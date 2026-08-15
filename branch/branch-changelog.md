## `docs/release-v2240-audience-document` changelog

### Branch title

Het audience-document van v2.24.0 zegt wat de release oplevert en wat er openstond

### Branch ID

20260815-232356

### Branch type

docs

### What does the change on this branch bring to main?

`cut-release` zet bij een minor een concept van het audience-document neer met twee lege secties die
geen script kan vullen: wat de release de organisatie oplevert, en wat er bij deze release nog
openstond. Dit is dat concept, herschreven — v2.24.0 is de eerste release die in deze repo via
`cut-release` is gecut, en met 54 entries ook veruit de grootste.

`What it is worth` splitst de 54 wijzigingen in de drie dingen die ze werkelijk opleverden: bugs die
bezoekers troffen zonder zichtbaar te zijn (de luisterpagina die als lege shell in de statische HTML
stond, 84 canonicals naar een redirect, een taalsignaal dat de eigen content tegensprak, een mix die
404 gaf), de poortenlaag die er in een week bij kwam (0 → 213 tests, ESLint als echte poort, CI, de
paginatal-ondergrens), en de documentatie die stopte met de machinerie tegen te spreken. Elk van de
drie is in de eenheid geschreven waarin de organisatie hem leest — tijd, risico, afhankelijkheid van
een developer — en niet in het aantal wijzigingen.

`What was still open at this release` staat in de verleden tijd, want een gepubliceerd document
beweegt niet mee: het ene niet-gesloten auditpunt (#68, de 25 Full-mixen op de legacy-bucket, wachtend
op een upload van Dave) plus de twee beslissingen die bewust open zijn gelaten — de PR-grens voor
site-werk nu er deploy previews zijn, en de tweede ruleset zonder bypass uit #91.

Daarnaast is de gegenereerde `For whom`-regel gecorrigeerd. Die beloofde *"consumers of this product,
and colleagues in the organisation -- one section each"* terwijl er maar één sectie is: geen enkele
entry haalde tier 2, wat het script in zijn eigen uitvoer ook meldt. Een kop die een lezer aankondigt
die er niet is, is precies de tegenspraak die deze repo elders opruimt.

### Significance

#### Tier 0

Het document is de enige plek waar staat wat een week auditwerk heeft opgeleverd in plaats van welke
54 dingen er zijn veranderd; de development-note draagt het tweede, niemand het eerste. Voor de
volgende sessie is dit bovendien het eerste voorbeeld van een uitgeschreven audience-document na een
`cut-release`-cut, dus het zet de vorm neer die de volgende cut kan volgen.

**Score:** 3

#### Tier 1

Dit is het document dat voor de organisatie geschreven is — de enige van de drie release-documenten
die niet in per-PR-eenheden praat. Zonder deze twee secties gaat v2.24.0 naar buiten als een lijst van
54 links, en dan is de vraag "wat hebben we hieraan gehad" onbeantwoord in het document dat er
speciaal voor bestaat.

**Score:** 4

### Pull Request

