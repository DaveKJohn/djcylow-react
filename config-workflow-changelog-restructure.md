### Workflow gesplitst: workflow/ map + per-branch changelog entries
**Branch naam** config/workflow-changelog-restructure
**Datum merge op main** 2026-07-02
**Branch type** Config

`CLAUDE.md` opgesplitst naar het voorbeeld van de smartwatchbanden-repo: het bestand is nu dun en laadt `workflow/workflow-CLAUDE.md` (volledige technische werkwijze) in via `@workflow/workflow-CLAUDE.md`; `workflow/workflow-HUMAN.md` beschrijft dezelfde workflow voor handmatige uitvoering. Project-specifieke referentie (Quick Reference, Mix JSON Rules) blijft in `CLAUDE.md`. De `[Unreleased]`-sectie van `CHANGELOG.md` wordt niet langer direct op een branch bewerkt — elke branch schrijft nu een eigen entry-bestand (`<branch-naam>.md` in de repo-root, gescaffold via `scripts/release/new-changelog-entry.ps1`), dat na de merge met `scripts/release/fold-changelog-entry.ps1` in `[Unreleased]` gevouwen en verwijderd wordt. Dit voorkomt merge-conflicten op `[Unreleased]` bij lang-openstaande branches. Beide scripts zijn getest op een scratch-kopie van `CHANGELOG.md`.
