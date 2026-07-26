### Vijf afgeleide velden voor alle mixen: `id_spotify`, `bpm`, `title_spotify`, `tracks` en `volume_spotify`
**Branch naam** data/spotify-velden
**Datum merge op main** 2026-07-26
**Branch type** Data

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
delen; Cyan krijgt 💠 omdat Unicode geen cyaan cirkel kent. Het `id` staat er naast het volume
omdat het volume alleen de titel niet uniek maakt: die reeks loopt per subgenre, dus dezelfde
`Vol. N` komt binnen één kleur + power + frequentie meerdere keren voor (`Red Light (m) Vol. 1`
bestaat als Tech House, Progressive House én Melodic Techno). Het volume staat er voor de
leesbaarheid, het `id` garandeert de uniciteit — alle 77 titels zijn nu uniek.

**`tracks`** — het aantal items in de `tracklist`, één keer geteld en vastgelegd zodat het nooit
meer opnieuw geteld hoeft te worden. Loopt van 22 tot 46 met een mediaan van 35; samen 2667 tracks
over de 77 mixen.

**`volume_spotify`** — een doorlopend nummer per kleur + power + frequentie + BPM, chronologisch met
de oudste mix als `1`. Bewust zonder het subgenre, zodat een nummer binnen één reeks nooit twee keer
voorkomt: het bestaande `volume` kan dat niet, omdat die reeks juist per subgenre loopt. Drum & Bass
vormt een eigen reeks, dus `Red Light (m)` heeft zes 128 BPM-mixen als `1` t/m `6` plus één
176 BPM Neurofunk-mix die zijn eigen `1` is. Levert 27 reeksen over de 77 mixen, met
`Purple Light (f)` 176 BPM als langste (`1` t/m `9`). Bewust nog niet gebruikt in `title_spotify`:
die draagt nog het `volume` van de site, en of de Spotify-titel moet overstappen is een open
beslissing.

De acht preview-entries (`ignore: true`) krijgen lege waarden (`""` en `0` voor de getalvelden), in
lijn met hoe hun `date`, `volume` en `description`-velden al leeg staan.

Meegenomen zodat de data niet meteen weer uit de pas loopt: `scripts/add-mix.js` genereert de vijf
velden nu voor elke nieuwe mix (met `176` als voorstel bij Drum & Bass), de `Mix`-interface in
`src/app/luister/mix/[slug]/page.tsx` kent ze, en `src/data/mixes/README.md` beschrijft ze als
onderdeel van het schema.
