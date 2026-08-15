## `config/dode-dependencies` changelog

### Branch title

Twee ongebruikte dependencies uit de build gehaald

### Branch ID

20260815-171604

### Branch type

config

### What does the change on this branch bring to main?

`gray-matter` en `@next/third-parties` stonden in `dependencies` — niet in `dev` — en werden nergens
geïmporteerd. Gemeten met een grep over `src/`, `netlify/`, `scripts/` en `tests/`: nul treffers voor
allebei. Ze reisden dus mee in elke `npm ci` en elke Netlify-build zonder ooit iets te doen. Uit de
lockfile verdwijnen er daarmee 129 regels.

Vóór het verwijderen is met `npm ls` gecontroleerd dat geen van beide transitief nodig is: ze stonden
alleen als directe dependency in de boom. De poort daarna is groen en de build levert nog steeds
**89** statische pagina's — dat laatste is precies de wacht die gisteren is gebouwd, en dit is de
eerste keer dat hij iets bewijst in plaats van alleen groen te zijn.

**`react-google-reviews` blijft staan**, en dat is een bewuste keuze en geen omissie. Dat pakket heeft
wél twee treffers, allebei in `src/components/home/GoogleReviews.tsx` — een component die in
`page.tsx` is uitgecommentarieerd maar nog bestaat. De dependency verwijderen zou die component
breken. Hij hoort thuis bij de opruiming van de dode componenten (#59), die `src/` raakt en dus op
Dave's woord wacht.

**`yaml` blijft ook staan**, ook al is dat óók nul treffers. Dat is geen dode dependency maar een
expliciet gedeclareerde optionele peer van vite, en `ci.yml` legt in twaalf regels uit waarom: zonder
die declaratie resolvet de boom per platform anders en faalde `npm ci` op Linux terwijl hij lokaal
slaagde.

### Significance

#### Tier 0

Twee pakketten minder in elke install en elke build. Klein in tijd, maar het houdt de
dependency-boom eerlijk: wat erin staat, wordt gebruikt.

**Score:** 2

#### Tier 1

De site verandert niet — zelfde 89 pagina's, zelfde uitvoer. Alleen het bouwproces wordt iets lichter.

**Score:** N/A

### Pull Request

