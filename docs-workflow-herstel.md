### Werkwijze-document hersteld en op zes punten gecorrigeerd

**Branch naam** docs/workflow-herstel
**Datum merge op main**
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
