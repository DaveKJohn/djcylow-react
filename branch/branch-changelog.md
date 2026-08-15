## `fix/contactformulier-endpoint` changelog

### Branch title

Boekingsaanvragen komen compleet aan en het mail-endpoint is gehard

### Branch ID

20260815-130602

### Branch type

fix

### What does the change on this branch bring to main?

Het contactformulier is de enige weg waarlangs een boeking binnenkomt, en het verloor de naam van
elke aanvraag. Het formulier verstuurt één veld `name`; de Netlify-function las `firstName` en
`lastName`, en die bestaan nergens in `src/`. Elke aanvraag kwam binnen als **"Boekingsaanvraag:
undefined undefined"** — beantwoorden kon nog via `replyTo`, maar terugvinden niet.

**Dat het een jaar onopgemerkt bleef, kwam door het ontbreken van validatie**, en dat is meteen het
tweede deel van deze branch. Het endpoint controleerde niets: geen aanwezigheid, geen type, geen
lengte, geen adresvorm. Een JSON-body mag arrays en objecten leveren, en die belandden
ongecontroleerd in de mail en in `replyTo`. Nu wordt elk veld als string gelezen, begrensd op
lengte, en het adres op vorm getoetst; een lege aanvraag wordt geweigerd in plaats van verstuurd.

Verder aan het endpoint:

- **De HTML-mail escapet zijn invoer**, via één helper zodat een volgend veld niet opnieuw vergeten
  wordt. Er gaat nu ook een `text:`-variant mee.
- **CORS staat niet meer op `*`.** Alleen `djcylow.com`, `www.djcylow.com`, het Netlify-adres en het
  deploy-preview-patroon krijgen de header terug, en alleen ná een match — de binnenkomende origin
  wordt nooit blind teruggekaatst. Er zit ook een controle op `hostname` uit het
  reCAPTCHA-antwoord bij: zonder die controle is een token dat op een ander domein is opgehaald
  hier net zo geldig.
- **De interne foutmelding gaat niet meer mee in de 500.** Een SMTP- of DNS-fout noemt
  infrastructuur, en de frontend las dat veld niet eens.

**De foutlus is weg.** Bij een mislukte verzending bleef het reCAPTCHA-token staan, terwijl zo'n
token eenmalig is en ~2 minuten geldig. De bezoeker probeerde het opnieuw met hetzelfde token,
Google antwoordde `timeout-or-duplicate`, en dat herhaalde zich tot de pagina herladen werd — één
tijdelijke serverfout kostte de hele aanvraag. De widget wordt nu geremount voor een verse
challenge. Bewust via een `key` en niet via een ref met `.reset()`: het component wordt met
`next/dynamic` geladen, en die wrapper geeft een ref niet betrouwbaar door.

**En er is nu een testsuite**, 23 tests, precies over wat hierboven staat (issue #71 — dit was het
enige server-side bestand zonder ook maar één test). Dat kostte drie pogingen, en de reden is het
vermelden waard: de function is CommonJS en woont buiten `src/`, dus Vitest laadt haar met Node's
eigen `require`. `vi.mock` greep daardoor niet op haar `require('axios')`, en zelfs
`vi.stubGlobal('fetch')` werd niet gezien — de module draait in een andere context en hield de
echte `fetch`, waarna elke test in een timeout van vijf seconden liep. Beide zijn gemeten voordat
het huidige patroon gekozen is: de twee buitenwereld-afhankelijkheden gaan nu via een derde
parameter naar binnen, die Netlify zelf nooit meegeeft.

**Bijvangst: `axios` is uit de repo.** Het werd alleen hier gebruikt, voor één POST, en Node levert
`fetch` sinds v18. Dat is één dode dependency minder dan issue #94 straks hoeft op te ruimen.

Eén tekstfout uit issue #49 zit in ditzelfde bestand en is meegenomen om een conflict met die
branch te voorkomen: `Direct Contact` → `Direct contact`, want Nederlands kent geen title case.

Sluit #42, #51, #57 en #71.

### Significance

#### Tier 0

Het enige server-side bestand had geen enkele test en verwerkte ongevalideerde bezoekersinvoer. Er
liggen nu 23 tests onder, en de function is testbaar gemaakt op een manier die eerst is gemeten in
plaats van aangenomen.

**Score:** 3

#### Tier 1

Elke boekingsaanvraag kwam binnen zonder naam en met een onbruikbaar onderwerp. Dit is het formulier
waarlangs opdrachten binnenkomen, dus dat raakt Dave direct en dagelijks. Daar bovenop stopt een
tijdelijke serverfout niet langer de hele aanvraag, en is het endpoint niet meer vanaf willekeurige
domeinen bruikbaar.

**Score:** 5

### Pull Request

