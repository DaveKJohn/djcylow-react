# CLAUDE.md — DJ Cylow Website

Dit bestand is de operating guide voor deze repo, die wordt bestuurd door de **Claude Specialists** —
een team gespecialiseerde Claudes onder één Chief of Staff. Het is opgebouwd zoals elke
specialist-manual: **de draagbare werkwijze staat hieronder** (het systeem en de grondwet, geldig in
elke repo die met de Claude Specialists werkt), en **alles wat specifiek is voor déze repo staat
onderaan** onder [`## Eigen aan deze repo (djcylow-react)`](#eigen-aan-deze-repo-djcylow-react) — het
concrete team, de projectstructuur, de taal en de manier waarop de grondwet hier is ingevuld.

**Dit bestand houdt de grénzen; de route staat in [`CONTRIBUTING.md`](CONTRIBUTING.md).** Daar staan sinds
2026-08-13 de **antwoorden** van deze repo op de contributie-cyclus: de branch-prefixen, de zeven stappen van
branch tot fold, en per stap wat hier anders is. Het **mechanisme** van die cyclus — het tier-model, de
rubric, de poorten die `open-pr` draait — staat er sinds 2026-08-13 níet meer in, maar in
`CONTRIBUTING-portable.md` in de plugin, dat met elke plugin-release meebeweegt. Die splitsing is er één van
**onderwerp**, niet van dezelfde werkwijze in twee documenten: wat op Dave's woord wacht staat hier, hoe het
werk loopt staat daar, en geen van beide beschrijft het onderwerp van de ander.

Dat is precies het verschil met de oude `workflow/`-map, die niet meer bestaat: dat was een **tweede
werkwijze-document** naast dit bestand, en twee beschrijvingen van hetzelfde liepen onvermijdelijk uit
elkaar. `CONTRIBUTING.md` is bovendien maar de helft van zijn eigen onderwerp — de andere helft reist
met de plugin mee en wordt daar onderhouden, dus ook dáár staat de cyclus maar één keer beschreven.
Dezelfde constructie als in de bron-repo en in `life-hub`.

---

## De Claude Specialists — wie doet wat

We werken niet met één generieke Claude, maar met de **Claude Specialists**: een groep
gespecialiseerde Claudes. Elke taak, vraag of opdracht wordt kritisch bekeken en aan het juiste
adres bezorgd. Eén huisregel bovenop alles: **elke opdracht begint en eindigt bij Chris.** Hij is de
Chief of Staff — hij neemt de opdracht aan, classificeert die, wijst hem toe aan de juiste
specialist (of een keten van meerdere), licht toe wie het oppakt en waarom, bewaakt de workflow, en
sluit af met wat er is gebeurd en wat de volgende stap is.

De Claude Specialists **staan niet boven de safety-rules hieronder — ze werken eronder.** Chris
routeert; elke specialist voert uit volgens de gedeelde safety-rules en zijn eigen vakregels. De
branch-discipline en de release-discipline blijven onverkort gelden voor iedereen.

**Wie het team is, staat niet hier.** Het roster, de routing, de laadstrategie en het luie-specialist-
principe wonen in [`.claude/specialists/SPECIALISTS.md`](.claude/specialists/SPECIALISTS.md) — het ene
bestand dat `CLAUDE.md` onderaan importeert. Dat is bewust: alles wat specialist-vormig is staat in één
map, zodat de-adoptie neerkomt op "verwijder één map en één regel". Dit bestand houdt de **werkwijze**;
dat bestand houdt het **team**.

---

## Safety rules

**Grondwet — lees dit eerst.** Deze regels gelden breed gedeeld en staan boven elk gemak. De
djcylow-specifieke invulling (concrete paden, scripts en de lint-poort) staat in
[`### Safety-invulling van djcylow-react`](#safety-invulling-van-djcylow-react).

### Nooit zonder expliciete toestemming van Dave

- **Werk met een zichtbaar resultaat mergen** — levert de wijziging iets op dat Dave met het oog moet
  beoordelen, dan stopt de branch en meldt in plaats van vanzelf door te mergen. **In deze repo is dat
  alles in `src/`, `public/` en `src/data/mixes/`**, want een merge is hier een deploy naar
  `djcylow.com`. Geen poort kan bewijzen dat iets er góéd uitziet. De volledige uitwerking staat
  hieronder onder [Nooit direct op `main`](#nooit-direct-op-main--via-branch--pr).
- **Pushen naar `origin/main`** — dit initiatief ligt altijd bij Dave. **Vraag hier nooit naar, ook
  niet impliciet** ("zeg het maar als je wil pushen") — rapporteer feitelijk de git-status en stop
  daar. In de praktijk gaat het alleen nog om de fold-commit; al het overige bereikt `origin/main`
  via de PR-merge.
- Een **release cutten** — start alleen op expliciet verzoek ("commit en push live", "maak een nieuwe
  release en push live" of gelijkwaardig).
- `git push --force` (welke branch dan ook), `git reset --hard`, `git rebase` op een gedeelde branch.
- **Bestanden verwijderen uit `public/images/`** — afbeeldingen worden via pad gerefereerd in de
  mix-JSON, dus een verwijdering breekt stil een pagina.
- **`next.config.ts` aanpassen** (static-export-config — een fout hier breekt de Netlify-build) en
  **`netlify.toml` aanpassen**.

### Nooit direct op `main` — via branch + PR

Alle wijzigingen gaan via een branch + Pull Request. **Of die PR op Dave's woord wacht, hangt af van wát
erin zit** — dat bepaalt de aard van het werk, niet een vaste regel per branch. De toets is één vraag:
*voegt Dave's eigen blik iets toe dat de poorten niet kunnen?*

- **De default — niet wachten.** Is het werk op een branch af, gecommit en staat de poort groen, dan loopt
  de hele beweging in één keer door: openen → mergen → de changelog-entry folden, zonder tussenvraag. Dat
  dekt `scripts/`, de governance-documentatie (`CLAUDE.md`, `CONTRIBUTING.md`, de README's), `CHANGELOG.md`,
  `releases/`, de specialisten-laag onder `.claude/` en onderzoek. Zulk werk raakt `djcylow.com` niet: de
  build levert dezelfde pagina's, dus de deploy die op de merge volgt is een no-op. Een stempel van Dave
  voegt daar niets aan toe, en wat tóch misgaat is één revert-PR verder.
- **De uitzondering — stoppen en op Dave's woord wachten.** Twee soorten werk mergen niet vanzelf:
  1. **Zichtbaar resultaat** — de wijziging levert iets op dat met het oog beoordeeld moet worden. **In deze
     repo is dat alles in `src/`, `public/` en `src/data/mixes/`**: componenten, styling, teksten, mix-data,
     afbeeldingen, metadata en routes. Geen poort kan bewijzen dat iets er góéd uitziet, en deze repo *is*
     een frontend — dit is hier dus geen randgeval maar het gros van het werk.
  2. **Onomkeerbaar of naar buiten gericht** — een release, een tag, repo-settings, en de met naam genoemde
     beschermde bestanden hierboven (`next.config.ts`, `netlify.toml`, verwijderingen uit `public/images/`).
- **Dave houdt het stuur in beide richtingen.** Hij kan een specifieke klus alsnog onder de uitzondering
  trekken bij het uitdelen ("deze wil ik eerst zien") — dan wacht de keten. En geeft hij een expliciet
  PR-commando ("open de PR", "zet de PR op", "doe het live"), dan telt dat als goedkeuring voor de hele
  beweging. Let op: "open de branch" (checkout), "check dit" (review) of "klaar?" (een vraag) zijn **géén**
  PR-commando.

De redenering achter de default: Dave's inhoudelijke goedkeuring valt in het gesprek vóórdat het werk
gebouwd wordt, niet bij de merge-knop erna. Waar die knop een tweede checkpoint was, was hij in de praktijk
een stempel — dus is hij nu alleen nog een checkpoint waar hij écht iets oplevert.

> **Dit is de regel van de bron, hier overgenomen op 2026-08-13.** De bron zette de default om op
> **27 juli 2026** (*"Decision by Dave, July 27, 2026"*) en deze repo droeg tot vandaag de tekst van
> daarvóór: *elke* PR wachtte, en ernaar vragen mocht niet. Er was geen besluit dat die afwijking dekte —
> niet hier, niet in `CHANGELOG.md`, niet in de handover. Het was achterstand, geen keuze, en het sprak
> bovendien Chris' eigen gedeelde body tegen, die bij elke sessie meelaadt met *"the PR step: it runs on
> its own unless the work falls under one of the narrow exceptions"*. Wil je dit terugdraaien, dan is dat
> net als in de bron een beslissing van Dave.
>
> **De invulling is hier ruimer dan de letter van de bron, en dat is bewust** (Dave, 2026-08-13). De
> bron-default leunt op *"the lint gate, the test gate, and CI"*; daarvan ontbraken er hier twee. **Sinds
> 2026-08-13 draait er CI** ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)), dus dat gat is
> gedicht — maar de twee andere staan nog open: er zijn **nul testsuites**, en er is **geen branch
> protection**, waardoor een rode CI een merge wel zichtbaar maakt maar niet tegenhoudt. De poort bewijst
> dat het **bouwt**, niet dat het gedrag gelijk bleef en niet dat een pagina goed oogt. Daarom wacht
> álles in `src/` en `public/` onverkort, ook een refactor die visueel niets verandert. **De herweging
> die hier stond aangekondigd voor "als er ooit CI komt" is daarmee opengevallen — en die weging is
> Dave's beslissing, niet die van een specialist.**

> **Een PR mergen is een deploy.** `gh pr merge` schrijft server-side rechtstreeks in `origin/main`,
> en Netlify bouwt en publiceert bij elke push naar `main`. Er is **geen staging**. Op het moment dat
> een PR gemerged wordt staat de wijziging dus binnen enkele minuten op `djcylow.com` — er komt geen
> aparte publicatiestap meer aan te pas. Dat is precies waarom de uitzondering hierboven zo ruim is:
> voor site-werk is de merge het punt van geen terugkeer. Draai de poort
> (`scripts/lint/lint-web.ps1`, inclusief de build) en wees zeker van je zaak vóór de merge, niet erna.
>
> Dit stond hier tot 2026-07-26 andersom beschreven — "een merge naar `main` zet niets live", met de
> live-push als aparte stap in de Release Workflow. Dat was onjuist en gaf een vals gevoel van
> veiligheid op precies het verkeerde moment. `CHANGELOG.md` verzamelt daarom wat **live is maar nog
> geen versienummer heeft**; sinds 2026-08-11 zonder sectiekop — elke `##`-kop erin is één wijziging.
> Een release is een label op wat al draait.

Er zijn twee bewuste uitzonderingen op "nooit direct committen":

1. De **fold-commit** (na een merge, [stap 7](CONTRIBUTING.md#7-na-de-merge-vouw-de-changelog-entry)) is
   de enige echte **directe commit op `main`** (geen branch): scope beperkt tot `CHANGELOG.md` + de twee
   vaste bestanden in `branch/`.
2. De **release-branch** (`docs/release-v<versie>`) is wél een branch, met scope beperkt tot
   `CHANGELOG.md`, `releases/development/<X>.x/<X.Y.Z>.md`, `releases/github/<X>.x/<X.Y.Z>.md`,
   `releases/audience/<X>.x/<X.Y.Z>.md` (alleen Minor/Major) en `releases/README.md` — maar wordt
   bewust gemerged via een kale
   `git merge --no-ff`, niet via een Pull Request. Dit wacht wél altijd op expliciete goedkeuring
   van Dave.

Dit zijn de **enige** twee. Ook een "onschuldige" opruim- of chore-commit gaat via een branch + PR.

> **Let op: de gedeelde `cut-release`-skill zou hier een derde weg zijn, en die is niet toegestaan
> zolang Dave hem niet heeft gewogen** (vastgesteld 2026-08-13). Dat script commit direct op de branch
> waar je op staat — in zijn eigen woorden `# --- Commit + tag directly on main ---` — stageert met
> `git add -A` in plaats van een scope, en **pusht daarna zelf naar `origin/main`**. Alle drie botsen
> met de regels hierboven: de twee uitzonderingen zijn scope-beperkt, en pushen naar `origin/main` is
> Dave's initiatief. Draai het dus niet ongevraagd, ook niet "even met `-NoPush`" — dat houdt alleen
> de push tegen, niet de ongescopete commit. De uitwerking staat bij
> [`cut-release` in de skill-lijst](#scripts).

---

## Algemene werkwijze

- **Geleerde lessen worden geborgd in de docs, niet alleen in het geheugen.** Leert een specialist
  een belangrijke les of ontdekt hij iets dat voor de volgende keer onthouden moet worden, dan wordt
  dat direct vastgelegd in dit bestand of de relevante manual — een geheugen-notitie alleen is te
  vrijblijvend. In deze repo is dat Tessa's werk.
- Wees binnen een branch proactief met het aanmaken van nieuwe mappen/bestanden zodra een nieuw
  onderwerp opduikt. Vraag niet eerst om toestemming voor de bestandsstructuur zelf; wél voor de
  inhoud als iets gevoelig of onzeker is.
- Bij twijfel over prioriteit: vraag naar deadlines/urgentie in plaats van te gokken.
- **Approval-vragen zijn zeldzaam, niet de norm.** Onderbreek Dave alleen bij écht uitzonderlijke
  acties: onomkeerbaar, naar buiten gericht, of met reëel risico. Al het routinewerk — git, bash,
  config, branches, commits, tooling/scripts, en het doorzetten van een oplevering naar de volgende
  schakel in een al vastgelegde keten — wordt gewoon uitgevoerd en gemeld, niet eerst gevraagd. Bij
  twijfel kiest een specialist een verstandige default, voert die uit, en meldt het pas. **Dit staat sinds
  2026-08-13 niet meer los van de PR-regel maar zegt hetzelfde**: die regel is nu óók "doorlopen tenzij", en
  wat er tenzij is — zichtbaar resultaat, onomkeerbaar, naar buiten gericht — is precies de opsomming aan
  het begin van deze bullet.

### Ontwikkelworkflow — de route staat in `CONTRIBUTING.md`

De route staat in [`CONTRIBUTING.md`](CONTRIBUTING.md): de branch-prefixen met hun label en changelog-type,
de zeven stappen van branch tot fold, en per stap het antwoord van déze repo — welke lint-poort de laatste
wacht is, waarom stap 5 bestaat, welke `gh`-vlaggen hier stukgaan. Die pagina is de **lokale helft** van een
gedeeld document; de **portable helft** (`CONTRIBUTING-portable.md`) reist met de plugin mee en draagt het
mechanisme: het tier-model, de rubric, de vier poorten van `open-pr`, de fold. Samen zijn ze de enige plek
waar de route beschreven staat — en sinds 2026-08-13 staat elk stuk ervan maar in één van de twee.

Drie regels uit die route zijn óók grondwet, en die vind je daarom hierboven in
[de safety-rules](#safety-rules): **mergen is hier deployen**, werk met een **zichtbaar resultaat** wacht
daarom op Dave (al het overige loopt door), en pushen naar `origin/main` is Dave's initiatief. Alles
daartussen — hoe je een branch noemt, wat er in de entry hoort, welke poort wat weigert — lees je in
`CONTRIBUTING.md` of de portable helft waarnaar dat document verwijst.

**Twee dingen gaan aan élke wijziging vooraf**, dus die staan hier ook:

1. **Check de branch.** Run `git status` en `git branch` vóór je het eerste bestand aanraakt — sta je op
   `main`, maak dan eerst de juiste branch aan. Dit geldt ook voor een script of een configbestand.
2. **Een branch is nooit entry-loos.** Laat de gedeelde `new-branch`-skill de branch mét zijn twee
   bestanden in `branch/` neerzetten; wat die twee bestanden zijn staat in
   [`branch/README.md`](branch/README.md).

---

## Eigen aan deze repo (djcylow-react)

> *Alles hierboven is de draagbare werkwijze van een repo die door de Claude Specialists wordt
> bestuurd. Dit deel is de djcylow-lens: kopieer je dit systeem naar een andere repo, dan is dít het
> stuk dat je vervangt.*

Dit is de **live website van DJ Cylow** (`djcylow.com`), een Next.js-app met static export die via
Netlify wordt gedeployed. Er is **geen staging-omgeving**: een kapotte build betekent dat de live
site plat ligt.

Extra gatekeeper die volgt uit dat live-karakter: **alles wat de publieke site of de SEO raakt**
(titels, `description`-velden, metadata, routes) **is een beslissing van Dave, niet van een
specialist.**

### Taal

De website is **Engels** (`lang="en"`, domein `djcylow.com`). De repo-documentatie, commit-berichten
en de communicatie met Dave zijn **Nederlands**. De `description`-velden in de mix-data zijn
tweetalig: `description_nl` en `description_en`.

**Uitzondering: de zes sectiekopjes van een changelog-entry** (`Branch title`, `Branch ID`,
`Branch type`, `What does the change on this branch bring to main?`, `Significance`,
`Pull Request`) **en de `Tier`/`Score`-sleutels blijven Engels.** Het zijn machine-gelezen sleutels
waar `new-branch`, `open-pr`, `fold-changelog` en de release-cut het over eens moeten zijn — vertaal
je ze, dan kan de eigen fold de eigen entry niet meer lezen. `scripts/repo-config.ps1` definieert
bewust géén `Get-EntrySectionHeadingOverrides`, en dát is de beslissing die dit vastlegt.

**Uitzondering: `releases/README.md` is volledig Engels** (Dave, 2026-08-13). Die pagina is een
**spiegel** van [dezelfde pagina in de bron](https://github.com/DaveKJohn/claude-code-specialists/blob/main/releases/README.md):
alles boven de horizontale streep is er woord voor woord uit gekopieerd, en dat is alleen te handhaven
zolang het de tekst van de bron zélf is. Een vertaling maakte de pagina precies zo onvergelijkbaar als een
parafrase — erger zelfs, want een vertaling valt niet te diffen, en daardoor stonden er drie verouderde
beweringen in die niemand zag. Een correctie boven de streep gaat dus naar de bron als `inbound`-issue en
komt terug via een plugin-release; hier repareren herstart de drift. Onder de streep staat het repo-eigen
deel, ook Engels, zodat de hele pagina één register heeft.

Wat **niet** meeverhuist naar het Engels: de 60 bestaande documenten in `releases/development/` en
`releases/audience/` en de titels in de release-lijst. Dat is historie — geschreven in de taal waarin ze
uitgingen, en een record is geen vertaling. De taalgrens loopt daarmee dwars door het
development-document: Engelse tier-koppen boven Nederlandse entries.

**Nieuwe release-documenten zijn wél Engels** (Dave, 2026-08-13, avond). Dat is een andere vraag dan
de vorige alinea — die gaat over niet-hervertalen, en daaruit volgt niets over wat je hierna schrijft.
`Get-ReleaseNoteWording` en `Get-InternalNoteWording` in `scripts/repo-config.ps1` blijven daarom
**leeg**, want leeg betekent Engels, en [stap 6 van de Release Workflow](#release-workflow) is
meebewogen zodat de twee elkaar niet meer tegenspreken. Tot die avond deden ze dat wel: de seam stond
op Engels en stap 6 droeg Nederlands op, met als meetbaar gevolg dat `/continue` de "nog open"-sectie
van een note niet kon vinden. `v2.23.0` is de laatste Nederlandse note.

**Ook `CONTRIBUTING.md` is Nederlands**, net als dit bestand. De portable helft ernaast is Engels en
valt buiten deze regel: die is niet van deze repo maar van de plugin, en wordt daar onderhouden.

### Het team: roster & routing

**Het roster staat in [`.claude/specialists/SPECIALISTS.md`](.claude/specialists/SPECIALISTS.md)** —
wie de negentien specialisten zijn, wat elk van hen in déze repo doet, en naar welke lens onder
`.claude/specialists/lenses/` Chris hen doorverwijst. Dat is de plek die de plugin verwacht en het
enige bestand dat `CLAUDE.md` importeert.

Loopt dat roster uit de pas met de plugin, dan zet de gedeelde `sync-roster`-skill de ontbrekende
lenzen neer. `check-script-contract.ps1` bewaakt daarnaast dat `scripts/repo-config.ps1` en
`scripts/lib/branch-info.ps1` het contract van de gedeelde scripts blijven leveren.

### Structuur en conventies

#### Key commands

```bash
npm run dev      # dev server → http://localhost:3000
npm run build    # static export → .next/
npm run lint     # ESLint + TypeScript check
```

#### Hulpscripts

| Commando | Script | Wat het doet |
|---|---|---|
| `npm run mix:add` | `scripts/add-mix.js` | Voeg interactief een nieuwe mix toe aan het juiste JSON bestand |
| `npm run images:webp` | `scripts/convert-to-webp.js` | Converteer alle `.jpg` in `public/images/` naar `.webp` en verwijder de originelen |
| `npm run images:webp:dry` | `scripts/convert-to-webp.js --dry-run` | Preview: laat zien welke bestanden geconverteerd zouden worden |

**Workflow nieuwe mix toevoegen:**

1. `npm run mix:add` — vul alle gegevens in, het script genereert de afgeleide velden automatisch
2. Afbeeldingen neerzetten in `public/images/{power}/{color}/`
3. `npm run images:webp` — als je `.jpg`-afbeeldingen hebt aangeleverd
4. Controleer het JSON-bestand in de editor
5. Commit + push via [de cyclus in `CONTRIBUTING.md`](CONTRIBUTING.md#de-cyclus-stap-voor-stap)

#### Critical constraints

- **Static export**: `output: 'export'` in `next.config.ts` — geen server-side rendering, geen
  Next.js API-routes. Het contactformulier loopt via Netlify Functions.
- **Images unoptimized**: `images: { unoptimized: true }` — vereist voor static export. Niet
  verwijderen.
- **Tweetaligheid (EN/NL) staat niet live, en het werk eraan is gestopt.** `main` heeft geen
  `messages/`-map en geen `[locale]`-route; de site levert de strings inline. Schrijf dus geen code die
  aanneemt dat `useTranslations()` of `messages/en.json` bestaat.
  > De next-intl-implementatie stond op `feature/i18n-setup` (17 commits: routing naar
  > `src/app/[locale]/`, string-extractie, hreflang/og:locale, LanguageSwitcher). **Die branch is op
  > 2026-08-13 gesloten** — hij liep 272 commits achter op `main` en Dave gaat er niets meer mee doen. Het
  > werk is niet weg: het hangt aan de tag **`archive/feature-i18n-setup`** op `origin`, dezelfde
  > conventie als `archive/feature-cookie-banner`. Wie tweetaligheid alsnog wil, begint opnieuw en gebruikt
  > die tag hooguit als naslag; rebasen over 272 commits Next-upgrades heen is geen kleiner werk dan
  > opnieuw beginnen.
- **Geen inline CSS**: gebruik geen `style={{}}` in JSX. Alle CSS hoort in SCSS onder `src/styles/`.
  Uitzondering: echt dynamische runtime-waarden (`backgroundImage: url(${src})`,
  progressbar-percentages).
- **Tailwind v4 + SCSS**: beide worden naast elkaar gebruikt. SCSS in `src/styles/`, Tailwind als
  utility-classes in de componenten.

#### Waar content leeft

| Wat | Waar |
|---|---|
| UI-strings (buttons, labels, errors) | Inline in de componenten — `messages/*.json` bestaat niet; zie de i18n-noot bij *Critical constraints* |
| Mix-metadata & tracklists | `src/data/mixes/[power]-[color].json` |
| Home-pagina tekst | `src/content/home.ts` |
| Diensten-tekst | `src/content/diensten.ts` |
| Music Mood Colours tekst | `src/content/musicmoodcolours.ts` |
| Referenties | `src/content/referenties.ts` |
| Breakpoints | `src/constants/design.ts` |
| Live, maar nog zonder versienummer | `CHANGELOG.md` (elke `##`-kop is één wijziging) |

#### Audio storage

Actieve Cloudflare R2-bucket: `https://pub-4fa4c2c1f9a644c4878cba29a7926443.r2.dev/`

#### Mix JSON-regels (`src/data/mixes/`)

De volledige schema-spec staat in [`src/data/mixes/README.md`](src/data/mixes/README.md). Snelle
regels:

- `color`: met hoofdletter (`"Red"`, niet `"red"`)
- `date`: ISO-formaat `"YYYY-MM-DD"` (niet leeg)
- `description_nl` / `description_en`: uniek per mix, 120–160 tekens, geen dashes (`-` of `—`), geen
  artiestnamen (die horen in `top_artists`)
- `tracklist`-tijden: `"HH:MM:SS"` met voorloopnullen
- `tracks` moet gelijk blijven aan `tracklist.length`
- Nieuwe mixen bovenaan de array

Bij het schrijven van JSON-databestanden:

- Controleer dat het resultaat geldige JSON is (parseable, geen trailing comma's)
- Houd de array gesorteerd **nieuwste eerst** (hoogste `id`-datum bovenaan)
- Wijzig nooit entries met `"ignore": true` (preview-entries)
- Overschrijf nooit een niet-lege `description` tenzij daar om gevraagd wordt

Voor het committen: run `npm run lint` en controleer dat afbeeldingspaden uit de JSON daadwerkelijk
bestaan in `public/images/`.

### Release Workflow

Alleen op expliciet verzoek ("commit en push live", "maak een nieuwe release en push live").

**Deze vijftien stappen beschrijven de route met de hand, en zo is v2.23.0 ook gelopen.** Dat is
bewust, want de gedeelde `cut-release`-skill overlapt er grotendeels mee en gaat van een ándere
beginsituatie uit dan stap 2. Wat het script overneemt als je het draait:

| stap | wie doet het |
|---|---|
| 3 (poort), 4 (versienummer) | het script, met eigen poorten en een bump-gate op de tier van de entries |
| 5 (development-note), 8 (`CHANGELOG.md` legen), 9 (rij in `releases/README.md`) | het script |
| 6 (audience-document) | het script zet een **concept** neer; het herschrijven blijft handwerk |
| 10 (commit), 12 (tag + push) | het script, met `git add -A` en twee pushes |
| 7 (aankondiging), 13 (GitHub Release), 14 (bijlagen), 15 (branch opruimen) | handwerk; 13 wordt alleen als commando geprint |

**En dit is waarom het hier nog niet gedraaid wordt:** het script commit direct op de branch waar je
op staat — het gaat ervan uit dat dat `main` is — terwijl stap 2 hieronder je opdraagt eerst een
release-branch te maken. Bovendien stageert het met `git add -A`, wat geen scope kent, terwijl de twee
toegestane directe commits op `main` allebei *"scope beperkt tot"* een lijstje bestanden zijn. Beide
punten staan uitgewerkt bij [`cut-release` in de skill-lijst](#scripts) en wachten op Dave.

1. **Check de status**: `git status && git branch`
2. **Maak een branch**: `git checkout -b docs/release-v<versie>`
3. **Run de poort én de build**:
   - `powershell -NoProfile -File scripts\lint\lint-web.ps1` — de poort (typecheck + build), moet
     groen zijn. De build zit er sinds 2026-07-26 in, dus dit dekt de bouwbaarheid al
   - `npm run lint` — ESLint meldt op dit moment 37 **pre-existing** errors; die zijn acceptabel
     zolang je geen `.ts`/`.tsx` hebt aangeraakt. Wat niet acceptabel is: een fout erbij. Vergelijk
     dus het aantal, niet alleen de exitcode
4. **Bepaal het versienummer** (tabel hieronder, en `releases/README.md`)
5. **Maak de development-release note**: `releases/development/<major>.x/<versie>.md` — gebruik
   de gefolde wijzigingen in `CHANGELOG.md`; elke `##`-kop is er één. **Neem die kop niet letterlijk
   over**: hij noemt de branch (``## `docs/mijn-branch` changelog``), niet de wijziging. De titel van
   de release-note-entry bouw je uit `### Branch title` en `### Branch type`; de slotregel
   `[PR #NN](...) · merged YYYY-MM-DD` neem je wél ongewijzigd mee
6. **Maak het handgeschreven release-document** (alleen Minor/Major):
   `releases/audience/<major>.x/<versie>.md` — dezelfde wijzigingen in leesbaar **Engels** zonder
   jargon en zonder ontwikkel-metadata (geen PR-nummers, merge-datums of branch-types), bedoeld voor
   de opdrachtgever in plaats van developers. Twee secties, want deze repo staat op tier 1:
   **`What it is worth`** en **`What was still open at this release`** — die tweede in de verleden
   tijd, want het document wordt gepubliceerd en beweegt daarna niet meer mee. `cut-release` zet er
   een **concept** voor neer met `DRAFT`-aanwijzingen in het document zelf; die herschrijf je en haal
   je weg
   > **Deze stap stond tot 2026-08-13 (avond) op Nederlands, en dat sprak de taalsectie hierboven
   > tegen** — die zegt dat `Get-ReleaseNoteWording` bewust leeg staat omdat leeg Engels betekent en
   > dat hier het gewenste antwoord is. Twee plekken, twee antwoorden, en de note van v2.23.0 volgde
   > deze stap: hij draagt `## Wat deze release waard is` en `## Wat er bij deze release nog open
   > stond`. Dat is niet cosmetisch gebleven — `session-status.ps1` leest de "nog open"-sectie via
   > `Get-ReleaseNoteWording['SectionOpen']`, valt terug op het Engelse
   > `What was still open at this release`, en meldde daarom bij `/continue` dat de note *"has no
   > section matching 'still open'"* terwijl die sectie er gevuld en wel stond. **Dave heeft de knoop
   > doorgehakt op Engels** (2026-08-13): de seam blijft leeg, deze stap beweegt mee, en de koppen
   > hierboven zijn nu letterlijk de defaults uit `release-lib.ps1`. `v2.23.0` is daarmee de laatste
   > Nederlandse note; hij wordt niet herschreven, want gepubliceerde documenten zijn historie
   > **Deze map heette `releases/highlights/` tot 2026-08-13.** Elke root onder `releases/` hoort
   > zijn lezer te noemen en niet de vorm van het document; `Get-ReleaseNoteRoot` in
   > `scripts/repo-config.ps1` wijst sindsdien naar `releases/audience`. De 23 bestaande documenten
   > zijn verplaatst, niet herschreven. Zie [`releases/README.md`](releases/README.md) voor de drie
   > roots en wat er per root in hoort
   > **En de submap ging later diezelfde dag van `<X.Y>` naar `<X>.x`**, toen `releases/` op Dave's
   > verzoek volledig gelijk werd getrokken met de bron: `Get-ReleaseNotesGrouping` staat sindsdien op
   > `'major'` en alle 60 documenten (37 development, 23 audience) wonen in `2.x/`. Ook die verhuizing
   > is `git mv` zonder een letter aan hun tekst te veranderen
7. **Schrijf de aankondiging**: `releases/github/<major>.x/<versie>.md` — een paar alinea's die
   de body van de GitHub Release worden: wat er nieuw is, voor wie, en een regel die naar de twee
   bijlagen wijst. Niet de per-PR details; die staan in `development/`
8. **Update `CHANGELOG.md`**: haal de gefolde entries eruit (ze staan nu in de release-note), zodat
   alleen de intro-alinea overblijft. **Er komt géén versieblok voor terug.**
   > Tot 2026-08-11 zette deze stap hier ook een `## Releases`-blok in `CHANGELOG.md` — dezelfde
   > informatie als `releases/README.md`, maar armer, met een `← LIVE`-markering die op 2026-07-26 al
   > was afgeschaft en die bovendien maandenlang fout stond (op v2.20.1, terwijl v2.20.2, v2.21.0 en
   > vijf PR's al live waren). Dat verviel: `releases/README.md` (stap 9) is sindsdien de enige plek
   > waar uitgebrachte versies worden bijgehouden — geen dubbele boekhouding meer
9. **Voeg de versie toe** aan de overzichtstabel in `releases/README.md` (bovenaan) — de enige
   boekhouding van uitgebrachte versies. De Versie-cel wijst naar het leesbaarste document dat de
   release heeft: `audience/` bij een Minor/Major, `development/` bij een Patch
   > **De kolomkoppen van die tabel zijn een machine-gelezen sleutel, geen proza.** De gedeelde
   > `release-lib.ps1` matcht die regel letterlijk om te weten waar een rij heen gaat, en er is bewust
   > geen seam voor. Zelfde categorie als de zes sectiekopjes van een entry — en de reden dat ze ook
   > blijven staan als iemand ooit besluit deze pagina terug naar het Nederlands te halen: vertaal je
   > ze, dan vindt de inserter zijn invoegpunt niet meer. Om dezelfde
   > reden staat er een `#### 2.x`-kop bóven de tabel — de guardrail die controleert of een rij in de
   > juiste major belandt, leest de laatste `<n>.x`-kop erboven en staat stil uit zodra die ontbreekt
10. **Stage en commit** op de release-branch
11. **Merge naar `main`** (na bevestiging) — bewust een kale merge, geen PR:
    ```bash
    git checkout main
    git merge [branch] --no-ff -m "merge: [branch] — v<versie>"
    ```
12. **Tag en push**:
    ```bash
    git tag -a v<versie> -m "v<versie> - <korte titel>"
    git push origin main
    git push origin v<versie>
    ```
    Deze push zet **niets nieuws live** — de code stond er al via de PR-merges. Hij brengt de
    release-documentatie en de tag naar `origin`, en triggert daarmee wel een nieuwe Netlify-build
    van dezelfde code. Was er sinds de laatste merge niets aan de app gewijzigd, dan is het resultaat
    identiek aan wat er al draaide
13. **GitHub Release aanmaken** — de aankondiging uit `github/` is de body:
    ```bash
    gh release create v<versie> --title "v<versie> - <korte titel>" \
      --notes-file releases/github/<major>.x/<versie>.md --verify-tag
    ```
    > De body was tot 2026-08-13 de `development/`-note. Die is nu bijlage: `gh` kapt een
    > `--notes-file` af op 125.000 tekens, en een volledig per-PR record kan daar langs
14. **Bijlagen uploaden** — `development/` altijd, `audience/` bij Minor/Major. **Onder unieke
    bestandsnamen**, want alle drie de documenten heten `<versie>.md` en de tweede upload botst
    anders met `HTTP 404` (`file#label` van `gh` lost dat niet op — dat zet het label, niet de naam):
    ```bash
    cp releases/development/<major>.x/<versie>.md v<versie>-development-notes.md
    cp releases/audience/<major>.x/<versie>.md    v<versie>-release-note.md
    gh release upload v<versie> v<versie>-development-notes.md v<versie>-release-note.md
    rm v<versie>-development-notes.md v<versie>-release-note.md
    ```
15. **Verwijder de release-branch**: `git branch -d [branch]` en
    `git push origin --delete [branch]`

Let op de volgorde van oorzaak en gevolg: de wijzigingen stonden al live vóór dit hele proces begon,
namelijk vanaf hun PR-merge. Een release cutten voegt een versienummer, een release-note en een tag
toe aan wat al draait. Precies daarom is een release-cut ook laagrisico: er gaat geen ongeteste code
mee naar buiten.

#### Versienummer bepalen

| Type wijziging | Versie |
|---|---|
| Bugfix, hotfix, kleine correctie | PATCH |
| Docs, workflow, `CLAUDE.md`, changelog-wijzigingen | PATCH |
| Kleine stijl-/CSS-correctie | PATCH |
| Nieuwe beschrijvingen, content-updates | MINOR |
| Nieuwe mix, nieuwe pagina, nieuw component | MINOR |
| Grote stijl-/CSS-herziening (een hele sectie herontworpen) | MINOR |
| Volledig redesign of framework-migratie | MAJOR |

> **Deze tabel en de bump-poort van `cut-release` spreken elkaar tegen, en dat is sinds v2.23.0
> gemeten in plaats van vermoed.** De poort leidt de bump af uit de **tier** van de wachtende entries:
> alleen tier 0 is een patch, tier 1 of hoger verdient een minor. Die release is als **minor** gecut
> omdat drie van haar entries tier 1 dragen — terwijl deze tabel docs-, workflow- en
> `CLAUDE.md`-werk op **patch** zet, en dat was precies wat erin zat.
>
> Ze meten ook echt iets anders: de tabel kijkt naar de **soort** wijziging, de poort naar **wie het
> merkt**. Een docs-wijziging die de opdrachtgever iets oplevert is tier 1 en dus een minor, hoe
> "docs" hij ook oogt. Zolang beide blijven staan wint in de praktijk de poort, want die weigert
> — de tabel is proza dat niets tegenhoudt.
>
> **Welke van de twee leidend wordt is Dave's beslissing**, want het bepaalt hoe snel de
> versienummers van deze repo oplopen. Er wordt hier niets van geschrapt tot die keuze er is.

### Scripts

De workflow-stappen draaien via de **gedeelde skills van de specialists-plugin**, die één bron hebben
in [`DaveKJohn/claude-code-specialists`](https://github.com/DaveKJohn/claude-code-specialists). Wat per
repo verschilt woont in `scripts/repo-config.ps1` en `scripts/lib/branch-info.ps1`.

De stapnummers hieronder verwijzen naar
[de cyclus in `CONTRIBUTING.md`](CONTRIBUTING.md#de-cyclus-stap-voor-stap).

- **`new-branch`** — maakt de branch én **twee** bestanden in `branch/` (`branch-changelog.md`,
  `branch-progress.md`) plus de referentiekopieën in `branch/templates/`, in één stap (stap 1–3). Het
  achterliggende werk zit in `scripts/task/new-branch.ps1` en `scripts/lib/entry-scaffold-lib.ps1` —
  er bestaat geen los `scripts/release/new-changelog-entry.ps1` (meer).
- **`open-pr`** — draait de vier entry-poorten (resolves/scaffold/impact/step-list), de lint-poort en
  de testsuites, en opent daarna de PR (stap 4). **Sinds 2026-08-13 niet meer "alleen op verzoek van
  Dave"**: of hij vanzelf loopt hangt af van wat er in de branch zit, zoals de safety-rules hierboven
  beschrijven. Site-werk wacht, de rest loopt door.
- **`fold-changelog`** — vouwt `branch/branch-changelog.md` gerangschikt op tier/score in
  `CHANGELOG.md`, verrijkt met de PR-link en de merge-datum, en reset de twee `branch/`-bestanden
  (stap 7).
- **`cut-release`** — **draait het grootste deel van de Release Workflow zélf**, en dat is het
  belangrijkste dat je over deze skill moet weten. Het genereert de development-note, schrijft een
  concept van het audience-document, leegt `CHANGELOG.md` tot de intro, voegt de rij toe aan
  `releases/README.md`, en doet daarna `git add -A`, `git commit -m "release: v<versie>"`,
  `git tag -a` en **twee pushes: `git push origin main` en `git push origin v<versie>`**. Alleen de
  `gh release create`-stap wordt geprint in plaats van uitgevoerd. `-NoPush` houdt de twee pushes
  tegen en laat commit en tag lokaal staan.
  > **Tot 2026-08-13 stond hier het omgekeerde:** *"Het print commandoblokken in vaste volgorde; het
  > draait niets zelf."* Dat was onjuist en op de gevaarlijkste manier — wie het las, dacht dat
  > proberen gratis was, terwijl het script precies de handeling doet die de safety-rules aan Dave
  > voorbehouden: pushen naar `origin/main`. Weerlegd door `cut-release.ps1` zelf te lezen; het blok
  > heet daar `# --- Commit + tag directly on main ---`.
  >
  > **Twee dingen die daaruit volgen en die Dave moet wegen, want ze raken de grondwet:**
  > 1. Het script doet géén `git checkout main` — het commit op de branch waar je op staat en gaat
  >    ervan uit dat dat `main` ís. Stap 2 van de Release Workflow hieronder draagt je op eerst een
  >    `docs/release-v<versie>`-branch te maken. Die twee aannames sluiten elkaar uit.
  > 2. `git add -A` stageert de héle tree. De twee toegestane uitzonderingen op "nooit direct op
  >    `main`" zijn allebei geformuleerd als *"scope beperkt tot"* een lijstje bestanden; `-A`
  >    respecteert geen scope.
  >
  > Zolang die twee niet beslecht zijn blijft de Release Workflow hieronder met de hand gelopen worden,
  > zoals bij v2.23.0. Alleen op expliciet verzoek van Dave, zoals de hele Release Workflow.
- **`park`** — commit het openstaande werk op de huidige branch en pusht die met `git push -u` naar
  `origin`, zodat je hem elders precies zo oppakt. Opent géén PR en zet niets live.
- **`ship-pr`** — opent de PR, wacht op CI, mergt en vouwt de changelog in één run. **Gebruiken we hier
  niet, en er is nog precies één reden over.** De eerste reden verviel op 2026-08-13 ("een merge wacht hier
  altijd op Dave"); de tweede diezelfde dag later, want er ís nu CI om op te wachten
  ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) — deze regel voorspelde dat zelf. Wat blijft:
  de PR-regel luidt *"hangt af van wát erin zit"*, en dat onderscheid — raakt dit de site of niet — is een
  menselijke beoordeling die een skill die openen, mergen en folden in één beweging doet niet kan maken.
  Die reden verdwijnt niet vanzelf. Deze regel staat hier zodat een latere sessie die de skill in de plugin
  ziet kan lezen waarom er hier niet aan begonnen wordt.
- **`adopt-config`** — plaatst de gedeelde waarden uit de blueprint van de bron in
  `scripts/repo-config.ps1` en `scripts/lib/branch-info.ps1`, en levert een voorstel voor de waarden
  die alleen deze repo kan beantwoorden. Gebruikt bij de adoptie; daarna alleen nog als de
  contract-check een seam meldt die hier nooit is ingevuld.
- **`fix-mojibake`** — spoort dubbel-gecodeerde tekens op in de paden die `Get-MojibakePaths` aanwijst.
  Deze repo is er eerder door gebeten bij handmatig geschreven entries.
- **`lock`** — schrijft het volgende onderwerp weg in `.claude/handover.md`, zodat een `/clear` de
  bedoeling niet meeneemt. Legt een **besluit** vast, geen feiten.
- **`continue`** — de andere helft: leest die lock, zet er de eigen stand van de repo naast (branch,
  commits, geparkeerde branches, wachtende entries, laatste tag) en verifieert de twee tegen elkaar.
  **Waar ze verschillen wint de repo**, en dat verschil hoort hardop gemeld te worden.
- **`sync-roster`** — zet ontbrekende repo-lenzen neer als het roster achterloopt op de plugin.
- **`specialists-init`** / **`specialists-teardown`** — adoptie en de-adoptie van het systeem in deze
  repo. Zie `QUICKSTART.md` en `UNINSTALL.md` in de bron-repo.

Repo-eigen scripts:

- **`scripts/lint/lint-web.ps1`** — de poort die `open-pr` draait: `tsc --noEmit` over
  `tsconfig.lint.json` **én** `npm run build`. ESLint zit er bewust nog niet in; de reden staat in de
  header van het script. Het draait sinds 2026-08-13 op twee plekken — lokaal onder Windows PowerShell
  5.1 en in CI onder `pwsh` op Linux — en houdt daar in zijn preferences rekening mee.
- **`.github/workflows/ci.yml`** — diezelfde poort, server-side, op elke PR en elke push naar `main`. Hij
  roept `lint-web.ps1` aan in plaats van tsc en de build over te schrijven, zodat er één poort te
  onderhouden blijft. Draait op **ubuntu** en niet op windows zoals de bron, omdat Netlify op Linux bouwt
  en letterkast-fouten in imports alleen daar aan het licht komen. **Zonder branch protection is dit een
  signaal en geen slot**: een PR met een rode run kan nog steeds gemerged worden.
- **`check-script-contract.ps1`** — bewaakt dat `repo-config.ps1` en `branch-info.ps1` de functies
  leveren die de gedeelde scripts verwachten. Woont in de plugin (`scripts/sync/` daar), niet in deze
  repo, en draait bij het starten van een sessie via de `script-contract-sessioncheck`-hook.
- `scripts/add-mix.js` (`npm run mix:add`) en `scripts/convert-to-webp.js` (`npm run images:webp`).

De Release Workflow hierboven kent geen repo-eigen script; de sluitende stappen lopen sinds de
herinstallatie op 2026-08-03 via de gedeelde **`cut-release`**-skill. Het bepalen van het versienummer,
de release-notes en de changelog-verhuizing blijven handwerk van Rendall 🎬.

### Safety-invulling van djcylow-react

De grondwet hierboven, hier concreet ingevuld:

- **`origin/main` ís de live site.** Netlify bouwt en publiceert bij elke push naar `main`, en
  `gh pr merge` schrijft daar server-side rechtstreeks in. Een PR mergen is dus deployen; er is
  **geen staging** en geen aparte publicatiestap. Een release cutten voegt daar een versienummer en
  een tag aan toe, maar zet niets nieuws live — dat was al gebeurd bij de merges.
- **De poort vóór elke PR is de laatste wacht vóór een live deploy.** `open-pr` draait
  `scripts/lint/lint-web.ps1` (via `Get-LintScript`): `tsc --noEmit` én `npm run build`, beide moeten
  groen zijn. De build zit er sinds 2026-07-26 in, precies omdat een typecheck een kapotte build niet
  vangt en er niets tussen de merge en de site zit. ESLint blijft bewust buiten de poort omdat er 37
  pre-existing errors staan; die vergelijk je op aantal. `-SkipBuild` bestaat om lokaal te itereren
  en hoort niet in de poort zelf.
- **Diezelfde poort draait sinds 2026-08-13 ook server-side**, via
  [`.github/workflows/ci.yml`](.github/workflows/ci.yml), op elke PR en elke push naar `main`. Dat is
  **geen tweede kopie** van tsc + build maar hetzelfde `lint-web.ps1`, aangeroepen onder `pwsh` — een
  kopie in een workflow die niemand openslaat is precies wat als eerste uit de pas gaat lopen. De
  workflow draait bewust op **ubuntu**, anders dan de bron die windows kiest: Netlify bouwt op Linux, en
  een import met de verkeerde letterkast bouwt wél op Windows en breekt daar. Die klasse fout kon de
  lokale poort structureel niet zien.
- **Wat die poort níet bewijst, en waarom de PR-regel ruim ingevuld blijft.** Er zijn nog steeds **nul
  testsuites** en er is **geen branch protection** op `main`; de repo is publiek. Zonder die protection
  is CI een **signaal, geen slot**: `gh pr merge` mergt een PR met een rode run gewoon. En de poort
  bewijst dat de code **bouwt** — niet dat het gedrag gelijk bleef en niet dat de pagina goed oogt. De
  gedeelde default in de bron leunt op *"the lint gate, the test gate, and CI"*; daarvan staan er hier nu
  twee. Dat is de reden dat álles in `src/`, `public/` en `src/data/mixes/` op Dave's woord blijft
  wachten, ook een refactor die visueel niets verandert. **De twee stappen die de grens verder zouden
  kunnen verschuiven — branch protection aanzetten (repo-settings) en een testsuite bouwen — liggen bij
  Dave.**
- **`public/images/` is beschermd.** Afbeeldingen worden via pad gerefereerd in de mix-JSON;
  verwijderen breekt stil een pagina en gebeurt nooit zonder Dave's woord.
- **`next.config.ts` en `netlify.toml` zijn beschermd.** Een fout daar breekt de Netlify-build en
  dus de live site.
- **Alles wat de publieke site of de SEO raakt is Dave's beslissing** — titels,
  `description`-velden, metadata en routes. Een specialist stelt voor, Dave beslist.
- **Twee uitzonderingen op "nooit direct op `main`"**: de fold-commit en de release-branch, zoals
  hierboven beschreven. Dit zijn de enige twee.
- **Kernverbeteringen gaan via de inbound-route.** Ontdek je een verbetering aan de *gedeelde* kern
  van het specialisten-systeem (agent-defs, manuals, persona's, skills uit de plugin), dan wordt die
  niet hier gebouwd: die gaat als issue met label `inbound` naar
  [`DaveKJohn/claude-code-specialists`](https://github.com/DaveKJohn/claude-code-specialists). Check
  daarbij eerst welke kant achterloopt — soms zit de fout niet in de bron maar in deze repo.

### Het hóé (draagbaar) vs. het wát (repo-eigen)

Kortom: het **hóé** (er is een team specialisten onder een Chief of Staff, alles via branch + PR,
geleerde lessen in de docs, de grondwet boven elk gemak) is draagbaar en staat bovenin. Het **wát**
(dit roster, de Next.js-structuur, de mix-data-conventies, de Release Workflow, het feit dat een
merge hier direct deployt, de scripts en de poort) is van deze repo en staat in dit slot.

Diezelfde tweedeling loopt door in [`CONTRIBUTING.md`](CONTRIBUTING.md), en dat is geen tweede systeem
maar hetzelfde: de portable helft van die pagina woont in de plugin, de antwoorden van déze repo staan
in de repo. Wat dit bestand hier doet voor de **grenzen**, doet die pagina daar voor de **route**.

De orchestrator (Chris) wordt altijd meegeladen; hij verwijst on-demand door naar de specialisten in
[`.claude/specialists/lenses/`](.claude/specialists/lenses/). Die ene import hieronder laadt het
roster, Chris' draagbare body uit de plugin en zijn repo-lens.

@.claude/specialists/SPECIALISTS.md
