# Changelog

De geschiedenis van de DJ Cylow-website: onder **Pull Requests** elke gemergde branch met zijn PR,
onder **Releases** de vastgelegde versies. Het mechanisme (entry-bestanden, folden, een release
knippen) staat in [`CLAUDE.md`](CLAUDE.md).

`main` is de integratie-branch, niet de live site. Wat onder **Pull Requests** staat is dus gemergd
maar nog niet uitgebracht, en een uitgebrachte versie is nog niet per se live: de versie met
**← LIVE** onder **Releases** is degene die op dit moment op de site draait.

## Pull Requests

Alles wat sinds de laatste release naar `main` is gemergd — nieuwste bovenaan, één blok per pull
request.

### #17 · Vijf afgeleide velden voor alle mixen: `id_spotify`, `bpm`, `title_spotify`, `tracks` en `volume_spotify` · Data · 2026-07-26

Alle 85 entries in `src/data/mixes/*.json` hebben vijf nieuwe velden gekregen, zodat de JSON de
enige administratie van een mix blijft, ook voor de Spotify-kant. De site gebruikt de velden
(nog) niet: er is geen component of route die ze leest, dus de publieke pagina's veranderen niet.

**`bpm`** — het tempo als getal, nieuw als eigenstandig veld. Tot nu toe zat de BPM alleen
versleuteld in de `audioSrc`-bestandsnaam en de `permalink`, en die spraken elkaar op twee plekken
tegen. Vastgestelde regel: Drum & Bass is altijd `176`, voor de overige genres geldt de BPM uit de
`audioSrc`. Dat dekt alle 77 echte mixen zonder gaten en levert 46× `176`, 30× `128` en 1× `112`.

**`id_spotify`** — `mmc_edm_{bpm}bpm_{power}_{freq}_{color}_{id}`, bijvoorbeeld
`mmc_edm_128bpm_light_m_yellow_20251021`. Uniek over alle mixen doordat het `id` erin zit.

**`title_spotify`** — `EDM {bpm}BPM {emoji} {Color} {Power} ({freq}) {emoji} {Vol. N} {emoji} {id}`,
bijvoorbeeld `EDM 128BPM 🟡 Yellow Light (m) 🟡 Vol. 7 🟡 20251021`. De kleur-emoji scheidt de drie
delen; Cyan krijgt 💠 omdat Unicode geen cyaan cirkel kent. Het nummer komt uit `volume_spotify` en
niet uit het site-`volume`: dat laatste loopt per subgenre, dus dezelfde `Vol. N` komt binnen één
kleur + power + frequentie meerdere keren voor (`Red Light (m) Vol. 1` bestaat als Tech House,
Progressive House én Melodic Techno). Ook een doortellend nummer is over de hele collectie niet
uniek, daarom sluit het `id` de titel af — alle 77 titels zijn daarmee uniek.

**`tracks`** — het aantal items in de `tracklist`, één keer geteld en vastgelegd zodat het nooit
meer opnieuw geteld hoeft te worden. Loopt van 22 tot 46 met een mediaan van 35; samen 2667 tracks
over de 77 mixen.

**`volume_spotify`** — een doorlopend nummer per kleur + power + frequentie + BPM, chronologisch met
de oudste mix als `1`. Bewust zonder het subgenre, zodat een nummer binnen één reeks nooit twee keer
voorkomt: het bestaande `volume` kan dat niet, omdat die reeks juist per subgenre loopt. Drum & Bass
vormt een eigen reeks, dus `Red Light (m)` heeft zes 128 BPM-mixen als `1` t/m `6` plus één
176 BPM Neurofunk-mix die zijn eigen `1` is. Levert 27 reeksen over de 77 mixen, met
`Purple Light (f)` 176 BPM als langste (`1` t/m `9`). Dit is ook het nummer dat `title_spotify`
draagt: bij 30 van de 77 mixen wijkt het daarmee af van het site-`volume`. Die mix die op de site
`Vol. 1` heet, staat op Spotify dus als `Vol. 6` — bedoeld, geen afwijking.

