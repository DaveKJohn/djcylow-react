## `docs/audit-correcties` changelog

### Branch title

Documentatie gelijkgetrokken met de machinerie die er werkelijk staat

### Branch ID

20260815-144049

### Branch type

docs

### What does the change on this branch bring to main?

De documentatie beschreef op een reeks plekken machinerie die er niet meer zo staat. Vier daarvan
waren niet passief-verouderd maar **stuurden de lezer actief de verkeerde kant op**.

**Chris' repo-lens beweerde dat er nul testsuites en geen branch protection waren** (#84). Er staan
vier testbestanden en de ruleset `main-ci-gate` bestaat sinds 2026-08-13. Dat woog het zwaarst van
alles hier: het is de **enige lens die automatisch meelaadt**, én het is het argument waarmee de
PR-grens wordt verantwoord — dus elke sessie woog iemand de merge-beslissing op feiten die niet meer
klopten, terwijl `CLAUDE.md` in een tabel het omgekeerde stelde. De conclusie blijft staan, maar rust
nu op de twee redenen die hem wél dragen: de suite dekt de mix-**data** en niet de vormgeving, en de
ruleset heeft `bypass_actors` waardoor de check voor een admin adviserend blijft.

**`CONTRIBUTING.md` gaf een opdracht tot werk dat al gedaan was, aan een seam die leeg hoort te
blijven** (#85). Het blok beweerde dat de PR-template nog een Nederlandse placeholder droeg en dat
`Get-PrDescriptionPlaceholder` gevuld moest worden op `docs/release-route-naar-script`. Vier
beweringen, alle vier onwaar: de template draagt de canonieke placeholder, het is gerepareerd via de
template-route juist *niet* via die seam, en die branch is gemerged en gefold.

**`scripts/repo-config.ps1` citeerde `CLAUDE.md` voor het tegendeel** (#89). Een comment bij
`Get-ReleaseMajorMinMinors` zei dat een major hier "een volledig redesign of een framework-migratie"
is "en niet een recap van tien minors zoals in de bron" — met bronvermelding, terwijl `CLAUDE.md`
sinds 2026-08-13 exact het omgekeerde zegt. Dat is de tekst waar iemand op terugvalt die die waarde
ooit wil zetten. Ook gecorrigeerd: het testaantal (stond op 36, waren er 71 — nu verwijst het naar
`npx vitest run` in plaats van een getal dat gegarandeerd veroudert) en de reden waarom de CI-check
adviserend is (niet "zonder branch protection", maar door `bypass_actors`).

**Vijftien repo-lenzen verwezen naar een plugin-id dat niet meer bestaat** (#90). Elke lens opende
met *"in `specialists` plugin"*, terwijl dat id gesplitst is in `team-alpha` en `workflow-davekjohn`.
Ze wijzen nu naar het bestand dat er werkelijk staat — en dat is **per lens gecontroleerd**: een
eerste poging zette er `personas/NN-NN-persona.md` neer, en die map bevat er maar vier. De vijftien
met de scaffold-header zijn precies de vijftien **agents**; één dode verwijzing was bijna vervangen
door vijftien.

Verder gelijkgetrokken met wat er staat:

| | was | is |
|---|---|---|
| `src/data/mixes/README.md` | vier plekken schreven een ander titelformaat voor dan de spec zelf eist (#88) | alle vier gelijk aan de vereiste vorm, die alle 77 live titels al volgen |
| idem | `description_en` "waiting on the parked `feature/i18n-setup`" | die branch is **gesloten** en gearchiveerd; hij komt niet vanzelf live |
| `CLAUDE.md`, `CONTRIBUTING.md` | de poort als "`tsc` + build", op drie plekken | drie stappen, met `eslint .` erbij |
| `CLAUDE.md` | "`npm run lint` = ESLint + TypeScript check" | alleen ESLint; de typecheck zit in `lint-web.ps1` |
| `CLAUDE.md` | "`npm run lint` staat nog buiten de poort" | zit er sinds 2026-08-14 in — het document sprak zichzelf drie alinea's verderop tegen |
| `CLAUDE.md` | versienummer en release-notes zijn "handwerk van Rendall" | het script doet ze; handwerk is het audience-concept en de Release |
| `CLAUDE.md` | tellingen van 60 documenten / 37 development | weggehaald — ze verouderen bij elke cut |
| `.github/pull_request_template.md` | "`npm run lint` gedraaid, geen nieuwe fouten" | de poort op 0/0, plus een regel voor de testsuite |

Sluit #84, #85, #87, #88, #89 en #90.

### Significance

#### Tier 0

Vier van deze correcties stuurden actief verkeerd werk aan: een lens die bij elke sessie meelaadt en
de PR-grens verkeerd verantwoordt, een opdracht tot werk aan een lege seam, een bronvermelding naar
het tegendeel, en vijftien verwijzingen naar een plugin die niet bestaat. Dat is duurder dan een
verouderde zin, want het kost iemand een dag aan de verkeerde reparatie.

**Score:** 4

#### Tier 1

N/A — dit raakt uitsluitend documentatie en comments. De build levert dezelfde pagina's.

**Score:** N/A

### Pull Request

