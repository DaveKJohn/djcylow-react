### GitHub Pull Requests toegevoegd aan de workflow
**Branch naam** config/github-pr-workflow
**Datum merge op main** 2026-07-02
**Branch type** Config

`.github/pull_request_template.md` herschreven voor djcylow-react (de Shopify-checklist van smartwatchbanden vervangen door lint/dev-server/afbeeldingen/bilingual-strings/changelog-entry checks). Workflow uitgebreid met een PR-stap tussen "ontwikkelen" en "mergen": branch pushen + `gh pr create --fill` mag zelfstandig (ship niets naar productie), maar de daadwerkelijke merge (`gh pr merge --merge --delete-branch`) blijft wachten op expliciete goedkeuring, net als voorheen. `workflow/workflow-CLAUDE.md` en `workflow/workflow-HUMAN.md` bijgewerkt met de nieuwe stappenvolgorde.