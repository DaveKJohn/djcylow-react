### Chore-prefix voor changelog fold-commits
**Branch naam** docs/fold-commit-chore-prefix
**Datum merge op main** 2026-07-02
**Branch type** Docs

De changelog fold-commit (stap 7 in de release-workflow) gebruikte de `docs:` prefix, terwijl
`docs` bedoeld is voor echte documentatie-inhoud (README's e.d.). Het schoonmaken van
`CHANGELOG.md` na een merge is een aparte, routinematige housekeeping-actie. Beide
workflow-bestanden (`workflow-CLAUDE.md` en `workflow-HUMAN.md`) gebruiken nu `chore:` voor deze
fold-commit.