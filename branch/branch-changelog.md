## `docs/release-route-volgt-de-bron` changelog

### Branch title

De release-route draait via cut-release, zoals de bron

### Branch ID

20260813-231530

### Branch type

docs

### What does the change on this branch bring to main?

Drie beslissingen van Dave zijn hiermee in de documentatie geland, en samen halen ze de release-route
van deze repo gelijk met de bron. De doorslaggevende: **`cut-release` moet hier draaien.** De repo is
daarom om het script heen gebogen in plaats van andersom.

**De release-branch is afgeschaft.** Uitzondering 2 op "nooit direct op `main`" was een
`docs/release-v<versie>`-branch met een scope-lijstje, gemerged via een kale `git merge --no-ff`. Dat
botste met het script: `cut-release.ps1` doet géén `git checkout main` maar commit op de branch waar je
op staat, dus vanaf een release-branch landde de commit daar terwijl de push naar `main` ging. De bron
heeft die branch niet en noemt dat expliciet *"deliberately no branch/PR — just like the fold"*.
Uitzondering 2 is nu de **release-commit** zelf, met de reden erbij die Dave in de bron gaf: *"aan het
product zelf verandert verder niks"* — een release herpubliceert wat al gemerged is, dus er is geen diff
om te beoordelen. En omdat het script met `git add -A` stageert, kan die uitzondering geen
bestandslijstje dragen zoals de fold; in plaats daarvan is de voorwaarde hard: **schone tree vóór de
cut**.

**De vijftien handmatige stappen zijn wat het script niet doet.** Een tabel bij de kop wijst aan wie wat
doet, en de route eronder is teruggebracht tot zeven punten: op `main` staan met een schone tree, niets
ongefold laten wachten, het script draaien, het audience-concept herschrijven, de aankondiging schrijven,
de GitHub Release maken en de bijlagen uploaden. Wat het script al deed staat eronder als noten, met hun
valkuilen — waaronder dat de development-note de **branchnaam** als kop houdt.

**De versienummertabel is vervangen door de tier-regel.** De tabel hing de bump aan de sóórt wijziging
(docs op patch, nieuwe mix op minor); de poort hangt hem aan de **tier** van de wachtende entries. Die
twee gaven op hetzelfde werk verschillende antwoorden, aantoonbaar bij v2.23.0: als minor gecut omdat
drie entries tier 1 droegen, terwijl de tabel dat docs- en datawerk op patch zette. Nu geldt: alleen
tier 0 is een patch, tier 1 of hoger een minor, en een major vraagt tien minors in de huidige
major-lijn. Deze repo blijft op **audience-tier 1**, dus een minor schrijft de note zonder
*For consumers*-sectie.

**En de stand van de vier pijlers is bijgewerkt in plaats van geschat.** Lint, CI, testsuite en branch
protection staan nu alle vier. Toch blijft site-werk op Dave's woord wachten, en de twee redenen daarvoor
staan er nu expliciet: geen poort kan bewijzen dat een pagina er góéd uitziet, en de ruleset heeft
`bypass_actors` voor Admin en Maintain — wat **moet**, anders blokkeert hij `cut-release`'s eigen push.
Voor een admin is de required check dus adviserend.

Meegenomen: `releases/README.md` zei nog dat de drie documenten hier met de hand worden geschreven en
kondigde deze branch aan als toekomstig werk; dat is bijgewerkt. En daar is één tegenspraak bij
opgeschreven die geen diff kan vinden: de gespiegelde helft van die pagina zegt *"this repo answers 2"*,
verbatim uit de bron waar "this repo" de bron zélf is, terwijl deze repo op tier 1 staat. Een
gespiegelde zin met de woorden "this repo" erin houdt niet op te bestaan bij het kopiëren — hij wordt
onwaar, en beide kopieën blijven byte-identiek.

### Significance

#### Tier 0

De release-route is niet langer een handmatige beschrijving naast een script dat iets anders doet. Wie
een release cut, leest nu wat er werkelijk gebeurt: waar hij moet staan, wat het script overneemt, en
waarom er geen branch meer is. De versieregel is bovendien van proza dat niets tegenhoudt veranderd in
dezelfde regel die de poort al afdwong.

**Score:** 4

#### Tier 1

De versienummers van deze repo gaan vanaf nu meebewegen met wie een wijziging merkt in plaats van met
hoe de wijziging heet, en dat is precies wat een versienummer aan een opdrachtgever hoort te vertellen.
Daarnaast staat nu zwart op wit waarom site-werk op Dave blijft wachten ook nu alle vier de poorten er
staan.

**Score:** 3

### Pull Request

