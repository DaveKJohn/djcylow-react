### Spotify-velden `id_spotify`, `bpm` en `title_spotify` voor alle mixen
**Branch naam** data/spotify-velden
**Datum merge op main** 2026-07-26
**Branch type** Data

Alle 85 entries in `src/data/mixes/*.json` hebben drie nieuwe velden gekregen, zodat de JSON de
enige administratie van een mix blijft, ook voor de Spotify-kant. De site gebruikt de velden
(nog) niet: er is geen component of route die ze leest, dus de publieke pagina's veranderen niet.

**`bpm`** — het tempo als getal, nieuw als eigenstandig veld. Tot nu toe zat de BPM alleen
versleuteld in de `audioSrc`-bestandsnaam en de `permalink`, en die spraken elkaar op twee plekken
tegen. Vastgestelde regel: Drum & Bass is altijd `176`, voor de overige genres geldt de BPM uit de
`audioSrc`. Dat dekt alle 77 echte mixen zonder gaten en levert 46× `176`, 30× `128` en 1× `112`.

**`id_spotify`** — `mmc_edm_{bpm}bpm_{power}_{freq}_{color}_{id}`, bijvoorbeeld
`mmc_edm_128bpm_light_m_yellow_20251021`. Uniek over alle mixen doordat het `id` erin zit.

**`title_spotify`** — `EDM {bpm}BPM {emoji} {Color} {Power} ({freq}) {emoji} Vol. N`, bijvoorbeeld
`EDM 128BPM 🟡 Yellow Light (m) 🟡 Vol. 7`. Cyan krijgt 💠 omdat Unicode geen cyaan cirkel kent.
Deze waarde is bewust niet uniek: het formaat laat het subgenre weg terwijl de volume-reeks per
subgenre loopt, waardoor drie titels in `light-red.json` samenvallen.

De acht preview-entries (`ignore: true`) krijgen lege waarden (`""` en `bpm: 0`), in lijn met hoe
hun `date`, `volume` en `description`-velden al leeg staan.

Meegenomen zodat de data niet meteen weer uit de pas loopt: `scripts/add-mix.js` genereert de drie
velden nu voor elke nieuwe mix (met `176` als voorstel bij Drum & Bass), de `Mix`-interface in
`src/app/luister/mix/[slug]/page.tsx` kent ze, en `src/data/mixes/README.md` beschrijft ze als
onderdeel van het schema.
