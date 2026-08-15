## `data/emoji-descriptions-en-preview-ids` progress

### Steps

- [x] De drie punten gemeten vóór ik koos: 7/7 Cyan op 🧊, drie descriptions op 165/167/162, en vijf
      naamconventies over acht preview-entries
- [x] Cyan: de **spec** aangepast en niet de data — die zeven titels staan al op Spotify, en ze hier
      herschrijven zou repo en uploads uit elkaar laten lopen
- [x] De drie beschrijvingen ingekort naar 152/155/148, met het use-case-signaal behouden
- [x] De twee ratchets bijgesteld die daardoor terecht klaagden: te lang 3 → 0, met dash 13 → 11
- [x] De acht preview-id's op één conventie (`Kleur_light_preview`) en de afwijkende title van
      `light-red` gelijkgetrokken
- [x] **Eerste poging teruggedraaid**: `JSON.stringify(…, null, 4)` herformatteerde de bestanden en
      gaf 7451 diffregels voor 8 wijzigingen (CRLF, twee spaties, arrays op één regel). Opnieuw
      gedaan met gerichte tekstvervanging: 17 regels
- [x] Poort groen, 207 tests groen, nog steeds 89 pagina's

### Where I left off

Af. Zichtbaar op de site: drie zoekresultaten worden niet meer afgekapt. De preview-id's en de
Cyan-emoji raken de bezoeker niet.

Sluit #95.
