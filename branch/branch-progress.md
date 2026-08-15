## `config/tailwind-eruit` progress

### Steps

- [x] Bevestigd in de gebouwde CSS dat Tailwind nooit iets genereerde (nul `--tw-`, nul `backdrop`)
- [x] `tailwindcss` en `@tailwindcss/postcss` uit `package.json`, `npm install` gedraaid
- [x] `postcss.config.mjs` en `src/app/globals.scss` verwijderd
- [x] `.w-fix` uit alle 28 voorkomens gehaald (25 automatisch, 3 in template literals)
- [x] `.flex` uit alle 6 voorkomens gehaald
- [x] `.size-base` en `.size-lg` toegevoegd aan `$utility-styles`
- [x] Gemeten in de nieuwe CSS: beide staan er nu in, `w-fix` nergens, nog steeds geen Tailwind
- [x] `CLAUDE.md` en `README.md` gelijkgetrokken (drie plekken)
- [x] Lint-poort groen, 71 tests

### Where I left off

Klaar voor PR, maar **dit is site-werk en wacht op Dave**.

**Er is precies één zichtbare wijziging, en die zit op de mixpagina's.** `size-base` en `size-lg`
werkten niet en werken nu wel, dus tekst die om die grootte vroeg verandert daadwerkelijk van
grootte. Kijk op de deploy preview naar `/luister/mix/<willekeurige-slug>`, bij de blokken met de
beschrijving en de tracklist — daar staan ze naast `size-sm`/`size-xs`.

Het verwijderen van `.w-fix` (28×) en `.flex` (6×) verandert niets: die klassen bestonden in geen
enkele stylesheet, dus ze deden al niets. Dat is ook waarom `w-fix` is weggehaald in plaats van
gedefinieerd — een definitie erbij zou de layout op 28 plekken wél veranderen, en niemand kan
vaststellen welke breedte de bedoeling was.
