## `config/contactform-tests` progress

### Steps

- [x] De vier dingen bepaald die stil kunnen breken, en daar de tests op geschreven in plaats van op
      de implementatie
- [x] `IntersectionObserver` gestubd — jsdom kent hem niet, en zonder stub wacht elke test op de
      zes-secondenfallback van de lazy captcha
- [x] De reCAPTCHA-widget vervangen door een knop die een token teruggeeft; wat telt is wat de
      component met het token dóet
- [x] Negatief getoetst op de veldnaam-bug (#42): `name` → `firstName` laat de test vallen
- [x] Negatief getoetst op de token-reset (#51): de reset weghalen laat de test vallen
- [x] Een test op `bot-field`, zodat de honeypot die vandaag in de function is aangesloten niet stil
      kan verdwijnen aan de clientkant
- [x] Poort groen; volledige suite 202 tests groen (was 193)
- [~] `sitemap.ts` en het `Playlist`-filter uit #73 — die zijn al gedekt sinds PR #111
      (`tests/sitemap.test.ts` en `tests/Playlist.test.tsx`)
- [~] De pure functies uit `[slug]/page.tsx` (`findMixBySlug`, `formatArtists`) — die worden niet
      geëxporteerd, dus testen vraagt eerst een extractie. Het issue noemt dat zelf bouwerswerk, en
      het gedrag is inmiddels indirect gedekt door de permalink-asserties in `mix-data.test.ts`
- [~] De canvas-componenten van Music Mood Colours — het issue tekent zelf aan dat een groene test
      daar niets zou bewijzen over hoe ze eruitzien. Dat blijft een eerlijk testgat

### Where I left off

Af. Raakt alleen `tests/`, dus dit had ook zonder yolo doorgelopen.

Sluit **#73**.
