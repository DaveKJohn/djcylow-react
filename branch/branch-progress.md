## `docs/entry-model-migratie` progress

### Steps

- [x] Rendall: pariteit `## Releases` vs `releases/README.md` gecontroleerd — 37 versies aan beide kanten, zelfde datum, type en linkdoel; de README heeft daarnaast een titelkolom
- [x] Rendall: `## Pull Requests` weggehaald en entry #24 gepromoveerd naar `##`
- [x] Rendall: `## Releases` en de 37 pointers weggehaald
- [x] Rendall: de intro van `CHANGELOG.md` herschreven naar het platte model
- [x] Rendall: `releases/README.md` stap 2/5/6 bijgewerkt (dubbele boekhouding vervallen, twee dode links naar `workflow/workflow-CLAUDE.md` hersteld)
- [x] Verificatie: `Get-PreFlatChangelogRefusal` geeft geen weigering meer; entry #24 leest terug als type `Config`
- [x] Tessa: `CLAUDE.md` stap 3 herschreven (het `branch/`-model, zes secties, Significance/Tier)
- [x] Tessa: `CLAUDE.md` stap 4 bijgewerkt (de vier `open-pr`-gates, PR-titel uit de entry)
- [x] Tessa: `CLAUDE.md` stap 7 bijgewerkt (fold reset i.p.v. verwijdert, `fold:` als commit-type)
- [x] Tessa: Release Workflow stap 5/7/8 bijgewerkt (dubbele boekhouding vervalt)
- [x] Tessa: de Engelse-kopjes-uitzondering vastgelegd in de Taal-sectie
- [x] Edith: de volledige diff nagelopen op taal, consistentie en dode links
- [x] Edith-bevindingen verwerkt: het kop-formaat van de release-note in beide documenten rechtgezet, `gefoldde` → `gefolde`, `óntbrekende` → `ontbrekende`, `rubriek` → `schaal`, `-Title` genuanceerd
- [x] Chris: de kop van een gefolde entry noemt de branch, niet de wijziging — vastgelegd in stap 3 en Release Workflow stap 5
- [x] De entry (`branch/branch-changelog.md`) ingevuld: body en alle drie de tiers
- [x] Poorten nagemeten: scaffold-gate en impact-gate melden niets; tier 0 → 5, tier 1 → 4, tier 2 → `N/A`, reach tier 1
- [x] Lint-poort gedraaid (`scripts/lint/lint-web.ps1`) — 0 fouten, build geslaagd, 89 statische pagina's
- [x] Committen en pushen
- [~] `.github/pull_request_template.md` bijwerken — buiten scope gehouden op Dave's woord; regel 2 matcht de placeholder niet, regel 17-18 noemen het oude model
- [~] `Get-MojibakePaths` in `scripts/repo-config.ps1` definiëren — buiten scope; zonder die functie bereikt `fix-mojibake` de nieuwe `branch/`-map niet
- [~] `Get-EntryGuidanceOverrides` voor de `Branch type`-hint — buiten scope; de template noemt `feat, fix or docs` terwijl deze repo zeven typen kent

### Where I left off

Branch is af en gepusht. Er is géén PR geopend — dat wacht op Dave's woord.

Drie punten zijn bewust laten vervallen (`- [~]`) omdat ze buiten de afgesproken scope vielen; ze
staan in de afronding aan Dave genoemd.
