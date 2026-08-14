## `config/eslint-in-de-poort` progress

### Steps

- [x] ESLint als tweede stap in `lint-web.ps1`, tussen `tsc` en de build
- [x] Warnings tellen en melden zonder te blokkeren (defensieve regex, net als het paginatal)
- [x] Header van het script herschreven: wat hij checkt, en waarom ESLint er eerst níet in zat
- [~] Geen `2>&1` bij de eslint-aanroep — bewust, om dezelfde reden als bij de build: PS 5.1 wikkelt
      stderr van een native commando in ErrorRecords en begraaft de echte melding
- [x] **Getoetst dat de poort blokkeert**: tijdelijk bestand met één `any` → exit 1 met de fout
      erbij; bestand daarna verwijderd en de poort weer groen geverifieerd
- [x] CI: alleen de stapnaam bijgewerkt — `ci.yml` roept het script aan, dus ESLint liftte mee
- [x] Docs bijgewerkt op vier plekken: `CLAUDE.md` (3×), `CONTRIBUTING.md`, `repo-config.ps1`
- [x] Duplicaat in de scriptheader opgeruimd en de `-SkipBuild`-beschrijving gecorrigeerd (die
      beweerde "alleen de typecheck", terwijl ESLint nu ook doorloopt)
- [x] Poort groen: tsc + eslint (0 errors, 8 warnings) + build (89 pagina's), en 36 tests

### Where I left off

De branch is af, en daarmee de hele reeks van 2026-08-14: **37 → 0 ESLint-errors in vier branches**,
met de poort dicht als sluitstuk.

| # | branch | resultaat |
|---|---|---|
| 1 | `config/eslint-node-overrides` (#35) | 37 → 27 — CommonJS-override voor Node-scripts |
| 2 | `config/overbodige-ts-ignores` (#36) | 27 → 13 — zestien overbodige `@ts-ignore`'s |
| 3 | `fix/react-hooks-en-types` (#37) | 13 → 0 — hooks, types, JSX-entities |
| 4 | deze branch | de poort dicht, aantoonbaar blokkerend |

**Wat open blijft staan, bewust:**

- **8 warnings**, waarvan 2× `next/no-img-element` in `Hero`. Die vragen een afweging over
  `next/image` bij `unoptimized: true` — een ontwerpbeslissing van Dave, geen opruimwerk.
- **Het testgat**: de suite dekt uitsluitend mix-data. Er is geen enkele componenttest, dus de
  audioplayer, de mobiele drawer en de e-mail-hydration worden door geen test bewaakt. De hooks-
  refactor van #37 is daarom op de deploy preview beoordeeld en niet door een suite.
- **`EmailDisplay` beschermt een adres dat er los naast staat**: `info@djcylow.com` staat letterlijk
  in de contactformulier-tekst op zes pagina's. De anti-scraping werkt zoals bedoeld, maar het adres
  lekt er drie regels hoger gewoon uit. Zichtbare content, dus Dave's beslissing.

