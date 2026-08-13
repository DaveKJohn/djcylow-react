## `docs/gedeelde-docs-spiegelen-de-bron` changelog

### Branch title

Deze repo trekt zich gelijk met de bron: de PR-regel, releases/README.md verbatim, CONTRIBUTING.md verwijzend, en Chris' lens gevuld

### Branch ID

20260813-130128

### Branch type

docs

### What does the change on this branch bring to main?

**Deze repo liep op drie plekken achter op de bron, en op geen ervan was dat een besluit.** Eén rode draad:
waar de gedeelde werkwijze iets zegt, hoort deze repo dat niet in eigen woorden te herhalen en er niet
stilzwijgend van af te wijken.

---

#### De PR-regel — de omkering die niemand had gewogen

**De grondwet zei het omgekeerde van de bron, en van Chris' eigen body.** De bron zette de default op
**27 juli 2026** om naar *"doorlopen tenzij"* (letterlijk: *"Decision by Dave, July 27, 2026"*), met twee
uitzonderingen: **zichtbaar resultaat** en **onomkeerbaar/naar buiten gericht**. De toets is één vraag:
*voegt Dave's eigen blik iets toe dat de poorten niet kunnen?* Deze repo droeg tot vandaag de tekst van
daarvóór — elke PR wachtte, en ernaar vragen mocht niet.

Gezocht naar een besluit dat die afwijking dekte: **er is er geen**, niet in `CLAUDE.md`, niet in
`CHANGELOG.md`, niet in `CONTRIBUTING.md`, niet in de handover. Het was achterstand. En het was een
tegenspraak die bij élke sessie meelaadde, want Chris' draagbare body zegt *"the PR step: it runs on its own
unless the work falls under one of the narrow exceptions — see the gatekeepers in the repo lens"* — en die
lens was een leeg `VUL-IN`-scaffold. Body zei doorlopen, lens zei niets, `CLAUDE.md` zei nooit.

De bron-regel is nu overgenomen, **ruimer ingevuld dan de letter** (Dave, 2026-08-13) en met de meting die
dat rechtvaardigt erbij: de bron-default leunt op *"the lint gate, the test gate, and CI"*, en hier bestaan
twee van die drie niet — **nul testsuites, nul GitHub Actions, geen branch protection**, en de repo is
publiek. Onze poort bewijst dat de code **bouwt**, niet dat het gedrag gelijk bleef. Daarom:

- **Loopt door** (openen → mergen → folden, zonder tussenvraag): `scripts/`, de governance-documentatie,
  `CHANGELOG.md`, `releases/`, de specialisten-laag onder `.claude/`, onderzoek. Zulk werk raakt
  `djcylow.com` niet — de build levert dezelfde pagina's, dus de deploy erna is een no-op.
- **Wacht op Dave**: alles in `src/`, `public/` en `src/data/mixes/`, ook een refactor die visueel niets
  verandert. Plus een release, een tag, en de al beschermde bestanden. Draagt een branch beide soorten werk,
  dan is het site-werk en wacht hij.

Dit raakt vijf plekken die de oude regel als feit aannamen, alle vijf nagelopen: de safety-rules, de
approval-bullet (die de PR-regel als "de uitzondering op zeldzame vragen" noemde — nu zegt hij hetzelfde),
de skill-beschrijvingen van `open-pr` en `ship-pr`, `CONTRIBUTING.md` stap 4/5/6, en de
`Get-PrMergeMethod`-verantwoording in `repo-config.ps1`. **`ship-pr` blijft ongebruikt, maar de reden is
vervangen**: de oude ("een merge wacht hier altijd") is onwaar geworden; wat blijft is dat er geen CI is om
op te wachten en dat de site-of-niet-beoordeling niet in een skill past die in één run mergt.

**Chris' lens is gevuld** — de enige lens die automatisch meelaadt, en de plek waar zijn body naar verwijst.
Hij **verwijst** naar de safety-rules in plaats van ze te herformuleren; een tweede formulering van een
grondwetregel is precies wat er niet moet staan.

---

#### De twee documenten die het model in eigen woorden navertelden

Deze branch beëindigt dat — maar met een verschillende ingreep per document, en dat verschil is
het punt: `releases/README.md` **moet** lokaal bestaan, want de release-lijst woont erin en
`release-lib.ps1` schrijft er rijen in, dus daar is een verbatim spiegel het beste dat kan. De cyclus in
`CONTRIBUTING-portable.md` reist al mee met de plugin, dus daar is verwijzen beter dan kopiëren. Eén
principe, twee vormen, elk met de reden erbij vastgelegd.

