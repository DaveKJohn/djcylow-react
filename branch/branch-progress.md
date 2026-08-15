## `fix/jsonld-escaping` progress

### Steps

- [x] Alle `application/ld+json`-plekken in `src/` gezocht: **twee**, niet één zoals het issue meldt —
      de `BreadcrumbList` had dezelfde vorm als de `MusicPlaylist`
- [x] Beide via één `jsonLdScript()` gehaald, met de reden en de vertrouwensgrens in de code
- [x] Zeven tests: vier op de bewerking zelf, drie op de broncode — die tweede groep is de reden dat
      de eerste blijft werken
- [x] Negatief getoetst door de kale `JSON.stringify` terug te zetten: twee tests vielen om, daarna
      hersteld en opnieuw groen
- [x] Gemeten in de gebouwde HTML: beide blokken parseren als geldige JSON (`MusicPlaylist` en
      `BreadcrumbList`), en nul escapes omdat de huidige data geen `<` bevat
- [x] Poort groen
- [~] De andere `dangerouslySetInnerHTML`-plekken (`Hero`, `Diensten`, `MeetTheDJ`, `Promo`,
      `Referenties`) — bewust niet aangeraakt: die lezen uit `src/content/*.ts`, dat met de hand
      geschreven is. Daar is de grens hard, en dezelfde behandeling zou suggereren dat hij dat niet is

### Where I left off

Af, poort groen, tests groen. Raakt `src/`, maar loopt door onder het yolo-akkoord van 2026-08-15.

Sluit #96.
