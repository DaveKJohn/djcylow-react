## `chore/overflow-propagatie-vastgelegd` progress

### Steps

- [x] Punt (b) van issue #79 narekenen tegen de overflow-propagatieregel
- [x] Meten of `html` ergens een overflow krijgt (gebouwde CSS + inline styles): nul treffers
- [x] `tests/overflow-propagatie.test.ts` schrijven, met de uitleg in de assertion
- [x] Negatief toetsen — en de eerste poging herzien, die door de `@use`-volgorde stil de build brak
- [x] De redenering in `_reset.scss` zetten, waar iemand hem tegenkomt
- [x] Poort en testsuite (210 tests)

### Where I left off

Poort groen, 210 tests groen. De browserverificatie uit het issue (Safari/WebKit) is níét gedaan:
de browserextensie was in deze sessie niet bereikbaar. Het argument staat op de spec plus een meting
van de gebouwde CSS, niet op waarneming in vier browsers — dat is eerlijker gezegd dan gesuggereerd.
Wie het alsnog wil zien: de luisterpagina in Safari, en kijken of de filter meescrollt.
