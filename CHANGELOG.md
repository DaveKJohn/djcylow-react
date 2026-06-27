# Changelog
Wijzigingen op deze branch (docs/ga4-gtm-setup). Bij merge naar main schuiven deze regels onder ## [Unreleased] in de hoofd-CHANGELOG. Zie de werkwijze in CLAUDE.md.

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
