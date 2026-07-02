### Workflow-inconsistenties gecorrigeerd
**Branch naam** docs/workflow-inconsistencies
**Datum merge op main** 2026-07-02
**Branch type** Docs

Drie inconsistenties tussen `workflow-CLAUDE.md`, `workflow-HUMAN.md` en `releases/README.md`
gecorrigeerd:
1. De release-branch werd omschreven als "directe main-commit", terwijl het feitelijk een branch
   is die bewust zonder Pull Request mergt (`git merge --no-ff`) — nu expliciet gedocumenteerd als
   bewuste 3e uitzondering op de PR-regel, in plaats van gelijkgesteld aan de fold-commit.
2. De versienummer-tabel in `workflow-CLAUDE.md` miste Style/CSS-wijzigingen volledig, terwijl
   `releases/README.md` die al wel als PATCH classificeerde — nu toegevoegd (PATCH voor kleine
   correcties, MINOR voor grote herzieningen).
3. Verwijzingen naar `CLAUDE.md` voor de Release Workflow-stappen in `releases/README.md` wezen
   niet naar het daadwerkelijke bestand `workflow/workflow-CLAUDE.md` — nu gecorrigeerd met een
   directe link.