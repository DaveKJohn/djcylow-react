## `style/scss-opruiming` progress

### Steps

- [x] Elk punt van #81 tegen de tree gecontroleerd in plaats van de lijst over te nemen. Twee bleken
      achterhaald: `src/app/globals.scss` bestaat niet meer (al weg bij de Tailwind-verwijdering), en
      `cta-hover-effect` is sinds 2026-08-15 geen dode mixin meer
- [x] Bij `assen.scss` en `_onderhoud.scss` geverifieerd dat de grep-treffers **tekst in comments**
      waren en geen imports — anders had ik een bestand verwijderd dat wel gebruikt wordt
- [x] Gemeten wat `className={styles.pageWrapper}` met een lege module werkelijk oplevert: React laat
      een `undefined` className weg, dus er staat géén `class="undefined"` in de HTML. Het issue
      noemde dit als gevolg; het is dode code, geen zichtbare fout
- [x] De acht hex-waarden in `basiskleurenCarousel.scss` één voor één vergeleken met `_colors.scss`
      vóór ik ze verving — alle acht identiek
- [x] Geverifieerd dat `--<kleur>-default` al in de gebouwde CSS stond en **nergens buiten `:root`**
      wordt overschreven, want anders zou de vervanging wél kleur veranderen
- [x] De vier dode stylesheets verwijderd (332 regels) plus hun verwijzingen in `main.scss`,
      `page.tsx` en `luister/page.tsx`
- [x] De carousel opgeruimd: drie ongebruikte variabelen, drie dubbele declaraties, en
      `var(--card_height)` → `var(--card_height, auto)` zodat de feitelijke waarde expliciet is
- [x] De drie no-op media queries uit `musicmoodcolours.module.scss`
- [x] Het overbodige `!important` op `.carousels .hidden` weg (restant van #78)
- [x] Poort groen; in de gebouwde CSS geverifieerd dat de acht kleurregels nu naar de variabelen
      wijzen en dat er geen `onderhoud`-regels meer in zitten
- [~] `cta-hover-effect` verwijderen — **niet gedaan, en dat is belangrijk**: de branch
      `fix/scss-hover-en-alignment` roept die mixin juist aan om het kapotte hover-effect te
      herstellen. Hem hier weghalen zou die branch breken
- [~] De hardcoded kleuren buiten het palet in `_contact-form.scss`, `_navigation.scss`, `filter.scss`
      en `Footer.tsx` — niet in deze branch. Dat zijn losse waarden die stuk voor stuk een
      ontwerpvraag zijn ("welke paletkleur hoort hier?"), en dat is iets anders dan een kopie van het
      palet vervangen. #81 blijft daarvoor open

### Where I left off

Af, poort groen, **geparkeerd**: site-werk, dus de merge wacht op Dave.

**Wat er te bekijken is.** De bedoeling is dat er *niets* verandert. De plek om te kijken is
**Music Mood Colours**: de acht gekleurde bolletjes onder de basiskleuren-carousel horen exact
dezelfde kleuren te hebben als voorheen — die lopen nu via de paletvariabelen in plaats van via een
eigen kopie. Verder de carousel-pijlen op diezelfde pagina (die hadden een dubbele `transform`).

**Let op de volgorde bij het mergen.** Deze branch en `fix/scss-hover-en-alignment` raken allebei
`src/styles/`, maar verschillende bestanden — ze botsen inhoudelijk niet. Wat wél botst is
`branch/branch-changelog.md` en `branch/branch-progress.md`, zoals bij elke gestapelde branch: op de
branch `--ours`, op `main` `--theirs`.

**#81 blijft open** voor de losse hardcoded kleuren; de rest van het issue is hiermee afgehandeld.
