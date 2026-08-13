## `config/testsuite-mixdata-en-node-pin` progress

### Steps

- [x] Eerst gemeten wat de mix-data nu al haalt, in plaats van de veldspec te geloven: 23 regels op 100%,
      7 met echte overtredingen
- [x] Vitest toegevoegd als devDependency, met `npm test` en `npm run test:watch`
- [x] `tests/mix-data.test.ts`: 36 tests, harde asserties voor de 23 en een ratchet voor de 7
- [x] De ratchet in beide richtingen bewezen (te hoog plafond faalt, te laag plafond faalt) voordat de
      baseline werd vastgelegd
- [x] `Get-TestCommands` in `scripts/repo-config.ps1`, met de ASCII-conventie van dat bestand
      gerespecteerd — nagemeten: 0 non-ASCII bytes
- [x] `.nvmrc` op 22, en `ci.yml` haalt de versie daar op via `node-version-file`
- [x] Testsuite als aparte stap in `ci.yml`, met opgeschreven waarom dat hier geen `Invoke-TestSuiteGate`
      is zoals in de bron
- [x] Contract-check: `Get-TestCommands` staat op `[OK]`, en het aantal `[INFO]`-seams blijft 5 — het
      verantwoordingsblok in `repo-config.ps1` hoeft dus niet bij
- [x] Lint-poort gedraaid met de tests erin: 0 fouten, 89 pagina's. `tsconfig.lint.json` includeert
      `**/*.ts`, dus de suite wordt meegetypecheckt
- [~] `image_square` van 25 mixen repareren — laten vallen, en bewust. Dat vraagt echte afbeeldingen en
      werk in `public/`, wat onder de site-uitzondering valt. De suite legt het aantal vast zodat het
      niet kan groeien
- [~] Componenttests — laten vallen voor deze ronde (Dave, 2026-08-13): de mix-data had de hoogste
      waarde per uur, en juist de UI beoordeel jij toch met het oog

### Where I left off

Deze PR raakt `tests/`, `scripts/`, `.github/`, `package.json` en `.nvmrc` — niets in `src/`, `public/`
of `src/data/mixes/`, dus geen zichtbaar resultaat en hij **loopt door**.

**Eén ding wil ik vóór de merge gezien hebben, en daar is de deploy preview voor.** `.nvmrc` verandert de
**live** build, want Netlify leest dat bestand. Bouwt de preview van deze PR groen op Node 22, dan is
mergen bewijsbaar veilig; dat is precies waar een preview-omgeving voor is en het is de eerste keer dat
deze repo hem zo gebruikt.

**Wat hierna nog van punt 3 openstaat:** de ruleset. De bron heeft `main-ci-gate` (actief, target
`~DEFAULT_BRANCH`, regels `deletion` + `non_fast_forward` + required check, met bypass voor Admin en
Maintain). Deze repo heeft er nul. Die komt na deze PR, want pas dan staat de definitieve set checks vast
die required moet worden — de job heet `poort` en heeft er sinds deze branch een teststap in.

**Twee defecten voor Dave, gemeten en niet gerepareerd:**

1. **25 live mixen met een gebroken `image_square`**, zichtbaar op de Music Mood Colours-pagina. De
   exacte lijst rolt uit `npx vitest run` zodra je het plafond in de suite op 0 zet.
2. **25 live mixen op de legacy R2-bucket**, terwijl `src/data/mixes/README.md` beweert dat dit alleen
   `full-blue.json` betreft. Die bewering in de veldspec is dus ook fout.
