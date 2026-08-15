## `config/permissions-die-meereizen` changelog

### Branch title

De gevaarlijke handelingen staan nu in de gedeelde permissions, niet alleen in het gitignorede bestand

### Branch type

config

### What does the change on this branch bring to main?

Issue #63 wees op gevaarlijke `allow`-regels in `.claude/settings.local.json`: 89 regels, waaronder
`git push *`, `PowerShell(git *)`, `gh api *` en `gh release *`. Bij het aanpakken bleek de kern van
het probleem een andere te zijn dan het weghalen van die regels, en dat is wat hier is opgelost.

**Dat bestand is gitignored.** Het reist niet mee, het geldt alleen op deze machine, en niets in de
repo kan eraan tornen — een reparatie daar is dus geen reparatie van de repo maar van één werkplek,
en hij is morgen op een tweede machine weer weg. De laag die wél meereist is
`.claude/settings.json`, en daar winnen `deny` en `ask` van een `allow` uit het lokale bestand.
**Dat is geen aanname**: de `ask`-regels voor `netlify.toml` hebben in deze repo in de praktijk
gevraagd terwijl `Edit` breed was toegestaan.

Dus staat het gevaar nu daar. Nieuw op de `ask`-lijst: `git push origin main` en
`git push origin HEAD:…`, `gh api` met een schrijvende methode (`-X` / `--method`),
`gh release create` en `delete`, `gh repo edit`, `gh ruleset` en `git config` — elk in beide vormen,
want `Bash(...)` en `PowerShell(...)` zijn aparte regels. `gh repo delete` staat op **deny**: dat is
de enige in de rij die niet terug te draaien is. De keuze voor `ask` boven `deny` is dezelfde als
bij `netlify.toml`: `deny` maakt een legitieme handeling onmogelijk in plaats van bewust, en de
safety-rule zegt dat Dave's woord nodig is — niet dat het onbereikbaar moet zijn. `cut-release`
pusht zelf naar `main`, en die draait alleen op Dave's verzoek; een prompt is daar precies goed.

**Er staat een eerlijke grens bij in `CLAUDE.md`, en die is het halve punt van deze branch.** Het
lokale bestand staat ook `Bash(node *)` en `Bash(python -c ' *)` toe, en daarmee is élke regel
hierboven te omzeilen: `node -e "require('child_process').execSync('…')"` valt onder geen van deze
patronen. Deze lijst beschermt tegen een **vergissing**, niet tegen opzet. Dat maakt hem niet
waardeloos — bijna alles wat hier ooit is misgegaan was een vergissing — maar wie hem leest als
sluitende afscherming leest hem verkeerd, en een lijst die meer belooft dan hij waarmaakt is
gevaarlijker dan geen lijst. Dat staat er nu bij, samen met het ene geval dat de patronen niet
kunnen vangen: een kale `git push` terwijl je op `main` staat, waar geen argument is om op te
matchen.

Het lokale bestand zelf is bewust **niet** opgeschoond. De `ask`-regels overrulen de gevaarlijke
`allow`-regels toch al, dus het weghalen ervan verandert het gedrag niet — het zou alleen de kans
vergroten dat een lopende sessie halverwege op een prompt stuit voor iets onschuldigs.

### Significance

#### Tier 0

De bescherming stond op de verkeerde plek: in een bestand dat niet meereist, terwijl de safety-rules
die hij hoort af te dwingen wél meereizen. Op een tweede machine, of na een verse checkout, gold er
niets. Nu wel.

**Score:** 3

#### Tier 1

Geen zichtbaar effect op de site. Wat het waard is, is dat een per ongeluk uitgevoerde push naar
`main` — dus een ongevraagde deploy naar `djcylow.com` — nu eerst vraagt.

**Score:** 2

### Pull Request

