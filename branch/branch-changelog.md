## `fix/scss-hover-en-alignment` changelog

### Branch title

Het hover-effect van de CTA-knop werkt weer en .row valt niet meer uit de uitlijnlogica

### Branch ID

20260815-174438

### Branch type

fix

### What does the change on this branch bring to main?

**Het hover-effect van de CTA-knop werkt weer.** Drie dingen versterkten elkaar. `_buttons.scss:54`
riep `apply-ux-bg(width)` aan, maar die mixin verwacht een P-shade (`"15"`..`"65"`) en kreeg het woord
`width` — het defaultargument van `cta-hover-effect`. Bij een refactor is daar de verkeerde mixinnaam
blijven staan. Sass gaf geen fout, want `map.get` levert netjes `null`, maar in de gebouwde CSS stond
daardoor letterlijk `body.ux-mode .btn.cta{background-color:!important}`: een lege en dus ongeldige
declaratie. Tegelijk kreeg het `::before` wel een kleur maar geen `content`, `position`, `width` of
`transition`, zodat het pseudo-element helemaal niet rendert — terwijl precies die vier al die tijd in
de mixin `cta-hover-effect` stonden, die nergens werd aangeroepen. Eén regel vervangen herstelt het
effect én ruimt de dode mixin op. Gemeten in de gebouwde CSS: `content:""`, `width:0` → `100%` op
hover en de transition staan er nu.

**`.row` viel uit de uitlijnlogica, en dat was een val.** `_set-align-logic` zette de uitlijning twee
keer: eerst zonder `!important`, daarna via `@at-root :is(.row-c, .stack, .column)` mét. Die eerste set
was **altijd** dood — de tweede matcht in elk geval waarin de eerste matchte, en wint. Twaalf
uitlijnklassen maal vier hosts, allemaal zonder effect.

Ernstiger was dat `.row` niet in die `:is()` stond terwijl `alignment-grid` wél op `.row, .row-c` wordt
toegepast, en de `break-m`/`break-s`-varianten binnen dat blok zitten. Een
`<div className="row AMC break-s">` matchte daardoor geen enkele regel: niet
`:is(.row-c,.stack,.column).row.AMC.break-s` (een `.row` is geen `.row-c`) en niet
`.row-c.AMC.break-s`. De klasse met de meest voor de hand liggende naam deed op mobiel dus stilletjes
niets. Vandaag staan alle tien `break-*`-gebruiken in de JSX toevallig op `row-c`, `column` of `stack`,
dus dit was een val en geen zichtbare storing — maar een val zonder waarschuwing.

**En er kwam een derde geval van dezelfde faalklasse boven water dat in geen issue stond.** Bij het
natellen van de lege declaraties bleken er **drie** te zijn, niet twee. De derde zat in `.splitter`:
die haalde `map.get($ux-black, "50")` op terwijl die map alleen `R90`/`R80`/`G90`/… kent. Ook daar
`background-color:!important`. Dat blok is verwijderd — gemeten visueel neutraal, want de splitter viel
en valt terug op `var(--black-70)`. **Welke ux-kleur hij zou moeten krijgen is een ontwerpkeuze en geen
reparatie**, dus die is niet gegokt maar vastgelegd in issue #116.

De gebouwde CSS gaat daarmee van **3** ongeldige declaraties naar **0**.

### Significance

#### Tier 0

Drie plekken waar Sass een `null` doorliet en er ongeldige CSS uitrolde zonder één waarschuwing. Dat
patroon is nu benoemd in de code zelf, op alle drie de plekken, met de meting erbij — zodat de
volgende `map.get` met een verkeerde key herkend wordt.

**Score:** 3

#### Tier 1

Het hover-effect van de belangrijkste knop op de site — de "Boek nu!"-CTA — werkt weer zoals bedoeld,
en een uitlijnklasse die op mobiel niets deed doet nu wat hij belooft. Dat eerste is direct zichtbaar
voor elke bezoeker die over de knop beweegt.

**Score:** 3

### Pull Request