---

#### `CONTRIBUTING.md` — de duplicatie eruit, de antwoorden erin

De pagina beschreef de zeven stappen voluit, inclusief het tier-model met zijn score-tabel, de zes
entry-secties, de vier poorten van `open-pr` en de fold-mechaniek. Dat is een tweede beschrijving van
`CONTRIBUTING-portable.md`, dat die splitsing zélf voorschrijft: *"read this page for the cycle; read your
own page for the values."* Gemeten: **126 regels weg, 100 erbij, 333 → 307**. Het saldo is klein omdat de
vrijgekomen ruimte is gevuld met wat écht van deze repo is en nergens stond:

- **Twee plugin-paden in plaats van één.** De scripts draaien uit de **cache**, dus dat is de tekst die
  beschrijft wat er feitelijk gebeurt; de marketplace-clone is de bron en kan vóórlopen. Deze repo stond
  een tijd op 4.5.0 terwijl `life-hub` al op 4.6.0 liep, en de release-scripts verschilden precies in wat er
  toen geauditeerd werd.
- **De PR-template-placeholder die `open-pr` niet vindt.** Onze regel is `<!-- Korte beschrijving van de
  wijziging en waarom -->`, en zonder match krijgt een PR een body **zonder beschrijving en zonder
  foutmelding** — gemeten bij PR #26. De reparatie is `Get-PrDescriptionPlaceholder` vullen, niet de template
  naar de bron toeschrijven; die seam bestaat sinds plugin 4.7.0.
