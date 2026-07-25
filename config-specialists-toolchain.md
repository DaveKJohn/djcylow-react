### Specialists-toolchain werkend gemaakt

**Branch naam** config/specialists-toolchain
**Datum merge op main**
**Branch type** Config

De specialists-init had een half ingevulde scaffold achtergelaten, waardoor de gedeelde skills
`new-branch`, `check-roster-sync` en `open-pr` in deze repo niet konden draaien. Alle poorten staan
nu groen: `check-script-contract` ging van 3 errors naar 0, `check-roster-sync` van 30 naar 0.

**Script-contract.** `scripts/lib/branch-info.ps1` was een lege scaffold: geen `Test-BranchName`, en
ook de hele prefix-tabel was leeg, waardoor elke changelog-entry `Type = $null` kreeg. De tabel is
nu gevuld met de taxonomie die deze repo werkelijk gebruikt, afgeleid uit de eigen geschiedenis (de
branch-prefixes uit de merge-commits plus de `**Branch type**`-regels in `CHANGELOG.md` en
`releases/development/`): Feature, Fix, Data, Content, Config, Docs, Chore. `scripts/repo-config.ps1`
kreeg de ontbrekende `Get-RosterPath` en `Get-RosterIgnoredIds`.

**Lint-poort.** `Get-LintScript` stond op `VUL-IN`, waardoor `open-pr` hier weigerde te draaien. De
poort is nu `scripts/lint/lint-web.ps1` en checkt `tsc --noEmit`. Die draait tegen een nieuwe
`tsconfig.lint.json` zonder de `.next/types`-includes: die worden door `next build` gegenereerd, dus
een gewone `tsc` hangt af van hoe vers de build-output toevallig is. Een build van een andere branch
liet hier stale route-types achter die als fouten binnenkwamen terwijl de broncode schoon is.

ESLint zit bewust nog niet in de poort. `npm run lint` meldt op dit moment 37 errors over 22
bestanden in de bestaande codebase, grotendeels `ban-ts-comment`, `no-require-imports` (in de
Node-scripts, waar CommonJS legitiem is) en `no-explicit-any`. Als poort zou dat vandaag elke PR
blokkeren op werk dat niets met die PR te maken heeft. De schoonmaak is een eigen branch; het
TODO-blok in `lint-web.ps1` markeert waar de stap dan bij komt.

**Lens-pad rechtgezet.** De 16 repo-lenzen stonden op
`.claude/plugins/davekjohns-workshop/specialists/`, met de marketplace-naam als map. `check-roster-sync`
zoekt ze op `.claude/plugins/claude-specialists/<plugin>/` — het pad dat life-hub ook gebruikt — en kon
hier dus nooit iets vinden. Ze zijn verplaatst; de `@`-import in `CLAUDE.md` wees mee.

**Roster.** `CLAUDE.md` had helemaal geen specialisten-tabel, waardoor alle 15 agents als drift
werden gemeld. Er staat nu een roster met alle 19 specialisten (4 personas + 15 subagents),
toegespitst op deze repo. De drie ontbrekende lenzen (Nolan 06-25, Marlowe 06-29, Auden 06-30) zijn
als scaffold aangemaakt via de `sync-roster`-skill; de lens van Sebastian (06-23) droeg nog de
verouderde naam "Sean" in de header en is naar de naamloze, hernoem-bestendige vorm gebracht.

**Governance.** Er was geen actieve `.claude/settings.json` — alleen een nooit toegepast voorstel.
De deny-regels voor destructieve git-acties staan nu actief, inclusief `PowerShell(...)`-varianten:
`settings.local.json` allowt `PowerShell(git *)` breed, dus met alleen de `Bash(...)`-regels bleef er
een gat open. De hook-stub uit het voorstel is weggelaten (die wees naar een niet-bestaand script);
`.claude/settings.suggested.jsonc` is daarmee afgehandeld en verwijderd.
