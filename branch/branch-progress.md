## `fix/scss-hover-en-alignment` progress

### Steps

- [x] Beide issues geverifieerd in de **gebouwde CSS** en niet alleen in de bron. Dat leverde meteen
      meer op dan de issues meldden: `.btn.cta:before` bestond wél maar zonder `content`, en er stonden
      **drie** lege `background-color:!important`-declaraties in de uitgeleverde CSS
- [x] Gecontroleerd dat `$ux-mode` op `true` staat, dus dat `apply-ux-bg` daadwerkelijk draait en de
      lege declaratie ook echt bij de bezoeker terechtkomt
- [x] `_buttons.scss:54` van `apply-ux-bg(width)` naar `cta-hover-effect`, met de diagnose in de code
- [x] Na de build gemeten dat het effect er nu is: `content:""`, `width:0` → `100%` op hover, de
      transition en `span{z-index:1}`
- [x] Vóór de `.row`-wijziging gemeten of hij iets kan breken: de twee elementen met `row … split`
      (AudioPlayer `:94` en `:118`) dragen géén uitlijnklasse, dus de nieuwe `!important` botst nergens
- [x] Bewezen dat de val echt bestond: `:is(.row-c,.stack,.column).row.AMC.break-s, .row-c.AMC.break-s`
      matcht geen enkel element met `class="row AMC break-s"`
- [x] `.row` toegevoegd aan de `:is()` en de altijd-dode niet-important set verwijderd; na de build
      geverifieerd dat de nieuwe selector `.row` wél dekt
- [x] De derde lege declaratie nagetrokken tot `.splitter` in `base/_layout.scss` — een `map.get` op
      key `"50"` die in geen van beide ux-maps bestaat
- [x] Gemeten dat het verwijderen van dat blok visueel neutraal is: de splitter valt terug op
      `var(--black-70)`/`var(--white-70)` uit `_tools.scss` en is dus gewoon zichtbaar
- [x] Eindmeting: **0** lege declaraties in de gebouwde CSS, was 3
- [x] De poort groen: tsc, ESLint, build, 89 pagina's
- [~] De ux-kleur van de splitter kiezen — bewust niet gedaan. Dat is een ontwerpkeuze en geen
      reparatie, dus vastgelegd als issue #116 in plaats van gegokt
- [~] De `!important`-cascade zelf opruimen (91 stuks in `src/styles/`) — het issue noemt dit al als
      aparte branch, want het raakt elke pagina

### Where I left off

Af, poort groen, en **geparkeerd in plaats van een PR geopend**: dit is site-werk, dus de merge wacht
op Dave.

**Wat er te zien is en waar.** De deploy preview komt er pas bij een PR, dus voor nu is de manier om
dit te bekijken `npm run dev` en dan:

- **De "Boek nu!"-knop** rechtsboven in de navigatie — beweeg eroverheen. Er hoort nu een cyaan vlak
  van links naar rechts overheen te lopen in 300 ms. Dat gebeurde vóór deze branch helemaal niet.
- **De uitlijning** hoort nergens veranderd te zijn. Dat is de kant die het meest aandacht verdient:
  de wijziging maakt de uitlijning van `.row` `!important` waar hij dat niet was. Gemeten is dat geen
  enkel element dat combineert met `.split`, maar een blik op de brede pagina's (home, luister,
  diensten) is hier meer waard dan mijn meting.
- **De splitters** (de dunne lijntjes tussen secties) horen er precies zo uit te zien als eerst.

Sluit #76 en #77 bij een merge. Issue #116 is nieuw en blijft open.
