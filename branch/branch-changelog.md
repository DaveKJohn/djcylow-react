## `docs/gedeelde-docs-spiegelen-de-bron` changelog

### Branch title

De twee gedeelde documenten stoppen met parafraseren: releases/README.md spiegelt de bron verbatim, CONTRIBUTING.md verwijst ernaar

### Branch ID

20260813-130128

### Branch type

docs

### What does the change on this branch bring to main?

**Twee documenten in deze repo beschrijven een model dat niet van deze repo is, en beide deden dat in eigen
woorden.** Deze branch beëindigt dat — maar met een verschillende ingreep per document, en dat verschil is
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

Raakt de onderhouder op de plek waar het misgaat: dit is het document dat de release-route beschrijft, en
het beloofde tot nu toe een skill die niets uitvoert terwijl het script zes stappen doet. Daar komt de
structurele winst bovenop — een correctie in het gedeelde model hoeft hier niet meer overgeschreven te
worden maar reist mee via de inbound-route en een plugin-release. Dat is precies de handmatige port die de
eigen `cut-release.ps1`-kopie ooit fataal werd.

**Score:** 4

#### Tier 1

N/A — dit raakt Dave als *onderhouder*, niet als opdrachtgever van de site. Er verandert niets aan
`djcylow.com`: geen component, geen mix-data, geen metadata, geen route. De build levert dezelfde 89
pagina's.

**Score:** N/A

### Pull Request

