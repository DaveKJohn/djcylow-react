## `fix/emaillek-en-dode-imports` progress

### Steps

- [x] `ContactForm`: `EmailDisplay` daadwerkelijk gebruikt in plaats van het adres voluit
- [x] Gemeten: **6 → 0** gebouwde HTML-bestanden met `info@djcylow.com`
- [x] De non-breaking space vóór het adres behouden (die houdt "naar" en het adres op één regel)
- [x] `Navigation`: dode `useState`/`useEffect`-imports weg
- [x] `send-email.js`: `catch (e)` → `catch {}` met de reden erbij
- [x] `page.tsx`: imports van de uitgeschakelde secties weg, commentaarregels in de JSX behouden
- [~] Niet besloten óf `Referenties`/`GoogleReviews` terugkomen — dat is een contentvraag en staat
      los van de dode import; de uitgecommentarieerde regels dragen die vraag verder
- [x] `Hero`: beide `no-img-element`-warnings onderdrukt mét de afweging in de code
- [x] `Hero`: alt-teksten vervangen — `heroDesktop`/`heroMobile` beschreven het bestand, niet de foto
- [x] Poort groen: tsc + eslint (**0 errors, 0 warnings**) + build (89 pagina's), 36 tests

### Where I left off

De branch is af. De ESLint-teller staat op **0 errors en 0 warnings**.

**Wat dit opleverde is geen opruimwerk.** De aanleiding was de laagste soort melding die er bestaat —
een ongebruikte import — en eronder zat een beveiligingsmaatregel die niets deed. Dat is het argument
om de teller op nul te houden in plaats van op "acht bekende": in een lijst bekende meldingen valt
niet op welke er één te veel is.

**Twee dingen die hieruit volgen en apart werk zijn:**

1. **De dubbele hero-download.** Gemeten: een mobiele bezoeker haalt `hero_desktop.webp` (105 KB)
   binnen bovenop de `hero_mobile.webp` (56 KB) die hij ziet. Oplossing is `<picture>` met
   `<source media=...>`, maar dat vraagt ook een samenvoeging in `hero.scss` (de mobiele variant
   heeft een eigen `height`/`transform`) en dus visuele controle. De meting staat in `Hero.tsx`.
2. **Het testgat**, onveranderd: nul componenttests. De suite dekt alleen mix-data.

