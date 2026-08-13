## `docs/contributing-en-branch-readme` changelog

### Branch title

De contributie-cyclus verhuist naar CONTRIBUTING.md, met branch/README.md erbij

### Branch ID

20260813-104046

### Branch type

docs

### What does the change on this branch bring to main?

Deze repo had als enige van de drie repo's die met de specialisten-plugin werken geen
`CONTRIBUTING.md`, en de map `branch/` miste het enige bestand dat de bron daar wel heeft: zijn
`README.md`. Beide zijn er nu, in de vorm die de bron en `life-hub` al gebruiken.

**`CONTRIBUTING.md` is de lokale helft van een gedeeld document.** De andere helft
(`CONTRIBUTING-portable.md`) reist met de plugin mee en beschrijft het mechanisme; deze pagina geeft de
antwoorden van deze repo. Dat is dezelfde splitsing die de manuals en de repo-lenzen al hanteren, en de
reden is dat een pagina die de antwoorden van één repo vastlegt niet door de volgende repo te adopteren
is: die moet hem herschrijven, en een herschrijving is een tweede bron.

**De cyclus staat daarmee op één plek, niet op twee.** De zeven stappen, de prefix-tabel, het
tier-model en de vier poorten van `open-pr` stonden in `CLAUDE.md`; die ruim 180 regels zijn verhuisd in
plaats van gekopieerd. `CLAUDE.md` houdt wat het altijd hield: de grondwet, het team en alles wat
repo-eigen is, plus de Release Workflow. De verdeling is nu: **dit bestand houdt de grenzen, die pagina
houdt de route.** De inleiding van `CLAUDE.md` legt uit waarom dat geen terugkeer is naar de oude
`workflow/`-map, die juist een tweede beschrijving van dezelfde werkwijze was.

**`Get-ReservedRootMd` kent het nieuwe root-document.** Zonder die regel leest `cut-release` een
`CONTRIBUTING.md` in de root als een changelog-entry die iemand vergeten is te folden, en weigert hij de
cut bij naam over een wijziging die nergens meer bestaat. De lijst stond op precies drie bestanden, met
in de toelichting de waarschuwing dat een nieuw vast root-document hier bijgeschreven moet worden en
nergens anders. Dat is gebeurd.

**Eén bekende fout is bij de verhuizing gerepareerd in plaats van meeverhuisd.** Het tier-blok vroeg
nog drie tiers, noemde tier 2 "een bezoeker van djcylow.com merkt het" en beschreef de ladder als
cumulatief. Alle drie waren achterhaald sinds `Get-ReleaseAudienceTier` op 2026-08-12 op **1** werd
gezet: bezoekers lezen geen release notes, en tier 1 en 2 zijn twee soorten lezer in plaats van twee
sporten van een ladder. De nieuwe tekst vraagt tier 0 en tier 1, verantwoordt de vervallen ladder, en
legt uit dat tier 2 nog wel gelezen wordt waar een oudere entry hem draagt. De noot in
`scripts/repo-config.ps1` die deze correctie aankondigde als werk voor een eigen branch is bijgewerkt
naar wat er feitelijk is gebeurd.

**Dave's taxonomie-besluit is met de verhuisde tabel meegekomen.** De prefix-tabel noemt de zeven
prefixen die je zelf kiest, met per prefix het GitHub-label en het changelog-type, en eronder staat wat
`scripts/lib/branch-info.ps1` daarnaast erkent: `feat/` als alias van `feature/` en `chore/`, met
`Chore` als achtste type waarop een onbekende prefix terugvalt. Dat is nagemeten en niet overgenomen —
de lib erkent negen prefixen, en `chore/` hoort daarbij, terwijl de bron-repo die juist hard weigert.
Herken beide, schrijf één.

**De referentiekopie in `branch/templates/` loopt sinds deze branch weer gelijk.** `new-branch`
verversde `branch_template_changelog.md` bij het aanmaken en haalde daar het `Tier 2`-blok uit: die
template was geschreven vóór `Get-ReleaseAudienceTier` op 1 ging, dus de referentie vroeg nog om een
tier die de scaffolder hier niet meer schrijft. Dat gebeurt automatisch — templates zijn gegenereerd,
niet onderhouden — maar het is wel een bestand in deze diff, dus het hoort genoemd.

**`branch/README.md` is een lens, geen kopie.** De bron-versie is 265 regels vol metingen, besluiten en
scriptpaden die daar bestaan en hier niet. Deze versie beschrijft wat de twee bestanden zijn, waarom
hun namen vast staan, wat de reset-staat op `main` betekent, de drie stappentekens en wat de fold doet
en verwijst voor de cyclus door naar `CONTRIBUTING.md`. Er staan twee dingen in die specifiek voor deze
repo gelden: hoe een gestapelde branch de twee bestanden overneemt (en dat dit tot plugin v4.5.0 stil
misging, gemeld als inbound #615 vanuit deze repo), en het conflictvenster tussen een merge en zijn
fold.

**De verwijzingen zijn meegelopen, want een verhuizing die dat overslaat maakt dode links.** De header
van `scripts/lib/branch-info.ps1` wees de tabel in `CLAUDE.md` als canonieke bron aan, twee toelichtingen
in `scripts/repo-config.ps1` verwezen naar stap 3 en stap 6 daar, en `.claude/specialists/SPECIALISTS.md`
noemde één bestand voor de hele werkwijze. Alle vier wijzen nu naar de plek waar de tekst staat. De
mappenboom in `README.md` noemde bovendien nog een `workflow/`-map die al niet meer bestond; die regel
is vervangen door `branch/`, `CONTRIBUTING.md` en `CLAUDE.md`.

### Significance

#### Tier 0

Wie hier werkt zoekt de route vanaf nu op de plek waar elke repo van deze familie hem heeft, en vindt
er één beschrijving in plaats van twee die uit elkaar kunnen lopen. Daar komt een gerepareerde
tier-uitleg bij: het oude blok vroeg om een derde tier die dit repo niet meer heeft, wat een entry kost
die de poort niet kan lezen. En het voorkomt een storing die nog niet was opgetreden maar wel klaarlag:
een release-cut die weigert op het nieuwe root-document.

**Score:** 3

#### Tier 1

De opdrachtgever vindt de contributie-route nu op de conventionele plek, met de seam-antwoorden van deze
repo in één tabel bij elkaar. Aan de site, de mixen of het werk zelf verandert niets.

**Score:** 2

### Pull Request
