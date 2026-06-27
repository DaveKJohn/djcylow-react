# Changelog

De belangrijkste wijzigingen aan deze repo kort bijgehouden. Één regel per noemenswaardige wijziging.

## Hoe dit werkt

- **`## [Unreleased]`** — wijzigingen die al in `main` zitten maar nog niet live zijn. Dit blok vult zich met elke branch die naar `main` wordt gemergd, en blijft staan tot de eerstvolgende live-push.
- **`## [vX.Y.Z] - YYYY-MM-DD — Patch/Minor/Major`** — op die datum live gegaan via een push naar het live thema. De volledige uitwerking staat in `release-notes/X.Y/X.Y.Z.md`.

De bovenste uitgebrachte versie draagt de markering **← LIVE**: dat is de versie die op dit moment op het live thema staat. Bij elke live-push verschuift die markering naar de nieuwe versie.

### Levenscyclus van een regel

1. **Op een branch** schrijf je je belangrijkste wijzigingen onder `## [Unreleased]` (op de branch zelf, in dezelfde commit als het werk). Een branch mag gerust weken geparkeerd blijven.
2. **Branch klaar en goedgekeurd** → merge naar `main`, branch verwijderen. Je `[Unreleased]`-regels reizen mee naar `main`.
3. **Meer branches** die later mergen vullen `[Unreleased]` op `main` verder aan. `main` kan dus een tijd met een gevulde `[Unreleased]` rondlopen — dat is gewoon "wel gemergd, nog niet live".
4. **`main` naar live pushen** → alles onder `## [Unreleased]` is nieuw en wordt de eerstvolgende release-note: maak `release-notes/X.Y/X.Y.Z.md` op basis van de inhoud, voeg de versie toe aan `release-notes/README.md`, hernoem het blok naar `## [vX.Y.Z] - YYYY-MM-DD — Patch/Minor/Major` (met "Zie release-notes/X.Y.Z.md"), en maak een vers leeg `## [Unreleased]` bovenaan aan.

> **Merge-conflict op `[Unreleased]`?** Dat kan, want elke branch bewerkt hetzelfde blok. Het is een verwacht, triviaal conflict: behoud simpelweg beide sets regels onder `[Unreleased]`. Geen werk gaat verloren — de volgorde maakt niet uit.

---

## [Unreleased]

### Entry-formaat definitief vastgesteld
**Branch naam** docs/new-entry-format
**Datum merge op main** 2026-06-27
**Branch type** Docs

Definitief formaat: beschrijvende titel als heading, `**Branch naam**`, `**Datum merge op main**` en `**Branch type**` als losse velden. Bijgewerkt in CLAUDE.md, release-notes/README.md en 2.16.3.md.

### Definitief entry-formaat doorgevoerd
**Branch naam** docs/final-entry-format
**Datum merge op main** 2026-06-27
**Branch type** Docs

Formaat nogmaals bijgesteld: beschrijvende titel als heading met branch naam, merge-datum en branch type als losse velden eronder.

---

## [v2.16.3] - 2026-06-27 — Patch ← LIVE

Zie [release-notes/2.16/2.16.3.md](release-notes/2.16/2.16.3.md)

---

## [v2.16.2] - 2026-06-27 — Patch

Zie [release-notes/2.16/2.16.2.md](release-notes/2.16/2.16.2.md)

---

## [v2.16.1] - 2026-06-27 — Patch

Zie [release-notes/2.16/2.16.1.md](release-notes/2.16/2.16.1.md)

---

## [v2.16.0] - 2026-06-25 — Minor

Zie [release-notes/2.16/2.16.0.md](release-notes/2.16/2.16.0.md)

---

## [v2.15.0] - 2026-06-25 — Minor

Zie [release-notes/2.15/2.15.0.md](release-notes/2.15/2.15.0.md)

## [v2.14.4] - 2026-06-25 — Patch

Zie [release-notes/2.14/2.14.4.md](release-notes/2.14/2.14.4.md)

## [v2.14.3] - 2026-06-25 — Patch

Zie [release-notes/2.14/2.14.3.md](release-notes/2.14/2.14.3.md)

## [v2.14.2] - 2026-06-25 — Patch

Zie [release-notes/2.14/2.14.2.md](release-notes/2.14/2.14.2.md)

## [v2.14.1] - 2026-06-25 — Patch

Zie [release-notes/2.14/2.14.1.md](release-notes/2.14/2.14.1.md)

## [v2.14.0] - 2026-06-25 — Minor

Zie [release-notes/2.14/2.14.0.md](release-notes/2.14/2.14.0.md)

## [v2.13.0] - 2026-06-18 — Minor

Zie [release-notes/2.13/2.13.0.md](release-notes/2.13/2.13.0.md)

## [v2.12.0] - 2026-06-16 — Minor

Zie [release-notes/2.12/2.12.0.md](release-notes/2.12/2.12.0.md)

## [v2.11.1] - 2026-05-10 — Patch

Zie [release-notes/2.11/2.11.1.md](release-notes/2.11/2.11.1.md)

## [v2.11.0] - 2026-05-08 — Minor

Zie [release-notes/2.11/2.11.0.md](release-notes/2.11/2.11.0.md)

## [v2.10.0] - 2026-05-05 — Minor

Zie [release-notes/2.10/2.10.0.md](release-notes/2.10/2.10.0.md)

## [v2.9.0] - 2026-05-01 — Minor

Zie [release-notes/2.9/2.9.0.md](release-notes/2.9/2.9.0.md)

## [v2.8.0] - 2026-04-20 — Minor

Zie [release-notes/2.8/2.8.0.md](release-notes/2.8/2.8.0.md)

## [v2.7.0] - 2026-04-13 — Minor

Zie [release-notes/2.7/2.7.0.md](release-notes/2.7/2.7.0.md)

## [v2.6.0] - 2026-04-11 — Minor

Zie [release-notes/2.6/2.6.0.md](release-notes/2.6/2.6.0.md)

## [v2.5.0] - 2026-04-10 — Minor

Zie [release-notes/2.5/2.5.0.md](release-notes/2.5/2.5.0.md)

## [v2.4.0] - 2026-03-20 — Minor

Zie [release-notes/2.4/2.4.0.md](release-notes/2.4/2.4.0.md)

## [v2.3.0] - 2026-03-19 — Minor

Zie [release-notes/2.3/2.3.0.md](release-notes/2.3/2.3.0.md)

## [v2.2.0] - 2026-03-13 — Minor

Zie [release-notes/2.2/2.2.0.md](release-notes/2.2/2.2.0.md)

## [v2.1.0] - 2026-03-11 — Minor

Zie [release-notes/2.1/2.1.0.md](release-notes/2.1/2.1.0.md)

## [v2.0.1] - 2026-03-08 — Patch

Zie [release-notes/2.0/2.0.1.md](release-notes/2.0/2.0.1.md)

## [v2.0.0] - 2026-03-07 — Major

Zie [release-notes/2.0/2.0.0.md](release-notes/2.0/2.0.0.md)