De acht preview-entries (`ignore: true`) krijgen lege waarden (`""` en `0` voor de getalvelden), in
lijn met hoe hun `date`, `volume` en `description`-velden al leeg staan.

Meegenomen zodat de data niet meteen weer uit de pas loopt: `scripts/add-mix.js` genereert de vijf
velden nu voor elke nieuwe mix (met `176` als voorstel bij Drum & Bass), de `Mix`-interface in
`src/app/luister/mix/[slug]/page.tsx` kent ze, en `src/data/mixes/README.md` beschrijft ze als
onderdeel van het schema.

[PR #17](https://github.com/DaveKJohn/djcylow-react/pull/17)

---

### #16 · GTM Laag 3 — content_group op mix_id, en de GA4-dimensie Mix ID · Config · 2026-07-25

Vastlegging van twee analytics-wijzigingen die al sinds **27 juni 2026** live staan in Google Tag
Manager en GA4, maar tot nu toe nergens in deze repo waren gedocumenteerd. Er verandert dus niets
aan de configuratie zelf; dit haalt alleen de administratie bij.

**GTM.** De parameter `content_group` is toegevoegd aan de tag `GA4 - view_mix`, met als waarde
`{{DLV - mix_id}}` (bijvoorbeeld `2026-06-15`). Gepubliceerd als GTM-versie 5 op 2026-06-27 16:59.
Hierdoor worden mix-weergaven in GA4 samengevoegd per mix-ID, ongeacht de URL-variant: met of zonder
`/en/`, met of zonder `.html`.

**GA4.** De aangepaste dimensie **Mix ID** is aangemaakt met bereik Gebeurtenis en parameternaam
`content_group`. Bruikbaar via Verkennen → vrije vorm → dimensie "Mix ID" als rij; dat toont de
weergaven per mix samengevoegd, ongeacht URL-variant.

**Waarom dit alsnog landt.** Het werk stond op de branch `config/ga4-content-group`, aangemaakt op
27 juni, die nooit is gemergd. Die branch bewerkte `CHANGELOG.md` rechtstreeks — de werkwijze van
vóór de omslag naar per-branch entry-bestanden — waardoor hij inmiddels zou conflicteren. De inhoud
is daarom overgezet naar het huidige entry-formaat en de oude branch is opgeruimd. Zonder deze stap
zou er een live analytics-configuratie bestaan waarvan in de repo geen spoor te vinden is.

[PR #16](https://github.com/DaveKJohn/djcylow-react/pull/16)

---

### #15 · Social previews en de canonical van /diensten gerepareerd · Fix · 2026-07-25

Drie SEO-defecten die alle drie in de gebouwde HTML terechtkwamen.

**1. Linkpreviews wezen naar localhost.** `metadataBase` was niet gezet in `src/app/layout.tsx`,
waardoor Next.js relatieve URL's in metadata oploste tegen `http://localhost:3000`. In de gebouwde
pagina's stond letterlijk:

```html
<meta property="og:image" content="http://localhost:3000/images/diensten.jpg"/>
<meta name="twitter:image" content="http://localhost:3000/images/diensten.jpg"/>
```

Wie een dienstenpagina op WhatsApp, Facebook of LinkedIn deelde, kreeg dus een preview zonder
afbeelding. De build waarschuwde hiervoor, maar die melding ging op in de rest van de output.
`metadataBase` staat nu op `https://www.djcylow.com`, in `layout.tsx` zodat elke pagina hem erft.
De mix-detailpagina had hem al lokaal staan; die was daardoor als enige wél in orde.

**2. De afbeelding bestond niet.** `/images/diensten.jpg` staat nergens in `public/images/`. Ook met
een correcte `metadataBase` zou die URL dus een 404 hebben opgeleverd. De verwijzing is verwijderd
uit de drie dienstenpagina's, plus uit `src/content/diensten.ts` waar een `image`-veld naar hetzelfde
niet-bestaande bestand wees (dat veld werd nergens gerenderd, dus er was geen zichtbaar kapot
plaatje op de site).

Er is bewust geen vervangende afbeelding gekozen: geen van de bestaande beelden is geschikt.
`hero_desktop.webp` is 882×1180 en dus staand, terwijl een og:image liggend 1200×630 wil zijn en
anders lelijk wordt bijgesneden. Een lege preview is beter dan een verminkte. Een echte og-image
laten maken is een aparte opdracht.

**3. `/diensten` verklaarde zichzelf een duplicaat van de homepage.** Zowel de `canonical` als de
`og:url` van die pagina stonden op `https://www.djcylow.com/`. Daarmee kreeg Google te horen dat
`/diensten` geen eigen pagina is maar een kopie van de homepage, wat betekent dat hij mogelijk niet
apart geïndexeerd werd. Beide wijzen nu naar `https://www.djcylow.com/diensten`. De drie
subpagina's (bruiloft, bedrijfsfeest, house) hadden wél een correcte canonical.

**Nog niet opgelost, want dit vraagt een inhoudelijke keuze:** `/luister` en `/musicmoodcolours`
hebben helemaal geen eigen metadata. Ze vallen terug op de titel `DJ Cylow` en de beschrijving
`DJ Cylow - Professional DJ for your events` uit `layout.tsx`, en hebben geen canonical. Voor de
luisterpagina, die de hele playlist ontsluit, is dat zonde. Daar horen een eigen titel, beschrijving
en canonical bij; wat daar precies moet staan is een SEO-beslissing.

Gecontroleerd: `npm run build` slaagt met 89 pagina's en meldt de `metadataBase`-waarschuwing niet
meer, de gebouwde output bevat geen enkele `localhost`-URL, beide canonicals kloppen in de HTML, en
ESLint meldt onverkort 37 pre-existing errors.

[PR #15](https://github.com/DaveKJohn/djcylow-react/pull/15)

---

## Releases

De vastgelegde versies — nieuwste bovenaan; elke regel linkt naar de volledige release-notes.

### [v2.21.0] - 2026-07-25 — Minor

Zie [releases/development/2.21/2.21.0.md](releases/development/2.21/2.21.0.md)

> Gecut, **nog niet live**. De `← LIVE`-markering verschuift hierheen zodra v2.20.2 en v2.21.0
> samen zijn uitgerold en de deploy geslaagd is.

---

### [v2.20.2] - 2026-07-25 — Patch

Zie [releases/development/2.20/2.20.2.md](releases/development/2.20/2.20.2.md)

> Gecut, **nog niet live**. Gaat samen met v2.21.0 uit bij de eerstvolgende live-push; de
> `← LIVE`-markering springt dan naar v2.21.0, de bovenste van de twee.

---

### [v2.20.1] - 2026-07-02 — Patch ← LIVE

Zie [releases/development/2.20/2.20.1.md](releases/development/2.20/2.20.1.md)

---

### [v2.20.0] - 2026-07-02 — Minor

Zie [releases/development/2.20/2.20.0.md](releases/development/2.20/2.20.0.md)

---

### [v2.19.2] - 2026-06-28 — Patch

Zie [releases/development/2.19/2.19.2.md](releases/development/2.19/2.19.2.md)

---

### [v2.19.1] - 2026-06-28 — Patch

Zie [releases/development/2.19/2.19.1.md](releases/development/2.19/2.19.1.md)

---

### [v2.19.0] - 2026-06-28 — Minor

Zie [releases/development/2.19/2.19.0.md](releases/development/2.19/2.19.0.md)

---

### [v2.18.0] - 2026-06-27 — Minor

Zie [releases/development/2.18/2.18.0.md](releases/development/2.18/2.18.0.md)

---

### [v2.17.0] - 2026-06-27 — Minor

Zie [releases/development/2.17/2.17.0.md](releases/development/2.17/2.17.0.md)

---

### [v2.16.4] - 2026-06-27 — Patch

Zie [releases/development/2.16/2.16.4.md](releases/development/2.16/2.16.4.md)

---

### [v2.16.3] - 2026-06-27 — Patch

Zie [releases/development/2.16/2.16.3.md](releases/development/2.16/2.16.3.md)

---

### [v2.16.2] - 2026-06-27 — Patch

Zie [releases/development/2.16/2.16.2.md](releases/development/2.16/2.16.2.md)

---

### [v2.16.1] - 2026-06-27 — Patch

Zie [releases/development/2.16/2.16.1.md](releases/development/2.16/2.16.1.md)

---

### [v2.16.0] - 2026-06-25 — Minor

Zie [releases/development/2.16/2.16.0.md](releases/development/2.16/2.16.0.md)

---

### [v2.15.0] - 2026-06-25 — Minor

Zie [releases/development/2.15/2.15.0.md](releases/development/2.15/2.15.0.md)

### [v2.14.4] - 2026-06-25 — Patch

Zie [releases/development/2.14/2.14.4.md](releases/development/2.14/2.14.4.md)

### [v2.14.3] - 2026-06-25 — Patch

Zie [releases/development/2.14/2.14.3.md](releases/development/2.14/2.14.3.md)

### [v2.14.2] - 2026-06-25 — Patch

Zie [releases/development/2.14/2.14.2.md](releases/development/2.14/2.14.2.md)

### [v2.14.1] - 2026-06-25 — Patch

Zie [releases/development/2.14/2.14.1.md](releases/development/2.14/2.14.1.md)

### [v2.14.0] - 2026-06-25 — Minor

Zie [releases/development/2.14/2.14.0.md](releases/development/2.14/2.14.0.md)

### [v2.13.0] - 2026-06-18 — Minor

Zie [releases/development/2.13/2.13.0.md](releases/development/2.13/2.13.0.md)

### [v2.12.0] - 2026-06-16 — Minor

Zie [releases/development/2.12/2.12.0.md](releases/development/2.12/2.12.0.md)

### [v2.11.1] - 2026-05-10 — Patch

Zie [releases/development/2.11/2.11.1.md](releases/development/2.11/2.11.1.md)

### [v2.11.0] - 2026-05-08 — Minor

Zie [releases/development/2.11/2.11.0.md](releases/development/2.11/2.11.0.md)

### [v2.10.0] - 2026-05-05 — Minor

Zie [releases/development/2.10/2.10.0.md](releases/development/2.10/2.10.0.md)

### [v2.9.0] - 2026-05-01 — Minor

Zie [releases/development/2.9/2.9.0.md](releases/development/2.9/2.9.0.md)

### [v2.8.0] - 2026-04-20 — Minor

Zie [releases/development/2.8/2.8.0.md](releases/development/2.8/2.8.0.md)

### [v2.7.0] - 2026-04-13 — Minor

Zie [releases/development/2.7/2.7.0.md](releases/development/2.7/2.7.0.md)

### [v2.6.0] - 2026-04-11 — Minor

Zie [releases/development/2.6/2.6.0.md](releases/development/2.6/2.6.0.md)

### [v2.5.0] - 2026-04-10 — Minor

Zie [releases/development/2.5/2.5.0.md](releases/development/2.5/2.5.0.md)

### [v2.4.0] - 2026-03-20 — Minor

Zie [releases/development/2.4/2.4.0.md](releases/development/2.4/2.4.0.md)

### [v2.3.0] - 2026-03-19 — Minor

Zie [releases/development/2.3/2.3.0.md](releases/development/2.3/2.3.0.md)

### [v2.2.0] - 2026-03-13 — Minor

Zie [releases/development/2.2/2.2.0.md](releases/development/2.2/2.2.0.md)

### [v2.1.0] - 2026-03-11 — Minor

Zie [releases/development/2.1/2.1.0.md](releases/development/2.1/2.1.0.md)

### [v2.0.1] - 2026-03-08 — Patch

Zie [releases/development/2.0/2.0.1.md](releases/development/2.0/2.0.1.md)

### [v2.0.0] - 2026-03-07 — Major

Zie [releases/development/2.0/2.0.0.md](releases/development/2.0/2.0.0.md)
