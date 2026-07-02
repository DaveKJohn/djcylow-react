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