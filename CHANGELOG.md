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

### Kleine letter in vijf mix-titels gecorrigeerd
**Branch naam** fix/mix-titels-hoofdletter
**Datum merge op main** 2026-07-25
**Branch type** Fix

Vijf `title`-velden begonnen met een kleine kleurnaam, terwijl de veldspecificatie in
`src/data/mixes/README.md` expliciet "Capitalize color (Red, Blue, Purple, etc.)" voorschrijft.
Omdat `title` SEO-kritisch is (mix-kaarten, de `<h1>` van de detailpagina en de metadata) is dit
zichtbaar op de site zelf.

- `full-green.json` — `green Full (m)` → `Green Full (m)`, `green Full (f)` → `Green Full (f)`
- `full-yellow.json` — 3 × `yellow Full (m)` → `Yellow Full (m)`

Alleen de beginletter is aangeraakt; geen enkele titel verandert van vorm of inhoud, en er is niets
aan de JSON-opmaak gewijzigd.

**Bewust niet meegenomen.** Dit is de kleine, veilige helft van een groter beeld dat bij deze
gelegenheid is opgemeten: van de 85 mixen volgen er **2** het "new standard"-titelformaat uit de
veldspec (`[Subgenre] · [Color] [Power] ([Frequency]) Mix · Vol. [N]`). De overige 83 dragen het
legacy-format, dat de spec voor oude entries ook uitdrukkelijk toestaat — het is dus geen bug maar
een migratie die nooit is uitgevoerd. 77 daarvan zijn volledig uit de losse velden te
reconstrueren; de 8 die dat niet zijn, zijn precies de `ignore: true`-preview-entries en tellen
niet mee voor de publieke playlist.

Die migratie is bewust een aparte beslissing gebleven: het herschrijft 75 SEO-titels in één keer,
en in minstens één record spreken de titel en het `frequency`-veld elkaar tegen (`green Full (m)`
tegenover `frequency: (f)`), zodat eerst bepaald moet worden welke van de twee leidend is.

### merge: prefix voor merge-commits
**Branch naam** docs/merge-commit-prefix
**Datum merge op main** 2026-07-02
**Branch type** Docs

Merge-commits waren de enige plek in de git-geschiedenis zonder type-prefix (`chore:`, `fix:`,
`docs:`, etc.). `gh pr merge --subject` en `git merge -m` gebruiken nu een `merge:` prefix
(`merge: [branch] (#PR-nummer)` voor PR-merges, `merge: [branch] — v<versie>` voor de
release-branch), consistent met de rest van de geschiedenis.

---

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

---

### Chore-prefix voor changelog fold-commits
**Branch naam** docs/fold-commit-chore-prefix
**Datum merge op main** 2026-07-02
**Branch type** Docs

De changelog fold-commit (stap 7 in de release-workflow) gebruikte de `docs:` prefix, terwijl
`docs` bedoeld is voor echte documentatie-inhoud (README's e.d.). Het schoonmaken van
`CHANGELOG.md` na een merge is een aparte, routinematige housekeeping-actie. Beide
workflow-bestanden (`workflow-CLAUDE.md` en `workflow-HUMAN.md`) gebruiken nu `chore:` voor deze
fold-commit.

---

### Fix genre filter matching subgenre family
**Branch naam** fix/genre-subgenre-family-mapping
**Datum merge op main** 2026-07-02
**Branch type** Fix

De `genre` filter op de Luister-pagina gaf geen resultaten voor `House`, `Techno` en `Nu-Disco`
omdat het `genre` veld in de mix-JSON's altijd `"EDM"` of `"Drum & Bass"` was, terwijl het filter
op deze specifiekere subgenre-families matchte. `genre` is nu bijgewerkt naar de subgenre-familie
(`House`, `Techno`, `Nu-Disco`, `Drum & Bass`) voor alle 31 betrokken mixen, het dode `EDM`
filterknop is verwijderd uit `Filter.tsx`, en `src/data/mixes/README.md` beschrijft de nieuwe
mapping tussen `subgenre` en `genre`.

Daarnaast tijdens het testen van deze branch gevonden en meegenomen:
- Twee Red mixen (`20250401`, `20241009`) hadden een subgenre-correctie naar Melodic Techno
  gekregen zonder dat title/description meegingen — nu consistent gemaakt
- Mix `20240226` in `full-red.json` is hergeclassificeerd van Neurofunk naar Dancefloor Drum & Bass
  (past beter bij de festival-georiënteerde tracklist), title/descriptions/subgenre bijgewerkt
- De "Laad meer"-knop-container in `Playlist.tsx` verdween niet meer volledig als de limit nog
  niet bereikt was (conditie stond om de button, niet om de omliggende div)
- Layout-shift in de Mood-filter opgelost: de mood-tekst reserveert nu altijd ruimte voor 2 regels,
  en de filterknoppen hebben een vaste borderbreedte (alleen de kleur wisselt tussen states) zodat
  wisselen tussen kleuren de rest van de sidebar niet meer laat verschuiven

---

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
