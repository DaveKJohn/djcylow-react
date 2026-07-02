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
   repo-root aan (via `scripts/release/new-changelog-entry.ps1`), met dezelfde inhoud die vroeger
   direct in `[Unreleased]` ging. Een branch mag gerust weken geparkeerd blijven — er is niets om
   over te conflicteren.
2. **Branch klaar en goedgekeurd** → merge naar `main`, branch verwijderen. Draai daarna
   `scripts/release/fold-changelog-entry.ps1 -Branch <branch>` op `main`: dat vouwt de entry in
   `[Unreleased]` en verwijdert het entry-bestand. Dit commit gaat direct op `main` (toegestane
   uitzondering op de geen-directe-main-commits-regel).
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

### Workflow gesplitst: workflow/ map + per-branch changelog entries
**Branch naam** config/workflow-changelog-restructure
**Datum merge op main** 2026-07-02
**Branch type** Config

`CLAUDE.md` opgesplitst naar het voorbeeld van de smartwatchbanden-repo: het bestand is nu dun en laadt `workflow/workflow-CLAUDE.md` (volledige technische werkwijze) in via `@workflow/workflow-CLAUDE.md`; `workflow/workflow-HUMAN.md` beschrijft dezelfde workflow voor handmatige uitvoering. Project-specifieke referentie (Quick Reference, Mix JSON Rules) blijft in `CLAUDE.md`. De `[Unreleased]`-sectie van `CHANGELOG.md` wordt niet langer direct op een branch bewerkt — elke branch schrijft nu een eigen entry-bestand (`<branch-naam>.md` in de repo-root, gescaffold via `scripts/release/new-changelog-entry.ps1`), dat na de merge met `scripts/release/fold-changelog-entry.ps1` in `[Unreleased]` gevouwen en verwijderd wordt. Dit voorkomt merge-conflicten op `[Unreleased]` bij lang-openstaande branches. Beide scripts zijn getest op een scratch-kopie van `CHANGELOG.md`.

---

### BOM-bug gefixt in changelog entry-scripts
**Branch naam** fix/changelog-scripts-bom
**Datum merge op main** 2026-07-02
**Branch type** Fix

`scripts/release/fold-changelog-entry.ps1` en `scripts/release/new-changelog-entry.ps1` schreven bestanden weg met `Set-Content -Encoding UTF8`, wat in Windows PowerShell 5.1 altijd een UTF-8 BOM toevoegt — terwijl de rest van de repo (waaronder `CHANGELOG.md`) BOM-loos is. Bij de eerste test op main voegde het fold-script hierdoor een BOM toe aan `CHANGELOG.md`. Beide scripts schrijven nu via `[System.IO.File]::WriteAllText` met een expliciete BOM-loze UTF8-encoding.

---

### Script om te wisselen tussen werk- en prive-account (GitHub CLI + Claude)
**Branch naam** config/work-account-switch
**Datum merge op main** 2026-07-02
**Branch type** Config

`scripts/env/switch-account.ps1` toegevoegd (vervangt `scripts/switch-work-account.ps1`): wisselt met een `work`/`personal` argument tussen de twee accounts, schakelt de actieve `gh` CLI account om, draait `gh auth setup-git` zodat git via de `gh` credential helper blijft werken, start automatisch de login-flow als het doelaccount nog niet is ingelogd, logt het andere account volledig uit bij `gh` CLI, en start de logout/login-flow voor het bijbehorende Claude-account. VS Code's eigen "Sign in with GitHub" (Settings Sync/Copilot) heeft geen CLI-ondersteuning en blijft een handmatige stap.

---

### Release notes herstructureerd: development/ + highlights/
**Branch naam** config/release-notes-restructure
**Datum merge op main** 2026-07-02
**Branch type** Config

`release-notes/` hernoemd naar `releases/`, met een `development/<X.Y>/<X.Y.Z>.md` submap (technische versie, altijd) en een nieuwe `highlights/<X.Y>/<X.Y.Z>.md` submap (leesbare Nederlandse versie zonder jargon en zonder branch-metadata, alleen bij Minor/Major). Alle 21 bestaande Minor/Major releases (2.0.0 t/m 2.20.0) hebben retroactief een highlights-versie gekregen. `releases/README.md`, `CLAUDE.md` (Release Workflow) en `README.md` bijgewerkt naar de nieuwe paden en het tweeledige releaseformaat.

---

## [v2.20.0] - 2026-07-02 — Minor ← LIVE

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
