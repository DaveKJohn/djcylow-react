## `config/testsuite-permalink-en-ratchets` progress

### Steps

- [x] De vier issues geverifieerd tegen de boom in plaats van ze over te nemen. Twee correcties:
      `Filter.test.tsx` en `send-email.test.ts` bestonden al (#73 sprak over "33 van de 36 componenten
      zonder test"), en `mixSlug`/`liveMixes` zijn al geëxtraheerd naar `src/data/mixes/all.ts` — de
      extractie die #69 en #73 als bouwerswerk aankondigden, is er dus al
- [x] Alle plafonds gemeten op de echte data: 77 live mixen, 2667 tracks, 2444 tijd-overtredingen
      (73 entries), 70 scheiding-overtredingen (33 entries), 0 duplicaten in `description_en`, 0
      en-dashes, 0 permalink-problemen
- [x] #70: de twee ratchets omgezet naar trackniveau, met de reden in de suite zelf
- [x] #70 negatief getoetst zónder de repo-data aan te raken: een in-memory simulatie liet de oude
      teller op 73 staan bij zowel een nieuwe overtreding als bij 41 reparaties, terwijl de nieuwe
      teller naar 2445 respectievelijk 2403 bewoog
- [x] #69: vijf harde permalink-asserties, met de slug-afleiding gelijk aan die in `all.ts`
- [x] #72: `description_en` op uniciteit, de en-dash in de dash-regex (plafonds bewegen niet, wat
      bevestigt dat er geen en-dashes staan), en een ratchet op 77 live mixen
- [x] #72: de anti-scrape-eigenschap van `EmailDisplay` vastgelegd met `renderToStaticMarkup`, en de
      kanttekening gecorrigeerd die zei dat dit niet te testen viel
- [x] #73: `tests/sitemap.test.ts` (dertien tests) en `tests/Playlist.test.tsx` (dertien tests)
- [x] De sitemap-koppeling negatief getoetst: `.toLowerCase()` tijdelijk uit `sitemap.ts` gehaald →
      twee tests vielen om. Daarna hersteld met `git checkout` en geverifieerd dat `src/` schoon is
- [x] `CLAUDE.md` bijgewerkt: die sprak van vier suites en 36 tests, en het zijn er acht en 143
- [~] `ContactForm.tsx` testen (#73 noemt dit "de belangrijkste") — niet in deze branch. Het is een
      component in `src/`, dus site-werk, en de branch zou daarmee op Dave gaan wachten terwijl de
      rest doorloopt. De backend (`send-email.js`) is al gedekt
- [~] De spec-correctie van #69 (`permalink` herclassificeren in `src/data/mixes/README.md`) — hoort
      bij dezelfde issue maar raakt `src/data/mixes/`, dus die gaat naar een eigen branch die op
      Dave's woord wacht. #69 blijft daarom open

### Where I left off

Af, 143 tests groen, de poort groen. Deze branch raakt alleen `tests/` en `CLAUDE.md`, dus de keten
loopt door tot en met de fold.

Sluit #70 en #72 volledig. **#69 en #73 blijven bewust open**: van #69 staat het spec-deel nog open en
van #73 het `ContactForm`-deel, en beide raken `src/`. Dat staat hierboven bij de twee `[~]`-stappen.

Wat hierna logisch is voor wie deze suite oppakt: de tijd-conversie zelf. 2444 van de 2667
tracklist-tijden staan niet in `HH:MM:SS`, de conversie is volledig mechanisch (`MM:SS` → `00:MM:SS`),
en de ratchet is er nu geschikt voor gemaakt — hij telt per track, dus elke reparatie is zichtbaar. Dat
is wel een wijziging in `src/data/mixes/`.
