# CLAUDE.md — DJ Cylow Website

Dit bestand is de operating guide voor deze repo, die wordt bestuurd door de **Claude Specialists** —
een team gespecialiseerde Claudes onder één Chief of Staff. Het is opgebouwd zoals elke
specialist-manual: **de draagbare werkwijze staat hieronder** (het systeem en de grondwet, geldig in
elke repo die met de Claude Specialists werkt), en **alles wat specifiek is voor déze repo staat
onderaan** onder [`## Eigen aan deze repo (djcylow-react)`](#eigen-aan-deze-repo-djcylow-react) — het
concrete team, de projectstructuur, de taal en de manier waarop de grondwet hier is ingevuld.

**Dit bestand houdt de grénzen; de route staat in
[`workflow-davekjohn/CONTRIBUTING.md`](workflow-davekjohn/CONTRIBUTING.md).** Daar staan sinds
2026-08-13 de **antwoorden** van deze repo op de contributie-cyclus: de branch-prefixen, de zeven stappen van
branch tot fold, en per stap wat hier anders is. Het **mechanisme** van die cyclus — het tier-model, de
rubric, de poorten die `open-pr` draait — staat er sinds 2026-08-13 níet meer in, maar in
`CONTRIBUTING-portable.md` in de plugin, dat met elke plugin-release meebeweegt. Die splitsing is er één van
**onderwerp**, niet van dezelfde werkwijze in twee documenten: wat op Dave's woord wacht staat hier, hoe het
werk loopt staat daar, en geen van beide beschrijft het onderwerp van de ander.

> **Er staan sinds 2026-08-16 twee `CONTRIBUTING.md`'s, en dat is één onderwerp in twee lagen.** De
> root-pagina is de **standaardwerkwijze** — nooit direct op `main`, CI groen vóór de merge, één
> wijziging per branch — en die blijft kloppen op de dag dat de plugin er niet is. De pagina in
> `workflow-davekjohn/` is de **laag van de plugin**, en die **wint waar de twee elkaar
> tegenspreken**. Overgenomen van de bron, die de splitsing op 14 augustus maakte; tot 2026-08-16
> stond de hele pluginlaag hier in de root, waar een bezoeker die niets van de plugin weet er als
> eerste tegenaan liep.

Dat is precies het verschil met de oude `workflow/`-map, die niet meer bestaat: dat was een **tweede
werkwijze-document** naast dit bestand, en twee beschrijvingen van hetzelfde liepen onvermijdelijk uit
elkaar. De pluginlaag is bovendien maar de helft van zijn eigen onderwerp — de andere helft reist
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

- **Werk mergen waar iets aan de frontend te bekíjken valt** — kan een mens met het oog zien of dit
  klopt, dan stopt de branch en meldt in plaats van vanzelf door te mergen. **In deze repo is dat
  alles in `src/`, `public/` en `src/data/mixes/`**, want een merge is hier een deploy naar
  `djcylow.com`. Geen poort kan bewijzen dat iets er góéd uitziet. **Dit is sinds 2026-08-16 de
  énige reden waarom een PR nog wacht**; de volledige uitwerking staat hieronder onder
  [Nooit direct op `main`](#nooit-direct-op-main--via-branch--pr).
- Een **release cutten** — start alleen op expliciet verzoek ("commit en push live", "maak een nieuwe
  release en push live" of gelijkwaardig).
- `git push --force` (welke branch dan ook), `git reset --hard`, `git rebase` op een gedeelde branch.
- **Bestanden verwijderen uit `public/images/`** — afbeeldingen worden via pad gerefereerd in de
  mix-JSON, dus een verwijdering breekt stil een pagina.
- **`next.config.ts` aanpassen** (static-export-config — een fout hier breekt de Netlify-build) en
  **`netlify.toml` aanpassen**.

> **De laatste drie gaan over het maken van de wijziging, niet over het mergen ervan** — en dat
> onderscheid draagt sinds 2026-08-16 gewicht dat het eerder niet had. Heeft Dave een wijziging aan
> `next.config.ts` eenmaal goedgekeurd, dan wacht de PR daarna niet nóg een keer: hij is al gewogen
> op het moment dat het werk begon. Alleen als er iets te bekíjken valt komt hij aan het eind
> terug — de eerste bullet.
>
> **Pushen naar `origin/main` stond hier tot 2026-08-16 ook bij, en is geschrapt** (Dave). De regel
> luidde *"dit initiatief ligt altijd bij Dave; vraag hier nooit naar, ook niet impliciet"* en kwam
> uit een correctie van 2 juli 2026, met als reden *"een release is gevaarlijk (gaat live op
> productie)"*. Die reden was uitgehold: sinds de PR-stap op *doorlopen tenzij* staat, bereikt al het
> overige `origin/main` allang via de merge — en `gh pr merge` schrijft daar server-side rechtstreeks
> in. Wat er ná die uitholling nog onder viel was precies één handeling, de **fold-commit**, en dat
> is de mínst riskante van alles wat hier naar `origin/main` schrijft: `CHANGELOG.md` plus twee
> bestanden in `workflow-davekjohn/branch/`, die geen enkele gebouwde pagina veranderen. Netlify
> meldde bij PR #145 letterlijk *"Pages changed — skipping"*.
>
> De zwaarste stap liep dus automatisch en de lichtste bleef wachten — omgekeerd aan de risicologica
> die de regel motiveerde. **Claude pusht nu gewoon naar `origin`.** Dat brengt deze repo ook terug
> bij de bron, waar de gedeelde `fold-changelog`-skill `-Push` als normale route noemt
> (*"normally should: `-Commit`, or `-Push` to commit and push"*).

### Nooit direct op `main` — via branch + PR

Alle wijzigingen gaan via een branch + Pull Request. **Of die PR op Dave's woord wacht, hangt af van wát
erin zit** — dat bepaalt de aard van het werk, niet een vaste regel per branch. De toets is één vraag:
*valt er iets aan de frontend te bekíjken?*

- **De default — niet wachten.** Is het werk op een branch af, gecommit en staat de poort groen, dan loopt
  de hele beweging in één keer door: openen → mergen → de changelog-entry folden → pushen, zonder
  tussenvraag. Dat dekt `scripts/`, de governance-documentatie (`CLAUDE.md`, `CONTRIBUTING.md`, de
  README's), `releases/`, `workflow-davekjohn/` (met `CHANGELOG.md` erin sinds 2026-08-27), de specialisten-laag onder `.claude/` en
  onderzoek. Zulk werk raakt `djcylow.com` niet: de build levert dezelfde pagina's, dus de deploy die op de
  merge volgt is een no-op. Een stempel van Dave voegt daar niets aan toe, en wat tóch misgaat is één
  revert-PR verder.
- **De uitzondering — stoppen en op Dave's woord wachten.** Er is er sinds 2026-08-16 nog **één**:
  **er valt iets aan de frontend te bekíjken.** De wijziging levert iets op dat een mens met het oog moet
  beoordelen. **In deze repo is dat alles in `src/`, `public/` en `src/data/mixes/`**: componenten,
  styling, teksten, mix-data, afbeeldingen, metadata en routes. Geen poort kan bewijzen dat iets er góéd
  uitziet, en deze repo *is* een frontend — dit is hier dus geen randgeval maar het gros van het werk.
  De [Netlify deploy preview](#safety-invulling-van-djcylow-react) maakt dat kijken goedkoop, maar neemt
  het niet weg: er moet nog steeds iemand kijken.

  > **Er stond hier tot 2026-08-16 een tweede uitzondering: *onomkeerbaar of naar buiten gericht*** — een
  > release, een tag, repo-settings, en de beschermde bestanden `next.config.ts`, `netlify.toml` en
  > verwijderingen uit `public/images/`. Die is geschrapt op Dave's woord: *"de enige uitzondering dat een
  > PR niet meteen gemerged mag worden is wanneer er iets op de frontend gecheckt kan worden."*
  >
  > **Wat daarmee níet is geschrapt:** die bestanden en handelingen staan nog onverkort op de lijst
  > [hierboven](#nooit-zonder-expliciete-toestemming-van-dave). Het verschil is *wannéér* Dave's woord
  > valt. Dat was tot nu toe twee keer — één keer om de wijziging te mogen maken, en nog eens om hem te
  > mogen mergen — en die tweede keer was een stempel op een besluit dat al genomen was. Nu valt het één
  > keer, aan het begin. Een release en een tag stonden bovendien sowieso al los van deze regel: een
  > release cut loopt hier niet via een branch of een PR, dus er viel niets te mergen.
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
> bron-default leunt op *"the lint gate, the test gate, and CI"*. Alle drie staan er nu — en dat is nieuw
> sinds die avond, dus lees dit als een stand en niet als een conclusie:
>
> | pijler | stand |
> |---|---|
> | lint-poort | `scripts/lint/lint-web.ps1`, lokaal én in CI |
> | CI | [`.github/workflows/ci.yml`](.github/workflows/ci.yml), op elke PR en elke push naar `main` |
> | testsuite | zestien suites in `tests/`, 213 tests: de mix-data, de componenten, de publieke output en de Netlify-function |
> | branch protection | ruleset `main-ci-gate`, met `poort` als required check |
>
> **Toch wacht álles in `src/`, `public/` en `src/data/mixes/` onverkort**, ook een refactor die visueel
> niets verandert, en daar zijn twee redenen voor die géén van de vier hierboven wegneemt. De eerste:
> geen enkele poort kan bewijzen dat een pagina er **góéd uitziet** — de testsuite dekt de mix-**data**,
> niet de vormgeving. De tweede: de ruleset heeft `bypass_actors` voor Admin en Maintain, en dat **moet**
> zo, want anders blokkeert hij `cut-release`'s eigen push naar `main`. Die bypass staat op
> `bypass_mode: "always"` en zet daarmee de **hele** ruleset opzij — dus ook `deletion` en
> `non_fast_forward`. Voor wie als admin werkt houdt hij dus **niets** tegen; hij beschermt alleen
> tegen collaborators met minder dan Maintain, en die zijn er niet.
>
> **De herweging is op 2026-08-16 gemaakt, en de grens is blijven staan waar hij stond** (Dave). Hij is
> alleen *scherper* geworden: de tweede uitzondering — onomkeerbaar of naar buiten gericht — is
> geschrapt, zodat wat overblijft exact de eerste reden hierboven is en niets anders. De ruleset-bypass
> uit de tweede reden verantwoordt dus niet langer een bredere uitzondering; die staat er als feit over
> wat er níet hard tegenhoudt, en de conclusie die hij droeg is nu dat de menselijke blik op de vórm de
> enige lijn is.
>
> Wat dat kijken goedkoop maakt: elke PR krijgt sinds 2026-08-13 een **Netlify deploy preview**
> (`deploy-preview-<nummer>--djcylow-react.netlify.app`), dus site-werk is vóór de merge te bekíjken.
> Dat neemt de uitzondering niet weg — er moet nog steeds iemand kijken — maar het maakt het kijken
> goedkoper dan een merge terugdraaien.

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

1. De **fold-commit** (na een merge, [stap 7](workflow-davekjohn/CONTRIBUTING.md#7-na-de-merge-vouw-de-changelog-entry)) is
   de enige echte **directe commit op `main`** (geen branch): scope beperkt tot `CHANGELOG.md` + de twee
   vaste bestanden in `workflow-davekjohn/branch/`. **Hij wordt meteen gepusht** — sinds 2026-08-16 draait
   de fold met `-Push` in plaats van `-Commit`, want pushen naar `origin/main` is geen apart besluit meer.
2. De **release-commit** (alleen op expliciet verzoek): `cut-release.ps1` genereert de release-notes,
   leegt `CHANGELOG.md` tot de intro, vult de rij in `workflow-davekjohn/releases/README.md`, en **commit dat plus de tag
   `vX.Y.Z` rechtstreeks op `main`** — waarna het zelf `git push origin main` en `git push origin
   vX.Y.Z` doet. Bewust geen branch en geen Pull Request, net als de fold.

   > **Dit is de regel van de bron, hier overgenomen op 2026-08-13 (avond) op Dave's woord.** Tot die
   > avond stond hier een **release-branch** (`docs/release-v<versie>`) met een scope-lijstje, gemerged
   > via een kale `git merge --no-ff`. Die constructie botste met het script dat de route hoort te
   > lopen: `cut-release.ps1` doet géén `git checkout main` maar commit op de branch waar je op staat,
   > dus vanaf een release-branch zou het daar committen en vervolgens `main` pushen — twee
   > verschillende dingen. De bron heeft die branch niet en noemt dat expliciet
   > *"deliberately no branch/PR — just like the fold"*.
   >
   > **Waarom geen PR, in Dave's woorden bij de bron:** *"aan het product zelf verandert verder niks."*
   > Een release herpubliceert wat al gemerged is. Er is geen diff om te beoordelen, dus een PR zou een
   > checkpoint zijn over een wijziging die niemand hoeft te wegen. In deze repo weegt dat extra zwaar
   > omdat een release-branch de scaffold-poort en de step-list-poort niet kan halen: zijn entry is
   > leeg by design.
   >
   > **En de scope is hier ruimer dan bij de fold, want `git add -A`.** Het script stageert de héle
   > tree. Er staat dus geen bestandslijstje bij deze uitzondering zoals bij de fold, en dat is geen
   > omissie maar een eigenschap van het script: zorg dat de tree schoon is vóór je een release cut.

Dit zijn de **enige** twee. Ook een "onschuldige" opruim- of chore-commit gaat via een branch + PR.

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
  2026-08-13 niet meer los van de PR-regel maar zegt hetzelfde**: die regel is nu óók "doorlopen tenzij".
  Sinds 2026-08-16 is dat *tenzij* bij de **merge** nog maar één ding — valt er iets aan de frontend te
  bekíjken — terwijl "onomkeerbaar, naar buiten gericht, reëel risico" blijft gelden voor het **starten**
  van zulk werk. De twee vragen zijn uit elkaar getrokken: Dave weegt vooraf of iets mag, niet nog eens
  achteraf of het gemerged mag.

### Ontwikkelworkflow — de route staat in `workflow-davekjohn/CONTRIBUTING.md`

De route staat in [`workflow-davekjohn/CONTRIBUTING.md`](workflow-davekjohn/CONTRIBUTING.md): de
branch-prefixen met hun label en changelog-type,
de zeven stappen van branch tot fold, en per stap het antwoord van déze repo — welke lint-poort de laatste
wacht is, waarom stap 5 bestaat, welke `gh`-vlaggen hier stukgaan. Die pagina is de **lokale helft** van een
gedeeld document; de **portable helft** (`CONTRIBUTING-portable.md`) reist met de plugin mee en draagt het
mechanisme: het tier-model, de rubric, de vier poorten van `open-pr`, de fold. Samen zijn ze de enige plek
waar de route beschreven staat — en sinds 2026-08-13 staat elk stuk ervan maar in één van de twee.

Twee regels uit die route zijn óók grondwet, en die vind je daarom hierboven in
[de safety-rules](#safety-rules): **mergen is hier deployen**, en werk waaraan **iets aan de frontend te
bekíjken valt** wacht daarom op Dave — al het overige loopt door tot en met de push. Alles daartussen —
hoe je een branch noemt, wat er in de entry hoort, welke poort wat weigert — lees je in
`workflow-davekjohn/CONTRIBUTING.md` of de portable helft waarnaar dat document verwijst.

> **Dit waren er drie tot 2026-08-16**; de derde was *"pushen naar `origin/main` is Dave's initiatief"*.
> Die is geschrapt — zie de noot bij de safety-rules hierboven.

**Twee dingen gaan aan élke wijziging vooraf**, dus die staan hier ook:

1. **Check de branch.** Run `git status` en `git branch` vóór je het eerste bestand aanraakt — sta je op
   `main`, maak dan eerst de juiste branch aan. Dit geldt ook voor een script of een configbestand.
2. **Een branch is nooit entry-loos.** Laat de gedeelde `new-branch`-skill de branch mét zijn twee
   bestanden in `workflow-davekjohn/branch/` neerzetten; wat die twee bestanden zijn staat in
   [`workflow-davekjohn/branch/README.md`](workflow-davekjohn/branch/README.md).

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

De website is **Nederlands** (`lang="nl"`, domein `djcylow.com`). De repo-documentatie,
commit-berichten en de communicatie met Dave zijn dat ook. De `description`-velden in de mix-data
zijn tweetalig: `description_nl` en `description_en`; de site rendert de Nederlandse.

> **Hier stond tot 2026-08-15 dat de website Engels is** — met `lang="en"` erbij als bewijs. Dat
> attribuut stond er inderdaad, maar het beschreef niets: álle content is Nederlands, in
> `src/content/`, in de koppen en in de UI-strings. Het was dus geen taalbesluit maar een verkeerd
> ingevuld attribuut dat als besluit werd gepresenteerd, en deze sectie hield dat in stand.
>
> Wat het kostte: schermlezers spraken Nederlandse tekst met een Engelse stem uit, en Google kreeg
> een taalsignaal dat de rest van de pagina tegensprak — op een site die juist lokaal gevonden wil
> worden. `README.md` had het bij het rechte eind over de inhoud ("The site is in Dutch") en ongelijk
> over het attribuut; die twee documenten spraken elkaar dus tegen terwijl de code een derde antwoord
> gaf. Sinds 2026-08-15 zeggen alle drie hetzelfde.
>
> `description_en` blijft bestaan en wordt onderhouden: het veld is er voor een eventuele Engelse
> variant later, en de testsuite bewaakt het net zo streng als de Nederlandse.

**Uitzondering: de zes sectiekopjes van een changelog-entry** (`Branch title`, `Branch ID`,
`Branch type`, `What does the change on this branch bring to main?`, `Significance`,
`Pull Request`) **en de `Tier`/`Score`-sleutels blijven Engels.** Het zijn machine-gelezen sleutels
waar `new-branch`, `open-pr`, `fold-changelog` en de release-cut het over eens moeten zijn — vertaal
je ze, dan kan de eigen fold de eigen entry niet meer lezen. `scripts/repo-config.ps1` definieert
bewust géén `Get-EntrySectionHeadingOverrides`, en dát is de beslissing die dit vastlegt.

**Uitzondering: `workflow-davekjohn/releases/README.md` is volledig Engels** (Dave, 2026-08-13). Die pagina is een
**spiegel** van [dezelfde pagina in de bron](https://github.com/DaveKJohn/claude-code-specialists/blob/main/releases/README.md):
alles boven de horizontale streep is er woord voor woord uit gekopieerd, en dat is alleen te handhaven
zolang het de tekst van de bron zélf is. Een vertaling maakte de pagina precies zo onvergelijkbaar als een
parafrase — erger zelfs, want een vertaling valt niet te diffen, en daardoor stonden er drie verouderde
beweringen in die niemand zag. Een correctie boven de streep gaat dus naar de bron als `inbound`-issue en
komt terug via een plugin-release; hier repareren herstart de drift. Onder de streep staat het repo-eigen
deel, ook Engels, zodat de hele pagina één register heeft.

Wat **niet** meeverhuist naar het Engels: de bestaande documenten in `releases/development/` en
`workflow-davekjohn/releases/audience/` en de titels in de release-lijst. Dat is historie — geschreven in de taal waarin ze
uitgingen, en een record is geen vertaling. De taalgrens loopt daarmee dwars door het
development-document: Engelse tier-koppen boven Nederlandse entries.

**Nieuwe release-documenten zijn wél Engels** (Dave, 2026-08-13, avond). Dat is een andere vraag dan
de vorige alinea — die gaat over niet-hervertalen, en daaruit volgt niets over wat je hierna schrijft.
`Get-ReleaseNoteWording` en `Get-InternalNoteWording` in `scripts/repo-config.ps1` blijven daarom
**leeg**, want leeg betekent Engels, en [stap 6 van de Release Workflow](#release-workflow) is
meebewogen zodat de twee elkaar niet meer tegenspreken. Tot die avond deden ze dat wel: de seam stond
op Engels en stap 6 droeg Nederlands op, met als meetbaar gevolg dat `/continue` de "nog open"-sectie
van een note niet kon vinden. `v2.23.0` is de laatste Nederlandse note.

**Ook beide `CONTRIBUTING.md`'s zijn Nederlands**, net als dit bestand — de standaardlaag in de root
en de pluginlaag in `workflow-davekjohn/`. De portable helft ernaast is Engels en valt buiten deze
regel: die is niet van deze repo maar van de plugin, en wordt daar onderhouden.

### Het team: roster & routing

**Het roster staat in [`.claude/specialists/SPECIALISTS.md`](.claude/specialists/SPECIALISTS.md)** —
wie de negentien specialisten zijn, wat elk van hen in déze repo doet, en naar welke lens onder
`.claude/specialists/lenses/` Chris hen doorverwijst. Dat is de plek die de plugin verwacht en het
enige bestand dat `CLAUDE.md` importeert.

Loopt dat roster uit de pas met de plugin, dan zet de gedeelde `sync-roster`-skill de ontbrekende
lenzen neer. `check-script-contract.ps1` bewaakt daarnaast dat `scripts/repo-config.ps1` en
`scripts/lib/branch-info.ps1` het contract van de gedeelde scripts blijven leveren.

### Structuur en conventies

#### `workflow-davekjohn/` — de map van de workflow

Sinds **2026-08-16** (plugin v4.12.0) woont alles wat van de workflow is in één map in de repo-root, in
plaats van verspreid door de root. Wat erin zit en wat er bewust buiten bleef:

| pad | wat | waarom daar |
|---|---|---|
| `workflow-davekjohn/branch/` | de entry, de stappenlijst, de templates, `README.md` | **verplicht** — de gedeelde scripts lezen alléén deze plek |
| `workflow-davekjohn/CHANGELOG.md` | de wachtende entries, live maar nog zonder versienummer | sinds 2026-08-27; `Get-ChangelogPath` (geen override, computed default) |
| `workflow-davekjohn/releases/README.md` | de release-historie | `Get-ReleaseHistoryPath` |
| `workflow-davekjohn/releases/audience/` | de 25 handgeschreven documenten | `Get-ReleaseNoteRoot` |
| `workflow-davekjohn/prompts/` | de prompt-inbox voor `/prompt` | nieuw in 4.12.0; `prompt.md` en `archive/` zijn **untracked** |
| `workflow-davekjohn/CLAUDE.md` · `README.md` | de werkregels in die map | scaffold van `adopt-workflow-folder` |
| `releases/development/` · `releases/github/` | **blijven in de repo-root** | hardcoded in `cut-release.ps1` (regel 728 en 820) — geen seam |
| `workflow-davekjohn/CONTRIBUTING.md` | de **pluginlaag** van de cyclus — wint bij conflict | model van de bron, overgenomen 2026-08-16 |
| `CONTRIBUTING.md` | **blijft in de repo-root**, maar dun: de **standaardwerkwijze** | GitHub zoekt hem daar, en hij moet kloppen zónder plugin |

**`CHANGELOG.md` verhuizen was op 2026-08-27 wél een keuze, en niet meer een die deze repo kon
uitstellen.** De bron maakte `Get-ChangelogPath` die dagen ervoor (25-26 augustus, issue #885/#914)
**isolate-by-default** voor een consumer-repo: `Assert-WorkflowIsolatedSeamPath` in de gedeelde
`seam-lib.ps1` weigert sindsdien (exit 1) élk antwoord — ook een expliciete override in
`scripts/repo-config.ps1` — dat buiten `workflow-davekjohn/` wijst. Deze repo bewaarde het bestand tot
die dag als vaste root-doc; de eerste keer dat `fold-changelog-entry.ps1` uit v4.20.0 daadwerkelijk
tegen die grens liep (PR #149's fold), moest die ene entry met de hand in de oude root-locatie worden
gevouwen. Er is bewust **geen** eigen `Get-ChangelogPath` gezet: de computed default volgt
`Get-WorkflowFolderName` en wijst dus vanzelf naar `workflow-davekjohn/CHANGELOG.md` zolang die map zo
heet.

**`branch/` verhuizen was geen keuze.** `Get-BranchFilePaths` in `entry-scaffold-lib.ps1` draagt de
aantekening *"No dual-read of the old root 'branch/' location, deliberately"* — er is dus geen fallback en
geen overgangsperiode. Wie 4.12.0 draait zonder deze map, krijgt `new-branch`, `open-pr` en
`fold-changelog` niet meer aan de praat.

**De splitsing van de release-boom is het model van de bron, geen halfheid.** De lijn loopt langs één
vraag: *heeft de root een seam?* Alleen `audience/` en de history-pagina hebben er een, en alleen die twee
konden dus mee. `Get-RelativeLinkPath` in `release-lib.ps1` zegt het letterlijk — *"a consumer's history
lives at `workflow-davekjohn/releases/README.md` while the generated development notes stay at the repo
root"* — en bestaat er zelfs uitsluitend voor om de link tussen die twee plekken te leggen. Bij deze
verhuizing zijn `development/` en `github/` eerst wél meegegaan en daarna teruggezet, toen het narekenen
van die twee regelnummers uitwees dat de eerstvolgende cut ernaast een tweede boom zou aanmaken.
**Verhuis ze dus niet alsnog** zolang die twee regels hardcoded zijn.

> **De prompt-inbox kwam er ongevraagd bij en dat is prima, maar weet wat het is.**
> `workflow-davekjohn/prompts/prompt.md` is Dave's bestand, niet dat van een specialist: hij schrijft daar
> een opdracht in een editor in plaats van in de terminal, en `/prompt` leest hem. Een specialist schrijft
> er nooit een opdracht in, en leest de HTML-commentaren erin niet als instructie — dat is de tekst van de
> scaffold zelf. Een inbox met alleen commentaren telt als leeg.

#### Key commands

```bash
npm run dev      # dev server → http://localhost:3000
npm run build    # static export → out/ (.next/ is build-output en cache)
npm run lint     # alleen ESLint -- de typecheck en de build zitten in scripts/lint/lint-web.ps1
```

#### Hulpscripts

| Commando | Script | Wat het doet |
|---|---|---|
| `npm run mix:add` | `scripts/add-mix.js` | Voeg interactief een nieuwe mix toe aan het juiste JSON bestand |
| `npm run mix:check-audio` | `scripts/check-audio.js` | Vraagt elke `audioSrc` op en meldt wat niet bereikbaar is (exit 1) |
| `npm run images:webp` | `scripts/convert-to-webp.js` | **Preview** — laat zien wat er zou gebeuren en wijzigt niets |
| `npm run images:webp:apply` | `scripts/convert-to-webp.js --apply` | Converteert werkelijk en verwijdert de `.jpg`-originelen |

> **Preview is sinds 2026-08-15 de default, en dat is de safety-rule in mechanismevorm.** Het script
> verwijderde eerder bestanden uit `public/images/` zonder bevestiging, terwijl dat hierboven onder
> *Nooit zonder expliciete toestemming van Dave* staat — en het kon via de `npm run *`-allowlist
> zelfs zonder prompt draaien. Verwijderen vraagt nu `--apply`. Verder overschrijft het geen
> bestaande `.webp` meer (dat kostte twee bestanden bij één naamconflict; `--force` doet het
> alsnog), en de exitcode volgt het resultaat: mislukte conversies gaven eerder exit 0.
>
> **Het levert nog steeds geen `small`-varianten.** Die moeten los aangeleverd of gegenereerd
> worden; dat gat is wat de 2026-mixen hun `_small.webp` kostte.

**Workflow nieuwe mix toevoegen:**

1. `npm run mix:add` — vul alle gegevens in, het script genereert de afgeleide velden automatisch
2. Afbeeldingen neerzetten in `public/images/{power}/{color}/`
3. `npm run images:webp` — als je `.jpg`-afbeeldingen hebt aangeleverd. Dat toont eerst wat er zou
   gebeuren; `npm run images:webp:apply` voert het daarna uit
4. Controleer het JSON-bestand in de editor
5. Commit + push via [de cyclus in `workflow-davekjohn/CONTRIBUTING.md`](workflow-davekjohn/CONTRIBUTING.md#de-cyclus-stap-voor-stap)

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
- **Alleen SCSS, geen Tailwind.** De styling zit volledig in `src/styles/`, met de eigen
  utility-klassen (`w-fill`, `w-hug`, `size-*`, `spacing-*`) die daar gegenereerd worden.
  > **Hier stond tot 2026-08-15 "Tailwind v4 + SCSS: beide worden naast elkaar gebruikt", en dat
  > was niet waar.** Tailwind v4 genereert alleen utilities voor een stylesheet die
  > `@import "tailwindcss"` bevat; de enige stylesheet die de app laadt (`src/styles/main.scss`)
  > had die regel niet. Het enige bestand met een Tailwind-at-rule was `src/app/globals.scss`, dat
  > **nergens werd geïmporteerd** — en het droeg `@theme "tailwindcss"`, wat geen geldige entry is.
  > Geverifieerd in de gebouwde CSS: geen enkele Tailwind-signatuur, en `.flex` nergens
  > gedefinieerd. Er is dus nooit één utility gegenereerd.
  >
  > Het gevolg was dat er markup werd geschreven met klassen die stil niets deden: `.flex` 6×,
  > `.w-fix` 28×. Dave heeft gekozen voor eruit halen (2026-08-15) — aanzetten zou Preflight
  > bovenop de eigen reset in `base/_reset.scss` zetten, en dat is wél een zichtbare wijziging op
  > elke pagina.

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
| Live, maar nog zonder versienummer | `workflow-davekjohn/CHANGELOG.md` (elke `##`-kop is één wijziging) |

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

**De route draait via `cut-release`, en die commit rechtstreeks op `main`** (Dave, 2026-08-13, avond).
Er is dus **geen release-branch** — dat is uitzondering 2 in de safety-rules hierboven. Je staat op
`main`, met een schone tree, en het script doet het grootste deel.

| wat | wie |
|---|---|
| poorten (lint + de testsuite via `Get-TestCommands`) | het script |
| versienummer, met de bump-gate op de tier van de wachtende entries | het script |
| development-note, `CHANGELOG.md` legen, rij in `workflow-davekjohn/releases/README.md` | het script |
| audience-document | het script zet een **concept** neer met `DRAFT`-aanwijzingen; herschrijven is handwerk |
| commit `release: vX.Y.Z`, tag, en `git push origin main` + de tag | het script |
| aankondiging in `github/`, de GitHub Release, de bijlagen | handwerk; het `gh release create`-commando wordt geprint |

> **Tot 2026-08-13 (avond) stond hier een handmatige route van vijftien stappen** die met een
> `docs/release-v<versie>`-branch begon, en zo is v2.23.0 ook gecut. Die branch is weg omdat hij met het
> script botste: `cut-release.ps1` doet géén `git checkout main` maar commit waar je staat, dus vanaf een
> release-branch landde de commit daar terwijl de push naar `main` ging. De stappen hieronder zijn wat
> er ná het script nog te doen is, plus wat je moet weten om het te kunnen draaien.

> **Deze route is op 2026-08-15 voor het eerst gelópen in plaats van gelezen — v2.24.0, 54 entries.**
> Alles hierboven bleek te kloppen; wat het document niet kon vertellen was wat het kóst en hoe het
> eruitziet terwijl het draait. Drie dingen uit die run, nagemeten op 2026-08-16 uit de
> git-timestamps en `gh release view v2.24.0`, zodat ze niet op de herinnering van één avond leunen:
>
> | leg | van → tot | duur |
> |---|---|---|
> | de cut zelf (poorten, notes, commit, tag, twee pushes) | 22:55:00 → 22:58:04 | **3m 04s** |
> | audience-document herschrijven, PR, CI, merge, fold | 22:58:04 → 23:27:50 | **29m 46s** |
> | GitHub Release + de twee bijlagen | 23:27:50 → 23:30:40 | **2m 50s** |
> | **van cut tot gepubliceerd** | | **35m 40s** |
>
> **Het script is dus niet de kostenpost — het handwerk erna is dat.** Bijna vijf zesde van de tijd
> zit in stap 4 en 5 hierboven, en dat is precies het deel dat `cut-release` bewust niet automatiseert.
> Reken op een half uur voor een minor, niet op drie minuten.
>
> **De push naar `main` meldt `Required status check "poort" is expected`, en dat is geen fout.** Het
> is de ruleset `main-ci-gate` die zijn required check mist op een commit die er rechtstreeks op landt,
> waarna de bypass voor Admin hem alsnog doorlaat. Verwacht gedrag, precies zoals de ruleset-noot in
> de safety-rules beschrijft — maar het ziet er op het beslissende moment uit als een blokkade. Wie
> hier schrikt en gaat ingrijpen, grijpt in op een geslaagde push.
>
> **`-NoPush` is bij een grote cut de moeite waard.** Het is het enige moment waarop een mens het
> samengestelde resultaat — development-note, geleegde `CHANGELOG.md`, de rij in `workflow-davekjohn/releases/README.md`,
> het audience-concept — naast elkaar ziet vóór het publiek is. Daarna is terugdraaien een tag
> verwijderen en een commit reverten op `main`.

1. **Sta op `main` met een schone tree**: `git status && git branch`. Dat is geen formaliteit maar een
   voorwaarde — het script stageert met `git add -A`, dus alles wat rondslingert gaat mee in de
   release-commit
2. **Zorg dat er niets ongefold wacht.** Het script weigert te draaien als
   `workflow-davekjohn/branch/branch-changelog.md` nog een entry draagt: een cut leegt `CHANGELOG.md`, dus een entry die
   daar nog niet in staat zou de release missen en daarna verweesd achterblijven
3. **Draai `cut-release`** met de bump die de wachtende entries verdienen (zie *Versienummer bepalen*
   hieronder). Het script draait zijn eigen poorten — `scripts\lint\lint-web.ps1` én de testsuite — dus
   je hoeft die er niet apart voor te zetten
   - De poort meldt sinds 2026-08-14 **0 errors en 0 warnings**, en ESLint zit er sinds diezelfde dag
     zélf in, als tweede van de vier stappen — dit stond hier tot 2026-08-15 nog als "blijft handwerk
     en staat nog buiten de poort", wat het document drie alinea's verderop al tegensprak. Er valt
     niets meer te vergelijken op aantal: elke melding is nieuw, en hoort niet mee de PR in
   - De vierde stap is sinds 2026-08-16 de link- en anker-check. Bij een cut is dat de stap die er het
     meest toe doet: een release schrijft in één keer een development-note, een audience-document en
     een rij in `workflow-davekjohn/releases/README.md`, allemaal met verse relatieve links tussen twee
     verschillende bomen — en dat is precies het soort werk waar PR #145 vijftien dode links liet staan
4. **Herschrijf het audience-concept** (alleen Minor/Major):
   `workflow-davekjohn/releases/audience/<major>.x/<versie>.md` — dezelfde wijzigingen in leesbaar **Engels** zonder
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
   > `scripts/repo-config.ps1` wijst sindsdien naar de audience-map. De 23 bestaande documenten
   > zijn verplaatst, niet herschreven. Zie [`workflow-davekjohn/releases/README.md`](workflow-davekjohn/releases/README.md) voor de drie
   > roots en wat er per root in hoort
   > **En de submap ging later diezelfde dag van `<X.Y>` naar `<X>.x`**, toen `releases/` op Dave's
   > verzoek volledig gelijk werd getrokken met de bron: `Get-ReleaseNotesGrouping` staat sindsdien op
   > `'major'` en alle documenten wonen in `2.x/`. Ook die verhuizing
   > is `git mv` zonder een letter aan hun tekst te veranderen
5. **Schrijf de aankondiging**: `releases/github/<major>.x/<versie>.md` — een paar alinea's die
   de body van de GitHub Release worden: wat er nieuw is, voor wie, en een regel die naar de twee
   bijlagen wijst. Niet de per-PR details; die staan in `development/`

Wat het script hierboven al voor je deed, met de valkuilen die daarbij horen:

- **De development-note** in `releases/development/<major>.x/<versie>.md`, opgebouwd uit de gefolde
  wijzigingen in `CHANGELOG.md`. **Let op de koppen:** het script houdt daar de **branchnaam** aan
  (``### `docs/mijn-branch` changelog``) in plaats van de titel van de wijziging. Alleen het
  audience-document herschrijft naar `### Branch title`. Wil je die koppen anders, dan is dat handwerk
  na de cut
- **`CHANGELOG.md` geleegd** tot de intro-alinea. **Er komt géén versieblok voor terug.**
  > Tot 2026-08-11 zette deze stap ook een `## Releases`-blok in `CHANGELOG.md` — dezelfde informatie
  > als `workflow-davekjohn/releases/README.md`, maar armer, met een `← LIVE`-markering die op 2026-07-26 al was
  > afgeschaft en die bovendien maandenlang fout stond (op v2.20.1, terwijl v2.20.2, v2.21.0 en vijf
  > PR's al live waren). Dat verviel: `workflow-davekjohn/releases/README.md` is sindsdien de enige plek waar
  > uitgebrachte versies worden bijgehouden — geen dubbele boekhouding meer
- **De rij in `workflow-davekjohn/releases/README.md`**, bovenaan de overzichtstabel — de enige boekhouding van
  uitgebrachte versies. De Versie-cel wijst naar het leesbaarste document dat de release heeft:
  `audience/` bij een Minor/Major, `development/` bij een Patch
   > **De kolomkoppen van die tabel zijn een machine-gelezen sleutel, geen proza.** De gedeelde
   > `release-lib.ps1` matcht die regel letterlijk om te weten waar een rij heen gaat, en er is bewust
   > geen seam voor. Zelfde categorie als de zes sectiekopjes van een entry — en de reden dat ze ook
   > blijven staan als iemand ooit besluit deze pagina terug naar het Nederlands te halen: vertaal je
   > ze, dan vindt de inserter zijn invoegpunt niet meer. Om dezelfde
   > reden staat er een `#### 2.x`-kop bóven de tabel — de guardrail die controleert of een rij in de
   > juiste major belandt, leest de laatste `<n>.x`-kop erboven en staat stil uit zodra die ontbreekt
- **De commit `release: v<versie>`, de tag, en twee pushes** (`git push origin main` en
  `git push origin v<versie>`). Die pushes zetten **niets nieuws live** — de code stond er al via de
  PR-merges. Ze brengen de release-documentatie en de tag naar `origin`, en triggeren wel een nieuwe
  Netlify-build van dezelfde code. Was er sinds de laatste merge niets aan de app gewijzigd, dan is het
  resultaat identiek aan wat er al draaide. `-NoPush` laat commit en tag lokaal staan

Daarna, met de hand:

6. **GitHub Release aanmaken** — de aankondiging uit `github/` is de body:
    ```bash
    gh release create v<versie> --title "v<versie> - <korte titel>" \
      --notes-file releases/github/<major>.x/<versie>.md --verify-tag
    ```
    > De body was tot 2026-08-13 de `development/`-note. Die is nu bijlage: `gh` kapt een
    > `--notes-file` af op 125.000 tekens, en een volledig per-PR record kan daar langs
7. **Bijlagen uploaden** — `development/` altijd, `audience/` bij Minor/Major. **Onder unieke
    bestandsnamen**, want alle drie de documenten heten `<versie>.md` en de tweede upload botst
    anders met `HTTP 404` (`file#label` van `gh` lost dat niet op — dat zet het label, niet de naam):
    ```bash
    cp releases/development/<major>.x/<versie>.md v<versie>-development-notes.md
    cp workflow-davekjohn/releases/audience/<major>.x/<versie>.md v<versie>-release-note.md
    gh release upload v<versie> v<versie>-development-notes.md v<versie>-release-note.md
    rm v<versie>-development-notes.md v<versie>-release-note.md
    ```

Er is **geen branch om op te ruimen**: de cut liep op `main`. Dat was tot 2026-08-13 stap 15.

Let op de volgorde van oorzaak en gevolg: de wijzigingen stonden al live vóór dit hele proces begon,
namelijk vanaf hun PR-merge. Een release cutten voegt een versienummer, een release-note en een tag
toe aan wat al draait. Precies daarom is een release-cut ook laagrisico: er gaat geen ongeteste code
mee naar buiten.

#### Versienummer bepalen

**De bump volgt de hoogste tier die er wacht** — niet de soort wijziging. `cut-release.ps1` weigert een
release die de wachtende entries niet verdienen, vóór het iets schrijft:

| wachtende entries | bump |
|---|---|
| alleen tier 0 | **PATCH** |
| tier 1 of hoger | **MINOR** |
| tien minors in de huidige major-lijn, bovenop het bovenstaande | **MAJOR** mag |

Deze repo staat op **audience-tier 1** (`Get-ReleaseAudienceTier`), dus een entry beantwoordt tier 0 en
tier 1. Een minor waarvan de hoogste entry tier 1 is, schrijft de note **zonder** een
*For consumers*-sectie: er is niemand buiten de organisatie die het merkt, en dan hoort daar geen sectie
over te staan. `cut-release.ps1` hangt die sectie aan het bestaan van een tier-2-entry, niet aan het
bumptype.

Een major is een **recap** van de minors ervoor, niet één grote wijziging. Wat hem verdient is de
accumulatie, en `Get-ReleaseMajorMinMinors` bezit dat getal (default 10).

> **Dit verving op 2026-08-13 (avond) een tabel die de bump aan de sóórt wijziging ophing** — bugfix en
> docs op patch, nieuwe mix of pagina op minor, redesign op major. Die tabel sprak de poort aantoonbaar
> tegen: v2.23.0 is als **minor** gecut omdat drie entries tier 1 droegen, terwijl de tabel het
> docs- en datawerk erin op **patch** zette. Twee regels die op hetzelfde werk verschillende antwoorden
> geven, waarvan er één weigert en één alleen proza is.
>
> Dave heeft gekozen voor de regel van de bron (*"precies zoals de bron het doet, alleen wel met een
> Tier 1 audience"*). Dat is niet alleen consistentie: de tier meet **wie het merkt** en dat is precies
> wat een versienummer aan een lezer hoort te vertellen, terwijl de soort wijziging daar niets over
> zegt — een docs-branch kan tier 1 raken en een `feature/`-branch tier 0 blijven.

### Scripts

De workflow-stappen draaien via de **gedeelde skills van de specialists-plugin**, die één bron hebben
in [`DaveKJohn/claude-code-specialists`](https://github.com/DaveKJohn/claude-code-specialists). Wat per
repo verschilt woont in `scripts/repo-config.ps1` en `scripts/lib/branch-info.ps1`.

De stapnummers hieronder verwijzen naar
[de cyclus in `workflow-davekjohn/CONTRIBUTING.md`](workflow-davekjohn/CONTRIBUTING.md#de-cyclus-stap-voor-stap).

**Er staan twee kopieën van elk gedeeld script op de machine, en je draait er maar één van.** Welke,
hangt af van wat je ermee doet:

| pad | wat het is | waarvoor |
|---|---|---|
| `~/.claude/plugins/cache/claude-code-specialists/workflow-davekjohn/<versie>/` | de **uitgebrachte release** | **draaien** — hierheen wijst `${CLAUDE_PLUGIN_ROOT}`, dus dit is wat een skill werkelijk uitvoert |
| `~/.claude/plugins/marketplaces/claude-code-specialists/plugins/…/` | de **bron-checkout**, die vóórloopt met alles wat sinds de laatste cut is gemerged | **lezen** — de persona's, waarnaar `.claude/specialists/SPECIALISTS.md` `@`-importeert |

**Cache om te dráaien, marketplace om te lézen.** Beide verwijzingen in deze repo zijn dus juist voor
hun eigen doel, en dat is precies wat het onderscheid onzichtbaar maakt: `SPECIALISTS.md` wijst naar de
marketplace en hoort dat te doen, maar het is ook de enige prominente pluginverwijzing die elke sessie
meelaadt. **Het makkelijkste advies is daarom: roep de skill aan in plaats van het script rechtstreeks.**
Elke skill print zijn eigen commando met de volledige cache-URL erin, dus wie dat volgt loopt niet in de
val.

> **Deze val is op 2026-08-15 dichtgelopen en kostte bijna een verkeerde repo-brede verhuizing.**
> `open-pr.ps1` uit de **marketplace-clone** zocht de changelog-entry in `workflow-davekjohn/branch/` —
> een verplaatsing die in de bron zit maar nog niet is uitgebracht — vond niets, viel terug op het
> legacy-pad en faalde met *"the entry's title section is empty"* terwijl de entry gevuld was. De
> conclusie die daaruit rolde was dat déze repo achterliep en zijn `branch/`-map moest verhuizen. Het
> omgekeerde was waar: migreren zou de repo vooruit laten lopen op een ongereleasede wijziging, waarna
> de geïnstalleerde 4.8.0 de bestanden juist niet meer zou vinden. De migratie is ingetrokken vóór er
> iets verplaatst was. De regel luidde toen: **verhuis `branch/` niet zolang de cache hem op `branch/`
> leest**; doe dat pas als een release die wijziging levert, en dan in één keer mét `CONTRIBUTING.md`,
> `.github/pull_request_template.md` en `branch/templates/`.
>
> **Die voorwaarde is op 2026-08-16 ingetreden en de verhuizing is uitgevoerd.** Plugin **v4.12.0** levert
> de wijziging, mét een `adopt-workflow-folder`-skill die de map neerzet. De vier bestanden uit het
> lijstje hierboven zijn in één beweging meegegaan. Het uitstel van augustus 15 was dus geen bezwaar tegen
> de verhuizing maar tegen de *timing*, en precies één release later klopte die wel — waarmee dit
> voorbeeld nu beide kanten van de les draagt: te vroeg meebewegen met een bron-checkout brak de repo, en
> te laat meebewegen met de cache zou hem net zo goed breken.
>
> **De bron gaf hier geen keuze, en dat is het scherpst wat 4.12.0 over dit onderwerp zegt.**
> `Get-BranchFilePaths` in `entry-scaffold-lib.ps1` bevat de aantekening *"No dual-read of the old root
> 'branch/' location, deliberately"* — Dave's eigen besluit bij de bron, boven een fallback die twee
> mogelijke locaties in elke lezer van die functie levend zou houden. Er was dus geen overgangsperiode
> waarin beide werkten.
>
> **Dit is geen fout van de bron en dus geen inbound-issue.** Een bron-checkout die vóórloopt op de
> release is precies wat een bron-checkout hoort te zijn, en de skills wijzen correct naar
> `${CLAUDE_PLUGIN_ROOT}`. Wat ontbrak was deze alinea.
>
> **En er stond al een waarschuwing die dit had moeten vangen** —
> [`workflow-davekjohn/CONTRIBUTING.md`](workflow-davekjohn/CONTRIBUTING.md)
> zegt sinds 2026-08-13 dat de scripts uit de cache draaien. Die dekte de **versie-as** (welke versie
> staat er geïnstalleerd) en niet de **map-as** (welke van twee bomen lees je), en dat is wat het
> verschil maakte: twee kopieën van dezelfde versie-as verwarren kost je een verouderd script, twee
> verschillende bomen verwarren kost je een verkeerde diagnose over de repo zelf.
>
> **Diezelfde dag leverde het onderscheid zijn tweede geval op, en dat is de nuttigste kant ervan:
> het bespaarde een overbodig inbound-issue.** `session-status.ps1` uit de **cache** print de open
> issues als één regel `#System.Object[]  System.Object[]` — gereproduceerd onder Windows PowerShell
> 5.1, waar `ConvertFrom-Json` een JSON-array als één object teruggeeft in plaats van hem uit te
> pakken, zodat `$_.number` alle 29 nummers achter elkaar plakt. Onder `pwsh` 7 valt dat niet op, wat
> verklaart waarom niemand het eerder zag. De reflex is dan een `inbound`-issue; de **marketplace-clone**
> laat echter zien dat de bron het al heeft gerepareerd — daar staat `$raw = gh issue list …` met een
> `Where-Object`-filter erachter, en die pipeline pakt de array wél uit. Nagemeten onder 5.1: 29
> issues, correct geformatteerd. Het komt hier dus vanzelf binnen met de volgende plugin-release.
>
> **De les is de volgorde**: eerst kijken welke van de twee bomen je leest, dán pas concluderen wie
> achterloopt. In het eerste geval wees de marketplace-clone een probleem aan dat er hier niet was;
> in het tweede loste hij er een op die hier wél zichtbaar is. Beide keren was de cache de waarheid
> over wat er nú draait, en de clone de waarheid over wat er straks draait.

**Acht van de tien plugin-skills kan een specialist niet zelf aanroepen, en voor drie daarvan heeft
deze repo een eigen ingang gemaakt** (Dave, 2026-08-15). De skills die naar buiten schrijven —
`open-pr`, `ship-pr`, `park`, `fold-changelog`, `cut-release`, plus `lock`, `continue` en
`fix-mojibake` — dragen `disable-model-invocation: true`. Dat is geen storing maar de guardrail van
de bron tegen autonoom pushen, mergen en releasen; de bron beschrijft het bij PR #155 als *"closes
the autonomous-invocation surface without touching the actual fold mechanism"*. Alleen `new-branch`
en `adopt-config` staan aan, en die doen niets buiten je machine. Het verklaart ook waarom
`/reload-plugins` "0 skills" kan melden: die teller sluit deze acht uit.

| skill | eigen ingang in `.claude/skills/`? | waarom |
|---|---|---|
| `open-pr` | **ja** | de PR-regel hierboven zegt al *doorlopen tenzij*; frontend-werk wacht, de rest niet |
| `fold-changelog` | **ja** | de fold is uitzondering 1 op "nooit direct op `main`", met een vastgelegde scope; draait sinds 2026-08-16 met `-Push` |
| `park` | **ja** | een push is geen PR; de branch wordt bereikbaar, de PR-regel blijft apart |
| `cut-release` | **nee** | staat hier aan Dave's expliciete verzoek; blijft slash-only |
| `ship-pr` | **nee** | wordt hier niet gebruikt — de frontend-of-niet-beoordeling kan hij niet maken |

Die drie ingangen **dupliceren geen enkel gedeeld script**: ze roepen via
`scripts/task/shared.ps1` het origineel uit de cache aan, precies zoals een plugin-skill dat zou
doen. Dat helperscript lost de versiemap zelf op — er staan acht versies in de cache en het pad dat
een skill zou hardcoderen verschuift bij elke update. Het sorteert op `[version]` en niet op tekst,
want anders wint `3.9.0` van `3.10.0`.

> **Geef er geen `--` aan mee** om de argumenten te scheiden. PowerShell leest dat bij `-File` zelf
> als parameternaam en stopt met *"the parameter name '' is ambiguous"*. Het is ook niet nodig: alles
> wat niet `-Script` of `-Plugin` heet, valt vanzelf in `-Rest`.

- **`new-branch`** — maakt de branch én **twee** bestanden in `workflow-davekjohn/branch/`
  (`branch-changelog.md`, `branch-progress.md`) plus de referentiekopieën in
  `workflow-davekjohn/branch/templates/`, in één stap (stap 1–3). Het
  achterliggende werk zit in `scripts/task/new-branch.ps1` en `scripts/lib/entry-scaffold-lib.ps1` —
  er bestaat geen los `scripts/release/new-changelog-entry.ps1` (meer).
- **`open-pr`** — draait de vier entry-poorten (resolves/scaffold/impact/step-list), de lint-poort en
  de testsuites, en opent daarna de PR (stap 4). **Sinds 2026-08-13 niet meer "alleen op verzoek van
  Dave"**: of hij vanzelf loopt hangt af van wat er in de branch zit, zoals de safety-rules hierboven
  beschrijven. Frontend-werk wacht, de rest loopt door.
- **`fold-changelog`** — vouwt `workflow-davekjohn/branch/branch-changelog.md` gerangschikt op tier/score in
  `CHANGELOG.md`, verrijkt met de PR-link en de merge-datum, en reset de twee
  `workflow-davekjohn/branch/`-bestanden
  (stap 7).
- **`cut-release`** — **draait het grootste deel van de Release Workflow zélf**, en dat is het
  belangrijkste dat je over deze skill moet weten. Het genereert de development-note, schrijft een
  concept van het audience-document, leegt `CHANGELOG.md` tot de intro, voegt de rij toe aan
  `workflow-davekjohn/releases/README.md`, en doet daarna `git add -A`, `git commit -m "release: v<versie>"`,
  `git tag -a` en **twee pushes: `git push origin main` en `git push origin v<versie>`**. Alleen de
  `gh release create`-stap wordt geprint in plaats van uitgevoerd. `-NoPush` houdt de twee pushes
  tegen en laat commit en tag lokaal staan.
  > **Tot 2026-08-13 stond hier het omgekeerde:** *"Het print commandoblokken in vaste volgorde; het
  > draait niets zelf."* Dat was onjuist en op de gevaarlijkste manier — wie het las, dacht dat
  > proberen gratis was, terwijl het script precies de handeling doet die de safety-rules aan Dave
  > voorbehouden: pushen naar `origin/main`. Weerlegd door `cut-release.ps1` zelf te lezen; het blok
  > heet daar `# --- Commit + tag directly on main ---`.
  >
  > **Diezelfde avond zijn de twee botsingen die daaruit volgden beslecht** (Dave): dit script **moet**
  > hier draaien, en de repo is eromheen gebogen in plaats van andersom.
  > 1. Het script doet géén `git checkout main` en commit op de branch waar je op staat. Daarom is de
  >    **release-branch afgeschaft** — je cut vanaf `main`, en uitzondering 2 in de safety-rules is nu
  >    de release-commit zelf, precies zoals in de bron.
  > 2. `git add -A` stageert de héle tree, dus die uitzondering kán geen bestandslijstje dragen zoals de
  >    fold. In plaats daarvan is de voorwaarde hard: **schone tree vóór de cut**.
  >
  > Alleen op expliciet verzoek van Dave, zoals de hele Release Workflow. Wat je daarbij moet weten:
  > `-SkipTierGate` overrulet de bump-poort en is bewust iets anders dan `-SkipLint` — die slaat een
  > tool over, de eerste een oordeel over inhoud.
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
  `tsconfig.lint.json`, **`eslint .`**, **`npm run build`** en sinds 2026-08-16 **`check-links.ps1`**.
  ESLint kwam er op 2026-08-14 bij, toen
  de 37 pre-existing errors op 0 stonden; errors blokkeren, warnings niet maar worden wel geteld.
  Sinds 2026-08-15 draagt de buildstap een **ondergrens op het aantal statische pagina's**
  (`$MinStaticPages`, nu 89): daalt het eronder, of is het getal niet uit de buildoutput te lezen,
  dan blokkeert de poort. Groei blokkeert niet maar wordt gemeld. De
  verantwoording staat in de header van het script. Het draait sinds 2026-08-13 op twee plekken —
  lokaal onder Windows PowerShell 5.1 en in CI onder `pwsh` op Linux — en houdt daar in zijn
  preferences rekening mee.
- **`scripts/lint/check-links.ps1`** — de **vierde** stap van die poort, sinds 2026-08-16: elke
  relatieve link en elk anker in alle 107 markdown-bestanden tegen de tree. Hij dekt het enige deel
  van deze repo dat tsc, ESLint en de build niet aanraken, terwijl het wel het deel is dat élke
  sessie meeleest. **Aanleiding:** de mapverhuizing naar `workflow-davekjohn/` (PR #145) liet
  **vijftien dode links** achter die een etmaal onopgemerkt bleven met een groene poort en groene CI;
  ze zijn gevonden omdat er toevallig een tweede verhuizing overheen ging. Drie eigenschappen die je
  moet kennen voor je hem aanpast:
  - **Hij toetst tegen `git ls-files`, hoofdlettergevoelig, niet tegen `Test-Path`.** Een bestand dat
    niet in git zit bestaat niet voor een lezer op GitHub, en `Test-Path` is op Windows
    hoofdletterongevoelig — precies de letterkast-klasse waarvoor CI op ubuntu draait. Een doel dat
    alleen op letterkast afwijkt krijgt een eigen melding.
  - **Code-spans gaan eruit vóór hij op links matcht, maar níet uit koppen.** Beide richtingen zijn
    fout gegaan tijdens het bouwen: `` `[x](next.config.ts)` `` in `workflow-davekjohn/branch/README.md`
    is een *illustratie* en werd als dode link gemeld, en andersom rekent GitHub de tekst binnen
    backticks wél mee in een anker — `#nooit-direct-op-main--via-branch--pr` bevat het woord `main`.
    Wie die twee door elkaar haalt, "repareert" werkende links kapot.
  - **Hij doet geen enkel netwerkverzoek.** Externe links worden niet opgevraagd, bewust dezelfde
    afweging als bij `check-audio.js`: een poort die om een externe oorzaak rood staat wordt genegeerd.
- **`.github/workflows/ci.yml`** — diezelfde poort, server-side, op elke PR en elke push naar `main`, plus
  de testsuite. Hij roept `lint-web.ps1` aan in plaats van tsc en de build over te schrijven, zodat er één
  poort te onderhouden blijft. Draait op **ubuntu** en niet op windows zoals de bron, omdat Netlify op
  Linux bouwt en letterkast-fouten in imports alleen daar aan het licht komen. De job heet **`poort`**, en
  dat is de naam die de ruleset als required check gebruikt — hernoem hem niet zonder de ruleset mee te
  nemen. De Node-versie komt uit `.nvmrc`, met de **volledige** versie erin en niet alleen de major.
  Sinds 2026-08-15 annuleert een nieuwe push de vorige run (`concurrency` met `cancel-in-progress`) en
  breekt een hangende job na tien minuten af in plaats van na GitHub's default van zes uur.
  > **`.nvmrc` wordt niet gelezen door `npm ci` op je eigen machine** — alleen door `setup-node` in CI
  > en door Netlify. Wie hier Node 20 of 24 draaide kreeg dus geen enkele melding, en de eerste rode
  > vlag was een lockfile-conflict of een subtiel ander buildresultaat. Sinds 2026-08-15 staat er
  > daarom een `engines`-regel in `package.json` (`>=22.15.1 <23`) met `engine-strict=true` in
  > `.npmrc`, wat van een waarschuwing een blokkade maakt. Getoetst in beide richtingen: `npm ci`
  > slaagt op 22.15.1 en faalt met `EBADENGINE` zodra de range niet gehaald wordt. Bewust een **range**
  > en geen exacte pin: die zou bij elke patch-upgrade op twee plekken bijgewerkt moeten worden, en dat
  > is juist de drift die de regel moet voorkomen.
- **`tests/`** — **zestien suites, 213 tests**, gedraaid met Vitest via `npm test`; gemeten op
  2026-08-16 met Vitest 4.1.10, looptijd 19s. De kern is
  `mix-data.test.ts`, die de veldregels uit [`src/data/mixes/README.md`](src/data/mixes/README.md)
  afdwingt en **gemeten is in plaats van overgeschreven**: regels die de data al haalt staan als harde
  assertie, regels met bekende achterstand als **ratchet** op het gemeten aantal. Die ratchet faalt óók
  als er iets is opgelost, met de vraag het plafond te verlagen — zo blijft de achterstand zichtbaar.
  Daarnaast, gegroepeerd naar wat ze bewaken: **componenten** (`AudioPlayer`, `MobileContent`,
  `MobileContent.scroll-lock`, `EmailDisplay`, `ContactForm`, `Filter`, `Playlist`), **de publieke
  output** (`sitemap`, `canonical-urls`, `jsonld-escaping`), **regels die eerder stil braken**
  (`breakpoints`, `overflow-propagatie`, `slapende-componenten`, `toegankelijkheid`) en de
  Netlify-function `send-email`. `Get-TestCommands` in `scripts/repo-config.ps1` zorgt dat `open-pr` en
  `cut-release` de suite meedraaien; zonder die seam meldden ze eerlijk "test gate skipped".
  > **Hier stond tot 2026-08-16 "acht suites, 143 tests", met acht van de zestien in de opsomming.**
  > Dat getal was juist toen het werd opgeschreven en is daarna blijven staan terwijl de auditbacklog
  > (PR's #98 t/m #142) de suite verdubbelde — precies de acht die eronder ontbraken zijn de suites
  > die uit die backlog kwamen. Het stond in de sectie die beschrijft hoe streng de poort is, in het
  > bestand dat élke sessie meelaadt, dus een lezer onderschatte structureel wat er bewaakt wordt en
  > kon een testgat vermoeden dat al gedicht was. **De les is dat een getal in een document een
  > houdbaarheidsdatum heeft die de bewering eromheen niet heeft**: de rest van deze bullet — de
  > ratchet, de seam — is nooit onjuist geweest. Meet opnieuw voor je hem aanpast; neem het niet uit
  > een handover over.
  > **Een ratchet moet tellen wat de regel bewaakt, en dat ging bij twee van de zeven mis.** De
  > tijd- en scheidingsratchets telden **entries met minstens één overtreding** (73 en 33) in plaats
  > van de overtredingen zelf (2444 en 70). Daarmee stonden ze in de praktijk uit: 73 van de 85
  > entries zaten al in de ratchet, en zolang een entry erin zit is de regel voor die entry
  > uitgeschakeld. Gemeten op 2026-08-15 met een in-memory simulatie: een nieuwe overtreding
  > toevoegen liet de oude teller op 73 staan, en 41 overtredingen repareren óók — terwijl de nieuwe
  > teller in beide gevallen bewoog. Sindsdien tellen ze per track. Bij de vijf andere ratchets
  > speelt dit niet: die tellen per mix één eigenschap, dus daar is entry = overtreding.
- **De ruleset `main-ci-gate`** — geen bestand in de repo maar een repo-setting, van vorm gelijk aan die
  van de bron: target `~DEFAULT_BRANCH`, regels `deletion` + `non_fast_forward` + de required check
  `poort`, met **bypass voor Admin en Maintain**. Die bypass is geen slordigheid: zonder hem blokkeert de
  ruleset `cut-release`'s eigen push naar `main`.
  > **De bypass dekt alle drie de regels, niet alleen de required check.** `bypass_mode` staat op
  > `"always"` voor RepositoryRole 4 en 5, en GitHub kent geen bypass per regel — dus voor een admin
  > staat óók `deletion` en `non_fast_forward` opzij. Geverifieerd via de API (ruleset 20818953).
  > **Hier stond tot 2026-08-15 dat de ruleset "vooral force-push, het verwijderen van `main` en
  > merges door niet-admins" tegenhoudt.** De eerste twee zijn onwaar voor de enige persoon die hier
  > werkt, en dat is precies de verkeerde kant om je in te vergissen: wie dit las, kon aannemen dat
  > een force-push server-side wordt geweigerd en de lokale denylist als tweede lijn beschouwen in
  > plaats van als de enige — en die denylist geldt alleen binnen Claude Code, niet in een terminal.
  > Wil je de oorspronkelijke bewering wél waarmaken, dan vraagt dat een **tweede ruleset zonder
  > bypass** met alleen `deletion` + `non_fast_forward`. Dat is een settingswijziging en dus Dave's
  > beslissing; zie issue #91.
  >
  > **`strict_required_status_checks_policy` staat sinds 2026-08-15 op `true`** (Dave). Daarvóór
  > stond hij op `false`, en dan konden twee PR's die los groen zijn na elkaar mergen zonder dat
  > `poort` de combinatie ooit had gezien — precies de klasse fout die de build zou vangen als hij
  > tegen de juiste basis had gedraaid, en in deze repo staat dat resultaat binnen minuten live.
  >
  > **Wat dat in de praktijk betekent: een PR moet bij zijn met `main` vóór de merge.** Is `main`
  > intussen opgeschoven — en dat gebeurt hier bij elke fold — dan meldt GitHub de PR als "out of
  > date" en is het `Update branch` of een lokale merge/rebase vóór je kunt mergen. Bij een reeks
  > wachtende branches betekent dat dus één update-ronde per branch.
  >
  > De wijziging is gedaan met een `PUT` op de ruleset, met de volledige definitie terug en daarin
  > exact één gewijzigd veld — geverifieerd door de opgehaalde ruleset vóór en ná te diffen: één
  > verschil, en `bypass_actors`, `enforcement` en de required check `poort` zijn ongemoeid.
  >
  > **Het eerste voorstel uit #91 is bewust níet uitgevoerd**: een tweede ruleset zonder bypass zou
  > `cut-release`'s eigen push naar `main` blokkeren, en dat is precies waarom die bypass er staat.
- **`check-script-contract.ps1`** — bewaakt dat `repo-config.ps1` en `branch-info.ps1` de functies
  leveren die de gedeelde scripts verwachten. Woont in de plugin (`scripts/sync/` daar), niet in deze
  repo, en draait bij het starten van een sessie via de `script-contract-sessioncheck`-hook.
- `scripts/add-mix.js` (`npm run mix:add`) en `scripts/convert-to-webp.js` (`npm run images:webp`,
  preview; `npm run images:webp:apply` voert uit).
- **`scripts/check-audio.js`** (`npm run mix:check-audio`) — vraagt elke `audioSrc` uit
  `src/data/mixes/` op en meldt wat niet bereikbaar is, met exit 1. **Bewust geen test en geen
  poortstap**: het doet 85 netwerkverzoeken naar een bucket buiten deze repo, en een poort die om een
  externe oorzaak rood staat wordt genegeerd — dan bewaakt hij niets meer. Draai hem met de hand na
  het aanraken van de mix-data of het opruimen van R2.
  > Aanleiding: `Green Full (m) Vol. 2` stond op 404 op de live site, gevonden bij het meten van iets
  > anders. De pagina bouwde, de link stond er, en alleen wie op play drukte merkte het. Dat is de
  > klasse fout waar geen enkele bestaande poort naar kijkt.

De Release Workflow hierboven kent geen repo-eigen script; de sluitende stappen lopen sinds de
herinstallatie op 2026-08-03 via de gedeelde **`cut-release`**-skill. Die skill doet het versienummer,
de development-note en het legen van `CHANGELOG.md` **zelf** — zie de tabel bij de Release Workflow.
Wat handwerk van Rendall 🎬 blijft: het **audience-concept herschrijven**, de aankondiging in
`github/`, en de GitHub Release met zijn bijlagen.

> Hier stond tot 2026-08-15 dat het versienummer, de release-notes en de changelog-verhuizing
> handwerk bleven. Dat was de tekst van vóór de omzetting van 2026-08-13, en de tabel hierboven wees
> alle drie al aan het script toe.

### Safety-invulling van djcylow-react

De grondwet hierboven, hier concreet ingevuld:

- **`origin/main` ís de live site.** Netlify bouwt en publiceert bij elke push naar `main`, en
  `gh pr merge` schrijft daar server-side rechtstreeks in. Een PR mergen is dus deployen; er is
  **geen staging** en geen aparte publicatiestap. Een release cutten voegt daar een versienummer en
  een tag aan toe, maar zet niets nieuws live — dat was al gebeurd bij de merges.
- **De poort vóór elke PR is de laatste wacht vóór een live deploy.** `open-pr` draait
  `scripts/lint/lint-web.ps1` (via `Get-LintScript`): `tsc --noEmit`, `eslint .`, `npm run build` én
  `check-links.ps1`, alle vier moeten
  groen zijn. De build zit er sinds 2026-07-26 in, precies omdat een typecheck een kapotte build niet
  vangt en er niets tussen de merge en de site zit. **ESLint zit er sinds 2026-08-14 in**, als tweede
  van de vier stappen. Daarmee is deze poort niet langer deels een afspraak: het oude advies
  "vergelijk op aantal en niet op exitcode" is vervallen, omdat er geen aantal meer te vergelijken is.
  **De link- en anker-check kwam er op 2026-08-16 bij**, als vierde en laatste — bewust áchter de
  build, want een kapotte build is het ergste dat hier kan gebeuren en hoort als eerste te blokkeren.
  `-SkipBuild` bestaat om lokaal te itereren en hoort niet in de poort zelf; de link-check slaat hij
  níet over, want dode links repareren is precies het werk waarbij je de build niet nodig hebt.
  > **Sinds 2026-08-15 checkt de poort werkelijk wat hij beloofde, op twee punten die allebei een
  > belofte zonder mechanisme waren.**
  >
  > **Eén: de isolatie van `tsconfig.lint.json` bestond niet.** Die config sluit `.next` uit en legde
  > in zijn eigen `"//"`-comment uit dat de poort daarom "puur de broncode checkt en zo
  > reproduceerbaar is". Een `exclude` filtert echter alleen wortelbestanden, niet wat via een import
  > binnenkomt — en `next-env.d.ts` doet op regel 3 een **directe** `import
  > "./.next/types/routes.d.ts"`. Gemeten: de poort typechecktte 680 bestanden mét
  > `.next/types/routes.d.ts` erin, precies de stale build-output waarvan hij onafhankelijk heette te
  > zijn. Daar kwam bij dat `next-env.d.ts` in `.gitignore` staat en **in CI dus niet bestaat**:
  > lokaal en server-side draaide dezelfde poort een ánder programma. `next-env.d.ts` staat nu in de
  > `exclude`; gemeten resultaat 677 bestanden, exit 0, geen `.next` meer — exact wat CI al deed.
  >
  > **Twee: het paginatal werd geprint maar niet getoetst.** Er stond een comment dat een plotse
  > daling "ook een signaal" is, zonder drempel en zonder vergelijking. Die faalklasse is hier al
  > eens live gegaan: `/luister` leverde een lege Suspense-shell in plaats van 78 mixlinks. Er staat
  > nu een ondergrens (`$MinStaticPages`, gemeten op **89**) die blokkeert bij een daling, en die
  > **ook blokkeert als het paginatal onleesbaar is** — anders valt de toets stil uit zodra Next zijn
  > buildoutput anders formuleert. Groei blokkeert niet maar wordt wel gemeld, met het verzoek de
  > ondergrens bewust te verhogen. Beide takken zijn negatief getoetst: ondergrens tijdelijk op 999
  > gaf exit 1, en een opzettelijk kapotte regex ook.
  > **Er stonden 37 pre-existing errors, en die zijn op 2026-08-14 in drie stappen naar 0 gebracht.**
  > Tien waren `no-require-imports` in `scripts/` en `netlify/functions/` — CommonJS in Node-land, dus
  > geen fout in die bestanden maar een ontbrekende override in `eslint.config.mjs`. Veertien waren
  > `ban-ts-comment`: een `@ts-ignore` boven een stylesheet-import, zestien keer in totaal (twee
  > ervan stonden niet in de telling omdat er een `eslint-disable-next-line` overheen lag). De laatste
  > dertien waren echte code: vier hook-fouten, vijf `any`'s en vier JSX-entities.
  >
  > **De tweede stap liep anders dan gepland, en dat is de les die blijft.** Het plan was een eigen
  > `.d.ts` met `declare module '*.scss'`. Bij het meten bleek `tsc` die imports al te accepteren.
  > Er was dus geen declaratiebestand nodig en ook nooit nodig geweest: de zestien regels konden
  > simpelweg weg. Was het plan zonder meting uitgevoerd, dan stond er nu een `.d.ts` in de repo die
  > niets doet en die
  > een latere lezer als noodzakelijk zou lezen. **De remedie van een plan is een aparte aanname dan
  > de diagnose, en faalt onafhankelijk daarvan.**
  >
  > **Hier stond tot 2026-08-15 een verkeerde reden onder een juiste conclusie:** *"`next-env.d.ts`
  > levert de declaratie via `/// <reference types="next" />`"*. Dat de zestien regels weg konden
  > klopte, maar `next-env.d.ts` is niet wat het mogelijk maakte. `declare module '*.scss'` staat in
  > `node_modules/next/types/global.d.ts` en komt transitief binnen via de `next`-imports in de code
  > zelf — gemeten met `tsc --listFiles`, zónder `next-env.d.ts` in de config. Dat bestand staat
  > bovendien in `.gitignore` en **bestaat in CI helemaal niet**, dus een verklaring die erop leunt
  > verklaart alleen de lokale helft. Het is sinds 2026-08-15 uit `tsconfig.lint.json` gehaald, om de
  > reden hieronder.
  >
  > **Diezelfde dag gingen ook de 8 warnings naar 0**, en dat leverde de vondst op die de hele
  > operatie rechtvaardigt: één ervan was een ongebruikte import van `EmailDisplay` in `ContactForm`,
  > terwijl `info@djcylow.com` drie regels verderop voluit in de tekst stond. Die component bestaat
  > juist om het adres uit de statische HTML te houden — de bescherming was begonnen en nooit
  > afgemaakt, en het adres stond scrape-baar op zes pagina's. **In een lijst van acht bekende
  > meldingen valt niet op welke er één te veel is**; daarom staat de teller nu op 0/0 en is elke
  > volgende melding per definitie nieuw. De twee `no-img-element`-warnings in `Hero` zijn onderdrukt
  > mét de afweging in de code: `next/image` doet bij `unoptimized: true` geen resizing en geen
  > formaatconversie, en voegt lazy loading toe die je voor een hero niet wilt.
  > **De ESLint-stap in `lint-web.ps1` is diezelfde dag gezet**, in een eigen branch. Dat hij ook
  > blokkeert is niet aangenomen maar getoetst: met een tijdelijk bestand met één `any` erin gaf de
  > poort exit 1 met de fout erbij, waarna het bestand weer weg is. Een poort die alleen groen is
  > waargenomen, is niet aantoonbaar een poort.
- **Diezelfde poort draait sinds 2026-08-13 ook server-side**, via
  [`.github/workflows/ci.yml`](.github/workflows/ci.yml), op elke PR en elke push naar `main`. Dat is
  **geen tweede kopie** van tsc + build maar hetzelfde `lint-web.ps1`, aangeroepen onder `pwsh` — een
  kopie in een workflow die niemand openslaat is precies wat als eerste uit de pas gaat lopen. De
  workflow draait bewust op **ubuntu**, anders dan de bron die windows kiest: Netlify bouwt op Linux, en
  een import met de verkeerde letterkast bouwt wél op Windows en breekt daar. Die klasse fout kon de
  lokale poort structureel niet zien.
- **En sinds 2026-08-13 (avond) draait de testsuite mee**, in CI als eigen stap en lokaal via
  `Get-TestCommands`. Er is ook **branch protection**: de ruleset `main-ci-gate`, met `poort` als required
  check. De drie pijlers waar de bron-default op leunt staan daarmee alle drie.
- **Wat die poorten níet bewijzen, en waarom de PR-regel ruim ingevuld blijft.** Twee dingen, en geen van
  beide verdwijnt door meer poorten. **Eén:** de suite dekt de mix-**data**, en geen enkele poort kan
  bewijzen dat een pagina er góéd uitziet — dat is de kern van de uitzondering en die is niet
  automatiseerbaar. **Twee:** de ruleset heeft `bypass_actors` voor Admin en Maintain, en dat moet zo,
  anders blokkeert hij `cut-release`'s eigen push naar `main`. Die bypass staat op `always` en zet de
  **hele** ruleset opzij, niet alleen de required check — dus voor wie als admin werkt houdt hij niets
  hard tegen, ook geen force-push en ook niet het verwijderen van `main`. Daarom blijft álles in
  `src/`, `public/` en `src/data/mixes/` op Dave's woord wachten, ook een refactor die visueel niets
  verandert: de menselijke blik is hier niet de tweede lijn maar de enige.
  > **Wat er wél is bijgekomen om het kijken goedkoper te maken:** elke PR krijgt een **Netlify deploy
  > preview** op `deploy-preview-<nummer>--djcylow-react.netlify.app`. Het staat niet in `netlify.toml`
  > (die heeft geen context-config) — het is Netlify's projectdefault, en het is op 2026-08-13 gemeten
  > bij PR #31 tot en met #33. Dat nuanceert het "geen staging" hierboven: juist blijft dat er niets
  > tussen de merge en live zit, maar **onjuist** was dat site-werk niet vóór de merge te bekijken valt.
  > Bij PR #33 is die preview voor het eerst bewust als bewijs gebruikt: die PR wijzigde `.nvmrc`, wat de
  > live build raakt, en de groene preview maakte de merge aantoonbaar veilig. **Of de PR-grens hierdoor
  > verschuift is Dave's beslissing en staat open.**
- **`public/images/` is beschermd.** Afbeeldingen worden via pad gerefereerd in de mix-JSON;
  verwijderen breekt stil een pagina en gebeurt nooit zonder Dave's woord.
- **`next.config.ts` en `netlify.toml` zijn beschermd.** Een fout daar breekt de Netlify-build en
  dus de live site.
- **Die drie staan sinds 2026-08-15 óók in de machinerie**, en niet meer alleen in deze tekst.
  `.claude/settings.json` draagt een `ask`-lijst voor `next.config.ts`, `netlify.toml` en
  `public/images/**`. Bewust `ask` en geen `deny`: een `deny` maakt een legitieme wijziging
  onmogelijk in plaats van bewust, en wat hierboven staat is dat Dave's woord nodig is — niet dat
  het onbereikbaar moet zijn. De denylist heeft er daarnaast de refspec-vorm
  (`git push origin +HEAD:main`) bij gekregen, die langs `git push --force` glipte.
  > Tot die dag leunde de bescherming volledig op of een specialist dit bestand gelezen had. Voor
  > een repo waar de merge de deploy is, is dat de verkeerde kant om op te leunen.
- **Later diezelfde dag zijn ook de handelingen zelf toegevoegd, en niet meer alleen de bestanden**
  (issue #63). Op de `ask`-lijst staan nu `git push origin main` en `git push origin HEAD:…`,
  `gh api` met een schrijvende methode (`-X`/`--method`), `gh release create`/`delete`, `gh repo
  edit`, `gh ruleset` en `git config` — telkens in beide vormen, want `Bash(...)` en
  `PowerShell(...)` zijn aparte regels. `gh repo delete` staat op de **deny**-lijst: dat is de enige
  in de rij die niet terug te draaien is.
  > **Waaróm dit in het gedeelde bestand moest.** De permissies stonden alleen in
  > `.claude/settings.local.json`, met 89 `allow`-regels waaronder `git push *`, `PowerShell(git *)`,
  > `gh api *` en `gh release *`. Dat bestand is **gitignored** — het reist dus niet mee, geldt alleen
  > op deze machine, en niets in de repo kon eraan tornen. `.claude/settings.json` is de enige laag
  > die wél meereist, en `deny` en `ask` winnen daar van een `allow` uit het lokale bestand. Dat is
  > geen aanname: de `ask`-regels voor `netlify.toml` hebben in de praktijk gevraagd terwijl `Edit`
  > breed was toegestaan.
  >
  > **En hier hoort een eerlijke grens bij.** Het lokale bestand staat ook `Bash(node *)` en
  > `Bash(python -c ' *)` toe, en daarmee is elke regel hierboven te omzeilen —
  > `node -e "require('child_process').execSync('…')"` valt onder geen van deze patronen. Deze lijst
  > beschermt dus tegen een **vergissing**, niet tegen opzet. Dat maakt hem niet waardeloos: bijna
  > alles wat in deze repo ooit is misgegaan was een vergissing. Maar wie hem leest als een
  > sluitende afscherming leest hem verkeerd, en een lijst die meer belooft dan hij waarmaakt is
  > gevaarlijker dan geen lijst.
  >
  > **De vier push-regels zijn op 2026-08-16 van de `ask`-lijst gehaald** (Dave):
  > `git push origin main` en `git push origin HEAD:…`, in beide vormen. Ze codificeerden een regel die
  > die dag verviel, en een `ask` op een handeling die vrij is, is geen bescherming maar een prompt die
  > mensen leren wegklikken. Wat blijft staan is de **deny**-lijst — force-push in alle drie zijn vormen,
  > `reset --hard`, `rebase`, en `gh repo delete` — plus de `ask` op het cutten van een release en op
  > repo-settings. Vrij pushen is niet hetzelfde als vrij herschrijven.
- **Alles wat de publieke site of de SEO raakt is Dave's beslissing** — titels,
  `description`-velden, metadata en routes. Een specialist stelt voor, Dave beslist. Dat weegt vooraf,
  bij het uitdelen van het werk; het is geen tweede poort bij de merge.
- **Pushen naar `origin` is vrij** (Dave, 2026-08-16), inclusief `origin/main`. Force-push, `reset --hard`
  en `rebase` op een gedeelde branch blijven verboden — die staan op de **deny**-lijst en zijn een andere
  handeling dan pushen.
- **Twee uitzonderingen op "nooit direct op `main`"**: de fold-commit en de release-commit, zoals
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

Diezelfde tweedeling loopt door in
[`workflow-davekjohn/CONTRIBUTING.md`](workflow-davekjohn/CONTRIBUTING.md), en dat is geen tweede systeem
maar hetzelfde: de portable helft van die pagina woont in de plugin, de antwoorden van déze repo staan
in de repo. Wat dit bestand hier doet voor de **grenzen**, doet die pagina daar voor de **route**.

De orchestrator (Chris) wordt altijd meegeladen; hij verwijst on-demand door naar de specialisten in
[`.claude/specialists/lenses/`](.claude/specialists/lenses/). Die ene import hieronder laadt het
roster, Chris' draagbare body uit de plugin en zijn repo-lens.

@.claude/specialists/SPECIALISTS.md
