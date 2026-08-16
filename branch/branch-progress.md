## `docs/wat-de-eerste-release-run-mat` progress

### Steps

- [x] Testaantal opnieuw meten in plaats van uit de handover overnemen (`npm test`, Vitest 4.1.10:
      zestien suites, 213 tests, 19s)
- [x] `CLAUDE.md` — de `tests/`-bullet draagt het gemeten aantal, de opsomming is compleet en
      gegroepeerd, met een correctienoot in de vorm die de rest van het bestand aanhoudt
- [x] `CLAUDE.md` — de pijler-tabel bij de PR-default noemt hetzelfde aantal (tweede plek met het oude
      getal)
- [x] De drie legs van de v2.24.0-run nameten uit de git-timestamps en `gh release view v2.24.0`, zodat
      de release-lessen niet op de herinnering van één avond leunen
- [x] `CLAUDE.md` — de Release Workflow draagt wat de eerste echte run kostte, de
      `Required status check "poort" is expected`-melding, en waarom `-NoPush` bij een grote cut loont
- [x] `releases/audience/2.x/2.24.0.md` — de tweede timing-pass die de checklist voorschrijft
- [x] Lint-poort groen (`scripts/lint/lint-web.ps1`)

### Where I left off

Het werk is af. Wat er ná de merge nog te doen is, en dus bewust geen stap hierboven:

- **`main` liep bij het aftakken één commit vóór op `origin`** — de fold van #143 (`ebca570`). Die
  commit reist mee naar `origin` zodra de PR van deze branch gemerged wordt. Structureel gevolg van de
  fold-uitzondering, geen incident; pushen naar `origin/main` blijft Dave's initiatief.
- **`strict_required_status_checks_policy` staat op `true`**, dus als `main` intussen is opgeschoven
  vraagt GitHub eerst een `Update branch` vóór de merge.
- **Bijvangst voor later, niet in deze branch:** `cut-release.ps1` schrijft in het audience-concept de
  vaste regel *"consumers of this product, and colleagues in the organisation -- one section each"*
  terwijl het zelf meldt dat geen entry tier 2 haalde en de consumer-sectie terecht weglaat. Kandidaat
  voor een `inbound`-issue in de bron — eerst checken of die daar al ligt.
