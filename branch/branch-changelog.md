## `fix/luister-crash-en-ssr` changelog

### Branch title

De luisterpagina valt niet meer om op een onbekende kleur en staat in de statische HTML

### Branch ID

20260815-131934

### Branch type

fix

### What does the change on this branch bring to main?

Drie dingen aan de luisterpagina, waarvan er twee alleen zichtbaar waren voor iemand die er
gericht naar zocht.

**De pagina viel om op een onbekende kleur.** `activeColor` kwam ongefilterd uit
`searchParams.get('color')` en ging rechtstreeks in `MOOD_DATA[activeColor].colorVar`; de guard
sloot alleen `'all'` uit. Elke andere waarde dereferenceerde `undefined` en gaf een TypeError
tijdens de client-render — en omdat er geen `error.tsx` is, was dat een witte pagina. Er wordt nu
eerst opgezocht en alleen gerenderd als de kleur bestaat, en de normalisatie naar kleine letters
gebeurt op één plek. Twee ingangen zijn daarmee dicht: `?color=Red` met een hoofdletter (wat de
mixpagina's zelf teruglinkten) en `?color=magenta`.

**Magenta stond er niet in.** De mix-data kent acht kleuren en er ligt een preview klaar in
`light-magenta.json`, maar `MOOD_DATA` had er zeven. De achtste is toegevoegd met de omschrijving
die de rest van de site al aanhoudt (`Geïrriteerd`, uit `BasiskleurenCarousel`), in de stijl van de
andere zeven regels. **Dat is nieuwe publieke tekst, dus die wil je waarschijnlijk even lezen:**
*geïrriteerd · gespannen · rusteloos · fel*.

**De pagina stond helemaal niet in de statische HTML** (issue #43). Twee onafhankelijke oorzaken,
allebei weg, en het resultaat is gemeten in de verse build in plaats van beredeneerd:

| | vóór | ná |
|---|---|---|
| `<main>` in `out/luister.html` | 0 | 1 |
| `<h1>` in `out/luister.html` | 0 | 1 |
| unieke mixlinks in `out/luister.html` | 0 | **77** |
| `href="/luister"` in `out/index.html` | 0 | 1 |

De eerste oorzaak: `/luister` was één client component met `useSearchParams()`, volledig in een
`<Suspense>` **zonder fallback**. Bij `output: 'export'` bailt Next zo'n subtree uit de prerender,
en wat er overbleef was letterlijk `<div hidden><!--$--><!--/$--></div>`. Alles wat niet van de URL
afhangt staat nu buiten die grens in een server component, en de grens heeft een fallback die de
volledige mixlijst server-rendert. Een fallback belandt namelijk wél in de HTML — dat is precies
waarom die 77 links er nu staan, terwijl `sitemap.ts` ze al die tijd op priority 0.8 aanmeldde
zonder dat er één interne link naartoe wees.

De tweede: de navigatielinks hingen achter een `mounted`-poort waarvan de serversnapshot `false`
is, waardoor alleen het logo en de hamburger in de HTML stonden. Die poort is nodig tegen een
hydratie-mismatch van de **class** (`ready` of `locked` hangt van de viewport af, die de server niet
kent) maar niet van de **inhoud**, en hangt nu alleen nog aan de mobiel-specifieke onderdelen.

**En de spelers pauzeren elkaar.** `AudioPlayer` had de mechaniek er al voor — `onPlay` meldt zich
aan, `activeId` pauzeert de rest — maar de playlist gaf die twee props niet door, dus alle spelers
konden tegelijk klinken.

Twee dingen die hier zijn opgeruimd omdat ze anders opnieuw waren overgeschreven:

- **De mix-imports en de slug-afleiding staan nu in één bron** (`src/data/mixes/all.ts`). De
  vijftien JSON-bestanden werden op zes plekken los samengevoegd en de slug werd op acht plekken
  opnieuw uit `permalink` gepeuterd — deels mét `.toLowerCase().trim()` en deels zonder. Dat laatste
  is geen schoonheidsfoutje: de routing hangt aan die slug. Deze branch zet de twee gebruikers om die
  hij toch aanraakt; issue #83 doet de rest.
- **`Luguber` met een hoofdletter** midden in de moodtekst van rood, in dezelfde constante.

Sluit #43, #44 en #56.

### Significance

#### Tier 0

De mix-imports en de slug-afleiding hebben één bron gekregen, en er liggen elf tests onder de
crash-guard — die viel anders stil terug te draaien.

**Score:** 3

#### Tier 1

De luisterpagina is de kern van de site en stond voor crawlers, link-previews en no-JS-bezoekers
volledig leeg: geen kop, geen inhoud, en geen enkele link naar de 77 mixpagina's die de sitemap wél
aanmeldt. Daar bovenop viel de pagina om op een kleur die in de eigen data bestaat.

**Score:** 5

### Pull Request

