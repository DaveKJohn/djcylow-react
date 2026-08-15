## `style/kleuren-uit-het-palet` progress

### Steps

- [x] De dertien losse hexwaarden inventariseren en per stuk vaststellen wat ze zijn
- [x] De tien gradient-stops uit `v.$colors` halen; de twee wrap-kleuren benoemen
- [x] `filter.scss` en `_tools.scss` naar het palet
- [x] De drie YouTube-kleuren juist buiten het palet houden, met de reden erbij
- [x] Issue #116 beslecht: de splitter houdt `--black-70`, vastgelegd in `_layout.scss`
- [x] Meten: gebouwde CSS voor en na vergelijken (gradient byte-identiek, 32 = 32 zwart-important)
- [x] Contrast van `#ffffff` → `#eeeeee` narekenen op de drie donkere achtergronden
- [x] ESLint-teller terug naar 0/0

### Where I left off

De poort staat groen (0 errors, 0 warnings, 89 pagina's) en 207 tests slagen. Dit is site-werk
(`src/`), dus het wacht onder de normale regel op Dave — deze keer gedekt door zijn staande akkoord
voor deze sessie.

Wat na de merge nog kan: issue #79 opnieuw meten nu de hero gerepareerd is, om te zien of
`overflow-x: hidden` op `musicmoodcolours` nog nodig is.
