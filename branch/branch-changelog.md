## `docs/releases-readme-spiegelt-de-bron` changelog

### Branch title

releases/README.md spiegelt de bron: de portable helft verbatim, de repo-eigen helft eronder

### Branch ID

20260813-130128

### Branch type

docs

### What does the change on this branch bring to main?

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

**Eén nieuwe bevinding voor de bron, en die is niet verstuurd.** Het niet-portable zijn van de portable
helft staat al open als [#643](https://github.com/DaveKJohn/claude-code-specialists/issues/643) en dekt twee
van de drie bridge-paragrafen; daar gaat dus geen duplicaat heen. Maar de intro van de gedeelde tekst
beweert dat *"the release block in `CHANGELOG.md` points here for everything but the current version"*, en
dat is een bewering over een bestand dat de **consumer** bezit, achter een relatieve link die oplost. Hier
is dat release-blok op 2026-08-11 afgeschaft, dus de zin leest alsof hij over ons gaat terwijl hij alleen in
de bron waar is. Dat is scherper dan de andere drie punten en staat niet in #643. Vastgelegd op de pagina;
het **melden** is naar buiten gericht en wacht op Dave's woord.

Twee dingen zijn bewust **niet** gedaan. De geplande branch
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

