## `data/title-spotify-zonder-datum` changelog

### Branch title

Het datumstaartje uit alle `title_spotify`-waardes

### Branch ID

20260811-204514

### Branch type

data

### What does the change on this branch bring to main?

Alle 77 gevulde `title_spotify`-waardes eindigden op het id van de mix, voorafgegaan door nog een
kleur-emoji: `EDM 128BPM 🟠 Orange Light (f) 🟠 Vol. 7 🟠 20260101`. Die datum hoort in `id` en
`id_spotify`, niet in een titel die luisteraars op Spotify lezen. De emoji en het datumdeel zijn eraf
gehaald, zodat het formaat afsluit op het volumenummer: `EDM 128BPM 🟠 Orange Light (f) 🟠 Vol. 7`.

Het datumstaartje stond er omdat een doortellend volume over de hele collectie niet uniek hoefde te
zijn. Dat blijkt in de praktijk niet nodig: `volume_spotify` telt door per kleur + power + frequentie
+ bpm, en die hele reeks staat in de titel. Alle 77 waardes zijn ook zonder datum uniek — nagerekend
na de wijziging, en opnieuw nagerekend na de merge met `main`: 77 gevuld, 77 uniek, nul waardes die
nog op een datum eindigen.

Meegenomen in dezelfde beweging, zodat het staartje niet terugkomt bij de volgende mix:

- **`scripts/add-mix.js`** — `buildSpotifyTitle()` genereert de titel zonder datum; de `dateCompact`-
  parameter is vervallen en de toelichting in de header klopt weer.
- **`src/data/mixes/README.md`** — de veldspec, de twee voorbeeld-JSON's en de checklist volgen het
  nieuwe formaat. De regel "**Do not drop the `id` from the format**" is vervangen door de uitleg
  waarom het volumenummer de uniciteit nu alleen draagt, met de waarschuwing dat een dubbele
  `volume_spotify` binnen één reeks nu wél een dubbele titel oplevert.

De site leest `title_spotify` niet — het veld staat in de mix-JSON als administratie van de
Spotify-upload. Deze wijziging is dus niet zichtbaar op `djcylow.com`.

**Samenloop met de Cyan-correctie.** Deze branch stond geparkeerd naast
`data/cyan-emoji-is-ijsblokje`, die in dezelfde `title_spotify`-regels van `full-cyan.json` en
`light-cyan.json` de kleur-emoji 💠 verving door 🧊. Die branch is als eerste gemerged; de zeven
Cyan-waardes dragen hier dus beide wijzigingen — het ijsblokje én geen datum.

### Significance

#### Tier 0

De regel die `title_spotify` beschrijft staat vanaf nu op één plek en klopt: het formaat sluit af op
het volumenummer, `scripts/add-mix.js` genereert het zo, en `src/data/mixes/README.md` schrijft het zo
voor. Tot nu toe genereerde het script een vorm die de spec verbood mee te veranderen ("do not drop
the `id`"), zodat elke nieuwe mix het staartje opnieuw meekreeg. De uniciteit die het datumdeel zou
garanderen is nagerekend in plaats van aangenomen: 77 waardes, 77 uniek.

**Score:** 3

#### Tier 1

De 77 playlistnamen die naar Spotify gaan lezen als titels in plaats van als administratie — geen
datumcode meer achter het volumenummer bij wat een luisteraar ziet. Aan `djcylow.com` verandert niets:
het veld wordt door geen enkele pagina gerenderd.

**Score:** 2

### Pull Request
