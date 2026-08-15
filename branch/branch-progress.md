## `config/componenttests` progress

### Steps

- [x] Vitest van een DOM en de `@/`-alias voorzien (`vitest.config.mts`), met de omgeving per bestand
      in plaats van globaal zodat `mix-data.test.ts` in node blijft draaien
- [x] `@testing-library/react`, `@testing-library/jest-dom` en `jsdom` toevoegen als devDependencies
- [x] `tests/EmailDisplay.test.tsx` — de component die het adres pas in de browser samenstelt
- [x] `tests/MobileContent.test.tsx` — met een werkende `matchMedia`-stub, want zonder listeners zou
      de belangrijkste test (schalen naar desktop) slagen zonder iets te bewijzen
- [x] `tests/AudioPlayer.test.tsx` — met gestubde `play()`/`pause()`, die jsdom niet implementeert
- [x] `tests/setup-dom.ts` — de jest-dom-matchers plus `afterEach(cleanup)`; zonder dat laatste
      stapelen de renders zich op en faalt elke query op "found multiple elements"
- [x] De configwaarschuwing wegnemen door `vitest.config.ts` → `.mts` (niet via `"type": "module"`,
      want dat raakt de Next-build en die staat buiten deze branch)
- [x] Meten dat de suite een echte wacht is: de render-phase reset in `MobileContent` en de
      `onPause`-handler in `AudioPlayer` tijdelijk gesloopt — beide werden gevangen door precies de
      bedoelde test, zonder ruis, waarna `src/` is teruggezet
- [x] Poort: `scripts/lint/lint-web.ps1` groen (0 fouten, 0 warnings, 89 pagina's), 71 tests groen

### Where I left off

Af. De poort staat open en de entry is ingevuld. Deze branch raakt `tests/`, `vitest.config.mts` en
`package.json` — geen `src/`, `public/` of `src/data/mixes/` — en valt daarmee onder de default: de
PR kan openen, mergen en folden zonder tussenvraag.

Wat bewust niet in deze suite zit, als testgat gemeld in plaats van stilgehouden:

- **De timeline-klik in `AudioPlayer`.** Die rekent met `getBoundingClientRect()`, en jsdom geeft
  daar overal nullen op — een test erop zou een berekening met NaN vastleggen in plaats van gedrag.
- **Dat het e-mailadres níét in de gebouwde HTML staat.** jsdom rendert altijd de clientsnapshot, dus
  daar valt dit niet te bewijzen. Die kant is gemeten op de echte build en de deploy preview.
- **`Playlist`**, die in een eerdere wijziging (`359e414`) dezelfde render-phase-reset kreeg. Buiten
  de scope die de branchtitel afbakent — maar het is dezelfde constructie en dus dezelfde kans dat
  iemand hem later "netjes" terugzet naar een effect. Kandidaat voor een volgende branch.
