### merge: prefix voor merge-commits
**Branch naam** docs/merge-commit-prefix
**Datum merge op main** 2026-07-02
**Branch type** Docs

Merge-commits waren de enige plek in de git-geschiedenis zonder type-prefix (`chore:`, `fix:`,
`docs:`, etc.). `gh pr merge --subject` en `git merge -m` gebruiken nu een `merge:` prefix
(`merge: [branch] (#PR-nummer)` voor PR-merges, `merge: [branch] — v<versie>` voor de
release-branch), consistent met de rest van de geschiedenis.