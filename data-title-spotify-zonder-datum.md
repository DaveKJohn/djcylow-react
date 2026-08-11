### Het datumstaartje uit alle `title_spotify`-waardes · Data · 2026-08-11

Alle 77 gevulde `title_spotify`-waardes eindigden op het id van de mix, voorafgegaan door nog een
kleur-emoji: `EDM 128BPM 🟠 Orange Light (f) 🟠 Vol. 7 🟠 20260101`. Die datum hoort in `id` en
`id_spotify`, niet in een titel die luisteraars op Spotify lezen. De emoji en het datumdeel zijn eraf
gehaald, zodat het formaat afsluit op het volumenummer: `EDM 128BPM 🟠 Orange Light (f) 🟠 Vol. 7`.

Het datumstaartje stond er omdat een doortellend volume over de hele collectie niet uniek hoefde te
zijn. Dat blijkt in de praktijk niet nodig: `volume_spotify` telt door per kleur + power + frequentie
+ bpm, en die hele reeks staat in de titel. Alle 77 waardes zijn ook zonder datum uniek — nagerekend
na de wijziging.

Meegenomen in dezelfde beweging, zodat het staartje niet terugkomt bij de volgende mix:

- **`scripts/add-mix.js`** — `buildSpotifyTitle()` genereert de titel zonder datum; de `dateCompact`-
  parameter is vervallen en de toelichting in de header klopt weer.
- **`src/data/mixes/README.md`** — de veldspec, de twee voorbeeld-JSON's en de checklist volgen het
  nieuwe formaat. De regel "**Do not drop the `id` from the format**" is vervangen door de uitleg
  waarom het volumenummer de uniciteit nu alleen draagt, met de waarschuwing dat een dubbele
  `volume_spotify` binnen één reeks nu wél een dubbele titel oplevert.

De site leest `title_spotify` niet — het veld staat in de mix-JSON als administratie van de
Spotify-upload. Deze wijziging is dus niet zichtbaar op `djcylow.com`.
