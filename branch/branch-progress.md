## `fix/react-hooks-en-types` progress

### Steps

- [x] `AudioPlayer`: de overbodige `setIsPlaying(false)` weg; `onPause` deed dat al
- [x] `MobileContent`: viewport en mount-vlag via `useSyncExternalStore`; het sluiten van de drawer
      bij navigatie en bij schalen naar desktop tijdens de render in plaats van in een effect
- [x] `EmailDisplay`: `useSyncExternalStore` met `""` als serversnapshot — anti-scraping intact
- [x] Bewezen dat de span leeg blijft in de gebouwde HTML (`<span class="..."><span></span></span>`)
- [x] `as any` op `allMixes` weg — de JSON voldoet gewoon aan `Mix`, `tsc` blijft groen
- [x] `Track`-type geëxtraheerd voor `getTopArtists` en de tracklist-tabel
- [x] `ContactForm`: cast op de dynamische reCAPTCHA-import weg, `catch (error: any)` →
      `error instanceof Error`
- [x] 4× `&quot;` in `BasiskleurenCarousel` en `Erlenmeyers`
- [x] Nagemeten: 13 → **0 errors**, 8 warnings ongewijzigd
- [x] Met en zonder branch gebouwd en alle 86 HTML-pagina's vergeleken: 0 inhoudelijke verschillen
- [~] De 8 warnings niet meegenomen — `no-img-element` vraagt een ontwerpafweging over `next/image`
      bij `unoptimized: true`, en dat is Dave's beslissing, geen opruimwerk
- [x] Docs bijgewerkt: het getal én de nu vervallen "vergelijk op aantal"-instructie, op alle vier
      de levende plekken
- [x] Poort groen: `lint-web.ps1` (tsc + build, 89 pagina's) en `npm test` (36 tests)

### Where I left off

De branch is af. Stap 3 van vier, en de laatste die `src/` raakt.

**Wat deze branch niet kan bewijzen, en waarom hij daarom wacht.** De HTML-vergelijking dekt wat er
uit de build komt; ze zegt niets over gedrag in de browser. Drie dingen vragen om een menselijke
blik op de deploy preview:

1. **De audioplayer** — start één mix, start dan een tweede: de eerste hoort te stoppen
2. **De mobiele navigatie** — drawer openen, navigeren (moet sluiten), en het venster van mobiel
   naar desktop schalen met de drawer open (moet sluiten)
3. **Het e-mailadres in de footer** — moet zichtbaar zijn zodra de pagina in de browser draait

**Testgat, eerlijk gemeld** (Tycho 🧪): de testsuite dekt uitsluitend de mix-data. Er is geen enkele
componenttest, dus geen van de drie punten hierboven wordt door een test bewaakt — niet vóór deze
branch en niet erna. Dat is geen regressie maar wel de reden dat de bewijslast hier bij het oog ligt.

**Stap 4 ligt klaar en is nu triviaal geworden:** ESLint als derde stap in `lint-web.ps1`, waarmee
de teller definitief door een check wordt vervangen. Die branch raakt alleen de poort en niet `src/`,
dus hij loopt onder de PR-regel gewoon door — maar hij kan pas ná deze branch, anders blokkeert de
poort op de dertien errors die hier verdwijnen.

