## `docs/wat-de-eerste-release-run-mat` changelog

### Branch title

de testpoort en de release-route dragen wat de eerste cut-run heeft gemeten

### Branch ID

20260816-092424

### Branch type

docs

### What does the change on this branch bring to main?

`CLAUDE.md` beschreef de testpoort als **acht suites, 143 tests**. Opnieuw gemeten op 2026-08-16 met
Vitest 4.1.10: **zestien suites, 213 tests**, in 19 seconden. Het getal was juist toen het werd
opgeschreven en bleef staan terwijl de auditbacklog (PR's #98 t/m #142) de suite verdubbelde — de acht
suites die in de opsomming ontbraken zijn precies de acht die uit die backlog kwamen. Het stond op twee
plekken: in de bullet die de testpoort beschrijft, en in de tabel met de vier pijlers waarop de
PR-default rust. Beide dragen nu het gemeten aantal, en de opsomming is compleet en gegroepeerd naar wat
elke suite bewaakt.

De **Release Workflow is op 2026-08-15 voor het eerst gelópen in plaats van gelezen** — v2.24.0, 54
entries — en de route bleek te kloppen. Wat het document niet kon vertellen was wat het kóst en hoe het
eruitziet terwijl het draait. Drie waarnemingen uit die run staan er nu bij, nagemeten uit de
git-timestamps en `gh release view v2.24.0` in plaats van uit de herinnering van één avond: de cut zelf
duurde 3m 04s, het handwerk erna 32m 36s, samen 35m 40s van cut tot gepubliceerd — dus het script is
niet de kostenpost maar stap 4 en 5 zijn dat. Verder dat de push naar `main` de melding
`Required status check "poort" is expected` geeft, wat de ruleset-bypass is en geen fout, maar er op het
beslissende moment uitziet als een blokkade. En dat `-NoPush` bij een grote cut het enige moment is
waarop een mens het samengestelde resultaat ziet vóór het publiek is.

Ten slotte de tweede timing-pass op `releases/audience/2.x/2.24.0.md`, die de checklist expliciet
voorschrijft: het totaal bestaat pas ná de publicatie, dus dat document droeg alleen de 3 minuten van de
cut en beweerde bovendien dat het schrijven ervan niet in het getal zat. Het draagt nu de hele run van
36 minuten, met de vaststelling dat vijf zesde daarvan schrijven en controleren was in plaats van
machinerie.

### Significance

#### Tier 0

`CLAUDE.md` laadt bij élke sessie mee, en het onjuiste getal stond in de sectie die beschrijft hoe
streng de poort is. Een lezer onderschatte structureel wat er bewaakt wordt en kon een testgat vermoeden
dat al gedicht was. De release-lessen zijn bovendien eenmalig te borgen: over een week is de run een
herinnering en staat er weer een beschrijving die uit de code is gelezen in plaats van gemeten.

**Score:** 3

#### Tier 1

Het audience-document van v2.24.0 is een gepubliceerd stuk voor de opdrachtgever en droeg een
kostenplaatje dat vier vijfde van de werkelijke tijd wegliet. Dat is precies de klasse bewering waarop
een lezer een verwachting baseert: een release die "3 minuten" kost leest als iets wat je tussendoor
doet.

**Score:** 2

### Pull Request

