# Changelog

De belangrijkste wijzigingen aan deze repo kort bijgehouden. Één regel per noemenswaardige wijziging.

## Hoe dit werkt

- **`## [Unreleased]`** — wijzigingen die al in `main` zitten maar nog niet live zijn. Dit blok vult zich met elke branch die naar `main` wordt gemergd, en blijft staan tot de eerstvolgende live-push.
- **`## [vX.Y.Z] - YYYY-MM-DD — Patch/Minor/Major`** — op die datum live gegaan via een push naar het live thema. De volledige uitwerking staat in `releases/development/X.Y/X.Y.Z.md`.

De bovenste uitgebrachte versie draagt de markering **← LIVE**: dat is de versie die op dit moment op het live thema staat. Bij elke live-push verschuift die markering naar de nieuwe versie.

### Levenscyclus van een regel

`CHANGELOG.md` zelf wordt **nooit direct bewerkt op een branch** — dat gaf bij lang-openstaande
branches merge-conflicten, omdat elke branch hetzelfde `[Unreleased]`-blok aanpaste. In plaats
daarvan schrijft elke branch zijn eigen entry-bestand; volledige uitleg staat in
[`workflow/workflow-CLAUDE.md`](workflow/workflow-CLAUDE.md).

1. **Op een branch** maak je een eigen entry-bestand `<branch-naam-met-koppeltekens>.md` in de
   repo-root aan (via de gedeelde `new-branch`-skill, die branch en entry in één stap neerzet), met
   dezelfde inhoud die vroeger direct in `[Unreleased]` ging. Een branch mag gerust weken geparkeerd
   blijven — er is niets om over te conflicteren.
2. **Branch klaar en goedgekeurd** → merge naar `main`, branch verwijderen. Vouw daarna de entry
   bovenaan `[Unreleased]` in en verwijder het entry-bestand. Dit commit gaat direct op `main`
   (toegestane uitzondering op de geen-directe-main-commits-regel) met een `chore:`-prefix. De
   gedeelde `fold-changelog`-skill kan dit nog niet automatisch — zie de aantekening bij stap 7 in
   [`workflow/workflow-CLAUDE.md`](workflow/workflow-CLAUDE.md).
3. **Meer branches** die later mergen en gevouwen worden vullen `[Unreleased]` op `main` verder
   aan. `main` kan dus een tijd met een gevulde `[Unreleased]` rondlopen — dat is gewoon "wel
   gemergd, nog niet live".
4. **`main` naar live pushen** → alles onder `## [Unreleased]` is nieuw en wordt de eerstvolgende
   release-note: maak `releases/development/X.Y/X.Y.Z.md` op basis van de inhoud, voeg de versie
   toe aan `releases/README.md`, hernoem het blok naar
   `## [vX.Y.Z] - YYYY-MM-DD — Patch/Minor/Major` (met "Zie releases/development/X.Y.Z.md"), en
   maak een vers leeg `## [Unreleased]` bovenaan aan.

---

## [Unreleased]

### Drie mixen toonden een andere frequentie dan hun eigen data
**Branch naam** fix/mix-frequency-conflicten
**Datum merge op main** 2026-07-25
**Branch type** Fix

Drie mixen droegen in hun `title` een andere frequentie dan in hun `frequency`-veld stond. Omdat de
titel in de `<h1>`, op de mix-kaarten en in de metadata terechtkomt, en `frequency` de filters
voedt, zag de bezoeker iets anders dan waarop hij filterde.

Welke van de twee leidend is, is niet gegokt maar afgeleid uit onafhankelijke getuigen: de
`permalink` en de bestandsnaam in `audioSrc` dragen de frequentie namelijk óók. Bij alle drie
wezen die naar `m`.

| Bestand | id | Was | Wordt | Aangepast veld |
|---|---|---|---|---|
| `full-green.json` | 20231127 | `frequency: "(f)"` bij titel `Green Full (m)` | `frequency: "(m)"` | het veld |
| `full-orange.json` | 20230705 | `title: "Orange Full (f)"` bij `frequency: "(m)"` | `Orange Full (m)` | de titel |
| `full-orange.json` | 20221003 | `title: "Orange Full (fm)"` bij `frequency: "(m)"` | `Orange Full (m)` | de titel |

