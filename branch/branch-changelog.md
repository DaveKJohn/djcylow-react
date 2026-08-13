# `data/cyan-emoji-is-ijsblokje` changelog

### Branch title

Cyan draagt in `title_spotify` het ijsblokje, niet de ruit

### Branch ID

20260811-214033

### Branch type

data

### What does the change on this branch bring to main?

Alle zeven Cyan-mixen schreven hun `title_spotify` met **💠** (U+1F4A0, *diamond with a dot*) als
kleur-emoji, terwijl Dave's eigen Spotify-playlists en de MMC-kleurcodering **🧊** (U+1F9CA, *ice*)
gebruiken. De zes andere kleuren in de bron komen wél overeen met hun playlists — Cyan was de enige
afwijking, en hij stond in élke Cyan-entry.

Dat veld bestaat om letterlijk overgenomen te worden: `title_spotify` is de exacte playlistnaam die bij
een mix hoort. Een afwijkende emoji is daar geen cosmetisch detail maar een verkeerde naam, en hij zou
zich hebben voortgeplant naar Spotify zodra die overname wordt uitgevoerd.

- **`full-cyan.json`** — 1 entry (`20240129`), 3 emoji's.
- **`light-cyan.json`** — 6 entries (`20251108`, `20250619`, `20250515`, `20250307`, `20241213`,
  `20220606`), 18 emoji's.

Samen 21 vervangingen over 7 waarden; elke titel draagt de emoji drie keer (na de kleur, na de
frequentie, en vóór het mix-ID). De diff raakt **uitsluitend** `title_spotify`-regels: `title`,
`description_nl`/`description_en` en de overige velden dragen deze emoji niet en zijn niet aangeraakt.
De preview-stub in `light-cyan.json` heeft een leeg `title_spotify` en blijft dus zoals hij was.

**Hoe dit aan het licht kwam.** In `life-hub` is de leeslaag gebouwd die deze namen naar Spotify
overneemt (branch `app/playlistnamen-uit-de-bron`). Die hub kent de canonieke kleur-emoji's en
**weigert** een naam te schrijven waarvan de kleur-emoji niet bij de kleur van de mix hoort, in plaats
van hem stil te corrigeren — anders zou een fout in de bron onzichtbaar blijven en zouden de twee
bronnen permanent uiteenlopen. Dave heeft vastgesteld dat de bron hier fout zat en dat de correctie
daarom hier hoort, niet in de hub. Zolang deze branch niet gemergd is, blokkeert de hub die zes
Cyan-playlists met de reden erbij; na de merge lopen ze mee zonder dat er in `life-hub` iets verandert.

**Geen zichtbaar gevolg voor de website.** De site gebruikt `title` voor wat bezoekers zien; dit veld is
uitsluitend voor de Spotify-kant en wordt door de pagina's niet gerenderd.

### Significance

#### Tier 0

Wie de mix-data leest heeft vanaf nu één regel die klopt in plaats van zes uitzonderingen: de
kleur-emoji in `title_spotify` hoort bij de kleur van de mix, voor alle veertien bestanden. Dat is
precies de aanname waarop de leeslaag in `life-hub` is gebouwd, en die aanname was tot nu toe onwaar
voor Cyan. Het was bovendien een **stille** fout — niets faalde, de waarde was alleen verkeerd, en hij
werd pas zichtbaar doordat een tweede systeem hem weigerde in plaats van hem te repareren.

**Score:** 2

#### Tier 1

Zes Cyan-playlists staan in `life-hub` geblokkeerd zolang de bron de verkeerde emoji draagt. Na deze
merge lopen ze mee zonder dat er aan die kant iets hoeft te gebeuren. Aan de website verandert niets:
`title_spotify` wordt door geen enkele pagina gerenderd, dus dit is een correctie aan de Spotify-kant
van de data en niet aan wat een bezoeker ziet.

**Score:** 2

### Pull Request