- **De kopniveau-valkuil van de fold.** `#` in plaats van `##`/`###` levert *"No entry files found to fold"*,
  **exit 0** en geen commit — de entry lijkt verdwenen terwijl hij er staat (overkomen bij PR #27).
- **De ESLint-nuance van de poort:** 37 pre-existing errors, dus vergelijk op aantal en niet op exitcode.

De zeven koppen zijn intact gehouden: `CLAUDE.md` linkt naar twee ervan en de pagina naar drie van zichzelf.
De tier-1-uitleg is bewust **niet** hier uitgeschreven maar doorverwezen naar
`releases/README.md#what-tier-1-means-here` — anders had deze branch de duplicatie op één plek opgeruimd en
op een andere opnieuw gemaakt. Alle 10 cross-file anchors tussen `CLAUDE.md`, `CONTRIBUTING.md` en
`releases/README.md` zijn nagelopen.

---

#### `releases/README.md` — de portable helft verbatim

`releases/README.md` was een **Nederlandse vertaling** van het gedeelde release-model geworden. Dat is een
stap verder van de bron dan een parafrase: een vertaling valt niet te diffen, dus niets kon een bewuste
lokale keuze onderscheiden van een correctie uit de bron die nooit was aangekomen. De pagina spiegelt nu de
bron, in dezelfde vorm die de bron zelf draagt — een horizontale streep met eronder letterlijk *"everything
above this line travels to any repo that runs this release workflow"*.

**De portable helft is woord voor woord de bron.** Gemeten: 4154 woorden aan beide kanten, nul verschil na
normalisatie. Eén mechanische ingreep, en alleen die: vijf bestanden die in de **bronrepo of de
plugin-install** wonen (`cut-release.ps1`, `release-lib.ps1`, `release-lib.tests.ps1`,
`entry-scaffold-lib.ps1`, de `cut-release`-skill) zijn absolute GitHub-URL's geworden, want relatief zijn ze
hier dood. De zichtbare linktekst is ongewijzigd. Let op dat de **reden** hier anders is dan in `life-hub`:
de poort hier is `tsc --noEmit` + `npm run build` en die leest geen markdown, dus een dode link faalde
nergens en was daarom alleen maar stil fout. Alle 42 relatieve links en alle 6 anchors zijn nagelopen.

**Onder de streep staat de repo-eigen helft**, met de vorm van de bron: hoe de spiegel onderhouden wordt, de
seam-waarden, `What tier 1 means here`, de lokale besluiten, de hier gemeten instanties, en de release-lijst
met alle 37 releases ongewijzigd. De twee secties die deze repo extra heeft — *Git tags & rollback* en *What
gets which version number* — staan onder de streep waar ze horen. De inserter-regex en de major-guardrail
zijn getest tegen het resultaat: precies één `| Version | Date | Type | Title |`-kop en één `#### 2.x`
erboven.

**Deze map is nu Engels, en dat is een nieuw besluit** (Dave, 2026-08-13), vastgelegd in `CLAUDE.md` bij de
taalregel — anders spraken de twee documenten elkaar tegen. `life-hub` had dat besluit al sinds 2026-08-04;
hier bestond het niet. Wat níet meeverhuist: de 60 documenten in `development/` en `audience/` en de titels
in de release-lijst. Dat is historie, en een record is geen vertaling.

**Drie verouderde beweringen zijn onderweg gecorrigeerd**, alle drie gemeten in plaats van aangenomen:

- De pagina zei dat de gedeelde `cut-release`-skill *"uitdrukkelijk een checklist is die niets uitvoert"*.
  Weerlegd door de droogloop van 2026-08-13: het script doet zes van de vijftien `CLAUDE.md`-stappen en
  commit zelf op `main`. `CLAUDE.md` draagt diezelfde bewering nog; die correctie hoort bij
  `docs/release-route-naar-script`, want ze komt met de vijftien stappen waar ze bij staat.
- `Get-ReleaseHistoryPath` stond beschreven als "op zijn default"; hij is expliciet gedeclareerd.
- `Get-LiveStage` is leeg, en de pagina liet de reden open. Die is hier het **omgekeerde** van de gewone: er
  is juist wel een live site, maar de deploy is bij de PR-merge al gebeurd, dus er is geen go-live-stap ná
  de cut — precies wat de seam vraagt.

**Eén inbound-issue geopend, op Dave's verzoek:
[#646](https://github.com/DaveKJohn/claude-code-specialists/issues/646).** Het vraagt de bron om een
**`RELEASES-portable.md`** in de plugin, naast `CONTRIBUTING-portable.md` en `TICKETWORK-portable.md`, zodat
de gedeelde helft meereist in plaats van in elke consumer met de hand gekopieerd te worden — zoals
`CONTRIBUTING.md` hier al werkt. Dat maakt de verbatim-spiegel die deze branch neerzet expliciet het beste
antwoord van *vandaag* en niet de eindvorm: hij is nu correct en voor altijd handwerk. Twee consumers
onderhouden er inmiddels één van 4154 woorden. Precedent is
[#566](https://github.com/DaveKJohn/claude-code-specialists/issues/566), dat deze zelfde redenering voor
`CONTRIBUTING.md` maakte en `CONTRIBUTING-portable.md` opleverde. Wat een splitsing níet oplost, en dus in
het issue staat: de release-lijst woont hier en `release-lib.ps1` schrijft er rijen in, dus een
`releases/README.md` van een consumer is nooit alleen maar een link.

Geen duplicaat naar #643, dat twee van de drie bridge-paragrafen al dekt. Het vierde punt — de
`CHANGELOG.md`-bewering, die over een **consumer**-bestand gaat en dus als "over jou" leest terwijl hij
alleen in de bron waar is — is als bewijs *binnen* #646 meegegaan in plaats van als eigen issue, want het
onderbouwt precies dat issue: zo'n zin blijft onzichtbaar zolang de tekst met de hand wordt gekopieerd.

Eén ding is bewust **niet** gedaan. De geplande branch
`config/release-notes-in-het-nederlands` wordt door dit besluit **tegengesproken**: lege wording-seams
betekenen Engels, en dat is nu het juiste antwoord. Wat van dat punt overblijft is smaller en nog steeds
waar, en staat op de pagina.

### Significance

#### Tier 0

**Een lang bestaande blokkade is weg, en er zat een tegenspraak onder.** De PR-regel hield elke branch tegen
bij de merge-knop — ook een pure docs-branch die de site byte-identiek laat — terwijl de gedeelde werkwijze
die knop op 27 juli al had teruggebracht tot een checkpoint waar hij iets oplevert. Erger was dat Chris' eigen
body het omgekeerde zei van `CLAUDE.md` en verwees naar een lens die leeg was: bij elke sessie laadde een
tegenspraak mee, en de strengste van de drie won zonder dat iemand dat had besloten.

Daar komt de documentwinst bovenop: het release-model en de contributie-cyclus stonden hier in eigen woorden,
waardoor drie beweringen stil verouderd waren — waaronder één die een droogloop al had weerlegd. Een correctie
in het gedeelde model hoeft nu niet meer overgeschreven te worden. Dat is precies de handmatige port die de
eigen `cut-release.ps1`-kopie ooit fataal werd.

**Score:** 5

#### Tier 1

N/A — dit raakt Dave als *onderhouder*, niet als opdrachtgever van de site. Er verandert niets aan
`djcylow.com`: geen component, geen mix-data, geen metadata, geen route. De build levert dezelfde 89
pagina's.

**Score:** N/A

### Pull Request

