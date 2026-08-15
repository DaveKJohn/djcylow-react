## `style/scss-opruiming` changelog

### Branch title

Dode stylesheets eruit en het kleurenpalet staat nog maar op een plek

### Branch ID

20260815-182601

### Branch type

style

### What does the change on this branch bring to main?

Opruimwerk in de styling. Niets hiervan veroorzaakte een fout; het kostte leesbaarheid en liet een
lezer denken dat er iets gebeurde.

**Het kleurenpalet stond twee keer, en dat is het punt dat het meest kon bijten.**
`basiskleurenCarousel.scss` droeg de acht moodkleuren opnieuw als losse hex-waarden. Ze waren
vandaag stuk voor stuk identiek aan de `default`-tinten in `_colors.scss`, maar niets hield dat zo —
wijzigde daar ooit een merkkleur, dan liep deze kopie er stil uit, en juist op de pagina die over
die kleuren gáát. Ze gebruiken nu `var(--<kleur>-default)`, en die variabelen bestonden al: `_root.scss`
genereert ze voor het hele palet. Er is dus niets bijgekomen, alleen een kopie weg. Geverifieerd in de
gebouwde CSS dat de acht regels nu naar de variabelen wijzen, en dat die nergens buiten `:root` worden
overschreven — dus visueel identiek.

**Vier dode stylesheets zijn weg**, samen 332 regels: `assen.scss` (nergens geïmporteerd, en er
bestaat geen `Assen.tsx`), `_onderhoud.scss` (wél in `main.scss`, maar `#onderhoud` komt in geen
enkele component voor en de regel stond zelf op `display: none`), en `home.module.scss` +
`luister.module.scss` (allebei leeg op de `@use`-regels na). Die laatste twee werden wél
geïmporteerd, en `className={styles.pageWrapper}` gaf `undefined` — gemeten blijkt dat onschadelijk,
want React laat een `undefined` className gewoon weg en er staat geen `class="undefined"` in de HTML.
De imports en de twee expressies zijn mee opgeruimd.

**In de carousel stonden drie ongebruikte Sass-variabelen** (`$row-1-h`, `$row-2-h`, `$gap`) en drie
declaraties die twee keer met dezelfde waarde stonden (`align-items`, `justify-content`, `transform`).
Ook `height: var(--card_height)` viel daar stil terug op `auto`, want die variabele wordt alleen gezet
door `referenties.scss` en die component wordt niet gerenderd. Dat is nu `var(--card_height, auto)`:
even expliciet als wat er feitelijk gebeurde, en het werkt weer zodra Referenties terugkomt.

**Drie media queries in `musicmoodcolours.module.scss` zetten exact dezelfde waarden als daarbuiten.**
Ze deden niets, maar suggereerden dat de kaarten op medium schermen van formaat veranderen — wat het
juist lastig maakt te zien dat dat níet gebeurt.

En het overbodige `!important` op `.carousels .hidden` is weg; dat kwam boven water bij #78, waarvan
de hoofdbewering juist niet standhield.

**Twee punten uit het issue zijn níet uitgevoerd, met reden.** `src/app/globals.scss` bestond al niet
meer — dat is bij de Tailwind-verwijdering van 2026-08-15 al opgeruimd. En de mixin
`cta-hover-effect` staat in het issue als dood, maar dat is hij sinds diezelfde dag niet meer: de
branch `fix/scss-hover-en-alignment` roept hem juist aan om het kapotte hover-effect van de CTA-knop
te herstellen. Hem hier verwijderen zou die branch breken.

### Significance

#### Tier 0

332 regels dode stylesheet weg en het kleurenpalet terug naar één bron. Wie hierna aan de styling
werkt, leest alleen nog wat er werkelijk gebeurt — en een merkkleur wijzigen doet nu wat je verwacht.

**Score:** 3

#### Tier 1

Zuiver opruimwerk: de site ziet er precies hetzelfde uit, gemeten in de gebouwde CSS.

**Score:** N/A

### Pull Request

