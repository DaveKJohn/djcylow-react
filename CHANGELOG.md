# Changelog

Alle noemenswaardige wijzigingen worden hier bijgehouden.

- **`[Unreleased]`** — werk op een feature-branch, nog niet live
- **`[vX.X.X]`** — op die datum live gegaan via merge naar `main`

Bij een release: hernoem `[Unreleased]` naar `[vX.X.X] - YYYY-MM-DD`, maak een
`release-notes/X.X.X.md` aan op basis van deze inhoud, en voeg de versie toe aan
`release-notes/README.md`.

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

## [v1.16.0] - 2026-06-25

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
