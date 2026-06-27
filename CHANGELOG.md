# Changelog
Wijzigingen op deze branch (docs/ga4-gtm-setup). Bij merge naar main schuiven deze regels onder ## [Unreleased] in de hoofd-CHANGELOG. Zie de werkwijze in CLAUDE.md.

## [Unreleased]

### Documentatie — GA4 + GTM setup ✅ voltooid op 2026-06-27

Doel: meten welke mix het meest bezocht wordt en hoe lang bezoekers gemiddeld blijven.
GTM container `GTM-PK7VHJ46` is actief op de site.

**GA4 Property aangemaakt**
- Property naam: `DJ Cylow`
- Tijdzone: Nederland (GMT+02:00) — Valuta: Euro (€)
- Platform: Web — Stream URL: `https://www.djcylow.com` — Stream naam: `DJ Cylow website`
- **Measurement ID: `G-6DS3L2SR6C`**

**GA4 tag aangemaakt in GTM**
- Tag naam: `GA4 - Configuration` — Tagtype: Google-tag
- Tag-ID: `G-6DS3L2SR6C` — Trigger: All Pages
- GTM container: `GTM-PK7VHJ46` — Versie 3 gepubliceerd op 2026-06-27 15:43

**Laag 2 — dataLayer events ✅ geïmplementeerd**
- Nieuw client component `src/components/analytics/MixAnalytics.tsx`
- Vuurt `view_mix` event op elke mix-pagina met dimensies: `mix_id`, `mix_title`, `mix_power`, `mix_color`, `mix_genre`, `mix_subgenre`, `mix_volume`
- Toegevoegd aan `src/app/luister/mix/[slug]/page.tsx`

**GTM configuratie Laag 2 ✅ gepubliceerd op 2026-06-27 16:02 — Versie 4**
- 7 Data Layer Variables aangemaakt: `DLV - mix_id/title/power/color/genre/subgenre/volume`
- Custom Event trigger `CE - view_mix` aangemaakt (luistert op event `view_mix`)
- GA4 Event tag `GA4 - view_mix` aangemaakt: stuurt alle 7 dimensies naar `G-6DS3L2SR6C`
- Controleerbaar in GA4 → Events → `view_mix`
