### Van `specialists` naar `team-alpha` + `workflow-davekjohn` · Config · 2026-08-12

De specialists-plugin heette in de bron niet meer zoals deze repo hem aanriep. `claude plugin list`
meldde `specialists@claude-code-specialists` als **failed to load — Plugin specialists not found in
marketplace**: de bron is sinds v4.0.0 gesplitst in *teams* (wie de specialisten zijn) en *workflows*
(hoe werk door een repo beweegt), en `specialists` bestaat als id niet meer. Deze repo stond nog op
v3.2.0, geïnstalleerd op 2026-08-03; de marketplace-clone liep zestien commits achter.

Wat er is gebeurd:

- **De marketplace bijgewerkt** naar `afed1b1`, gelijk met `origin/main` van de bron — **v4.5.0**
  plus 42 commits.
- **`.claude/settings.json`** — `specialists@claude-code-specialists` eruit,
  `team-alpha@claude-code-specialists` (de kernploeg) en `workflow-davekjohn@claude-code-specialists`
  (het branch-, changelog- en release-model) erin, beide op v4.5.0 met `--scope project`.
  `workflow-davekjohn` is geen nieuwe keuze maar dezelfde: `CLAUDE.md` beschrijft dat model al woord
  voor woord, inclusief de vijf skills die het meebrengt.
- **De `@`-import van Chris' body herstelt** in `.claude/specialists/SPECIALISTS.md`. Die wees naar
  `plugins/specialists/personas/01-01-persona.md` — een pad dat met de splitsing verdween. Nu:
  `plugins/teams/team-alpha/personas/01-01-persona.md`. Dit is de stille breuk van de twee: Claude
  Code laat een `@`-import die het niet kan vinden zonder één woord vallen, dus het roster rendert
  normaal terwijl de orchestrator zonder zijn ritueel en zijn routeringsregels draait.
- **Hetzelfde pad in vier lenzen** (`01-01`, `03-02`, `05-05`, `05-06`) meegecorrigeerd. Dat zijn
  prozaverwijzingen in de kop, geen imports, dus die faalden niet — ze wezen alleen de weg naar een
  map die er niet meer is.

Wat hierna nog moet, en waarom het hier niet kon:

- **Een sessie-herstart**, gevolgd door `specialists-init` (additief; overschrijft niets). Een
  herstart kan een specialist niet zelf uitvoeren.
- **`CLAUDE.md` volgt in een eigen beweging.** `workflow-davekjohn@4.x` verplaatst het changelog
  entry-bestand van de repo-root (`<branch-naam>.md`) naar `branch/branch-changelog.md` plus
  `branch/branch-progress.md`, en `scripts/release/new-changelog-entry.ps1` is vervangen door
  `scripts/task/new-branch.ps1`. Dat raakt stap 3 en stap 7 van de ontwikkelworkflow — een
  inhoudelijke wijziging van de werkwijze, niet iets om ongemerkt mee te nemen in een config-commit.
  Deze branch houdt zich daarom nog aan het root-model.

Als [inbound #612](https://github.com/DaveKJohn/claude-code-specialists/issues/612) naar de bron
gestuurd: de migratiehandleiding daar noemde één oud pad voor de `@`-import, en dat is niet het pad dat
`specialists@3.2.0` shipte. Wie zijn eigen regel in die tabel niet terugvindt, concludeert redelijkerwijs
dat de reparatie niet voor hem geldt — precies bij de stap die stil faalt. **Dat issue is op 2026-08-12
gesloten en de reparatie zit in v4.5.0**: `INSTALL.md` noemt nu beide oude padvormen, geeft een vormtest
voor wie geen van beide terugvindt, en zegt met zoveel woorden dat een niet-gevonden regel geen bewijs is
dat de reparatie niet van jou is. Dit is dus de eerste keer dat de inbound-route rond is — de
verbetering is in de bron gebouwd en komt via de plugin-update hier terug.