De eerste twee spiegelden elkaar: bij `full-green` was het veld fout, bij `full-orange` de titel.
Eén vaste regel ("het veld wint" of "de titel wint") zou daarom bij precies één van de twee de fout
juist hebben bestendigd.

Het derde geval kwam pas boven water bij een bredere scan. `(fm)` is geen geldige waarde: de
veldspec in `src/data/mixes/README.md` staat uitsluitend `"(f)"` en `"(m)"` toe. Het was dus een
typefout in de titel, geen derde variant. Alle 85 `frequency`-velden zelf zijn wél geldig; de
verdeling is nu 54 × `(f)` en 31 × `(m)`.

**Bijwerking, bewust geaccepteerd.** `Orange Full (m)` komt hierdoor 4 keer voor in plaats van 2.
Dat is geen regressie maar een symptoom van het legacy-titelformaat: **63 van de 85 mixen dragen op
dit moment een titel die niet uniek is** (11 × `Purple Light (f)`, 9 × `Orange Light (f)`, enzovoort).
Het new-standard-formaat uit de veldspec lost dat op doordat het subgenre en volumenummer meeneemt.
Die migratie blijft een aparte beslissing; deze branch corrigeert alleen de tegenstrijdigheden.

Gecontroleerd: alle 85 records parsen, 0 resterende conflicten, en `npm run build` slaagt.

---

### Werkwijze-document hersteld en op zes punten gecorrigeerd
**Branch naam** docs/workflow-herstel
**Datum merge op main** 2026-07-25
**Branch type** Docs

Commit `c5191c0` verwijderde `workflow/workflow-CLAUDE.md` (323 regels) samen met
`workflow-HUMAN.md`, terwijl `CLAUDE.md` de eerste nog inlaadt via `@workflow/workflow-CLAUDE.md`.
Die import faalt stil: sindsdien draaide elke sessie zónder de werkwijze van deze repo. De
commit-boodschap noemt alleen het "human-friendly workflow document" (enkelvoud), dus het meenemen
van de Claude-versie was vrijwel zeker onbedoeld. Het bestand is teruggehaald uit `c5191c0^`;
`workflow-HUMAN.md` blijft bewust vervallen, zodat er nog maar één workflow-document is dat niet uit
de pas kan lopen met een tweede.

Klakkeloos terugzetten kon niet — de doc was op zes punten achterhaald:

1. **`main` is niet live.** De doc stelde twee keer dat `main` de productiebranch is die
   automatisch naar Netlify deployt. Dat spreekt `CHANGELOG.md` tegen, waar `v2.20.1` (2 juli) nog
   `← LIVE` draagt terwijl er sindsdien vier merges in `main` zitten die als "nog niet live" geboekt
   staan. Bij auto-deploy zou het hele `[Unreleased]`-blok zinloos zijn. `main` is herbenoemd tot
   integratiebranch; de live-push is de expliciete stap in de Release Workflow.
2. **PR-discipline omgedraaid.** De doc zei dat een PR openen zelfstandig mag "want dat ship niets
   naar productie". Dat is precies andersom aan de werkelijke afspraak: Dave geeft het startsein, en
   dat sein dekt dan meteen openen, mergen en folden.
3. **Geen build-stap vóór de live-push.** De release-workflow controleerde alleen lint. Terwijl er
   geen staging is en een kapotte build de site platlegt, ontbrak `npm run build` volledig. Stap 3
   draait nu de TypeScript-poort, ESLint (met de nuance dat de 37 errors pre-existing zijn — het
   gaat erom dat er geen fout bijkomt) en de build.
4. **Verwijzingen naar verdwenen scripts.** `scripts/release/new-changelog-entry.ps1`, `open-pr.ps1`
   en `fold-changelog-entry.ps1` zijn in dezelfde commit verwijderd; de doc verwees er nog vier keer
   naar. De Scripts-sectie beschrijft nu de gedeelde plugin-skills plus de repo-eigen scripts.
