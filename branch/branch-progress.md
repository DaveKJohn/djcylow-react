## `fix/green-full-vol2-audio-404` progress

### Steps

- [x] Alle 85 `audioSrc`-velden opvragen — één 404 gevonden
- [x] Uitzoeken of het bestand echt weg is of anders heet (`_f_` in plaats van `_m_`)
- [x] Verifiëren dat het de juiste opname is: bitrate uit de MP3-header tegen de tracklistduur
- [x] De `audioSrc` corrigeren met een gerichte vervanging (1 regel diff, geen herformattering)
- [x] `scripts/check-audio.js` + `npm run mix:check-audio`, negatief getoetst
- [x] Meten of de 25 Full-mixen al op de actieve bucket staan (0 van 25) en dat vastleggen
- [x] `README.md` en `CLAUDE.md` bijwerken
- [x] Poort en testsuite

### Where I left off

Alle 85 audio-URL's staan op 200. Poort groen, 207 tests groen.

Wat hierna aan Dave is, en alleen aan hem: de 25 Full-mixen naar de actieve bucket kopiëren (issue
#68 blijft daarvoor open). Pas ná die kopie kunnen de URL's om. En als `Green_Full_f_…20231127…`
ooit hernoemd wordt naar `_m_`, moet dit veld mee.
