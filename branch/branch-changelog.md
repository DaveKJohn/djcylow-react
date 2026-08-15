## `fix/jsonld-escaping` changelog

### Branch title

De JSON-LD kan niet meer uit zijn script-tag breken

### Branch ID

20260815-200955

### Branch type

fix

### What does the change on this branch bring to main?

De JSON-LD op de mixdetailpagina werd met een kale `JSON.stringify` in een
`<script type="application/ld+json">` gezet. Die escapet `</script>` niet, dus een mix-titel of
-beschrijving met die reeks erin sluit de script-tag daar, en de browser leest de rest van de JSON als
HTML.

**Twee plekken, niet één.** Het issue noemt alleen de `MusicPlaylist`-injectie; de `BreadcrumbList`
eronder had exact dezelfde vorm. Beide lopen nu via één `jsonLdScript()`, die `<` vervangt door
`<` — binnen een JSON-string dezelfde tekst, maar de HTML-parser ziet geen tag meer.

**Waarom dit de moeite is terwijl de data uit de repo zelf komt.** Die grens is zwakker dan hij oogt:
`scripts/add-mix.js` laat de `description`-velden door een taalmodel genereren en schrijft die
rechtstreeks het datamodel in. Modeluitvoer is geen handgeschreven code, en een beschrijving is precies
het vrije tekstveld waar zo'n reeks in belandt.

**Er staan zeven tests op**, en die bewaken twee dingen tegelijk: dat de bewerking doet wat hij moet
doen (een sluitende script-tag overleeft niet, gewone inhoud verandert niet, en het resultaat parseert
terug naar exact hetzelfde object), én dat de pagina hem daadwerkelijk toepast. Die tweede helft is de
belangrijkste: zonder een test op de broncode komt een refactor die terugvalt op `JSON.stringify` er
ongemerkt langs. Negatief getoetst door precies die terugval te maken — twee tests vielen om.

Gemeten in de gebouwde HTML: beide blokken parseren nog steeds als geldige JSON, met `@type`
`MusicPlaylist` en `BreadcrumbList`. Nul escapes, want in de huidige data staat geen `<` — wat precies
laat zien dat gewone inhoud onaangeroerd blijft.

De andere `dangerouslySetInnerHTML`-plekken zijn niet aangeraakt: die lezen uit `src/content/*.ts`,
dat met de hand geschreven is.

### Significance

#### Tier 0

Een injectiepad dicht dat vandaag niet exploiteerbaar is maar wel op een vertrouwensgrens ligt die een
taalmodel passeert. Plus een test die bewaakt dat de reparatie blijft staan.

**Score:** 3

#### Tier 1

Voorkomt dat een mixpagina kapotgaat of ongewenste HTML uitvoert bij een ongelukkige beschrijving. Er
is vandaag niets mis en de pagina's zien er hetzelfde uit.

**Score:** 2

### Pull Request

