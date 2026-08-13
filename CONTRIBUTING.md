# Bijdragen aan djcylow-react — de contributie-cyclus

Dit is de **lokale helft** van de contributie-cyclus: hoe werk in *deze* repo van een idee naar `main`
komt, en daarmee naar de live site. De **portable helft** reist met de plugin mee en staat niet in
deze repo:

```text
# de geïnstalleerde release -- dit is de cyclus zoals de scripts hem NU draaien
~/.claude/plugins/cache/claude-code-specialists/workflow-davekjohn/<versie>/CONTRIBUTING-portable.md

# de bron -- kan vóórlopen op de release hierboven
~/.claude/plugins/marketplaces/claude-code-specialists/plugins/workflows/workflow-davekjohn/CONTRIBUTING-portable.md
```

Die pagina beschrijft de cyclus zoals de gedeelde `workflow-davekjohn`-scripts hem draaien, en noemt
overal de **seam** waar een repo zelf het antwoord geeft. Deze pagina geeft die antwoorden. Lees de
portable pagina voor het mechanisme, deze voor de waarden.

> **Beide paden staan er met opzet, en het verschil is een keer duur geweest.** De scripts draaien uit de
> **cache**, dus dat is de tekst die beschrijft wat er feitelijk gebeurt. De marketplace-clone is de bron en
> kan verder zijn. Deze repo stond een tijd op 4.5.0 terwijl `life-hub` al op 4.6.0 liep, en de
> release-scripts verschilden precies in het stuk dat toen geauditeerd werd. Lees bij twijfel
> `installed_plugins.json` op `projectPath` en niet de sessie-context.

**Hier staat de cyclus niet nóg een keer.** Wat hieronder volgt zijn de **antwoorden** van deze repo, per
stap, met een verwijzing naar de portable stap waar het mechanisme staat. Tot 2026-08-13 beschreef deze
pagina de zeven stappen wél voluit — inclusief het tier-model met zijn score-tabel, de zes entry-secties, de
vier poorten van `open-pr` en de fold-mechaniek. Dat was een tweede beschrijving van tekst die al met de
plugin meereist, en een tweede beschrijving loopt uit de pas: `releases/README.md` deed hetzelfde en daar
waren op de dag van het opruimen drie beweringen stil verouderd. De portable helft schrijft deze splitsing
zelf voor — *"read this page for the cycle; read your own page for the values"* — dus dit is de bedoelde
vorm en geen bezuiniging.

