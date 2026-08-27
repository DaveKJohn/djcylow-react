# Bijdragen aan djcylow-react — de laag van de workflow

Dit is de **enige** `CONTRIBUTING.md` van deze repo: de standaardwerkwijze — nooit direct op `main`, CI
groen vóór de merge, één wijziging per branch — én de mechaniek die de `contributing-davekjohn`-plugin
bezit: het branch-eigen document, de gefolde changelog-entry, het tier-model, de release-cyclus. Samen
in de map die met de plugin meereist.

> **Zowel de map als de plugin heetten tot 2026-08-27 `workflow-davekjohn`.** De bron hernoemde het
> plugin-package zelf naar `contributing-davekjohn` in v4.20.0 (#886), en `Get-BranchFilePaths` in de
> gedeelde scripts wijst het branch-document sindsdien hardcoded naar een map met die naam — geen seam,
> dus een consument ontmoet de hernoeming via een plugin-update in plaats van een eigen keuze. Deze
> repo's eigen map is diezelfde dag met `git mv` meeverhuisd, mét de historie van elk bestand. Zie
> [issue #152](https://github.com/DaveKJohn/djcylow-react/issues/152) voor de volledige adoptie.

> **Er stond hier van 2026-08-16 tot 2026-08-27 een tweede laag: een dunne `CONTRIBUTING.md` in de
> repo-root**, die de standaardwerkwijze droeg zodat een bezoeker zonder de plugin ook iets had om op
> te bouwen — en waar de twee elkaar tegenspraken won deze pagina (Dave, 2026-08-16, overgenomen van de
> bron, `627f030`, *"the workflow ships a second CONTRIBUTING layer that wins on conflict"*). Vóór 14
> augustus stond deze hele pagina zelf al eens in de repo-root, met als reden dat GitHub
> `CONTRIBUTING.md` daar zoekt — hetzelfde argument dat op 2026-08-16 opnieuw voor een root-pagina
> pleitte, tegen een mengsel op dat pad van 29 KB branch-dossiers en fold-mechaniek die zonder de
> plugin niet bestaan.
>
> **Dave heeft de root-laag op 2026-08-27 laten vervallen: er is nu precies één `CONTRIBUTING.md`, hier,
> en die geldt zonder voorbehoud** — ook voor wie de plugin niet heeft. De bron was intussen zelf ook al
> naar dat model gegaan (`adopt-workflow-folder.ps1` scaffoldt sinds v4.20.0 nog maar één
> `CONTRIBUTING.md`), dus dit trekt de repo gelijk met het huidige scaffold. Wat de eerdere splitsing
> kostte: het toenmalige `branch/README.md` verwees sinds de mapverhuizing van 2026-08-16 naar
> `../CONTRIBUTING.md` — een bestand dat op dat moment niet bestond, en dat is precies de klasse fout
> die twee documenten over hetzelfde onderwerp met zich meebrengen. Die link was daarna vanzelf weer
> heel; het bestand zelf is op 2026-08-27 verdwenen met het tweebestandsmodel dat het beschreef, zie
> [stap 3](#3-ontwikkel-op-de-branch-en-houd-development-cyclemd-bij). Zie [`../CLAUDE.md`](../CLAUDE.md#safety-rules)
> voor de volledige redenering achter de terugkeer naar één bestand.

Dit is de **lokale helft** van de contributie-cyclus: hoe werk in *deze* repo van een idee naar `main`
komt, en daarmee naar de live site. De **portable helft** reist met de plugin mee en staat niet in
deze repo:

```text
# de geïnstalleerde release -- dit is de cyclus zoals de scripts hem NU draaien
~/.claude/plugins/cache/claude-code-specialists/contributing-davekjohn/<versie>/CONTRIBUTING-portable.md

# de bron -- kan vóórlopen op de release hierboven
~/.claude/plugins/marketplaces/claude-code-specialists/plugins/workflows/contributing-davekjohn/CONTRIBUTING-portable.md
```

> **Beide paden droegen tot 2026-08-27 de naam `workflow-davekjohn`** — het plugin-package heette zo
> tot v4.20.0 (#886 hernoemde het naar `contributing-davekjohn`, in de bron én in elke consument die
> bijwerkt). De oude cache-map (`workflow-davekjohn/4.12.0`, `4.18.0`) staat nog op de machine — dat is
> geen storing, alleen een vorige installatie die niet is opgeruimd — maar wat deze repo daadwerkelijk
> draait staat sinds 2026-08-26 onder `contributing-davekjohn/4.20.0`.

Die pagina beschrijft de cyclus zoals de gedeelde `contributing-davekjohn`-scripts hem draaien, en noemt
overal de **seam** waar een repo zelf het antwoord geeft. Deze pagina geeft die antwoorden. Lees de
portable pagina voor het mechanisme, deze voor de waarden.

> **Beide paden staan er met opzet, en het verschil is twee keer duur geweest — op twee verschillende
> assen.** De scripts draaien uit de **cache**, dus dat is de tekst die beschrijft wat er feitelijk
> gebeurt. De marketplace-clone is de bron en kan verder zijn.
>
> - **De versie-as:** deze repo stond een tijd op 4.5.0 terwijl `life-hub` al op 4.6.0 liep, en de
>   release-scripts verschilden precies in het stuk dat toen geauditeerd werd. Lees bij twijfel
>   `installed_plugins.json` op `projectPath` en niet de sessie-context.
> - **De map-as:** op 2026-08-15 draaide er een `open-pr.ps1` uit de **clone** in plaats van uit de cache.
>   Die zocht de entry op een pad dat nog niet is uitgebracht, vond niets, en de diagnose wees naar déze
>   repo in plaats van naar de gedraaide kopie. Deze waarschuwing stond er toen al en ving hem niet: hij
>   dekte alleen de as hierboven.
>
> De regel die beide dekt staat in [`CLAUDE.md`](../CLAUDE.md#scripts): **cache om te dráaien, marketplace om
> te lézen** — en het makkelijkste advies is de skill aanroepen in plaats van het script, want die print
> zijn eigen cache-pad.

**Hier staat de cyclus niet nóg een keer.** Wat hieronder volgt zijn de **antwoorden** van deze repo, per
stap, met een verwijzing naar de portable stap waar het mechanisme staat. Tot 2026-08-13 beschreef deze
pagina de zeven stappen wél voluit — inclusief het tier-model met zijn score-tabel, de zes entry-secties, de
vier poorten van `open-pr` en de fold-mechaniek. Dat was een tweede beschrijving van tekst die al met de
plugin meereist, en een tweede beschrijving loopt uit de pas: de release-pagina (toen `releases/README.md`,
sinds 2026-08-16 [`contributing-davekjohn/releases/README.md`](releases/README.md)) deed hetzelfde en daar
waren op de dag van het opruimen drie beweringen stil verouderd. De portable helft schrijft deze splitsing
zelf voor — *"read this page for the cycle; read your own page for the values"* — dus dit is de bedoelde
vorm en geen bezuiniging.

> **Deze pagina is Nederlands, de portable helft is Engels.** Dat volgt de taalregel van
> [`CLAUDE.md`](../CLAUDE.md#taal): de repo-documentatie is Nederlands. De portable helft is niet van
> deze repo, dus die valt buiten die regel. De vier `###`-koppen van het branch-document
> (`PLAN`/`CREATE`/`TEST`/`DEPLOY`), de entry-sectiekoppen daaronder en de `Score`-sleutel blijven wél
> Engels — het zijn machine-gelezen sleutels, zie
> [stap 3](#3-ontwikkel-op-de-branch-en-houd-development-cyclemd-bij).

**De grondwet staat hier niet.** Wat mag en wat op Dave's woord wacht — de safety-rules, de PR-regel,
de drie uitzonderingen op "nooit direct op `main`", de release-toestemming — staat in
[`CLAUDE.md`](../CLAUDE.md#safety-rules) en gaat boven alles op deze pagina. Deze pagina beschrijft de
**route**; die beschrijft de **grenzen**.

**Eén van die grenzen hoort hier wel genoemd, omdat ze de hele route kleurt: een PR mergen is in deze
repo een deploy.** `origin/main` ís de live site — Netlify bouwt en publiceert bij elke push naar
`main`, en `gh pr merge` schrijft daar server-side rechtstreeks in. Er is **geen staging**. De poorten
in [stap 4](#4-push-de-branch-en-open-de-pr--behalve-bij-frontend-werk) zijn dus de laatste wacht vóór `djcylow.com`, en
niet een formaliteit onderweg.

---

## Specifiek voor deze repo (djcylow-react)

> *Alles in de portable helft is de cyclus, en die reist naar elke repo die de plugin aanzet. Dit deel
> is de djcylow-lens: kopieer je die pagina naar een eigen repo, dan is dít het stuk dat je vervangt.*

### De seam, in één tabel beantwoord

| de portable helft vraagt | het antwoord hier | waar het machinaal staat |
|---|---|---|
| hoofdbranch | `main` | — |
| branch-prefixes | zeven die je kiest; de lib erkent er negen en levert acht changelog-typen | [`scripts/lib/branch-info.ps1`](../scripts/lib/branch-info.ps1) |
| het type waar een onbekende prefix op terugvalt | `Chore` | `Get-EntryFallbackType` |
| de lint-poort | [`scripts/lint/lint-web.ps1`](../scripts/lint/lint-web.ps1) — `tsc --noEmit`, `eslint .` én `npm run build` | `Get-LintScript` |
| de sectiekoppen van een entry | de Engelse defaults — bewust niet overschreven | *(geen override gedefinieerd)* |
| de rubric achter de scores 1–5 | de gedeelde vijf banden | *(geen override gedefinieerd)* |
| de ene publieks-tier van deze repo | **1** — het management en de opdrachtgever | `Get-ReleaseAudienceTier` |
| permanente root-docs | `CLAUDE.md` · `README.md` | `Get-ReservedRootMd` |
| de flat changelog met de wachtende entries | [`contributing-davekjohn/CHANGELOG.md`](CHANGELOG.md) — sinds 2026-08-27, isolate-by-default (issue #885/#914 in de bron) | *(geen override gedefinieerd; de computed default)* |
| de release-historie | de tabel in [`contributing-davekjohn/releases/README.md`](releases/README.md) | `Get-ReleaseHistoryPath` |
| indeling van de release-notes | per **major** (`2.x/`) — gelijk aan de bron sinds 2026-08-13 | `Get-ReleaseNotesGrouping` |
| het handgeschreven release-document | [`contributing-davekjohn/releases/audience/`](releases/audience/), bij een minor en een major | `Get-ReleaseNoteRoot` · `Get-ReleaseConsumerBumps` |
| de aankondiging die de Release-body wordt | [`contributing-davekjohn/releases/github/`](releases/github/) — zie hieronder | `Get-ReleaseGithubNotesRoot`, computed default sinds #914 |
| de gegenereerde changelog-note | [`contributing-davekjohn/releases/changelog/`](releases/changelog/) — zie hieronder | `Get-ReleaseChangelogNotesRoot`, computed default sinds #914 |
| een aparte go-live-stap ná de cut | geen — de code stond al live vanaf zijn eigen PR-merge | `Get-LiveStage` (leeg) |

Op één na wonen ze allemaal in [`scripts/repo-config.ps1`](../scripts/repo-config.ps1); de prefix-tabel is
een eigen lib. Waar de tabel *geen override gedefinieerd* zegt, draait deze repo bewust op de gedeelde
default — **dat is een antwoord, geen gat**, en de verantwoording staat per stuk in `repo-config.ps1`
zelf.

**Tel de onbeantwoorde seams nooit uit dat bestand.** Elke niet-gedeclareerde optionele functie wordt
door `check-script-contract.ps1` als `[INFO]` gemeld, en dat aantal is de enige stand die met de
blueprint meebeweegt — handgeschreven tellingen liepen hier al eens met drie verschillende getallen
uiteen. De check draait bij elke sessiestart via de `script-contract-sessioncheck`-hook.

**`CHANGELOG.md` verhuisde op 2026-08-27 van de repo-root naar `contributing-davekjohn/CHANGELOG.md`**
(Dave). De bron maakte de `Get-ChangelogPath`-seam op 25-26 augustus **isolate-by-default** voor een
consumer-repo: `Assert-WorkflowIsolatedSeamPath` weigert sindsdien (exit 1) élk antwoord — ook een
expliciete override in `scripts/repo-config.ps1` — dat buiten de workflow-map wijst. Deze repo bewaarde
het bestand tot die dag als vaste root-doc (`Get-ReservedRootMd`); de eerste keer dat de gedeelde
`fold-changelog-entry.ps1` daadwerkelijk tegen de nieuwe grens liep, moest die entry met de hand
gevouwen worden. Er is bewust **geen** eigen `Get-ChangelogPath` in `repo-config.ps1` gezet: de
computed default volgt `Get-WorkflowFolderName` en wijst dus vanzelf naar
`contributing-davekjohn/CHANGELOG.md` zolang die map zo heet, en zou vanzelf meebewegen als de map ooit
naar `contributing-davekjohn/` hernoemt.

#### De release-boom staat sinds 2026-08-27 volledig in de workflow-map

Met plugin **v4.12.0** (2026-08-16) kreeg de workflow zijn eigen map, en de release-boom werd toen
gesplitst langs precies één lijn: wat een seam had verhuisde mee, wat hardcoded was niet.
Bron-issue [#914](https://github.com/DaveKJohn/claude-code-specialists/issues/914) (gesloten 2026-08-26,
uitgebracht in plugin 4.20.0) maakte van de twee hardcoded paden echte seams met een **berekende default
binnen de workflow-map**, en hernoemde `development` naar `changelog` in dezelfde beweging. Sinds
2026-08-27 staan daarom alle vier de roots hier:

| root | waar | waarom daar |
|---|---|---|
| `contributing-davekjohn/releases/README.md` | de map | `Get-ReleaseHistoryPath` wijst erheen |
| `contributing-davekjohn/releases/audience/` | de map | `Get-ReleaseNoteRoot` wijst erheen |
| `contributing-davekjohn/releases/changelog/` | de map | `Get-ReleaseChangelogNotesRoot`, computed default sinds #914 |
| `contributing-davekjohn/releases/github/` | de map | `Get-ReleaseGithubNotesRoot`, computed default sinds #914 |

**Dit was geen automatische migratie.** Deze repo installeerde plugin 4.20.0 op 2026-08-26, maar niets
erin verplaatste de bestaande 39 + 2 bestanden of waarschuwde dat het moest —
`adopt-workflow-folder.ps1` waarschuwt wél voor de vergelijkbare verhuizing van `Get-ReleaseHistoryPath`
en `Get-ChangelogPath`, maar noemt deze twee zelfs niet, en `cut-release.ps1` drukt evenmin iets af op
het moment dat het de paden oplost. Zonder ingrijpen was de eerstvolgende cut hier stilzwijgend een
tweede, lege boom begonnen naast de bestaande geschiedenis op de repo-root — gemeld als
[inbound #955](https://github.com/DaveKJohn/claude-code-specialists/issues/955). Met `git mv` naar
`contributing-davekjohn/releases/changelog/` en `.../github/` resolven beide roots nu vanzelf op hun
berekende default; er staat voor geen van beide iets in `scripts/repo-config.ps1` gedeclareerd, net als
bij `audience/`.

> **Tot 2026-08-27 stonden `development/` en `github/` bewust op de repo-root**, hardcoded in
> `cut-release.ps1` (regel 728 en 820 in de toenmalige bron), met als motivering `Get-RelativeLinkPath`'s
> eigen commentaar: *"a consumer's history lives at `contributing-davekjohn/releases/README.md` while the
> generated development notes stay at the repo root."* Die redenering hield op te gelden op het moment
> dat #914 er seams van maakte — de functie zelf is er sindsdien op aangepast. Bij de upgrade van
> 2026-08-16 waren `development/` en `github/` om dezelfde destijds-geldige reden eerst wél meegegaan en
> daarna teruggezet.

### De prefixen: zeven die je kiest, negen die de lib kent

| Type werk | Branch naam | GitHub-label | Changelog-type |
|---|---|---|---|
| Nieuwe feature of pagina | `feature/[korte-omschrijving]` | `enhancement` | Feature |
| Bugfix | `fix/[korte-omschrijving]` | `bug` | Fix |
| Mix data (JSON) | `data/[kleur-of-omschrijving]` | `enhancement` | Data |
| Tekst/content updates | `content/[korte-omschrijving]` | `enhancement` | Content |
| Styling/CSS | `style/[korte-omschrijving]` | `enhancement` | Style |
| Docs/README | `docs/[korte-omschrijving]` | `documentation` | Docs |
| Config-wijzigingen, scripts, workflow-tooling | `config/[korte-omschrijving]` | `documentation` | Config |

**Voorbeelden:** `data/light-red-descriptions`, `feature/mix-bpm-filter`, `fix/audio-player-volume`

**Nooit "final" in een branchnaam** — `Test-BranchName` weigert die hard. Is een tweede poging nodig,
gebruik dan `-v2`, `-v3` etcetera.

De zeven prefixen hierboven zijn wat je kiest. `scripts/lib/branch-info.ps1` erkent er **negen**: die
zeven plus **`feat/` als alias van `feature/`** en **`chore/`**, met `Chore` als achtste
changelog-type. Die twee staan er met opzet in en verdwijnen niet:

- **`Chore` is het type waarop een onbekende prefix terugvalt** (`Get-EntryFallbackType`). Het weghalen
  breekt dat vangnet, want de blueprint eist dat de fallback-waarde in `Get-BranchTypes` voorkomt.
- **`feat/` werkt dus ook**, en levert hetzelfde type als `feature/`. **Herken beide, schrijf één** —
  en dat ene is `feature/`, want dat is wat de tabel hierboven noemt.

Let op het verschil met de bron-repo, die `chore/` juist **hard weigert** omdat een chore daar per
definitie werk is dat rechtstreeks op de trunk landt. Hier weigert `Test-BranchName` hem niet — maar
gebruik hem niet als achtste optie: de tabel hierboven is de keuze, en een wijziging die nergens in die
zeven past hoort besproken te worden in plaats van onder `chore/` te verdwijnen.

Leid de taxonomie **niet** af uit de git-historie; die mist prefixen die wel bestaan. De tabel hierboven
en `branch-info.ps1` zijn samen de enige bron — de tabel voor de mens, de lib voor de scripts.

Classificeer op **wat er feitelijk verandert**, niet op welke bestanden meekomen: `docs/` is puur tekst,
`feature/` is een mogelijkheid die nieuw of groter is dan hij was, ook als er documentatie bij hoort.

---

## De cyclus, stap voor stap

**Zeven stappen hier, vijf in de portable helft**, en dat verschil is de kern van deze repo: stap 5 bestaat
alleen omdat een PR hier op Dave's woord wacht, en stap 6 is de handeling die de site verandert. Elke stap
hieronder geeft **het antwoord van deze repo** en wijst naar de portable stap waar het mechanisme staat. Staat
er onder een stap niets bijzonders, dan is er hier ook niets bijzonders — dan geldt de portable stap zoals
hij is.

### 1. Check de branch — voor je ook maar één bestand aanraakt

**Voor je code schrijft, een bestand aanmaakt of iets wijzigt:** run `git status` en `git branch`. Dit
is niet-onderhandelbaar — zelfs een script of configbestand wordt niet geschreven vóór deze stap.

- **Op `main`** → maak eerst de juiste branch aan, dan pas wijzigingen.
- **Op een feature branch** → ga door op die branch.

Dit staat ook in [`CLAUDE.md`](../CLAUDE.md#ontwikkelworkflow--de-route-staat-in-contributing-davekjohncontributingmd) als één van de
twee dingen die aan élke wijziging voorafgaan, en dat is met opzet: het is een grondwetregel die het niet mag
uitmaken welk van de twee documenten je open hebt.

> **Lees bij die `git status` ook de `ahead`-regel, want een vooruitlopende `main` reist mee.** Loopt je
> lokale `main` voor op `origin/main`, dan takt je branch daarvan af en draagt hij die commits mee. Bij de
> merge komen ze **allemaal** op `origin/main` terecht, zonder dat er ooit `git push origin main` is
> gedraaid.
>
> **Dit was tot 2026-08-16 de normale stand hier, en is dat sindsdien niet meer.** De oorzaak was de
> push-regel: de fold-commit bleef bewust lokaal, dus `main` liep na élke merge weer voor. Gemeten toen
> dat nog gold: bij PR #108 gingen zo negentien lokale commits mee (tien folds en negen merges), bij
> PR #109 de fold van #108. Er was niets aan stuk — het zijn commits die er hoe dan ook heen moesten —
> maar het verklaarde waarom `main` na een merge ineens gelijkliep terwijl niemand had gepusht, en wie
> dat niet wist ging zoeken naar een push die niet bestond.
>
> Nu de fold met `-Push` draait, hoort `main` na elke ronde weer gelijk te staan. **De waarschuwing
> blijft staan** omdat het mechanisme niet weg is: onderbreek je een keten halverwege, of commit je iets
> anders lokaal op `main`, dan geldt hetzelfde. Alleen is het nu een uitzondering in plaats van de regel,
> en een `ahead`-regel is daarmee een signaal geworden in plaats van behang.
>
> Wil je dat een branch die commits **niet** meedraagt, tak dan af van `origin/main`
> (`git checkout -b <naam> origin/main`) in plaats van van je lokale `main`.

### 2. Classificeer de wijziging en noem de branch

Volgens de [prefix-tabel](#de-prefixen-zeven-die-je-kiest-negen-die-de-lib-kent) hierboven.

### 3. Ontwikkel op de branch en houd `development-cycle.md` bij

Maak wijzigingen op de branch en commit met een duidelijke boodschap. De gedeelde
**`new-branch`**-skill zet de branch én zijn eigen document neer op
`contributing-davekjohn/development-cycle.md` in één stap — een branch is nooit entry-loos, en dit
bestand bestaat alleen zolang de branch openstaat: `new-branch` schrijft het, de fold verwijdert het bij
de merge. **Vier vaste `###`-koppen en nooit een vijfde**: `PLAN`, `CREATE`, `TEST` dragen de
stappenlijst — wat er nog moet gebeuren, nooit gevouwen — en `DEPLOY: \`<branch>\`` **is** de
changelog-entry — wat de wijziging **doet**, gevouwen bij de merge. Een subonderwerp binnen een van de
vier gaat als `####` eronder; geen enkele gate leest die diepte.

Wat elk stuk is, waarom de naam vast is en wat de drie stappentekens betekenen: **portable helft,
`DEVELOPMENT-portable.md`** — dat vervangt sinds 23 augustus 2026 het losse tweetal
(`branch-changelog.md` + `branch-progress.md`) dat hier tot 27 augustus 2026 nog stond. Er is geen
reference-kopie meer om te raadplegen: de guidance staat nu **inline** in het document zelf, in zowel
zijn lege als zijn gevulde staat.

Wat déze repo daaraan toevoegt:

**`CHANGELOG.md` blijft met rust op de branch — nooit direct bewerken.** Elke branch bewerkte vroeger
hetzelfde blok, wat bij lang-openstaande branches tot merge-conflicten leidde. Het vaste branch-document
lost dat op: er is niets om over te conflicteren.

**Nooit mergen zonder een gevulde `### DEPLOY`-sectie.** Dit geldt ook voor kleine of puur documentaire
wijzigingen. `open-pr` weigert zolang de beschrijving, de body of een tier waarnaar deze repo vraagt nog
leeg is — er staat geen zichtbare `TODO:`-placeholder meer; het script *meet* in plaats van te matchen.

**De `###`-koppen zijn exact.** Ze zijn wat de gedeelde scripts opzoeken; een verschrijving betekent dat
de fold die declaratie stilzwijgend verliest. En binnen `### DEPLOY` mag nooit een eigen `###` staan —
dat wordt bij het folden een aparte, impactloze wijziging in `CHANGELOG.md`. Gebruik `#####` of vet voor
iets dat daar zijn eigen regel nodig heeft.

#### Significance — het antwoord van deze repo is tier 1

**Sinds deze repo een audience-tier heeft opgegeven (`Get-ReleaseAudienceTier`, 2026-08-12) draagt de
`### DEPLOY`-sectie geen aparte `Tier 0`/`Tier 1`-koppen meer.** Dat was tot 19-23 augustus 2026 nog wel
zo; sindsdien is de vraag **de kop zelf**: de opening van `### DEPLOY` is tier 0's eigen sectie (geen
eigen kop nodig — de DEPLOY-kop stelt de vraag al), en de ene audience-tier die deze repo heeft
gekozen krijgt één herkenbare `####`-kop eronder. Beide dragen **`**Score:** N`** tegen de gedeelde
rubric die `new-branch` print bij het aanmaken; `N/A` telt als volwaardig antwoord zolang de reden erboven
staat — juist een `N/A` kost daardoor niets dan een zin.

**Het antwoord van deze repo is `Get-ReleaseAudienceTier = 1`**: het management en de opdrachtgever. Dave's
keuze van 2026-08-12, in zijn eigen woorden — *bezoekers lezen geen release notes.*

Wie tier 1 hier precies is, welke wijzigingen hem bereiken en waarom dat de release-cadans bepaalt, staat op
één plek: **[`contributing-davekjohn/releases/README.md`](releases/README.md#what-tier-1-means-here)**. Daar hoort het, want het is
onderdeel van het release-model; hier staat alleen dát het antwoord 1 is. Eén regel om bij het invullen op
terug te vallen: repo-machinerie bereikt Dave als **onderhouder** en blijft tier 0, de site zelf bereikt hem
als **opdrachtgever** en is tier 1.

> **Dit verving op 2026-08-27 de oudere beschrijving met zes sectiekoppen** (Branch title, Branch ID,
> Branch type, "What does the change on this branch bring to main?", Significance met expliciete
> `#### Tier 0`/`#### Tier 1`-koppen, Pull Request). Die vorm bestond echt, maar was al vóór de
> map-hernoeming stilzwijgend verouderd geraakt: het model waarin een repo met een gekozen audience-tier
> de vraag zelf als kop draagt in plaats van het tier-nummer bestaat sinds 19-23 augustus 2026. `Branch
> ID` verhuisde naar de creation-stamp in het document-eigen `## Development cycle: \`<branch>\` ·
> <stamp>`-kop; `Branch title` en `Branch type` zijn niet meer apart geschreven velden — de branchnaam
> in elke kop draagt het type via zijn prefix, en de PR-titel (nog steeds `new-branch -Title`) leeft nu
> als eerste regel van `Pull Request`.

### 4. Push de branch en open de PR — behalve bij frontend-werk

Zodra de branch klaar is (commits + `contributing-davekjohn/development-cycle.md` met elke stap boven
`### DEPLOY` opgelost en de `### DEPLOY`-sectie zelf gevuld): push hem. **Of de PR daarna vanzelf
opengaat, hangt af van wat er in de branch zit** — de toets en de ene uitzondering staan in de
safety-rules van [`CLAUDE.md`](../CLAUDE.md#nooit-direct-op-main--via-branch--pr), en die gaan boven
deze pagina:

| wat er in de branch zit | wat er gebeurt |
|---|---|
| `scripts/`, governance-docs, `CHANGELOG.md`, `releases/`, `contributing-davekjohn/`, `.claude/`, onderzoek | **loopt door**: openen → mergen → folden → pushen, zonder tussenvraag |
| iets in `src/`, `public/` of `src/data/mixes/` | **stop na de push** en meld dat de branch klaar staat — hier valt iets aan de frontend te bekíjken, en een merge is een deploy naar `djcylow.com` |

Bij twijfel geldt de zwaarste rij. Draagt een branch beide soorten werk, dan is het frontend-werk en wacht hij.

> **Er stond hier tot 2026-08-16 een derde rij** — *"een release, een tag, of een beschermd bestand →
> stop, expliciet verzoek van Dave vereist"*. Die is geschrapt op Dave's woord: *"de enige uitzondering
> dat een PR niet meteen gemerged mag worden is wanneer er iets op de frontend gecheckt kan worden."*
>
> **De beschermde bestanden zijn niet vrijgegeven** — `next.config.ts`, `netlify.toml` en verwijderingen
> uit `public/images/` staan onverkort op de lijst in
> [`CLAUDE.md`](../CLAUDE.md#nooit-zonder-expliciete-toestemming-van-dave). Wat verviel is de **tweede**
> keer vragen: Dave's woord valt bij het uitdelen van het werk, niet nóg eens bij de merge-knop. Een
> release en een tag hoorden sowieso niet in deze tabel, want een release cut loopt hier niet via een
> branch of een PR — er valt niets te mergen.

Gebruik in beide gevallen de gedeelde **`open-pr`**-skill. Welke poorten die vóór het pushen
draait — resolves, scaffold, impact, step-list — en welke van de vier een `-Force` kent, staat in de
**portable helft, stap 3**. Wat hier van ons is:

**De lint-poort uit `Get-LintScript` is de laatste wacht vóór de live site**, want een merge is hier een
deploy. [`scripts/lint/lint-web.ps1`](../scripts/lint/lint-web.ps1) draait `tsc --noEmit`, `eslint .` **én**
`npm run build`, en alle drie moeten groen zijn. De build zit er sinds 2026-07-26 in, precies omdat een typecheck een kapotte
build niet vangt en er niets tussen de merge en de site zit. `-SkipBuild` bestaat om lokaal te itereren en
hoort niet in de poort zelf. **ESLint zit er sinds 2026-08-14 in** als tweede stap: er waren 37
pre-existing errors, die zijn die dag in drie branches naar **0** gebracht, en daarmee verviel de reden
om hem erbuiten te houden. Het oude advies "vergelijk op **aantal** en niet op exitcode" is dus vervallen
— er is geen aantal meer. Sinds diezelfde dag staan ook de **warnings op 0**; die blokkeren de poort
niet, maar hun aantal wordt wel gemeld zodat het niet ongemerkt terugloopt. Elke melding die je ziet is
dus nieuw en van jou. **Sinds 2026-08-15 toetst de buildstap ook het aantal statische pagina's** tegen
een ondergrens: daalt het eronder — een `generateStaticParams` die stilvalt geeft namelijk gewoon exit 0
— of is het getal niet uit de buildoutput te lezen, dan blokkeert de poort. Groei blokkeert niet maar
wordt gemeld, met het verzoek de ondergrens bewust te verhogen.

De PR-body komt uit [`.github/pull_request_template.md`](../.github/pull_request_template.md) — loop de
checklist na en vink af wat van toepassing is. De titel geef je **niet** mee; die stelt `open-pr` samen uit
de entry. Twee dingen die hier gemeten zijn en niet in de portable helft staan:

- **Gebruik nooit `gh pr create --fill`.** `--fill` vult de body met de volledige commit-geschiedenis sinds
  `main` — ontdekt bij PR #1/#2, tientallen irrelevante historische commits in plaats van de template.
  Gebruik `--body`/`--body-file`.
- **Draai je het handmatig, geef dan `--repo DaveKJohn/djcylow-react` mee.** Deze repo heeft een `origin`-
  én een `upstream`-remote die naar dezelfde GitHub-URL wijzen, wat de branch-detectie van `gh` in de war
  stuurt met *"you must first push the current branch to a remote"*.

> **De PR-body wordt gevuld uit de `### DEPLOY`-sectie van `contributing-davekjohn/development-cycle.md`**, en dat werkt omdat
> `.github/pull_request_template.md` de canonieke placeholder draagt waar `open-pr` naar zoekt.
> `Get-PrDescriptionPlaceholder` in `scripts/repo-config.ps1` blijft daarom **bewust leeg**: die seam
> bestaat om een afwijkende placeholder te melden, en er is er geen.
>
> Hier stond tot 2026-08-15 het omgekeerde — dat dit "nog niet gerepareerd" was, dat de template een
> Nederlandse placeholder droeg, en dat de reparatie het vullen van die seam zou zijn, gepland op
> `docs/release-route-naar-script`. Alle vier onwaar: de reparatie was juist de template-route, ze is
> gemerged en gefold, en die branch bestaat niet meer. Dat is de gevaarlijkste soort achterstand —
> geen verouderde constatering maar een opdracht tot werk aan een seam die leeg hoort te blijven.

### 5. Vertel Dave wat er is gedaan

Rapporteer wat er veranderd is en deel de PR-link. **Wanneer die rapportage valt, hangt af van stap 4:** bij
frontend-werk is dit het stoppunt en wacht de keten hier op Dave's woord; bij werk dat doorloopt is het de
afsluiting ná de fold en de push. **Vraag niet naar releasen** — dát blijft een expliciet verzoek van Dave.

> **Hier stond tot 2026-08-16 "vraag niet naar releasen óf pushen naar `main`".** Pushen is die dag
> vrijgegeven (Dave), dus er valt niets meer over te vragen: het gebeurt gewoon. Alleen de release
> blijft een expliciet verzoek.

### 6. Merge de Pull Request

Wissel eerst naar `main` — `gh pr merge` kan de huidige branch niet lokaal verwijderen als je er nog op
staat, dus `--delete-branch` ruimt dan alleen de remote op en laat een lokale rest achter:

```bash
git checkout main
gh pr merge [branch] --merge --delete-branch --subject "merge: [branch] (#<PR-nummer>)"
git pull --ff-only
```

`--merge` maakt een merge-commit (geen squash/rebase — behoudt de losse commits). `--subject` geeft de
merge-commit de `merge:`-prefix, consistent met de rest van de geschiedenis; zonder deze override
gebruikt GitHub het generieke "Merge pull request #N from ...". Controleer daarna of de lokale branch
écht weg is en ruim 'm zo nodig alsnog op: `git branch -d [branch]`.

Deze merge is de handeling die de site verandert — bij frontend-werk althans; bij de rest is de deploy die
erop volgt een no-op die dezelfde pagina's oplevert.

`Get-PrMergeMethod` blijft onbeantwoord in `repo-config.ps1`, maar sinds 2026-08-13 om een andere reden dan
"de merge wacht altijd op Dave". Die knop wordt alleen gelezen door **`ship-pr`**, en die gebruiken we hier
nog steeds niet — nu nog om één reden: de PR-regel vraagt een beoordeling per branch, raakt dit de site of
niet, en die kan een skill die openen, mergen en folden in één beweging doet niet maken. De tweede reden
("er is geen CI om op te wachten") verviel diezelfde dag, toen
[`.github/workflows/ci.yml`](../.github/workflows/ci.yml) landde.

### 7. Na de merge: vouw de changelog entry

Vouw de `### DEPLOY`-sectie van `contributing-davekjohn/development-cycle.md` in `CHANGELOG.md` via de
gedeelde **`fold-changelog`**-skill. Die splitst het document bij de `DEPLOY`-kop, neemt precies die
sectie, stript HTML-commentaren, plaatst de entry bovenaan `CHANGELOG.md` met de PR-link en de
merge-datum op de `DEPLOY`-kop zelf, en **verwijdert daarna het hele document** — het plan erboven gaat
mee, want dat is dezelfde bestand-sectie als de entry. **Reset in plaats van verwijderen was het oude
gedrag** (tot 23 augustus 2026, toen het document nog uit twee losse bestanden bestond die op `main` in
een lege staat bleven staan); sindsdien bestaat het bestand alleen zolang de branch openstaat, dus is er
na de fold niets meer om te resetten. Hoe de entry precies rangschikt: **portable helft,
`DEVELOPMENT-portable.md`, "What happens at the merge"**. Dit gebeurt zonder aparte toestemming — het
hoort bij het afronden van de zojuist goedgekeurde merge, net als de branch-opruiming in stap 6.

Draai de skill met **`-Push`**: die commit én pusht dan zelf, met bericht `fold: [branch] changelog (#NN)`,
en de scope wordt door git afgedwongen tot precies `CHANGELOG.md` plus de verwijdering van
`contributing-davekjohn/development-cycle.md`. Dit is de **enige echte directe commit op `main`** in deze repo —
één van de twee met naam genoemde uitzonderingen in
[`CLAUDE.md`](../CLAUDE.md#nooit-direct-op-main--via-branch--pr). `-Push` impliceert `-Commit`, dus je hoeft
er maar één mee te geven.

> Tot 2026-08-11 stond hier `chore: fold changelog entry [branch]` als handmatig `git add`/`git
> commit`-blok. **`fold:` is sindsdien de erkende prefix voor deze ene commit** — de reden: `merge:` en
> `fold:` zijn één beweging in twee commits en horen als paar te lezen; `chore:` zei alleen
> "huishouding". Changelog-bookkeeping blijft daarnaast wél `chore:` voor ander boekhoudwerk — dit is een
> met naam genoemde uitzondering, geen algemene regelwijziging.

> **Dit stond hier tot 2026-08-16 andersom:** *"Pushen van deze fold-commit naar `origin` gebeurt niet
> automatisch — dat blijft, net als elke push naar `origin/main`, initiatief van Dave. De skill kent een
> `-Push`-vlag; die gebruiken we hier niet."* Dave heeft die regel die dag geschrapt. De reden dat hij
> juist hier het langst bleef staan is ook de reden dat hij verviel: na de omzetting van de PR-stap op
> 2026-08-13 was de fold-commit het **enige** dat er nog onder viel — en dat is de minst riskante commit
> die deze repo kent. Hij verandert geen enkele gebouwde pagina; Netlify meldt bij zo'n PR letterlijk
> *"Pages changed — skipping"*. Daarmee wachtte de lichtste handeling terwijl de zwaarste, de merge zelf,
> allang doorliep. Deze repo volgt nu de bron, waar de gedeelde skill `-Push` als de normale route noemt.

---

## De release-route

Een release begint **alleen op expliciet verzoek** van Dave. Dat is een grondwetregel, geen voorkeur.
De volledige route — het versienummer bepalen, de release-notes, de changelog-verhuizing, de tag en de
GitHub Release — staat in [`CLAUDE.md`](../CLAUDE.md#release-workflow), en de lijst van wat er is
uitgebracht in [`contributing-davekjohn/releases/README.md`](releases/README.md).

Let op de volgorde van oorzaak en gevolg, want die is hier omgekeerd ten opzichte van wat je zou
verwachten: **een release zet niets nieuws live.** De wijzigingen stonden al op de site vanaf hun eigen
PR-merge. Een cut voegt daar een versienummer, een release-note en een tag aan toe. Precies daarom is
een release-cut laagrisico — er gaat geen ongeteste code mee naar buiten — en precies daarom staat
`Get-LiveStage` leeg.

## Waar de rest woont

- **Het mechanisme van de cyclus zelf** — de vijf portable stappen, het tier-model, de rubric, de poorten:
  `CONTRIBUTING-portable.md` in de plugin, via een van de twee paden bovenaan deze pagina. Dat is de helft
  die met elke plugin-release meebeweegt; een correctie daarin gaat als
  [`inbound`-issue](https://github.com/DaveKJohn/claude-code-specialists/issues) naar de bron en niet hier.
- Het branch-eigen document, de vier fasen en de drie stappentekens: `DEVELOPMENT-portable.md` in de
  plugin, via een van de twee paden bovenaan deze pagina — er is sinds 2026-08-27 geen repo-eigen
  reference-kopie meer, de guidance staat inline in `development-cycle.md` zelf.
- Wat live is maar nog geen versienummer heeft: [`CHANGELOG.md`](CHANGELOG.md).
- De grondwet, het roster en alles wat repo-eigen is: [`CLAUDE.md`](../CLAUDE.md).
- Het release-model en de lijst uitgebrachte versies: [`contributing-davekjohn/releases/README.md`](releases/README.md). Let op dat
  die pagina de **andere** constructie draagt: daar staat de portable helft verbatim in het bestand zelf,
  boven een streep, omdat de release-lijst er lokaal in moet wonen en `release-lib.ps1` er rijen in schrijft.
  Dat er twee vormen naast elkaar bestaan is geen inconsistentie maar een gevolg van dat verschil — en het is
  bij de bron aangekaart als [inbound #646](https://github.com/DaveKJohn/claude-code-specialists/issues/646),
  dat om een `RELEASES-portable.md` vraagt zodat ook die helft gaat meereizen.
- Welke specialist welk soort wijziging oppakt:
  [`.claude/specialists/SPECIALISTS.md`](../.claude/specialists/SPECIALISTS.md).