5. **De fold-skill werkt hier niet.** Bij het vouwen van de vorige entry bleek
   `fold-changelog-entry.ps1` een `## Pull Requests`-kop te zoeken, hardcoded; deze repo gebruikt
   `## [Unreleased]`. Er is geen `Get-ChangelogHeading` in het contract van `repo-config.ps1`. Dit
   staat nu als waarschuwing bij stap 7 en hoort als `inbound`-issue naar de workshop-repo — niet
   als lokale workaround.
6. **`style/` ontbrak in de prefix-tabel.** De canonieke taxonomie in deze doc bevat zeven
   prefixes; `scripts/lib/branch-info.ps1` was op de vorige branch gevuld op basis van de
   git-historie en miste daardoor `style` (er is maar één `style:`-commit). Toegevoegd, en de doc is
   nu expliciet aangewezen als de canonieke bron van die tabel.

Verder zijn de dode verwijzingen naar `workflow-HUMAN.md` en `scripts/release/` uit `CLAUDE.md` en
uit de normatieve "Levenscyclus"-sectie van `CHANGELOG.md` gehaald. De historische release-notes in
`releases/development/` zijn bewust ongemoeid gelaten: die beschrijven wat er destijds gebeurde.

**Tweetaligheid teruggezet naar de werkelijkheid.** `CLAUDE.md` stelde dat de site "fully bilingual"
is via next-intl, met `messages/en.json` en `messages/nl.json` als vindplaats voor alle UI-strings.
Dat klopt niet voor `main`: er is geen `messages/`-map en geen `[locale]`-route. De volledige
next-intl-implementatie staat op de geparkeerde branch `feature/i18n-setup` (17 commits). De regel
beschreef dus een branch alsof het de live site was, waardoor elke sessie code kon gaan schrijven
tegen een `useTranslations()` die hier niet bestaat. Nu expliciet gemarkeerd als nog-niet-live, met
de aantekening wat de regel wordt zodra die branch landt.

---

### Specialists-toolchain werkend gemaakt
**Branch naam** config/specialists-toolchain
**Datum merge op main** 2026-07-25
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

---

## [v2.20.2] - 2026-07-25 — Patch

Zie [releases/development/2.20/2.20.2.md](releases/development/2.20/2.20.2.md)

> Gecut, **nog niet live**. De `← LIVE`-markering verschuift hierheen zodra de live-push naar
> `origin/main` is gedaan en de Netlify-deploy geslaagd is.

---

## [v2.20.1] - 2026-07-02 — Patch ← LIVE

Zie [releases/development/2.20/2.20.1.md](releases/development/2.20/2.20.1.md)

---

## [v2.20.0] - 2026-07-02 — Minor

Zie [releases/development/2.20/2.20.0.md](releases/development/2.20/2.20.0.md)

---

## [v2.19.2] - 2026-06-28 — Patch

Zie [releases/development/2.19/2.19.2.md](releases/development/2.19/2.19.2.md)

---

## [v2.19.1] - 2026-06-28 — Patch

Zie [releases/development/2.19/2.19.1.md](releases/development/2.19/2.19.1.md)

---

## [v2.19.0] - 2026-06-28 — Minor

Zie [releases/development/2.19/2.19.0.md](releases/development/2.19/2.19.0.md)

---

## [v2.18.0] - 2026-06-27 — Minor

Zie [releases/development/2.18/2.18.0.md](releases/development/2.18/2.18.0.md)

---

## [v2.17.0] - 2026-06-27 — Minor

Zie [releases/development/2.17/2.17.0.md](releases/development/2.17/2.17.0.md)

---

## [v2.16.4] - 2026-06-27 — Patch

Zie [releases/development/2.16/2.16.4.md](releases/development/2.16/2.16.4.md)

---

## [v2.16.3] - 2026-06-27 — Patch

