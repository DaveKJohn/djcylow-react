## `fix/mix-add-schema` progress

### Steps

- [x] Werkelijke bestandsnaampatronen op schijf gemeten (`public/images/**`) i.p.v. aangenomen
- [x] `buildImagePaths` gecorrigeerd voor wide én square; geverifieerd tegen vier bestaande mixen
- [x] `genreSlug` als enige bron; `buildSpotifyId`/`buildSpotifyTitle` krijgen `genre` mee
- [x] `description` gesplitst in `description_nl` + `description_en`
- [x] Prompt herschreven: geen dash, geen artiestnamen, 120-160 tekens, beide talen
- [x] `keurBeschrijving` toont dezelfde grens als de testpoort, vóór het opslaan
- [x] `verifyAudioSrc`: HEAD-request op de R2-URL i.p.v. blind vertrouwen
- [x] Kopdocumentatie van het script gelijkgetrokken met het nieuwe gedrag
- [x] Lint-poort groen

### Where I left off

Klaar voor PR. Het script is niet interactief gedraaid (dat zou een echte mix toevoegen); de
pure padfuncties zijn los getoetst tegen de schijf — 11 van de 12 paden bestaan, en de twaalfde
is het werkelijk ontbrekende `full/blue/square/`-bestand uit issue #66.

Wat hierna volgt: #46, #66 en #67 ruimen de data op die dit script heeft geproduceerd. Die drie
konden niet eerder, want dan zou het gereedschap ze bij de volgende mix opnieuw maken.
