### Fix genre filter matching subgenre family
**Branch naam** fix/genre-subgenre-family-mapping
**Datum merge op main** 2026-07-02
**Branch type** Fix

De `genre` filter op de Luister-pagina gaf geen resultaten voor `House`, `Techno` en `Nu-Disco`
omdat het `genre` veld in de mix-JSON's altijd `"EDM"` of `"Drum & Bass"` was, terwijl het filter
op deze specifiekere subgenre-families matchte. `genre` is nu bijgewerkt naar de subgenre-familie
(`House`, `Techno`, `Nu-Disco`, `Drum & Bass`) voor alle 31 betrokken mixen, het dode `EDM`
filterknop is verwijderd uit `Filter.tsx`, en `src/data/mixes/README.md` beschrijft de nieuwe
mapping tussen `subgenre` en `genre`.

Daarnaast tijdens het testen van deze branch gevonden en meegenomen:
- Twee Red mixen (`20250401`, `20241009`) hadden een subgenre-correctie naar Melodic Techno
  gekregen zonder dat title/description meegingen — nu consistent gemaakt
- Mix `20240226` in `full-red.json` is hergeclassificeerd van Neurofunk naar Dancefloor Drum & Bass
  (past beter bij de festival-georiënteerde tracklist), title/descriptions/subgenre bijgewerkt
- De "Laad meer"-knop-container in `Playlist.tsx` verdween niet meer volledig als de limit nog
  niet bereikt was (conditie stond om de button, niet om de omliggende div)
- Layout-shift in de Mood-filter opgelost: de mood-tekst reserveert nu altijd ruimte voor 2 regels,
  en de filterknoppen hebben een vaste borderbreedte (alleen de kleur wisselt tussen states) zodat
  wisselen tussen kleuren de rest van de sidebar niet meer laat verschuiven