Zie [releases/development/2.16/2.16.3.md](releases/development/2.16/2.16.3.md)

---

## [v2.16.2] - 2026-06-27 — Patch

Zie [releases/development/2.16/2.16.2.md](releases/development/2.16/2.16.2.md)

---

## [v2.16.1] - 2026-06-27 — Patch

Zie [releases/development/2.16/2.16.1.md](releases/development/2.16/2.16.1.md)

---

## [v2.16.0] - 2026-06-25 — Minor

Zie [releases/development/2.16/2.16.0.md](releases/development/2.16/2.16.0.md)

---

## [v2.15.0] - 2026-06-25 — Minor

Zie [releases/development/2.15/2.15.0.md](releases/development/2.15/2.15.0.md)

## [v2.14.4] - 2026-06-25 — Patch

Zie [releases/development/2.14/2.14.4.md](releases/development/2.14/2.14.4.md)

## [v2.14.3] - 2026-06-25 — Patch

Zie [releases/development/2.14/2.14.3.md](releases/development/2.14/2.14.3.md)

## [v2.14.2] - 2026-06-25 — Patch

Zie [releases/development/2.14/2.14.2.md](releases/development/2.14/2.14.2.md)

## [v2.14.1] - 2026-06-25 — Patch

Zie [releases/development/2.14/2.14.1.md](releases/development/2.14/2.14.1.md)

## [v2.14.0] - 2026-06-25 — Minor

Zie [releases/development/2.14/2.14.0.md](releases/development/2.14/2.14.0.md)

## [v2.13.0] - 2026-06-18 — Minor

Zie [releases/development/2.13/2.13.0.md](releases/development/2.13/2.13.0.md)

## [v2.12.0] - 2026-06-16 — Minor

Zie [releases/development/2.12/2.12.0.md](releases/development/2.12/2.12.0.md)

## [v2.11.1] - 2026-05-10 — Patch

Zie [releases/development/2.11/2.11.1.md](releases/development/2.11/2.11.1.md)

## [v2.11.0] - 2026-05-08 — Minor

Zie [releases/development/2.11/2.11.0.md](releases/development/2.11/2.11.0.md)

## [v2.10.0] - 2026-05-05 — Minor

Zie [releases/development/2.10/2.10.0.md](releases/development/2.10/2.10.0.md)

## [v2.9.0] - 2026-05-01 — Minor

Zie [releases/development/2.9/2.9.0.md](releases/development/2.9/2.9.0.md)

## [v2.8.0] - 2026-04-20 — Minor

Zie [releases/development/2.8/2.8.0.md](releases/development/2.8/2.8.0.md)

## [v2.7.0] - 2026-04-13 — Minor

Zie [releases/development/2.7/2.7.0.md](releases/development/2.7/2.7.0.md)

## [v2.6.0] - 2026-04-11 — Minor

Zie [releases/development/2.6/2.6.0.md](releases/development/2.6/2.6.0.md)

## [v2.5.0] - 2026-04-10 — Minor

Zie [releases/development/2.5/2.5.0.md](releases/development/2.5/2.5.0.md)

## [v2.4.0] - 2026-03-20 — Minor

Zie [releases/development/2.4/2.4.0.md](releases/development/2.4/2.4.0.md)

## [v2.3.0] - 2026-03-19 — Minor

Zie [releases/development/2.3/2.3.0.md](releases/development/2.3/2.3.0.md)

## [v2.2.0] - 2026-03-13 — Minor

Zie [releases/development/2.2/2.2.0.md](releases/development/2.2/2.2.0.md)

## [v2.1.0] - 2026-03-11 — Minor

Zie [releases/development/2.1/2.1.0.md](releases/development/2.1/2.1.0.md)

## [v2.0.1] - 2026-03-08 — Patch

Zie [releases/development/2.0/2.0.1.md](releases/development/2.0/2.0.1.md)

## [v2.0.0] - 2026-03-07 — Major

Zie [releases/development/2.0/2.0.0.md](releases/development/2.0/2.0.0.md)
