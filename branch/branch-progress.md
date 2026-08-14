## `config/scss-typedeclaratie` progress

### Steps

- [x] Getest of de geplande `.d.ts` nodig is: één `@ts-ignore` weggehaald, `tsc` draaide groen
- [~] Geen `src/types/scss.d.ts` aangemaakt — de meting hierboven weerlegde de aanname uit het
      voorstel; `next-env.d.ts` levert de declaratie al, dus het bestand zou niets doen
- [x] Alle 16 `@ts-ignore`-regels boven stylesheet-imports verwijderd
- [x] De 2 `eslint-disable-next-line`-regels in `Playlist.tsx` en `Filter.tsx` mee verwijderd
- [x] `GoogleReviews.tsx` apart getoetst — die importeert CSS uit `node_modules` en kon dus wél echt
      falen; `tsc` en de build accepteren hem zonder onderdrukking
- [x] Nagemeten: 27 → 13 errors over 7 bestanden, `ban-ts-comment` volledig weg, warnings op 8
- [x] Diff gereviewd: 18 verwijderde regels in `src/`, 0 toegevoegd, geen import geraakt
- [x] Het getal bijgewerkt op alle vier de levende plekken, plus de `.d.ts`-claim in `CLAUDE.md`
      gecorrigeerd die uit het oorspronkelijke voorstel stamde
- [x] Poort groen: `lint-web.ps1` (tsc + build, 89 pagina's) en `npm test` (36 tests)

### Where I left off

De branch is af. Stap 2 van vier; deze raakt `src/` en valt dus onder de uitzondering "zichtbaar
resultaat" — visueel is er niets te zien, maar dat oordeel is Dave's en niet dat van een poort. De
deploy preview van de PR is het bewijsmiddel.

Wat resteert voor stap 3 (`fix/react-hooks-en-types`), 13 errors over 7 bestanden:

- 4× `react-hooks/set-state-in-effect` — `AudioPlayer.tsx`, `MobileContent.tsx` (2×),
  `EmailDisplay.tsx`. Inhoudelijk het waardevolst: de audioplayer en de mobiele navigatie
- 5× `no-explicit-any` — `luister/mix/[slug]/page.tsx` (3), `ContactForm.tsx` (2)
- 4× `react/no-unescaped-entities` — `BasiskleurenCarousel.tsx`, `Erlenmeyers.tsx`

Daarna stap 4: ESLint als derde stap in `lint-web.ps1`, waarmee "vergelijk het aantal" ophoudt een
afspraak te zijn die iemand moet onthouden.

