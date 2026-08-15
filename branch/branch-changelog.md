## `fix/toegankelijkheid-focus-en-toetsenbord` changelog

### Branch title

De site is met het toetsenbord te bedienen en de focus is weer zichtbaar

### Branch ID

20260815-202018

### Branch type

fix

### What does the change on this branch bring to main?

**De site had nergens een zichtbare focus.** De enige `:focus`-regel in de hele styles-boom stond op
het contactformulier en deed `outline: none` met een vervanging die niet bestaat: `--primary-color`
wordt nergens gedefinieerd, en een `var()` zonder fallback naar een onbekende property maakt de hele
declaratie ongeldig. Netto was de browserring weg en kwam er niets voor in de plaats — op het enige
conversiepunt van de site. Er staat nu een `:focus-visible` in de reset én op de invoervelden, in de
accentkleur van de CTA-knop.

**Vier interactieve elementen waren met het toetsenbord onbereikbaar**, en één daarvan was erger dan
de rest: de filterknop op `/luister` had wél `role="button"` en `tabIndex`, maar geen `onKeyDown` —
dus hij kondigde zich als knop aan en deed vervolgens niets. Dat is slechter dan geen rol. Nu een
echte `<button>`, net als de erlenmeyers (de kerninteractie van Music Mood Colours) en de
video-starter.

**Twee dingen die het issue niet noemt en die bij het bouwen bleken.** De carousel-pijlen hadden hun
`onClick` op de omhullende `div` en niet op de `<button>` erbinnen — tabben lukte dus wel, maar Enter
deed niets: exact dezelfde vorm als de filterknop. En `#errorMessage` in de SCSS bleek **dode code**:
geen enkele component draagt dat id, terwijl het blok wel een te lage contrastkleur bevatte. Een
kleur repareren die niemand ziet is geen reparatie, dus het blok is weg.

**De tijdlijn van de speler wijkt bewust af van het voorstel.** Het issue stelt `<input type="range">`
voor; dat zou de tweelaagse weergave moeten vervangen, en die speler staat op élke mixkaart. Hij
draagt nu `role="slider"` mét een volledige toetsafhandeling — pijltjes vijf seconden, Page Up/Down
een minuut, Home en End naar begin en eind — plus de vereiste `aria-value*`. Het verschil met de
filterknop is precies dat die handler er wél is.

Verder namen voor drie knoppen die alleen een SVG of teken bevatten, en beschrijvende alt-teksten in
plaats van `alt="Logo"` (tweemaal op elke pagina) en `alt="verzoek"`.

**Uit #54 is het contactformulier meegenomen, en dat corrigeert mijn eigen werk van vanmiddag.** In
PR #125 verving ik de inline `color: 'red'` door `#d93025`. Dat loste de repo-regel op maar niet het
contrast: gemeten geeft die kleur hier **4,30:1**, en AA vraagt 4,5:1. De melding draagt nu
`.feedback-message.error`, die al bestond en `--error-fg` op `--error-bg` gebruikt — gemeten
**6,80:1**.

**De moodkleuren uit #54 blijven staan.** Wit op rood (3,4:1) en op magenta (2,7:1) zakken door AA,
maar dat raakt de merkkleuren en het issue merkt zelf aan dat dit een keuze van Dave is.

**Dertien nieuwe tests**, en ze legden meteen twee regressies bloot in bestaande tests: de
volumeschuif-test zocht op `role="slider"` zonder naam en vond nu ook de tijdlijn, en de
sluitknop-test zocht op de tekst `✕` terwijl de knop nu `aria-label="Sluiten"` draagt. Beide zijn
meegecorrigeerd — precies waarvoor die suite bestaat.

### Significance

#### Tier 0

Toegankelijkheid is de fout-soort die geen enkele poort ziet: alles ziet er met een muis normaal uit.
De dertien tests leggen het gedrag vast, inclusief het patroon "een `role` die iets belooft moet ook
een toets afhandelen". Suite van 165 naar 178.

**Score:** 3

#### Tier 1

Wie de site met een toetsenbord of schermlezer gebruikt, kon het contactformulier niet volgen, de
mixen niet doorspoelen, de filters niet openen en de kerninteractie van Music Mood Colours niet
bedienen. Dat werkt nu allemaal, en de foutmelding van het formulier is bovendien leesbaar geworden.

**Score:** 4

### Pull Request

