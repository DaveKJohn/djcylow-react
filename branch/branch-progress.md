## `config/lokale-workflow-skills` progress

### Steps

- [x] Vastgesteld welke acht skills `disable-model-invocation` dragen en waarom (bron, PR #155)
- [x] `scripts/task/shared.ps1`: lost de hoogste pluginversie op en draait het gedeelde origineel
- [x] Versiesortering op `[version]` i.p.v. tekst — anders wint `3.9.0` van `3.10.0`
- [x] Exitcode gerepareerd: geslaagde run meldde 255 door een blijven staande `LASTEXITCODE`
- [x] `.claude/skills/open-pr`, `fold-changelog` en `park` aangemaakt
- [x] `cut-release` en `ship-pr` bewust overgeslagen, met de reden in beide documenten
- [x] `--`-scheiding uit de documentatie gehaald nadat die aantoonbaar faalde
- [x] Padresolutie, foutpad en exitcode getoetst tegen de echte cache
- [x] Keuze en afweging geborgd in `CLAUDE.md`, niet alleen in de skillbestanden
- [x] Lint-poort groen

### Where I left off

Klaar voor PR. Let op: de drie nieuwe skills worden pas zichtbaar **na een herstart van de
sessie** — `/reload-plugins` en `/reload-skills` laden alleen de al geladen set opnieuw, en dat
geldt ook voor een nieuw project-skillbestand. Dat staat zo in `INSTALL.md` van de plugin.

Deze branch is zelf de reden dat hij bestaat: hij kon niet via `open-pr` naar buiten, want die
skill was nog niet aan te roepen. Na de herstart is dat voor elke volgende branch wel het geval.

