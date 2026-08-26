## `config/plugin-update-4.20` progress

### Steps

#### PLAN
- [x] Vaststellen waarom `workflow-davekjohn@claude-code-specialists` "failed to load" meldde -- de bron hernoemde het pluginpakket naar `contributing-davekjohn` op 2026-08-26 (issue #886)
- [x] Gecontroleerd of de repo-eigen map `workflow-davekjohn/` mee moet hernoemen -- nee, `Get-WorkflowFolderName` leest beide namen; blijft `workflow-davekjohn/`

#### CREATE
- [x] `workflow-davekjohn@claude-code-specialists` verwijderd (projectscope) en `contributing-davekjohn@claude-code-specialists` geïnstalleerd
- [x] `team-alpha@claude-code-specialists` bijgewerkt van 4.12.0 naar 4.20.0 (projectscope)
- [x] `.claude/settings.json` geverifieerd -- `enabledPlugins` is door de plugin-manager zelf al bijgewerkt
- [x] `scripts/task/shared.ps1` -- default `-Plugin` van `workflow-davekjohn` naar `contributing-davekjohn`

#### TEST
- [x] `check-script-contract.ps1` uit de nieuwe 4.20.0-cache gedraaid tegen deze repo: 0 errors, 14 optionele info-signalen (allemaal met werkende fallback, geen actie vereist)
- [x] `scripts/task/shared.ps1 -Script sync/check-script-contract.ps1` gedraaid om te bevestigen dat het pad-resolutiemechanisme zelf weer naar de juiste (nieuwste) plugin-cache wijst

### Where I left off
Klaar. De pluginversie is bijgewerkt en de kapotte installatie is gerepareerd. De sessie zelf draait nog
op de oude, vóór-update plugin-state (skills/hooks laden pas na een herstart van Claude Code) -- de
nieuwe `new-branch`/`adopt-config`-skills uit `contributing-davekjohn` worden pas na een herstart
zichtbaar. De 14 optionele nieuwe seams in `scripts/repo-config.ps1` (o.a. de significance-rubric,
de hernoemde release-note-roots) zijn bewust niet ingevuld -- ze hebben een werkende default en zijn
losstaand vervolgwerk, geen onderdeel van deze branch.
