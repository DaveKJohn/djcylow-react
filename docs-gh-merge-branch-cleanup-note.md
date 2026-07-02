### Workflow-fix: git checkout main voor gh pr merge --delete-branch
**Branch naam** docs/gh-merge-branch-cleanup-note
**Datum merge op main** 2026-07-02
**Branch type** Docs

Bij het mergen van PR #1 bleef de lokale branch `config/github-pr-workflow` bestaan ondanks `gh pr merge --delete-branch`, omdat die branch op dat moment nog actief was uitgecheckt (git laat de huidige branch niet lokaal verwijderen). `workflow/workflow-CLAUDE.md` en `workflow/workflow-HUMAN.md` bijgewerkt: eerst `git checkout main` voor `gh pr merge`, plus een expliciete controle/opruim-stap (`git branch -d [branch]`) als fallback.