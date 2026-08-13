# Bijdragen aan djcylow-react — de contributie-cyclus

Dit is de **lokale helft** van de contributie-cyclus: hoe werk in *deze* repo van een idee naar `main`
komt, en daarmee naar de live site. De **portable helft** reist met de plugin mee en staat niet in
deze repo:

```text
~/.claude/plugins/marketplaces/claude-code-specialists/plugins/workflows/workflow-davekjohn/CONTRIBUTING-portable.md
```

Die pagina beschrijft de cyclus zoals de gedeelde `workflow-davekjohn`-scripts hem draaien, en noemt
overal de **seam** waar een repo zelf het antwoord geeft. Deze pagina geeft die antwoorden. Lees de
portable pagina voor het mechanisme, deze voor de waarden.

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
in [stap 4](#4-push-de-branch--de-pr-pas-op-verzoek) zijn dus de laatste wacht vóór `djcylow.com`, en
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
| indeling van de release-notes | per **minor** (`2.22/`) | `Get-ReleaseNotesGrouping` |
| het handgeschreven release-document | [`releases/highlights/`](releases/highlights/), bij een minor en een major | `Get-ReleaseNoteRoot` · `Get-ReleaseConsumerBumps` |
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

### 1. Check de branch — voor je ook maar één bestand aanraakt

**Voor je code schrijft, een bestand aanmaakt of iets wijzigt:** run `git status` en `git branch`. Dit
is niet-onderhandelbaar — zelfs een script of configbestand wordt niet geschreven vóór deze stap.

- **Op `main`** → maak eerst de juiste branch aan, dan pas wijzigingen.
- **Op een feature branch** → ga door op die branch.

### 2. Classificeer de wijziging en noem de branch

Volgens de [prefix-tabel](#de-prefixen-zeven-die-je-kiest-negen-die-de-lib-kent) hierboven.

### 3. Ontwikkel op de branch en houd de twee branch-bestanden bij

Maak wijzigingen op de branch en commit met een duidelijke boodschap. De gedeelde
**`new-branch`**-skill zet de branch én zijn twee bestanden in [`branch/`](branch/) in één stap neer —
een branch is nooit entry-loos:

- `branch/branch-changelog.md` — wát de wijziging doet; niets eromheen, zodat het in één keer in
  `CHANGELOG.md` past
- `branch/branch-progress.md` — de stappenlijst en waar je gebleven bent

**Vaste namen, niet één per branch** — git houdt ze al per branch uit elkaar, en de repo-root loopt
niet meer vol. Op `main` staan ze in een lege reset-staat. Ernaast staan referentiekopieën met de
veldtoelichting in `branch/templates/`; die zijn gegenereerd — bewerk je er één, dan zet de volgende
run hem terug. De volledige uitleg van het tweetal staat in [`branch/README.md`](branch/README.md).

`branch/branch-changelog.md` heeft **zes vaste secties**:

```text
## `<branch>` changelog

### Branch title      <- de titel; óók de PR-titel
### Branch ID         <- tijdstempel, gezet bij aanmaken
### Branch type       <- de branch-prefix (kleine letter, bv. `docs`)
### What does the change on this branch bring to main?
### Significance
### Pull Request      <- vult de fold in, na de merge
```

Drie ervan staan er al bij het aanmaken. `Branch title` schrijf je **zonder** `feat:`/`docs:`-prefix —
die zet `open-pr` er zelf voor (stap 4).

**Die zes koppen en de `Tier`/`Score`-sleutels blijven Engels**, als bewuste uitzondering op de
Nederlandse repo-documentatie: het zijn de sleutels waar `new-branch`, `open-pr`, `fold-changelog` en de
release-cut het over eens moeten zijn. Vertaal je ze, dan kan de eigen fold de eigen entry niet meer
lezen. `scripts/repo-config.ps1` definieert daarom bewust géén `Get-EntrySectionHeadingOverrides`.

**De datum staat niet in de kop.** Tot 2026-08-11 stond hij in de entry-titel en was dat de
geboortedatum van de branch in plaats van de landingsdatum. De fold schrijft hem nu uit de
merge-timestamp van de PR, als slotregel `[PR #NN](url) · merged YYYY-MM-DD` onder `### Pull Request`.

**De kop van de entry noemt de branch, niet de wijziging.** De fold laat hem staan zoals hij is
geschreven; in `CHANGELOG.md` staat er straks dus ``## `docs/mijn-branch` changelog``. De leesbare naam
van de wijziging woont in `### Branch title`, en dát is de zin die je overneemt als je er ergens anders
naar verwijst — een release-note bijvoorbeeld.

**`CHANGELOG.md` blijft met rust op de branch — nooit direct bewerken.** Elke branch bewerkte vroeger
hetzelfde blok, wat bij lang-openstaande branches tot merge-conflicten leidde. De vaste branch-bestanden
lossen dat op: er is niets om over te conflicteren.

**Nooit mergen zonder een gevuld `branch/branch-changelog.md`.** Dit geldt ook voor kleine of puur
documentaire wijzigingen.

#### Significance — het verplichte tier-model

Onder `### Significance` staan **twee** sub-secties, `#### Tier 0` en `#### Tier 1`, elk met een
`**Score:**`-regel. Beide worden beantwoord:

- **Tier 0** — alleen de mensen die deze repo onderhouden merken het
- **Tier 1** — het management en de opdrachtgever: Dave, en wie met hem aan dit project werkt

**Twee tiers, en tier 1 is geen tussenstap naar een derde.** `Get-ReleaseAudienceTier` staat hier op
**1** — Dave's keuze van 2026-08-12, in zijn eigen woorden: *bezoekers lezen geen release notes.* Tier 1
en tier 2 zijn twee **soorten** lezer en niet twee sporten van een ladder, en een repo heeft er precies
één. Wie `djcylow.com` bezoekt luistert een mix of boekt een boeking; die persoon opent nooit een
versie-document. `new-branch` scaffoldt daarom tier 0 en tier 1, en `open-pr` en de release-cut vragen
exact die twee compleet te zijn.

**De cumulatieve ladder is vervallen.** Tot 2026-08-12 werden alle drie de tiers gevraagd en moest een
gescoorde tier 2 een gescoorde tier 1 boven zich hebben. Dat kostte de bron-repo 81 van haar 89
tier-1-secties aan hetzelfde argument in een tweede register. Tier 2 blijft wél **gelezen** waar een
oudere entry hem draagt (`Get-EntryTierMax` is nog 2), dus entries van vóór die datum blijven folden.

De score is 1 t/m 5 tegen deze schaal, of `N/A` met één regel waarom het die groep niet bereikt:

| Score | Betekenis |
|---|---|
| `5` | de lezer moet iets dóén — breaking change, verplichte migratie, of een lang bestaande blokkade die weg is |
| `4` | verandert wezenlijk hoe ze werken; ze merken het binnen een dag zonder dat iemand het zegt |
| `3` | een duidelijke verbetering, merkbaar zodra ze dat deel aanraken |
| `2` | klein; merkbaar als iemand erop wijst |
| `1` | cosmetisch, of het voorkomt een storing die nog niet is opgetreden — noem dan die storing, want dat is het enige waar een latere lezer iets aan heeft |

Harde regels:

- **Tier 0 mag nooit `N/A`** — elke wijziging raakt de mensen die deze repo onderhouden.
- **`N/A` heeft zijn reden nodig.** "Geen bezoeker kan dit zien" is informatie; een leeg veld betekent
  óók "hier is niemand aan toegekomen", en de poort moet die twee kunnen onderscheiden.
- **De reden staat bóven de `**Score:**`-regel.** Alles eronder wordt door de parser weggegooid.
- **De score wordt bewust leeg gescaffold** — een gegokt cijfer is erger dan geen cijfer.
- **Leid het tier niet af uit de branch-prefix.** Een `docs/`-branch kan tier 1 zijn en een
  `feature/`-branch tier 0.

Het bereik is de **hoogste tier met een cijfer**. Dat bepaalt in welk release-document de entry belandt
en, samen met de score, wáár in `CHANGELOG.md` hij landt — de fold plaatst gerangschikt, niet simpelweg
bovenaan.

#### De stappenlijst is een poort, geen versiering

`branch/branch-progress.md` moet leeg zijn van openstaande punten voordat er een PR mag komen. Elk punt
wordt `- [x]` gedaan óf `- [~]` laten vervallen, met de reden op de regel. Dat derde teken bestaat zodat
niemand een vakje hoeft af te vinken voor werk dat niet is gedaan. **Er is geen `-Force`** op deze poort.

### 4. Push de branch — de PR pas op verzoek

Zodra de branch klaar is (commits + een gevuld `branch/branch-changelog.md` en een leeg
`branch/branch-progress.md`): push hem en meld dat hij klaar staat. **Open de PR niet uit jezelf** — zie
de safety-rules in [`CLAUDE.md`](CLAUDE.md#nooit-zonder-expliciete-toestemming-van-dave).

Zegt Dave "open de PR", gebruik dan de gedeelde **`open-pr`**-skill. Die draait vier poorten vóór er
iets gepusht wordt:

1. **resolves-gate** — noemt de branch een openstaand issue, dan moet `-Resolves` of `-NoResolves` mee,
   zodat een gerepareerd issue niet open blijft na de merge
2. **scaffold-gate** — de entry mag geen scaffold-tekst meer dragen, en geen lege secties. Deze heeft
   wél een `-Force`
3. **impact-gate** — draait op dezelfde lezing: een onmogelijk tier of een onmogelijke score wordt
   geweigerd, een **ontbrekende** score wordt alleen gemeld (die weigering valt bij de release-cut)
4. **step-list-gate** — geen enkel `- [ ]` mag nog openstaan in `branch/branch-progress.md`. Geen
   `-Force`

Daarna pas de repo's eigen lint-poort uit `Get-LintScript` (`scripts/lint/lint-web.ps1`) en alle
testsuites. Faalt er iets, dan wordt er niets gepusht en komt er geen PR. **Deze poort is de laatste
wacht vóór de live site**, want een merge is hier een deploy: `tsc --noEmit` én `npm run build` moeten
groen zijn, en `-SkipBuild` bestaat om lokaal te itereren en hoort niet in de poort zelf.

Is alles groen, dan opent de skill de PR met
[`.github/pull_request_template.md`](.github/pull_request_template.md) als body — loop de checklist na en
vink af wat van toepassing is. **De titel komt uit de entry**: geef `open-pr` géén titel mee — hij stelt
hem zelf samen als `<branch-type>: <Branch title uit branch/branch-changelog.md>` (`feature:`, `fix:`,
`data:`, `content:`, `style:`, `docs:`, `config:`). Zo staat de zin één keer geschreven en kunnen de PR,
`CHANGELOG.md` en de release-documenten niet uit elkaar lopen. Een meegegeven `-Title` wordt nog
geaccepteerd maar genegeerd, met een waarschuwing die de titel noemt die de entry wél geeft.

**Gebruik nooit `gh pr create --fill`** in deze repo: `--fill` vult de body met de volledige
commit-geschiedenis sinds `main` (ontdekt bij PR #1/#2 — tientallen irrelevante historische commits in
plaats van de template). Gebruik `--body`/`--body-file` met de template-inhoud.

Draai je het handmatig, geef dan altijd **`--repo DaveKJohn/djcylow-react`** mee: deze repo heeft zowel
een `origin`- als een `upstream`-remote die naar dezelfde GitHub-URL wijzen, wat de automatische
branch-detectie van `gh` in de war stuurt ("you must first push the current branch to a remote").

### 5. Vertel Dave wat er is gedaan — stop daar

Rapporteer wat er veranderd is en deel de PR-link. Vraag niet naar mergen, releasen of pushen naar
`main`.

### 6. Na goedkeuring: merge de Pull Request

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

Deze merge is de handeling die de site verandert. `Get-PrMergeMethod` blijft daarom onbeantwoord in
`repo-config.ps1`: die knop wordt alleen gelezen door de `ship-pr`-skill, en die gebruikt deze repo
bewust niet — hij zou openen, mergen en folden in één beweging doen, terwijl de merge hier apart op
Dave's woord wacht.

### 7. Na de merge: vouw de changelog entry

Vouw `branch/branch-changelog.md` in `CHANGELOG.md` via de gedeelde **`fold-changelog`**-skill. Die
plaatst de entry gerangschikt op tier en score — niet simpelweg bovenaan — sluit hem af met de regel
`[PR #NN](url) · merged YYYY-MM-DD`, en laat de kop verder ongemoeid. Dit gebeurt zonder aparte
toestemming: het hoort bij het afronden van de zojuist goedgekeurde merge, net als de branch-opruiming
in stap 6.

`branch/branch-changelog.md` en `branch/branch-progress.md` worden daarbij niet verwijderd maar
**gereset** naar hun lege staat — het zijn vaste paden die de volgende branch nodig heeft. Een oud
entry-bestand in de repo-root (uit het model van vóór 2026-08-11) wordt, als het wordt aangetroffen, wel
nog verwijderd.

Draai de skill met `-Commit`: die commit dan zelf, met bericht `fold: [branch] changelog (#NN)`, en de
scope wordt door git afgedwongen tot precies `CHANGELOG.md` plus de twee `branch/`-bestanden.

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

- De twee bestanden waarin een branch werkt, en de drie stappentekens: [`branch/README.md`](branch/README.md).
- Wat live is maar nog geen versienummer heeft: [`CHANGELOG.md`](CHANGELOG.md).
- De grondwet, het roster en alles wat repo-eigen is: [`CLAUDE.md`](CLAUDE.md).
- Welke specialist welk soort wijziging oppakt:
  [`.claude/specialists/SPECIALISTS.md`](.claude/specialists/SPECIALISTS.md).
