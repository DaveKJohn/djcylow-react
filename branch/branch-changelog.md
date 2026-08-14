## `fix/react-hooks-en-types` changelog

### Branch title

De laatste dertien lint-errors: hooks, types en JSX-entities

### Branch ID

20260814-205946

### Branch type

fix

### What does the change on this branch bring to main?

De laatste dertien ESLint-errors zijn opgelost. Daarmee staat de teller op **0**, van de 37 waarmee
2026-08-14 begon, en vervalt de instructie uit `CLAUDE.md` om deze poort *"op aantal en niet op
exitcode"* te vergelijken — de enige poort in deze repo die een mens met het blote oog moest aflezen.

**Vier hook-fouten, drie verschillende oorzaken.** De regel `react-hooks/set-state-in-effect` is geen
stijlvoorkeur: elk van deze vier bouwde iets in state na dat er al was, en betaalde dat met een extra
renderronde.

- **`AudioPlayer`** — het effect dat een andere speler pauzeert zette daarna zélf `isPlaying` op
  false, terwijl het `<audio>`-element al een `pause`-event vuurt dat door de `onPause`-handler wordt
  opgevangen. Twee bronnen voor dezelfde waarheid; de fix is een *verwijdering*. De conditie is
  meteen vereenvoudigd, want `pause()` op een stilstaande speler is een no-op.
- **`MobileContent`** — de viewport en "draait dit al in de browser?" zijn externe bronnen, geen
  state van de component. Ze lezen nu via `useSyncExternalStore`, precies waarvoor die hook bestaat,
  met `false` als serversnapshot. Het sluiten van de drawer bij navigatie én bij het schalen naar
  desktop gebeurt nu tijdens de render in plaats van in een effect — dat sluit de drawer vóór de
  browser schildert, zonder de zichtbare tussenstap die een effect ná de paint oplevert.
- **`EmailDisplay`** — hier wás de setState-in-effect de bescherming: het adres wordt pas in de
  browser samengesteld zodat scrapers van de statische HTML het niet zien. Die bescherming is intact
  en aantoonbaar: de span is in de gebouwde HTML nog steeds leeg. Het verschil is dat "leeg" nu de
  serversnapshot is in plaats van een beginstate die een effect moet overschrijven.

**Vijf `any`'s, waarvan er één zwaarder woog dan de rest.** Op de mix-detailpagina stond
`const allMixes: Mix[] = [...] as any` — die cast zette de typecontrole op de **hele mix-dataset**
uit, inclusief de annotatie ernaast. Hij kon zonder één andere wijziging weg: de JSON voldoet gewoon
aan `Mix`. Vanaf nu wordt dat ook echt gecontroleerd, dus een hernoemd veld in de data valt voortaan
door de mand bij `tsc`. De twee `any[]`-tracklists kregen een eigen `Track`-type, en in `ContactForm`
verdween de cast op de dynamische reCAPTCHA-import plus `catch (error: any)` — die laatste vroeg
`.message` zonder te weten of er een `Error` was, precies in de tak die een fout netjes hoort af te
handelen.

**Vier JSX-entities** zijn `&quot;` geworden. Dat rendert letterlijk hetzelfde teken; er is bewust
geen typografisch aanhalingsteken van gemaakt, want dat is een ontwerpkeuze en geen opruimwerk.

**De uitgeleverde HTML is ongewijzigd, en dat is gemeten in plaats van beloofd.** De site is met en
zonder deze branch gebouwd en alle **86** pagina's zijn vergeleken. Na normalisatie van de drie
build-artefacten die per build verschillen — chunk-bestandsnamen, de build-id en de favicon-hash —
zijn er **0** verschillen. Wat deze meting niet dekt is het runtime-gedrag: de audioplayer, de
drawer en de hydration van het e-mailadres draaien pas in de browser. Daarvoor is de deploy preview
het bewijsmiddel, en dat is precies waarom deze branch op Dave's woord wacht.

### Significance

#### Tier 0

Sluit een achterstand die drie documenten en twee scripts van een instructie voorzag die niemand
betrouwbaar kon volgen. Belangrijker dan het getal: de `as any` op de mixdata zette de typecontrole
op de complete dataset uit, en de vier hook-fouten zaten in de audioplayer en de mobiele navigatie —
de twee dingen die elke bezoeker aanraakt. De poort kan hierna dicht, wat de telling definitief
vervangt door een check.

**Score:** 4

#### Tier 1

N/A — de opdrachtgever ziet geen verschil. De gebouwde HTML is aantoonbaar identiek op alle 86
pagina's; wat verandert is het aantal renderrondes en de typeveiligheid eronder.

**Score:** N/A

### Pull Request

