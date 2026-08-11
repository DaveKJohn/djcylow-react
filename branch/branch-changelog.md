## `docs/entry-model-migratie` changelog

### Branch title

Changelog en werkwijze op het platte entry-model

### Branch ID

20260811-214145

### Branch type

docs

### What does the change on this branch bring to main?

`CHANGELOG.md` staat op het platte model dat de gedeelde workflow-scripts sinds
`workflow-davekjohn@4.x` lezen, en `CLAUDE.md` beschrijft weer de werkwijze die er feitelijk draait.

**De eerstvolgende fold zou geweigerd hebben.** Het nieuwe model leest elke `##`-kop onder de intro
als één wijziging; `Get-PreFlatChangelogRefusal` noemt `## Pull Requests` en `## Releases` letterlijk
als het patroon dat fout gaat, en die weigering is hard aangesloten (`exit 1` in
`fold-changelog-entry.ps1`, `throw` in `release-lib.ps1`). Beide koppen stonden hier. De secties zijn
weg, de ene bestaande entry is naar `##` gepromoveerd — hij blijft leesbaar omdat `Resolve-EntryType`
terugvalt op het type in de kop — en de weigering geeft nu een lege string terug.

De 37 versie-pointers onder `## Releases` zijn vervallen omdat ze een armere kopie waren:
`releases/README.md` heeft dezelfde 37 versies, met dezelfde link, plus datum, type en een
samenvattende regel per versie. Daarmee verdwijnt ook de dubbele boekhouding uit de Release Workflow
— een cut leegt `CHANGELOG.md` terug tot zijn intro, en `releases/README.md` is de enige plek waar
uitgebrachte versies worden bijgehouden.

In `CLAUDE.md` is bijgewerkt wat sinds de plugin-migratie niet meer klopte: het changelog-entry is
geen los bestand meer in de repo-root maar het paar `branch/branch-changelog.md` en
`branch/branch-progress.md` met zes vaste secties; `Significance` is een verplicht drieledig
tier-model met een schaal van 1 tot 5; `open-pr` draait vier poorten vóór de lint-poort en stelt de
PR-titel samen uit de entry in plaats van hem mee te krijgen; de fold reset de twee bestanden in
plaats van er één te verwijderen en commit zelf.

Twee beslissingen zijn hierbij vastgelegd in plaats van impliciet gelaten. **`fold:` is de erkende
commit-prefix** voor de fold-commit, als met naam genoemde uitzondering op de regel dat
changelog-bookkeeping `chore:` is: het gedeelde script schrijft die prefix zelf, en `merge:` en
`fold:` zijn één beweging in twee commits. En **de zes sectiekopjes blijven Engels** in een verder
Nederlands document, omdat vier scripts het over die sleutels eens moeten zijn — vertaal je ze, dan
kan de eigen fold de eigen entry niet meer lezen.

De skill `ship-pr` staat expliciet als niet-gebruikt genoteerd. Hij mergt in één run, en een merge is
in deze repo een deploy die apart op Dave's woord wacht.

### Significance

#### Tier 0

De blokkade zat op de weg: elke volgende fold in deze repo zou geweigerd hebben zonder iets te
wijzigen, en de foutmelding wijst naar een migratie die iemand met de hand moet uitvoeren. Die is nu
gedaan. Daarbovenop verandert de manier van werken wezenlijk — twee vaste bestanden in plaats van
één in de repo-root, een verplicht tier-model, en vier poorten die een PR tegenhouden. Wie hier de
volgende branch begint moet dat weten, en kan het nu lezen in plaats van het bij de eerste weigering
te ontdekken.

**Score:** 5

#### Tier 1

Een collega die aan dit project meewerkt volgt dezelfde werkwijze, en die stond tot nu toe fout
beschreven: `CLAUDE.md` beschreef een entry-bestand en een fold-commit die geen van beide nog
bestonden. De documentatie loopt weer gelijk met de scripts, inclusief wat de poorten weigeren en
waarom. Geen actie vereist, wel merkbaar zodra iemand een branch begint.

**Score:** 4

#### Tier 2

Een bezoeker van djcylow.com merkt hier niets van. Er is geen regel applicatiecode, styling, content
of mix-data aangeraakt; de wijziging zit volledig in de documentatie en de changelog-boekhouding van
de repo.

**Score:** N/A

### Pull Request
