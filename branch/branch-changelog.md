## `config/ci-poort-in-github-actions` changelog

### Branch title

De poort wordt onontkoombaar: GitHub Actions draait typecheck en build server-side, op Linux zoals Netlify

### Branch ID

20260813-203702

### Branch type

config

### What does the change on this branch bring to main?

**De poort bestond, maar hij was vrijwillig.** `scripts/lint/lint-web.ps1` draait `tsc --noEmit` plus
`npm run build` en is sinds 2026-07-26 de laatste wacht vóór een live deploy — maar hij draaide alleen
lokaal, en alleen als iemand `open-pr` gebruikte. Een PR uit de GitHub-UI, een vergeten `-SkipLint`, een
merge op een moment van haast: er stond niets tussen. In een repo waar een merge rechtstreeks naar
`djcylow.com` deployt en er geen staging is, was dat het grootste gat in de keten. Dit was ook het eerste
openstaande punt dat `docs/gelijktrekken-met-de-bron` bij zijn afsluiting neerlegde.

`.github/workflows/ci.yml` sluit dat gat: op **elke** PR en elke push naar `main` draait dezelfde poort
server-side.

#### Hetzelfde script, geen tweede kopie

De workflow schrijft tsc en de build niet over maar roept `lint-web.ps1` aan. Dat is een geleende les uit
de bron, die er expliciet over is: zijn CI hield tot 7 augustus 2026 een inline kopie van de testloop, en
die bleef dagenlang serieel draaien nadat beide lokale aanroepers al geparallelliseerd waren — *"the copy
nobody looks at being the one that drifts."* Eén poort betekent hier dat de ESLint-stap die in het script
als TODO staat, straks op beide plekken tegelijk aangaat.

#### Ubuntu, waar de bron windows kiest — en dat is het inhoudelijke punt

De bron draait zijn CI op `windows-latest`, met reden: zijn scripts targeten Windows PowerShell 5.1 en het
geteste product zíjn die scripts. Hier is het geteste product de site, en **Netlify bouwt op Linux**. Dat
verschil is niet cosmetisch:

> Een import met de verkeerde letterkast — `./header` terwijl het bestand `Header.tsx` heet — bouwt
> probleemloos op het case-insensitieve bestandssysteem van Windows en **breekt op Netlify**. Precies de
> klasse fout die de lokale poort structureel niet kan zien, en die meteen de live site raakt omdat er
> geen staging tussen zit.

Daarom draait de poort op `ubuntu-latest` met `shell: pwsh`. Dat maakt de CI-run strikt strenger dan de
lokale, wat de goede richting is voor een laatste wacht.

**Dat vroeg één aanpassing in het script**, want het was met PowerShell 5.1-aannames geschreven: PowerShell
7 kan een native commando met een exitcode ≠ 0 als terminating error gooien zodra
`PSNativeCommandUseErrorActionPreference` aanstaat, en dit script beoordeelt `tsc` en de build juist bewust
op `$LASTEXITCODE` om zijn eigen samenvatting te kunnen printen. Zonder die ingreep blokkeerde de poort nog
steeds, maar met een ruwe exception in plaats van *"de build faalt — mergen zou een kapotte site
opleveren"*. De guard is versie-veilig (PS 5.1 kent de variabele niet), en het script is lokaal onder 5.1
opnieuw groen gedraaid.

#### Wat dit wél en niet oplost — en waarom de PR-regel niet meebeweegt

De PR-regel van vanochtend verantwoordde zijn ruime uitzondering met de meting *"de bron-default leunt op de
lint gate, the test gate, and CI; hier bestaan twee van die drie niet"*, en beloofde: **komt er ooit CI, dan
is dat het moment om de grens opnieuw te wegen.** Die CI is er nu — en de grens is toch niet verschoven. Dat
is een besluit, geen vergeten stap:

- Er zijn nog steeds **nul testsuites**. De poort bewijst dat het **bouwt**, niet dat het gedrag gelijk
  bleef, en al helemaal niet dat een pagina er goed uitziet.
- Er is **geen branch protection**. Zonder die instelling is de run een **signaal, geen slot**: `gh pr merge`
  mergt een PR met een rode CI zonder morren. Dat aanzetten is een repo-setting en dus Dave's woord.

Van de drie pijlers staan er nu dus twee. Het herwegen van de grens tussen "wacht op Dave" en "loopt door"
is daarmee een openstaande beslissing van Dave geworden in plaats van een hypothetische — en dat staat nu
zo in `CLAUDE.md`, in Chris' lens en in `CONTRIBUTING.md`, op de plekken waar tot vandaag *"er is geen CI"*
als vaststaand feit werd aangevoerd. Ook de `Get-PrMergeMethod`-verantwoording in `repo-config.ps1` is
bijgewerkt: die noemde twee redenen om `ship-pr` te mijden en voorspelde zelf dat reden 1 zou vervallen
zodra er CI kwam. Dat is nu gebeurd; reden 2 blijft.

#### Eén ding dat de workflow bewust níet vastlegt

Deze repo pint zijn Node-versie **nergens** vast: geen `.nvmrc`, geen `.node-version`, geen `engines`, geen
`NODE_VERSION` in `netlify.toml`. Netlify draait dus zijn eigen default en CI de versie in de workflow (22,
gelijk aan wat hier lokaal draait). Die twee kunnen uit elkaar lopen zonder dat iets dat meldt, en dan
bewijst de CI-build iets anders dan wat live gaat. De reparatie is een `.nvmrc` — maar Netlify **leest** dat
bestand, dus het toevoegen ervan verandert de live build. Dat is een beslissing van Dave en staat als
comment in de workflow genoteerd, niet stilletjes uitgevoerd.

#### Meegenomen: de i18n-verwijzing die vandaag dood raakte

`feature/i18n-setup` is op 2026-08-13 gesloten (Dave: liep 272 commits achter, er gebeurt niets meer mee),
gearchiveerd als tag `archive/feature-i18n-setup` op `origin` — dezelfde conventie als
`archive/feature-cookie-banner`. `CLAUDE.md` verwees op twee plekken naar die branch als "geparkeerd", en
dat is nu onjuist; beide wijzen naar de tag, met de kanttekening dat opnieuw beginnen goedkoper is dan
rebasen over 272 commits Next-upgrades. Dat hoort strikt genomen in een eigen branch, maar het raakt
dezelfde regels van `CLAUDE.md` als het werk hierboven en zou daar als merge-conflict terugkomen.

### Significance

#### Tier 0

**Het laatste vrijwillige stuk van de keten is niet meer vrijwillig.** Elke andere schakel — de entry, de
step-list, de fold — wordt door een script afgedwongen; uitgerekend de poort die een kapotte site
tegenhoudt hing af van of iemand het juiste commando koos. Daar komt bij dat de CI een klasse fout ziet die
lokaal onzichtbaar was: op Linux bouwen betekent dat letterkast-fouten in imports hier stuklopen in plaats
van op `djcylow.com`. Dat is precies het scenario waar deze repo geen vangnet voor had.

**Score:** 4

#### Tier 1

N/A — aan de site verandert niets: geen component, geen mix-data, geen metadata, geen route. De build
levert dezelfde 89 pagina's. Dit raakt Dave als onderhouder, niet als opdrachtgever.

**Score:** N/A

### Pull Request

