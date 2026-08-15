## `fix/mix-imports-een-bron` changelog

### Branch title

De mix-imports en de slug-afleiding staan nog maar op een plek

### Branch ID

20260815-183126

### Branch type

fix

### What does the change on this branch bring to main?

De vijftien mix-imports en de slug-afleiding stonden in **zes** bestanden met de hand overgeschreven,
elk met een eigen volgorde en een eigen typedefinitie. Vijf daarvan lezen nu uit
`src/data/mixes/all.ts`; de zesde (`Playlist.tsx`) deed dat al.

**De slug-afleiding stond vier keer in één bestand, en niet elke keer hetzelfde.** In
`[slug]/page.tsx` deden `findMixBySlug` en `generateStaticParams` het **zonder**
`.toLowerCase().trim()`, terwijl de twee plekken die de canonieke URL bouwen het er wél bij deden. Dat
is geen schoonheidsfoutje: als de vergelijking anders normaliseert dan de generatie, kan een pagina
onvindbaar zijn terwijl hij wel gebouwd is. Alle vier lopen nu via `mixSlug()`. De `decodeURIComponent`
blijft staan op de **inkomende** slug, want die komt uit de URL en kan geëncodeerd zijn — de permalinks
in de data zijn dat niet (gemeten: alle 77 slugs matchen `^[a-z0-9-]+$`).

**Het `Mix`-type stond twee keer volledig uitgeschreven.** `all.ts` droeg een afgeslankte versie van
veertien velden, `[slug]/page.tsx` de volledige met dertig. Nu staat de volledige in `all.ts`, inclusief
het `Track`-type.

**Bij de drie Music Mood Colours-carousels zat er een aanname in de import.** Die importeerden alleen
de acht `light-*`-bestanden en zochten daarin `featured === true` — dus "featured" betekende daar
impliciet ook "light". Naïef overzetten op `allMixes` zou dat filter stil weggooien. De nieuwe
`featuredMixByColor()` draagt het **expliciet**: `power === 'Light'` én `featured`. Gemeten zijn alle
acht featured entries vandaag inderdaad light previews en staat er geen enkele in een `full-*`-bestand
— maar dat is een eigenschap van de data van vandaag, niet van de regel, en zonder dat filter zou een
featured Full-mix die er ooit bijkomt stilletjes een cover overnemen.

**Wat het concreet oplevert:** een zestiende kleurbestand hoeft nog op één plek te worden
bijgeschreven in plaats van op vier, en de kans dat de plek die je vergeet stil faalt is weg.

**Geverifieerd dat het gedrag gelijk bleef**, en niet alleen dat het bouwt: de sitemap-suite uit
PR #111 blijft groen (dertien tests, waaronder de eis dat elke sitemap-URL exact de slug van `mixSlug`
draagt), de build levert dezelfde 89 pagina's, `out/sitemap.xml` bevat dezelfde 84 URL's, en op de
Music Mood Colours-pagina staan nog steeds de acht mp3-bronnen van de covers.

### Significance

#### Tier 0

Zes kopieën terug naar één bron, en een normalisatieverschil weg dat een mixpagina onvindbaar had
kunnen maken. Wie hierna een kleur toevoegt, doet dat op één plek.

**Score:** 4

#### Tier 1

De site levert exact dezelfde pagina's en URL's op — gemeten. De waarde is dat de volgende mix niet
half wordt toegevoegd.

**Score:** 2

### Pull Request

