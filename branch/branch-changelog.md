## `style/inline-styles-naar-scss` changelog

### Branch title

De statische inline styles staan waar de repo-regel ze wil hebben

### Branch ID

20260815-183754

### Branch type

style

### What does the change on this branch bring to main?

`CLAUDE.md` staat `style={{}}` in JSX alleen toe voor echt dynamische runtime-waarden. Van de vijftien
inline styles vielen er elf buiten die uitzondering. Er staan er nu **vijf**, en dat zijn precies de
vier toegestane plus één in een component die niet gerenderd wordt.

**Vijf zaten in `ContactForm`**, en twee daarvan waren duplicaten van CSS die er al stond:

- `display: "none"` op het honeypot-veld, terwijl `#honeypot { display: none }` al in
  `_contact-form.scss` stond en door niets werd gebruikt. Het veld draagt nu dat `id`
- `color: 'red'`, terwijl `#errorMessage p.text` al `#d93025` gebruikt voor precies dezelfde rol. Die
  waarde geldt nu ook hier — meteen beter voor het contrast
- `height: "78px"` op de reCAPTCHA-plaatshouder. Functioneel (hij houdt de ruimte vrij zodat het
  formulier niet verspringt), dus die reden staat nu in de CSS in plaats van als kaal getal in de JSX
- `fontSize: '3rem'` op de ✅. Die 3rem stond buiten de `$design-scale`; het is nu de `5xl`-trap (48px)
- `marginTop: '1rem'` op de "Nieuw bericht sturen"-knop

**Bij die laatste week ik bewust af van wat het issue voorstelde.** Dat noemde de `top-push-*`-
utilities, maar die zetten `padding-top` en niet `margin-top` — gemeten geeft `top-push-xl` 11px
padding. Padding verandert de knop zelf, margin de afstand eromheen; dat is niet hetzelfde, en de knop
zou er anders uit gaan zien. Het is daarom een eigen regel geworden.

**De twee SVG-gevallen zijn attributen geworden in plaats van CSS.** Op een `<path>` en een `<svg>`
horen `fill`, `fillRule` en `width`/`height` gewoon als presentatieattribuut; dat is idiomatischer dan
een style-object en daarmee vallen ze uit de telling. De hardcoded `#000000` in de Facebook-icoon is
meteen `var(--black-100)` geworden — dezelfde kleur, maar nu uit het palet.

**En de drie placeholders van de Music Mood Colours-carousels stonden alle drie anders.**
`BasiskleurenCarousel` en `Erlenmeyers` droegen een inline `minHeight: '150px'`, terwijl
`VsKleurenCarousel` de klasse `placeholder-mix` gebruikte die **nergens gedefinieerd** was — daar had
de placeholder dus helemaal geen hoogte. Eén gedeelde klasse lost alle drie tegelijk op: twee inline
styles weg, een dode klasse krijgt betekenis, en de drie zien er nu hetzelfde uit.

**Wat er bewust blijft staan:** de vier dynamische gevallen (`backgroundImage` en de progressbar in
`AudioPlayer`, de thumbnail in `Promo`, de `display` in `Filter`) vallen onder de uitzondering en zijn
letterlijk de voorbeelden die `CLAUDE.md` noemt. En `MeetTheDJ.tsx` is niet aangeraakt: die component
wordt nergens gerenderd, dus opruimen daar is werk aan dode code — dat hoort bij #59.

### Significance

#### Tier 0

Elf regels opmaak van de JSX naar de stylesheets, waarvan twee duplicaten van CSS die er al stond. De
repo-regel is weer waar wat hij zegt, en een `placeholder-mix`-klasse die niets deed doet nu wat zijn
naam belooft.

**Score:** 3

#### Tier 1

Twee dingen die een bezoeker kan merken: de foutmelding van het contactformulier krijgt de leesbaardere
`#d93025` in plaats van puur rood, en de placeholder in de VS-carousel heeft eindelijk hoogte. De rest
is gelijk gebleven.

**Score:** 2

### Pull Request

