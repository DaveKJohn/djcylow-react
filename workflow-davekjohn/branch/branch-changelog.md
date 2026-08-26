## `config/plugin-update-4.20` changelog

### Branch title
Update de specialists-plugin naar v4.20.0, inclusief de rename van workflow-davekjohn naar contributing-davekjohn

### Branch ID
20260827-004457

### Branch type
config

### What does the change on this branch bring to main?
Deze repo draaide op plugin v4.12.0 (`team-alpha`) en had een kapotte `workflow-davekjohn@claude-code-specialists`-installatie: de bron hernoemde dat pluginpakket op 2026-08-26 naar `contributing-davekjohn` (issue #886), waardoor `claude plugin list` voor dit project "Plugin workflow-davekjohn not found in marketplace" meldde op alle geïnstalleerde versies.

Deze branch trekt de installatie recht:
- `workflow-davekjohn@claude-code-specialists` verwijderd (projectscope) en vervangen door `contributing-davekjohn@claude-code-specialists`; `team-alpha@claude-code-specialists` bijgewerkt van 4.12.0 naar 4.20.0. `.claude/settings.json` is automatisch meeveranderd (`enabledPlugins`).
- `scripts/task/shared.ps1` — de standaardwaarde van `-Plugin` stond hardcoded op `workflow-davekjohn`, de nu verwijderde plugin-id. De drie repo-eigen skills (`open-pr`, `fold-changelog`, `park`) roepen dit script altijd zonder `-Plugin` aan, dus liepen ze stil door tegen de oude, niet meer bijgewerkte cache (laatste versie daar: 4.18.0) totdat die cache-map ooit wordt opgeruimd. De default is nu `contributing-davekjohn`.

Gemeten met `check-script-contract.ps1` uit de nieuwe 4.20.0-cache: **0 errors**. De 14 gemelde `[INFO]`-signalen zijn optionele nieuwe seams (o.a. een significance-rubric-override, de hernoemde release-note-roots) met een werkende fallback — geen van alle vereist een wijziging om te blijven werken. De repo-eigen map `workflow-davekjohn/` hoeft niet mee te hernoemen: `Get-WorkflowFolderName` leest zowel de oude als de nieuwe mapnaam, en de check bevestigt dat expliciet ("yours to do when it suits you").

### Significance

#### Tier 0

Zonder deze fix faalden de drie repo-eigen skills die de release-cyclus dragen (`open-pr`, `fold-changelog`, `park`) niet meteen, maar zouden ze bij de eerstvolgende opschoning van de plugin-cache (elke versie ouder dan de nieuwste wordt normaal gesproken op termijn geprund) volledig stukgaan zonder duidelijke oorzaak. Dit repareert de installatie vóór dat gebeurt en haalt de repo bovendien acht patch/minor-versies in.

**Score:** 2

Niet zichtbaar voor de opdrachtgever: dit is interne tooling-hygiëne, geen wijziging aan de site of het proces waarmee die wordt opgeleverd.

**Score:** N/A

### Pull Request
<!-- link to the PR in github when branch is merged to main and the date this happened-->