> **Deze pagina is Nederlands, de portable helft is Engels.** Dat volgt de taalregel van
> [`CLAUDE.md`](CLAUDE.md#taal): de repo-documentatie is Nederlands. De portable helft is niet van
> deze repo, dus die valt buiten die regel. De zes sectiekoppen van een entry en de `Tier`/`Score`-
> sleutels blijven wél Engels — het zijn machine-gelezen sleutels, zie
> [stap 3](#3-ontwikkel-op-de-branch-en-houd-de-twee-branch-bestanden-bij).

**De grondwet staat hier niet.** Wat mag en wat op Dave's woord wacht — de safety-rules, de PR-regel,
de twee uitzonderingen op "nooit direct op `main`", de release-toestemming — staat in
[`CLAUDE.md`](CLAUDE.md#safety-rules) en gaat boven alles op deze pagina. Deze pagina beschrijft de
**route**; die beschrijft de **grenzen**.

**Eén van die grenzen hoort hier wel genoemd, omdat ze de hele route kleurt: een PR mergen is in deze
repo een deploy.** `origin/main` ís de live site — Netlify bouwt en publiceert bij elke push naar
`main`, en `gh pr merge` schrijft daar server-side rechtstreeks in. Er is **geen staging**. De poorten
in [stap 4](#4-push-de-branch-en-open-de-pr--behalve-bij-site-werk) zijn dus de laatste wacht vóór `djcylow.com`, en
niet een formaliteit onderweg.

---

## Specifiek voor deze repo (djcylow-react)

> *Alles in de portable helft is de cyclus, en die reist naar elke repo die de plugin aanzet. Dit deel
> is de djcylow-lens: kopieer je die pagina naar een eigen repo, dan is dít het stuk dat je vervangt.*

### De seam, in één tabel beantwoord

| de portable helft vraagt | het antwoord hier | waar het machinaal staat |
|---|---|---|
| hoofdbranch | `main` | — |
| branch-prefixes | zeven die je kiest; de lib erkent er negen en levert acht changelog-typen | [`scripts/lib/branch-info.ps1`](scripts/lib/branch-info.ps1) |
| het type waar een onbekende prefix op terugvalt | `Chore` | `Get-EntryFallbackType` |
| de lint-poort | [`scripts/lint/lint-web.ps1`](scripts/lint/lint-web.ps1) — `tsc --noEmit` én `npm run build` | `Get-LintScript` |
| de sectiekoppen van een entry | de Engelse defaults — bewust niet overschreven | *(geen override gedefinieerd)* |
| de rubric achter de scores 1–5 | de gedeelde vijf banden | *(geen override gedefinieerd)* |
| de ene publieks-tier van deze repo | **1** — het management en de opdrachtgever | `Get-ReleaseAudienceTier` |
| permanente root-docs | `CHANGELOG.md` · `CLAUDE.md` · `README.md` · `CONTRIBUTING.md` | `Get-ReservedRootMd` |
| de release-historie | de tabel in [`releases/README.md`](releases/README.md) | `Get-ReleaseHistoryPath` |
| indeling van de release-notes | per **major** (`2.x/`) — gelijk aan de bron sinds 2026-08-13 | `Get-ReleaseNotesGrouping` |
| het handgeschreven release-document | [`releases/audience/`](releases/audience/), bij een minor en een major | `Get-ReleaseNoteRoot` · `Get-ReleaseConsumerBumps` |
| de aankondiging die de Release-body wordt | [`releases/github/`](releases/github/), bij elke release | *(hardcoded in de bron, geen seam)* |
| een aparte go-live-stap ná de cut | geen — de code stond al live vanaf zijn eigen PR-merge | `Get-LiveStage` (leeg) |

Op één na wonen ze allemaal in [`scripts/repo-config.ps1`](scripts/repo-config.ps1); de prefix-tabel is
een eigen lib. Waar de tabel *geen override gedefinieerd* zegt, draait deze repo bewust op de gedeelde
default — **dat is een antwoord, geen gat**, en de verantwoording staat per stuk in `repo-config.ps1`
zelf.

**Tel de onbeantwoorde seams nooit uit dat bestand.** Elke niet-gedeclareerde optionele functie wordt
door `check-script-contract.ps1` als `[INFO]` gemeld, en dat aantal is de enige stand die met de
blueprint meebeweegt — handgeschreven tellingen liepen hier al eens met drie verschillende getallen
uiteen. De check draait bij elke sessiestart via de `script-contract-sessioncheck`-hook.

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

Dit staat ook in [`CLAUDE.md`](CLAUDE.md#ontwikkelworkflow--de-route-staat-in-contributingmd) als één van de
twee dingen die aan élke wijziging voorafgaan, en dat is met opzet: het is een grondwetregel die het niet mag
uitmaken welk van de twee documenten je open hebt.

### 2. Classificeer de wijziging en noem de branch

Volgens de [prefix-tabel](#de-prefixen-zeven-die-je-kiest-negen-die-de-lib-kent) hierboven.

### 3. Ontwikkel op de branch en houd de twee branch-bestanden bij

Maak wijzigingen op de branch en commit met een duidelijke boodschap. De gedeelde
**`new-branch`**-skill zet de branch én zijn twee bestanden in [`branch/`](branch/) in één stap neer — een
branch is nooit entry-loos. Wat die twee bestanden zijn, welke zes secties de entry heeft, waarom de namen
vast zijn en wat de drie stappentekens betekenen: **portable helft, stap 1 en 2**, en
[`branch/README.md`](branch/README.md) voor het tweetal zelf.

Wat déze repo daaraan toevoegt:

**De zes sectiekoppen en de `Tier`/`Score`-sleutels blijven Engels**, als bewuste uitzondering op de
Nederlandse repo-documentatie: het zijn de sleutels waar `new-branch`, `open-pr`, `fold-changelog` en de
release-cut het over eens moeten zijn. Vertaal je ze, dan kan de eigen fold de eigen entry niet meer lezen.
`scripts/repo-config.ps1` definieert daarom bewust géén `Get-EntrySectionHeadingOverrides` — dát is de
beslissing die dit vastlegt, niet deze alinea.

**`CHANGELOG.md` blijft met rust op de branch — nooit direct bewerken.** Elke branch bewerkte vroeger
hetzelfde blok, wat bij lang-openstaande branches tot merge-conflicten leidde. De vaste branch-bestanden
lossen dat op: er is niets om over te conflicteren.

**Nooit mergen zonder een gevuld `branch/branch-changelog.md`.** Dit geldt ook voor kleine of puur
documentaire wijzigingen.

**Een entry met het verkeerde kopniveau wordt stil overgeslagen.** `Get-EntryHeadingLevel` is hier 2, dus de
fold accepteert `##` of `###`. Schrijf je de kop als `#`, dan meldt de fold *"No entry files found to fold"*,
eindigt met **exit 0** en committeert niets — de entry lijkt verdwenen terwijl hij er staat. Via
`new-branch` kan dit niet gebeuren; bij handwerk wel (overkomen op 2026-08-13, PR #27). Controleer na élke
fold `git log -1`, niet alleen de exitcode.

#### Significance — het antwoord van deze repo is tier 1

Het mechanisme — twee vragen in één sectie, de rubric, waarom `N/A` zijn reden nodig heeft, waarom tier 0
nooit `N/A` is, waarom je het tier niet uit de prefix afleidt — staat in de **portable helft,
`## Significance`**, en `new-branch` print de rubric bovendien zelf bij het aanmaken.

**Het antwoord van deze repo is `Get-ReleaseAudienceTier = 1`**: het management en de opdrachtgever. Dave's
keuze van 2026-08-12, in zijn eigen woorden — *bezoekers lezen geen release notes.* `new-branch` scaffoldt
daarom `#### Tier 0` en `#### Tier 1`, en vragen `open-pr` en de release-cut exact die twee compleet te zijn.

Wie tier 1 hier precies is, welke wijzigingen hem bereiken en waarom dat de release-cadans bepaalt, staat op
één plek: **[`releases/README.md`](releases/README.md#what-tier-1-means-here)**. Daar hoort het, want het is
onderdeel van het release-model; hier staat alleen dát het antwoord 1 is. Eén regel om bij het invullen op
terug te vallen: repo-machinerie bereikt Dave als **onderhouder** en blijft tier 0, de site zelf bereikt hem
als **opdrachtgever** en is tier 1.

### 4. Push de branch en open de PR — behalve bij site-werk

Zodra de branch klaar is (commits + een gevuld `branch/branch-changelog.md` en een leeg
`branch/branch-progress.md`): push hem. **Of de PR daarna vanzelf opengaat, hangt af van wat er in de branch
zit** — de toets en de twee uitzonderingen staan in de safety-rules van
[`CLAUDE.md`](CLAUDE.md#nooit-direct-op-main--via-branch--pr), en die gaan boven deze pagina:

| wat er in de branch zit | wat er gebeurt |
|---|---|
| `scripts/`, governance-docs, `CHANGELOG.md`, `releases/`, `.claude/`, onderzoek | **loopt door**: openen → mergen → folden, zonder tussenvraag |
| iets in `src/`, `public/` of `src/data/mixes/` | **stop na de push** en meld dat de branch klaar staat — een merge is hier een deploy naar `djcylow.com` |
| een release, een tag, of een beschermd bestand | **stop** — expliciet verzoek van Dave vereist |

Bij twijfel geldt de zwaarste kolom. Draagt een branch beide soorten werk, dan is het site-werk en wacht hij.

Gebruik in beide gevallen de gedeelde **`open-pr`**-skill. Welke poorten die vóór het pushen
draait — resolves, scaffold, impact, step-list — en welke van de vier een `-Force` kent, staat in de
**portable helft, stap 3**. Wat hier van ons is:

**De lint-poort uit `Get-LintScript` is de laatste wacht vóór de live site**, want een merge is hier een
deploy. [`scripts/lint/lint-web.ps1`](scripts/lint/lint-web.ps1) draait `tsc --noEmit` **én** `npm run build`
en beide moeten groen zijn. De build zit er sinds 2026-07-26 in, precies omdat een typecheck een kapotte
build niet vangt en er niets tussen de merge en de site zit. `-SkipBuild` bestaat om lokaal te itereren en
hoort niet in de poort zelf. ESLint blijft er bewust buiten: er staan 37 pre-existing errors, dus die
vergelijk je op **aantal** en niet op exitcode.

De PR-body komt uit [`.github/pull_request_template.md`](.github/pull_request_template.md) — loop de
checklist na en vink af wat van toepassing is. De titel geef je **niet** mee; die stelt `open-pr` samen uit
de entry. Twee dingen die hier gemeten zijn en niet in de portable helft staan:

- **Gebruik nooit `gh pr create --fill`.** `--fill` vult de body met de volledige commit-geschiedenis sinds
  `main` — ontdekt bij PR #1/#2, tientallen irrelevante historische commits in plaats van de template.
  Gebruik `--body`/`--body-file`.
- **Draai je het handmatig, geef dan `--repo DaveKJohn/djcylow-react` mee.** Deze repo heeft een `origin`-
  én een `upstream`-remote die naar dezelfde GitHub-URL wijzen, wat de branch-detectie van `gh` in de war
  stuurt met *"you must first push the current branch to a remote"*.

> **Nog niet gerepareerd, en het bijt bij elke PR:** de placeholder in onze PR-template is
> `<!-- Korte beschrijving van de wijziging en waarom -->`, terwijl `open-pr` letterlijk naar een andere
> zoekt. Zonder match krijgt de PR een body **zonder beschrijving en zonder foutmelding** — gemeten bij PR
> #26. De reparatie is niet de template naar de bron toeschrijven maar `Get-PrDescriptionPlaceholder` in
> `scripts/repo-config.ps1` vullen met onze eigen regel; die seam bestaat sinds plugin 4.7.0 en waarschuwt
> er nu wél hard over. Staat gepland op `docs/release-route-naar-script`.

### 5. Vertel Dave wat er is gedaan

Rapporteer wat er veranderd is en deel de PR-link. **Wanneer die rapportage valt, hangt af van stap 4:** bij
site-werk is dit het stoppunt en wacht de keten hier op Dave's woord; bij werk dat doorloopt is het de
afsluiting ná de fold. In beide gevallen geldt: **vraag niet naar releasen of pushen naar `main`** — dat blijft
Dave's initiatief, en er niet naar vragen is een aparte grondwetregel.

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

Deze merge is de handeling die de site verandert — bij site-werk althans; bij de rest is de deploy die erop
volgt een no-op die dezelfde pagina's oplevert.

`Get-PrMergeMethod` blijft onbeantwoord in `repo-config.ps1`, maar sinds 2026-08-13 om een andere reden dan
"de merge wacht altijd op Dave". Die knop wordt alleen gelezen door **`ship-pr`**, en die gebruiken we hier
nog steeds niet: er is **geen CI** om op te wachten, en de nieuwe regel vraagt een beoordeling — raakt dit de
site of niet — die een skill die in één beweging mergt niet kan maken.

### 7. Na de merge: vouw de changelog entry

Vouw `branch/branch-changelog.md` in `CHANGELOG.md` via de gedeelde **`fold-changelog`**-skill. Hoe die de
entry rangschikt, wat hij met de kop doet en dat de twee `branch/`-bestanden **gereset** worden in plaats van
verwijderd: **portable helft, stap 5**. Dit gebeurt zonder aparte toestemming — het hoort bij het afronden
van de zojuist goedgekeurde merge, net als de branch-opruiming in stap 6.

Draai de skill met `-Commit`: die commit dan zelf, met bericht `fold: [branch] changelog (#NN)`, en de
scope wordt door git afgedwongen tot precies `CHANGELOG.md` plus de twee `branch/`-bestanden. Dit is de
**enige echte directe commit op `main`** in deze repo — één van de twee met naam genoemde uitzonderingen in
[`CLAUDE.md`](CLAUDE.md#nooit-direct-op-main--via-branch--pr).

> Tot 2026-08-11 stond hier `chore: fold changelog entry [branch]` als handmatig `git add`/`git
> commit`-blok. **`fold:` is sindsdien de erkende prefix voor deze ene commit** — de reden: `merge:` en
> `fold:` zijn één beweging in twee commits en horen als paar te lezen; `chore:` zei alleen
> "huishouding". Changelog-bookkeeping blijft daarnaast wél `chore:` voor ander boekhoudwerk — dit is een
> met naam genoemde uitzondering, geen algemene regelwijziging.

**Pushen van deze fold-commit naar `origin` gebeurt niet automatisch** — dat blijft, net als elke push
naar `origin/main`, initiatief van Dave. De skill kent een `-Push`-vlag; die gebruiken we hier niet.

---

## De release-route

Een release begint **alleen op expliciet verzoek** van Dave. Dat is een grondwetregel, geen voorkeur.
De volledige route — het versienummer bepalen, de release-notes, de changelog-verhuizing, de tag en de
GitHub Release — staat in [`CLAUDE.md`](CLAUDE.md#release-workflow), en de lijst van wat er is
uitgebracht in [`releases/README.md`](releases/README.md).

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
- De twee bestanden waarin een branch werkt, en de drie stappentekens: [`branch/README.md`](branch/README.md).
- Wat live is maar nog geen versienummer heeft: [`CHANGELOG.md`](CHANGELOG.md).
- De grondwet, het roster en alles wat repo-eigen is: [`CLAUDE.md`](CLAUDE.md).
- Het release-model en de lijst uitgebrachte versies: [`releases/README.md`](releases/README.md). Let op dat
  die pagina de **andere** constructie draagt: daar staat de portable helft verbatim in het bestand zelf,
  boven een streep, omdat de release-lijst er lokaal in moet wonen en `release-lib.ps1` er rijen in schrijft.
  Dat er twee vormen naast elkaar bestaan is geen inconsistentie maar een gevolg van dat verschil — en het is
  bij de bron aangekaart als [inbound #646](https://github.com/DaveKJohn/claude-code-specialists/issues/646),
  dat om een `RELEASES-portable.md` vraagt zodat ook die helft gaat meereizen.
- Welke specialist welk soort wijziging oppakt:
  [`.claude/specialists/SPECIALISTS.md`](.claude/specialists/SPECIALISTS.md).
