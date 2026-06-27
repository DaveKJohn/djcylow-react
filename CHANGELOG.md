# Changelog

De belangrijkste wijzigingen aan deze repo kort bijgehouden. Eén regel per noemenswaardige wijziging.

## Hoe dit werkt

- **`## [Unreleased]`** — wijzigingen die al in `main` zitten maar nog niet live zijn. Dit blok vult zich met elke branch die naar `main` wordt gemergd, en blijft staan tot de eerstvolgende live-push.
- **`## [vX.Y.Z] — YYYY-MM-DD`** — op die datum live gegaan via een push naar het live thema. De volledige uitwerking staat in `release-notes/X.Y.Z.md`.

De bovenste uitgebrachte versie draagt de markering **← LIVE**: dat is de versie die op dit moment op het live thema staat. Bij elke live-push verschuift die markering naar de nieuwe versie.

### Levenscyclus van een regel

1. **Op een branch** schrijf je je belangrijkste wijzigingen onder `## [Unreleased]` (op de branch zelf, in dezelfde commit als het werk). Een branch mag gerust weken geparkeerd blijven.
2. **Branch klaar en goedgekeurd** → merge naar `main`, branch verwijderen. Je `[Unreleased]`-regels reizen mee naar `main`.
3. **Meer branches** die later mergen vullen `[Unreleased]` op `main` verder aan. `main` kan dus een tijd met een gevulde `[Unreleased]` rondlopen — dat is gewoon "wel gemergd, nog niet live".
4. **`main` naar live pushen** → alles onder `## [Unreleased]` is nieuw en wordt de eerstvolgende release-note: maak `release-notes/X.Y.Z.md` op basis van de inhoud, voeg de versie toe aan `release-notes/README.md`, hernoem het blok naar `## [vX.Y.Z] — YYYY-MM-DD` (met "Zie release-notes/X.Y.Z.md"), en maak een vers leeg `## [Unreleased]` bovenaan aan.

> **Merge-conflict op `[Unreleased]`?** Dat kan, want elke branch bewerkt hetzelfde blok. Het is een verwacht, triviaal conflict: behoud simpelweg beide sets regels onder `[Unreleased]`. Geen werk gaat verloren — de volgorde maakt niet uit.

---

## [Unreleased]

### Documentatie — GA4 + GTM setup (nog uit te voeren)

Doel: meten welke mix het meest bezocht wordt en hoe lang bezoekers gemiddeld blijven.
GTM container `GTM-PK7VHJ46` is al actief op de site. Enkel GA4 property + tag aanmaken is nodig.

**Stap 1 — GA4 property aanmaken**
1. Ga naar analytics.google.com → Admin → Create property
2. Property name: `DJ Cylow` — Time zone: Netherlands — Currency: EUR
3. Platform: Web — URL: `https://www.djcylow.com` — Stream name: `DJ Cylow website`
4. Kopieer de **Measurement ID** (`G-XXXXXXXXXX`)

**Stap 2 — GA4 tag in GTM aanmaken**
1. Ga naar tagmanager.google.com → container `GTM-PK7VHJ46`
2. Tags → New → Tag Configuration → **Google Tag**
3. Tag naam: `GA4 - Configuration` — Tag ID: jouw `G-XXXXXXXXXX`
4. Triggering: **All Pages** → Save

**Stap 3 — Publiceren in GTM**
1. Rechtsbovenin → Submit → Version name: `GA4 configuratie` → Publish

**Resultaat**
Na 24–48 uur zichtbaar in GA4 → Reports → Engagement → **Pages and screens**:
per mix-URL → aantal bezoeken + gemiddelde engagement time.

**Volgende stap (optioneel — Laag 2)**
Rijkere data via `dataLayer` events in de mix-pagina component:
mix naam, power, kleur, tags meesturen zodat je in GA4 ook op die dimensies kunt filteren
(los van de URL). Hiervoor zijn code-aanpassingen nodig.

---

## [v1.16.0] - 2026-06-25 ← LIVE

Zie [release-notes/1.16.0.md](release-notes/1.16.0.md)

---

## [v1.15.0] - 2026-06-25

Zie [release-notes/1.15.0.md](release-notes/1.15.0.md)

## [v1.14.4] - 2026-06-25

Zie [release-notes/1.14.4.md](release-notes/1.14.4.md)

## [v1.14.3] - 2026-06-25

Zie [release-notes/1.14.3.md](release-notes/1.14.3.md)

## [v1.14.2] - 2026-06-25

Zie [release-notes/1.14.2.md](release-notes/1.14.2.md)

## [v1.14.1] - 2026-06-25

Zie [release-notes/1.14.1.md](release-notes/1.14.1.md)

## [v1.14.0] - 2026-06-25

Zie [release-notes/1.14.0.md](release-notes/1.14.0.md)

## [v1.13.0] - 2026-06-18

Zie [release-notes/1.13.0.md](release-notes/1.13.0.md)

## [v1.12.0] - 2026-06-16

Zie [release-notes/1.12.0.md](release-notes/1.12.0.md)

## [v1.11.1] - 2026-05-10

Zie [release-notes/1.11.1.md](release-notes/1.11.1.md)

## [v1.11.0] - 2026-05-08

Zie [release-notes/1.11.0.md](release-notes/1.11.0.md)

## [v1.10.0] - 2026-05-05

Zie [release-notes/1.10.0.md](release-notes/1.10.0.md)

## [v1.9.0] - 2026-05-01

Zie [release-notes/1.9.0.md](release-notes/1.9.0.md)

## [v1.8.0] - 2026-04-20

Zie [release-notes/1.8.0.md](release-notes/1.8.0.md)

## [v1.7.0] - 2026-04-13

Zie [release-notes/1.7.0.md](release-notes/1.7.0.md)

## [v1.6.0] - 2026-04-11

Zie [release-notes/1.6.0.md](release-notes/1.6.0.md)

## [v1.5.0] - 2026-04-10

Zie [release-notes/1.5.0.md](release-notes/1.5.0.md)

## [v1.4.0] - 2026-03-20

Zie [release-notes/1.4.0.md](release-notes/1.4.0.md)

## [v1.3.0] - 2026-03-19

Zie [release-notes/1.3.0.md](release-notes/1.3.0.md)

## [v1.2.0] - 2026-03-13

Zie [release-notes/1.2.0.md](release-notes/1.2.0.md)

## [v1.1.0] - 2026-03-11

Zie [release-notes/1.1.0.md](release-notes/1.1.0.md)

## [v1.0.1] - 2026-03-08

Zie [release-notes/1.0.1.md](release-notes/1.0.1.md)

## [v1.0.0] - 2026-03-07

Zie [release-notes/1.0.0.md](release-notes/1.0.0.md)
