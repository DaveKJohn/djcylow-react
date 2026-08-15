# Changelog

De geschiedenis van de DJ Cylow-website: elke gemergde branch met zijn pull request, nieuwste
bovenaan. Er zijn geen secties meer — **elke `##`-kop hieronder is één wijziging**, en dat is wat de
gedeelde workflow-scripts lezen. Het mechanisme (het entry-bestand in `branch/`, folden, een release
knippen) staat in [`CLAUDE.md`](CLAUDE.md).

**`origin/main` is de live site.** Netlify bouwt en publiceert bij elke push naar `main`, en een
PR-merge schrijft daar rechtstreeks in. Alles hieronder staat dus al op `djcylow.com` — live, maar
nog zonder versienummer. Een release is een label op wat al draait.

**De uitgebrachte versies staan niet hier maar in [`releases/README.md`](releases/README.md)**, met
datum, type en een samenvattende regel per versie. Dit bestand houdt alleen wat nog géén
versienummer heeft; een release-cut haalt die entries eruit en laat deze intro achter.

> Tot 2026-07-26 stond hier het omgekeerde, met een `← LIVE`-markering die zou aanwijzen welke versie
> draaide. Dat model was onjuist en de markering stond maandenlang fout — op v2.20.1, terwijl
> v2.20.2, v2.21.0 en vijf PR's al live waren. De markering is vervallen: de bovenste uitgebrachte
> versie draait per definitie al.

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

[PR #104](https://github.com/DaveKJohn/djcylow-react/pull/104) · merged 2026-08-15

---

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

[PR #103](https://github.com/DaveKJohn/djcylow-react/pull/103) · merged 2026-08-15

---

## `fix/nederlandse-taal-en-404` changelog

### Branch title

De site zegt tegen browsers en Google dat hij Nederlands is

### Branch ID

20260815-211644

### Branch type

fix

### What does the change on this branch bring to main?

De site draagt `<html lang="nl">` in plaats van `lang="en"`. Alle content is Nederlands — de teksten
in `src/content/`, alle koppen, alle UI-strings — dus dat attribuut beschreef niets. Het kostte twee
concrete dingen: schermlezers spraken Nederlandse tekst met een Engelse stem uit, en Google kreeg een
taalsignaal dat de rest van de pagina tegensprak, op een site die juist lokaal gevonden wil worden.

**De fallback-description was ook Engels** (*"DJ Cylow - Professional DJ for your events"*). De vier
hoofdpagina's zetten hun eigen description, maar wat dat niet doet krijgt deze — en `out/404.html`
droeg hem letterlijk.

**En er was geen eigen 404-pagina**, dus Next leverde zijn standaard: `404: This page could not be
found.`, in het Engels en zonder enige styling van deze site. Er staat nu een `not-found.tsx` in de
huisstijl, met `robots: noindex, follow` — een foutpagina hoort niet in de zoekresultaten, maar de
links erop mogen wel gevolgd worden.

Gemeten in de build: `out/404.html` en `out/index.html` dragen beide `lang="nl"`, de 404 heet
*"Pagina niet gevonden | DJ Cylow"* en draagt een Nederlandse description.

**De documentatie sprak zichzelf hierover tegen, en dat is meegecorrigeerd.** `CLAUDE.md` zei "de
website is Engels" met `lang="en"` als bewijs; `README.md` zei "the site is in Dutch". De code gaf
een derde antwoord. Het attribuut was dus geen taalbesluit maar een verkeerde waarde die als besluit
werd gepresenteerd — en die presentatie hield hem in stand. Alle drie zeggen nu hetzelfde.

`description_en` blijft bestaan en wordt net zo streng bewaakt door de testsuite: dat veld is er voor
een eventuele Engelse variant later.

### Significance

#### Tier 0

Een tegenspraak tussen twee governance-documenten en de code is weg, en de reden waarom hij ontstond
staat erbij: een verkeerd ingevuld attribuut dat als besluit werd gelezen.

**Score:** 3

#### Tier 1

Het taalsignaal naar Google klopt nu op een site die van lokale vindbaarheid leeft, en wie een
schermlezer gebruikt krijgt Nederlandse tekst niet langer met een Engelse stem. De 404 is bovendien
geen kale Next-standaardpagina meer.

**Score:** 4

### Pull Request

[PR #134](https://github.com/DaveKJohn/djcylow-react/pull/134) · merged 2026-08-15

---

## `style/contrast-rood-en-magenta` changelog

### Branch title

Tekst op rood en magenta haalt WCAG AA

### Branch ID

20260815-211304

### Branch type

style

### What does the change on this branch bring to main?

Tekst op de moodkleuren **rood** en **magenta** zakte door WCAG AA voor normale tekst. Berekend
volgens de relatieve luminantie uit WCAG 2.x, met de #eeeeee die `--white-100` levert:

| kleur | wit #eee | zwart | gekozen |
|---|---|---|---|
| red `#ff0000` | 3,45 ✗ | **5,25** ✓ | zwart |
| magenta `#ff00ff` | 2,70 ✗ | **6,70** ✓ | zwart |
| purple `#7f00ff` | 5,41 ✓ | 3,35 | wit blijft |
| blue `#0000ff` | 7,41 ✓ | 2,44 | wit blijft |

Beide staan nu in `$dark-text-colors`, waardoor ze zwarte tekst krijgen in plaats van wit.

**De merkkleuren zelf zijn niet aangeraakt**, en dat is precies waarom deze oplossing is gekozen
boven het bijstellen van `#ff0000` en `#ff00ff`. Alleen de tekstkleur eróp draait om; het contrast
komt in orde zonder dat de huisstijl verandert. Purple en blue houden wit, want daar zou zwart juist
zakken — de keuze is per kleur gemeten en niet als groep gemaakt.

Dit is geen randgeval: juist rood en magenta worden als labels **met tekst** gerenderd op de
luister-filter en op Music Mood Colours. Geverifieerd in de gebouwde CSS dat `.red p` en `.magenta p`
nu `var(--black-100)` krijgen.

### Significance

#### Tier 0

De meetwaarden en de afweging staan nu in de code, zodat een volgende kleur niet op gevoel bij die
lijst wordt gezet.

**Score:** 2

#### Tier 1

Twee van de acht moodkleuren waren met normale tekst slecht leesbaar — magenta op 2,70:1, ver onder de
norm. Dat raakt elke bezoeker van de luister-filter en van Music Mood Colours, en het meest de mensen
voor wie de norm bestaat.

**Score:** 4

### Pull Request

[PR #133](https://github.com/DaveKJohn/djcylow-react/pull/133) · merged 2026-08-15

---

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

[PR #128](https://github.com/DaveKJohn/djcylow-react/pull/128) · merged 2026-08-15

---

## `fix/scroll-lock-met-cleanup` changelog

### Branch title

De scroll-lock laat de pagina niet meer onscrollbaar achter

### Branch ID

20260815-201522

### Branch type

fix

### What does the change on this branch bring to main?

`MobileContent` schreef rechtstreeks naar `document.body.style.overflow` en gaf **geen cleanup**
terug. Op `/luister` leven er twee instanties naast elkaar — de nav-drawer en de filter-drawer — en
dat gaf twee manieren om de pagina onbruikbaar of onbeschermd achter te laten:

- **Unmount met de drawer open.** Browser-back weg van `/luister` met het filterpaneel open liet
  `overflow: hidden` staan, en dan was de **volgende** pagina niet meer scrollbaar.
- **De ene instantie wiste de lock van de andere.** Het volstond dat de nav-instantie zijn effect
  opnieuw draaide — een oriëntatiewissel klapt `isMobile` voor beide om — om met `isOpen === false`
  de lock te wissen terwijl de filterdrawer nog openstond.

De lock is nu **geteld** in plaats van geschreven: hij gaat aan bij de eerste die hem neemt en pas uit
bij de laatste die hem teruggeeft, met een cleanup uit het effect. De teller staat op module-scope, en
dat is precies het punt — de twee instanties moeten dezelfde teller delen.

**Een derde ding dat het issue niet noemt en dat bij het bouwen bleek:** de oude code zette `overflow`
bij het vrijgeven hard op `''`. Dat wiste ook een waarde die er al stond, en `base/_reset.scss` zet
`body { overflow-y: auto }`. De vorige waarde wordt nu bewaard en teruggezet.

**Zes tests**, waarvan er vier precies de faalscenario's uit het issue reproduceren. Negatief getoetst
door de oude implementatie terug te zetten: **vier van de zes vielen om**, inclusief beide gemelde
scenario's en het herstel van de bestaande waarde.

De cleanup draagt een guard tegen dubbel vrijgeven, want React kan een cleanup in StrictMode twee keer
aanroepen — dan zou de teller onder nul zakken en de lock te vroeg loslaten.

### Significance

#### Tier 0

Een globale bijwerking die twee componenten deelden loopt nu via één geteld mechanisme, met tests die
beide faalpaden vastleggen. De suite gaat van 152 naar 165.

**Score:** 3

#### Tier 1

Dit is een bug die de bezoeker écht kan raken: een pagina die na browser-back niet meer scrollt is
onbruikbaar, en er is geen foutmelding die verraadt waarom. Op mobiel, waar de drawers juist bestaan.

**Score:** 4

### Pull Request

[PR #127](https://github.com/DaveKJohn/djcylow-react/pull/127) · merged 2026-08-15

---

## `fix/hero-padding-en-overflow` changelog

### Branch title

De hero-afbeelding valt niet meer weg tussen 1332 en 1400 pixels

### Branch ID

20260815-175300

### Branch type

fix

### What does the change on this branch bring to main?

**De hero-afbeelding werd afgeknipt, en dat gebeurde stil.** `hero.scss` duwde hem naar rechts met drie
losse magic numbers: 900px boven 1331px, 400px daaronder, 0 onder 884px. Wat buiten de container viel
werd weggeknipt door `overflow: hidden` op `.stack`, dus er kwam geen scrollbar en geen foutmelding —
alleen een hero die er deels niet was.

Het issue noemde dit expliciet **niet gemeten**, dus dat is eerst gedaan: in Chrome, met de pagina in
een iframe van een exacte breedte zodat de media queries echt meedoen. Hoeveel procent van de
afbeelding zichtbaar was, per viewportbreedte:

| breedte | vóór | ná |
|---|---|---|
| 900 px | 86 % | **100 %** |
| 1330 px | 100 % | 100 % |
| 1332 px | 81 % | **100 %** |
| 1400 px | 86 % | 100 % |
| 1560 px | 98 % | 100 % |
| 1600 px | 100 % | 100 % |

**Twee dingen stellen het oorspronkelijke vermoeden bij.** Het issue verwachtte het probleem in het
venster 1332–1400px; in werkelijkheid knipte **ook het hele medium-bereik**, wat niemand had opgemerkt
— bij 900px viel er 91px af. En de kern is niet dat venster maar de **sprong** op 1331px: de afbeelding
werd slechter naarmate het scherm bréder werd, en dat is precies de richting waarin niemand kijkt.

Alle metingen passen op één formule — wat er buiten valt is `341 - viewport/2 + padding/2` — dus nul
afknipping vraagt `padding ≤ viewport - 682px`. De drie waarden zijn vervangen door
`clamp(0px, 100vw - 700px, 900px)`: vloeiend, 18px marge op die grens, en bij 1600px exact dezelfde
900px als voorheen. Boven de 1600 verandert er dus niets aan wat er nu staat.

**Wat de clamp níet oplost, en dat staat in de code.** De afbeelding heeft `height: 110%; width: auto`,
dus hij wordt breder naarmate het venster hóger is: bij 1332×1000 is hij 749px in plaats van 667px.
Na deze fix is dat 96% zichtbaar in plaats van 78% — een grote verbetering, maar geen 100%. Die rest is
niet met een `vw`-formule weg te nemen en zou een andere manier van schalen vragen.

**En de vraag van #79 is beantwoord zonder er iets aan te veranderen.** Dat issue vroeg om te meten wát
er uitsteekt als `body { overflow-x: hidden }` weg is. Gemeten: op de home-pagina exact één ding — deze
hero-afbeelding. Op `/luister` steekt er bij 890px en 1000px níets uit, wat de belangrijkste zorg van
dat issue weerlegt. Op `/musicmoodcolours` steken 120 elementen uit, maar dat is een pagina vol
carousels waar horizontale overflow binnen een container normaal gedrag is. De regel is daarom blijven
staan en de metingen zijn in #79 vastgelegd; dat issue blijft open.

### Significance

#### Tier 0

De drie magic numbers zijn vervangen door één formule met de meting ernaast, dus de volgende die hieraan
werkt hoeft niet opnieuw te ontdekken waar de randen liggen. En het toont de faalvorm die deze repo het
vaakst raakt: een fout die geen enkele poort kan zien, alleen een oog.

**Score:** 3

#### Tier 1

De hero is het eerste wat een bezoeker ziet, en hij was op een flink deel van de gangbare
schermbreedtes voor 14 tot 19 procent afgeknipt — inclusief het hele bereik rond 900px. Dat is nu
overal heel.

**Score:** 4

### Pull Request

[PR #121](https://github.com/DaveKJohn/djcylow-react/pull/121) · merged 2026-08-15

---

## `data/audio-mismatch` changelog

### Branch title

Twee mixen spelen weer hun eigen audio

### Branch ID

20260815-141837

### Branch type

data

### What does the change on this branch bring to main?

Twee live mixpagina's speelden de audio van een andere mix af. Titel, tracklist, beschrijving en
cover waren van de ene mix, het geluid van een andere — de bezoeker hoorde dus iets anders dan
waarop hij klikte, met een tracklist die niet meeliep.

| entry | speelde | speelt nu |
|---|---|---|
| `20210412` — Purple Full (f), 176 BPM | het **Blue Full**-bestand van 2024-04-08 | `Purple_Full_f_EDM_DNB_20210412_Audio_V1 (Vol. 1)` |
| `20210329` — Purple Light (f), 176 BPM | een **Progressive House 128 BPM**-bestand uit 2023 | `Purple_Light_f_EDM_DNB_20210329_Audio_V2 (Vol. 1)` |

**Het projectbord noemde dit geblokkeerd op informatie, en dat is het niet gebleken.** De juiste
objectnamen zijn niet afgeleid maar **opgezocht**: uit de 77 bestaande `audioSrc`-waarden volgt per
kleur en power een vaste vorm (`Purple_Full_f_..._V1`, `Purple_Light_f_..._V2`), en de kandidaten
daaruit zijn met een HEAD-request tegen R2 getoetst. Beide bestanden bestaan gewoon — het waren
copy-paste-fouten in de data, geen ontbrekende uploads. De ene staat op de legacy-bucket, de andere
op de actieve; dat is per bestand overgenomen zoals het werkelijk is en niet gelijkgetrokken (dat
is issue #68).

**En de naam alleen was niet genoeg bewijs**, want een naam die klopt kan nog steeds naar het
verkeerde object wijzen. De lengte is daarom tegen de tracklist gelegd: beide nieuwe bestanden
komen uit op **1.40 en 1.42 MB per minuut**, precies in de band van de elf andere purple-mixen
(1.28–1.47). De duur past dus bij de tracklist die op de pagina staat.

**Er ligt nu een wacht op**, zoals het issue voorstelde: `audioSrc` moet uniek zijn over alle
bestanden. Dat die poort echt sluit is niet aangenomen maar getoetst — met een opzettelijk
duplicaat in de tree gaf de suite een rode test met de naam erbij, waarna de tree is hersteld.
Beide oorspronkelijke fouten waren de **oudste** entry in hun bestand, wat past bij een copy-paste
die nooit is afgemaakt.

Sluit #45.

### Significance

#### Tier 0

De uniciteit van `audioSrc` is nu afgedwongen in plaats van verondersteld, en die poort is
aantoonbaar sluitend.

**Score:** 2

#### Tier 1

Twee van de 77 mixpagina's lieten de bezoeker iets anders horen dan waarop hij klikte. Op een site
die om het luisteren draait is dat het ergste wat een pagina kan doen zonder stuk te gaan.

**Score:** 4

### Pull Request

[PR #107](https://github.com/DaveKJohn/djcylow-react/pull/107) · merged 2026-08-15

---

## `data/covers-en-afbeeldingspaden` changelog

### Branch title

Dode afbeeldingspaden in de mix-data hersteld en de spec op de werkelijkheid gezet

### Branch ID

20260815-140951

### Branch type

data

### What does the change on this branch bring to main?

**Er stonden 30 dode afbeeldingspaden in de mix-data. Dat zijn er nu nul**, gemeten over alle 85
entries tegen de schijf. De inventaris week op één punt af van wat de issues beschreven: er waren
28 dode `image_square` en niet 23+3 — de twee extra zijn de 2026-mixen uit #67, die in geen van
beide tellingen zaten.

**De drie kapotte covers zijn de goedkoopste kritieke reparatie** (#46). Purple, Red en Yellow
wezen naar een bestand dat op twee manieren tegelijk fout was: een hoofdletter in de mapnaam —
fataal op Linux, en Netlify bouwt op Linux — en `_preview_square` in plaats van `_square_preview`,
waardoor het ook lokaal al faalde. Die drie zijn drie van de acht covers op `/musicmoodcolours`, in
alle drie de componenten die ze tonen.

> Deze drie entries dragen `ignore: true`, en `CLAUDE.md` zegt die nooit te wijzigen. Die regel gaat
> over de *inhoud* van een preview — het zijn voorbeelden — en niet over een bestandspad dat
> aantoonbaar nergens naar wijst. Ze dragen bovendien `featured: true` en zijn dus zichtbaar.

**De 25 overige dode `image_square` zijn leeggemaakt, niet gerepareerd, en dat is een beslissing die
op een meting rust.** Issue #66 bood twee wegen: de afbeeldingen genereren, of het veld leegmaken en
de spec bijstellen. De eerste weg is dicht, en dat was niet vooraf bekend: een bestaande square is
**geen uitsnede** van de bijbehorende wide-afbeelding maar een aparte foto. Gemeten op een paar
waarvan beide bestaan is het gemiddelde kanaalverschil met een centrale crop **87.9 van 255** — bij
een echte crop was dat een handvol geweest. Een gegenereerde square zou dus verzonnen beeldmateriaal
zijn geweest dat er als origineel uitziet. Wil je vierkante covers voor de Full-mixen, dan moeten de
afbeeldingen aangeleverd worden; tot die tijd is leeg de eerlijke waarde.

**De twee ontbrekende `small`-varianten zijn wél gegenereerd** (#67), want daar gold het omgekeerde:
`small` ís aantoonbaar een verkleining van `large` (verschil 3.1 en 9.8 — compressieruis), dus die
zijn mechanisch af te leiden. `20260101` en `20260507` droegen het `_large`-pad in hun `small`-veld,
waardoor elke bezoeker van `/luister` daar 1920x1080 binnenhaalde voor een kaartje. Er staan nu twee
echte 480x270-bestanden, en de paden wijzen ernaar.

**De testsuite is meebewogen, en één ratchet is opgeheven.** `liveZonderSquareAfbeelding` stond op
25 en is weg: `image_square` is nu een harde assertie. Daar is een nieuwe wacht bij gekomen die
dekt wat het leegmaken openlaat — **elke `featured` entry moet een bestaand `image_square` hebben**,
want dat zijn precies de acht die gerenderd worden. Die test kijkt naar álle entries en niet alleen
de live, omdat de acht covers preview-entries zijn.

**En de spec beschreef twee dingen verkeerd.** `image_square` heette "required" terwijl 25 entries
het tegendeel bewezen; dat is nu "required for `featured`, may be empty otherwise", met de meting
erbij. Daarnaast schreven `image_wide_small` en `image_square` `.jpg` voor, terwijl elk bestand op
schijf `.webp` is en altijd is geweest.

Bijvangst: `Green_Light_Preview` was de enige preview met ingevulde `image_wide_*`-velden, en die
wezen naar bestanden die nooit hebben bestaan — previews staan uitsluitend als square op schijf. De
andere zeven laten die velden leeg; deze is daarmee gelijkgetrokken.

Sluit #46, #66 en #67.

### Significance

#### Tier 0

De data klopt weer met de schijf, en dat is nu afgedwongen in plaats van geteld: een ratchet is
vervangen door een harde assertie plus een nieuwe wacht op de featured-covers. De spec belooft niet
langer iets wat de data niet levert.

**Score:** 3

#### Tier 1

Drie van de acht covers op `/musicmoodcolours` waren gebroken afbeeldingen, in alle drie de
componenten die ze tonen. Daarnaast haalde elke bezoeker van `/luister` voor twee mixen een
1920x1080-bestand binnen waar een 480x270-kaartje stond.

**Score:** 4

### Pull Request

[PR #106](https://github.com/DaveKJohn/djcylow-react/pull/106) · merged 2026-08-15

---

## `fix/live-tekst-en-debugtoets` changelog

### Branch title

Spelfouten op de live site hersteld en de debug-sneltoets uit productie

### Branch ID

20260815-132811

### Branch type

fix

### What does the change on this branch bring to main?

**De debug-sneltoets stond live.** `src/app/layout.tsx` registreerde op elke pagina een globale
`keydown`-listener op de losse toets **`w`**. Elke bezoeker die daar buiten een invoerveld op drukte,
zette de klasse `ux-mode` op `<html>` en `<body>` en veranderde daarmee het uiterlijk van de site —
bereikbaar bij gewone toetsenbordnavigatie en bij type-ahead-zoeken op een pagina zonder gefocust
veld. Het script staat nu achter `process.env.NODE_ENV !== 'production'`, en de combinatie is
meteen `Ctrl+Shift+W` geworden: ook in ontwikkeling is een enkele letter te makkelijk per ongeluk te
raken. Gemeten in de verse build: `ux-mode-toggle` en `KeyW` komen in **nul** van de 89 gebouwde
pagina's nog voor.

**Zes tekstfouten die alle zes live stonden**, geverifieerd in `out/`:

| was | wordt | waar |
|---|---|---|
| `Muziekale kaart` | `Muzikale kaart` | `musicmoodcolours/page.tsx`, een `<h2>` |
| `© 2025 DJ Cylow` | `© {buildjaar}` | `Footer.tsx`, op elke pagina |
| `Geirriteerd` | `Geïrriteerd` | `Erlenmeyers.tsx` |
| `(nor)Adrenaline` | `Adrenaline` | `musicmoodcolours/page.tsx`, een `<h3>` |
| `top-producers` | `topproducers` | de fallback-beschrijving op elke mixpagina |
| `Direct Contact` | `Direct contact` | *al meegenomen in `fix/contactformulier-endpoint`* |

Twee daarvan verdienen een woord. Het **copyrightjaar** is nu `new Date().getFullYear()`, wat bij
static export het **buildjaar** vastlegt — hier precies goed, want elke merge naar `main` triggert
een Netlify-build. Een verouderd jaartal in de footer leest op een boekingssite als "wordt niet
onderhouden", bij precies de bezoeker die op het punt staat contact op te nemen. En **`Geirriteerd`**
stond naast `Geïrriteerd` in een tweede component op dezelfde pagina; het verschil is binnen één
scroll te zien, maar de variant zonder trema verschijnt pas na interactie en is daardoor nooit
opgevallen.

De laatste tekstfout uit issue #49 zat in `ContactForm.tsx` en is in de contactformulier-branch
meegenomen, omdat die hetzelfde bestand aanraakte.

Sluit #49 en #55.

### Significance

#### Tier 0

N/A — dit raakt alleen wat de bezoeker ziet. De code eromheen blijft zoals hij was.

**Score:** N/A

#### Tier 1

Elke bezoeker kon met één toetsaanslag het uiterlijk van de site veranderen, en er stonden zes
tekstfouten live waarvan er twee in een `<h2>`/`<h3>` staan en dus meetellen in de koppenstructuur
die Google leest. Het copyrightjaar stond een jaar achter op elke pagina.

**Score:** 4

### Pull Request

[PR #105](https://github.com/DaveKJohn/djcylow-react/pull/105) · merged 2026-08-15

---

## `data/emoji-descriptions-en-preview-ids` changelog

### Branch title

De Cyan-emoji, drie te lange descriptions en de preview-ids zijn gelijkgetrokken

### Branch ID

20260815-212715

### Branch type

data

Drie afwijkingen in de mix-data die elk een keuze vroegen in plaats van een fix.

**De Cyan-emoji: de spec volgt de data, niet andersom.** Alle zeven Cyan-mixen gebruiken 🧊 waar de
spec 💠 voorschreef. De spec is aangepast, om één reden: die zeven titels staan al gepubliceerd op
Spotify. Ze hier herschrijven zou de repo iets anders laten zeggen dan de live uploads, en zou elke
toekomstige Cyan-release tot buitenbeentje maken tussen zijn eigen broertjes. Zeven op zeven is een
conventie, geen slordigheid.

**Drie te lange `description_nl` in `full-red.json`** (165, 167 en 162 tekens) zijn ingekort naar 152,
155 en 148. Google kapt rond 155–160 af, dus die drie verloren hun laatste zin — bij `20240226`
precies het use-case-signaal ("of een intense thuissessie") waar de spec om vraagt. De boodschap is
behouden; alleen de omhaal is eruit.

**Dat verlaagde twee ratchets, en dat is het mechanisme dat werkt.** De testsuite meldde uit zichzelf
dat er iets was opgelost: te lange beschrijvingen van 3 naar **0**, en beschrijvingen met een streepje
van 13 naar **11** — twee van de drie herschreven teksten droegen er een (`non-stop`,
`DnB-liefhebber`). Beide plafonds zijn verlaagd, want een ratchet die je niet bijstelt verliest
precies de zichtbaarheid waarvoor hij bestaat.

**De acht preview-entries hadden vijf naamconventies** voor hun `id`: drie volgden de spec, drie waren
lowercase, twee Title_Case. Alle acht dragen nu `Kleur_light_preview`, de vorm die de spec al
voorschrijft. En `light-red` had als enige een afwijkende `title` (`"Preview · Red Light (f) Mix"`);
die is gelijkgetrokken.

**Een noot over de uitvoering.** De eerste poging schreef de JSON terug met `JSON.stringify(…, null, 4)`
en produceerde een diff van 7451 regels voor 8 wijzigingen — die bestanden gebruiken CRLF, twee spaties
en arrays op één regel. Teruggedraaid en opnieuw gedaan met gerichte tekstvervanging: **17 regels**.
Een opmaakwijziging die als datawijziging in de historie belandt, is precies wat een latere `git blame`
onbruikbaar maakt.

### Significance

#### Tier 0

Drie inconsistenties weg, en de twee ratchets staan weer op de werkelijke stand — inclusief de eerste
die op nul komt.

**Score:** 3

#### Tier 1

Drie zoekresultaten worden niet meer afgekapt midden in hun laatste zin, op precies het deel dat de
bezoeker vertelt wanneer de mix past. De rest raakt de bezoeker niet.

**Score:** 3

### Pull Request

[PR #136](https://github.com/DaveKJohn/djcylow-react/pull/136) · merged 2026-08-15

---

## `fix/honeypot-wordt-uitgelezen` changelog

### Branch title

De honeypot van het contactformulier vangt eindelijk iets

### Branch ID

20260815-203842

### Branch type

fix

### What does the change on this branch bring to main?

Het contactformulier zette een honeypot neer — een veld dat met CSS verborgen is, zodat een mens het
leeg laat en een bot het invult — maar `send-email.js` las dat veld **nooit** uit. De val stond er
dus wel en ving niets.

Dat is dezelfde vorm die deze repo vandaag al twee keer heeft gevonden: `EmailDisplay` bestond
terwijl het adres er in platte tekst naast stond, en `cta-hover-effect` bestond terwijl het hover-
effect nergens werd aangeroepen. Het onderdeel is er, de aansluiting ontbreekt, en niets wordt rood.

**Het antwoord is bewust een 200 en geen fout.** Een bot die een foutmelding krijgt, weet dat de val
bestaat en laat het veld de volgende keer leeg; een bot die "verzonden" leest, probeert het niet nog
eens. Er wordt niets verstuurd — de functie stopt daar.

**De check staat vóór álle andere validatie**, en dat is een tweede keuze: zo krijgt een bot ook geen
`vul het volgende in`-antwoord terug, waaruit hij zou kunnen afleiden welke velden er zijn. Hij kost
bovendien geen call naar Google meer.

**Vijf tests**, waarvan er drie het gedrag rond de randen vastleggen: een leeg veld moet gewoon
doorgaan (het formulier stuurt het altijd mee), een veld met alleen spaties ook, en een ingevuld veld
mag zelfs zonder reCAPTCHA-token nog een 200 geven. Negatief getoetst door de conditie uit te
schakelen: twee tests vielen om.

Het veld wordt rechtstreeks gelezen en niet via `leesVeld`, want die toetst op `MAX_LENGTE[naam]` en
die bestaat voor dit veld niet — dan zou de vergelijking tegen `undefined` lopen.

### Significance

#### Tier 0

Een beveiliging die er wel stond maar niets deed, doet nu wat hij belooft. Met tests eromheen, want
dit is precies het soort aansluiting dat stil weer kan verdwijnen.

**Score:** 3

#### Tier 1

Het contactformulier is het enige conversiepad van de site, en de tweede laag botbescherming
functioneerde niet. reCAPTCHA deed zijn werk al wel, dus dit is een verbetering en geen gat dat
openstond.

**Score:** 3

### Pull Request

[PR #129](https://github.com/DaveKJohn/djcylow-react/pull/129) · merged 2026-08-15

---

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

[PR #120](https://github.com/DaveKJohn/djcylow-react/pull/120) · merged 2026-08-15

---

## `config/netlify-publish-en-csp` changelog

### Branch title

netlify.toml wijst de juiste publicatiemap aan en meet een Content-Security-Policy

### Branch ID

20260815-191055

### Branch type

config

### What does the change on this branch bring to main?

Twee dingen in `netlify.toml`, het bestand dat de safety-rules beschermen omdat een fout erin de live
site plat legt.

**De publicatiemap wees naar `.next`, waar geen `index.html` staat.** `next.config.ts` zet
`output: 'export'`, en dan schrijft `next build` de complete site naar `out/`. Als Netlify `.next`
letterlijk zou publiceren, was de hele site een 404. Dat hij tóch werkt komt doordat de Netlify
Next.js-runtime `output: 'export'` herkent en zelf de export-map neemt — maar die runtime staat
nergens in dit bestand verklaard, dus de configuratie leunde op een detectie die de repo niet
vastlegt. Nu staat er `publish = "out"`, wat de aanname expliciet maakt zonder het resultaat te
veranderen.

**Er was geen Content-Security-Policy en geen Permissions-Policy.** Live gemeten: `x-frame-options`,
`x-content-type-options` en `referrer-policy` komen wel door, die twee niet. Dat weegt hier zwaarder
dan gemiddeld omdat de site GTM laadt — een mechanisme dat per ontwerp willekeurige tags injecteert,
met een container waarvan de inhoud buiten deze repo wordt beheerd. Zonder CSP is er geen enkele
begrenzing op wat daarlangs in de pagina van de bezoeker draait.

De CSP staat **bewust als `Report-Only`**. Die blokkeert niets en meldt alleen in de console; dat is
de juiste eerste stap, want een te strakke policy breekt de site zonder dat een build of test het
ziet, en er is geen staging. De bronnenlijst is gemeten aan de gebouwde HTML en de componenten:
googletagmanager, google/gstatic voor reCAPTCHA, youtube-nocookie en i.ytimg voor de promo, en de
R2-bucket voor de audio. Fonts staan er niet bij, want `next/font/google` haalt die bij de build
binnen en serveert ze self-hosted — geverifieerd: nul verwijzingen naar `fonts.gstatic.com` in de
uitgeleverde HTML.

De Permissions-Policy sluit camera, microfoon en locatie af. Die stonden open voor elke ingesloten
frame, en de site sluit er twee in.

**Onderweg bleek er iets dat in geen enkel issue staat:** er zit **Cloudflare** vóór Netlify, en
`www.djcylow.com` doet een 301 naar de apex. De `strict-transport-security`-header komt daar
vandaan en niet uit dit bestand — gemeten levert Netlify zelf al
`max-age=31536000; includeSubDomains; preload`. Dat is de reden dat het HSTS-voorstel uit #52 hier
níet is uitgevoerd: die header aanpassen in `netlify.toml` raakt niet wat de bezoeker krijgt.

**En de eerste poging leverde de twee nieuwe headers helemaal niet uit — stil.** De deploy preview
gaf `x-frame-options`, `x-content-type-options` en `referrer-policy` netjes terug, maar de CSP en de
Permissions-Policy niet. Geen foutmelding, geen gefaalde build, en Netlify's eigen "Header
rules"-check bleef gewoon op `pass` staan.

Het verschil tussen wat wél en niet doorkwam bleek **de comments**: de nieuwe headers stonden met
uitleg en lege regels ertussen binnen `[headers.values]`. Na het verplaatsen van precies die comments
naar bóven het blok kwamen alle vijf door. Dat is met een tijdelijke `X-Csp-Test`-header hard gemaakt,
zodat een structuurprobleem te onderscheiden viel van een waardeprobleem; die testheader is daarna
weer verwijderd en de eindmeting bevestigt alle vijf.

Die val staat nu als waarschuwing in het bestand zelf, want hij faalt op de gevaarlijkste manier: je
denkt dat er twee beveiligingsheaders staan, en er staat niets. Zonder deze meting was dat precies zo
gemerged.

**Wat de deploy preview verder bewijst:** alle vier de gemeten routes (`/`, `/luister`,
`/musicmoodcolours`, `/diensten`) geven 200 met HTML terwijl `publish = "out"` actief is. Daarmee is
de publicatiemap niet beredeneerd maar aangetoond.

### Significance

#### Tier 0

De config beschrijft nu wat er werkelijk gebeurt in plaats van te leunen op auto-detectie, en de
documentatie in `CLAUDE.md` en `README.md` die de build naar `.next` liet gaan is meegecorrigeerd.

**Score:** 3

#### Tier 1

Twee beveiligingsheaders erbij op de live site, waarvan er één voorlopig alleen meet. De bezoeker
merkt er niets van — dat is precies de bedoeling bij `Report-Only`.

**Score:** 3

### Pull Request

[PR #118](https://github.com/DaveKJohn/djcylow-react/pull/118) · merged 2026-08-15

---

## `fix/emaillek-en-dode-imports` changelog

### Branch title

Het e-mailadres lekte langs zijn eigen bescherming

### Branch ID

20260814-214410

### Branch type

fix

### What does the change on this branch bring to main?

**Het e-mailadres stond op zes pagina's gewoon in de statische HTML, terwijl de component die dat
hoort te voorkomen er ongebruikt boven hing.** `ContactForm.tsx` importeerde `EmailDisplay` maar
gebruikte het niet, en zette `info@djcylow.com` drie regels verderop voluit in de zin *"Stuur een
e-mail naar ..."*. Die component bestaat juist om het adres pas in de browser samen te stellen, zodat
scrapers die alleen de HTML lezen het niet vinden. De bescherming was begonnen en nooit afgemaakt.

Dat is nu wel afgemaakt, en het resultaat is gemeten: **6 → 0** gebouwde HTML-bestanden met het adres
erin. De zin blijft staan met een lege `<span>` die de browser vult. De footer deed dit al goed; het
lek zat in het contactformulier, dat op de home, `diensten` en de drie dienstenpagina's staat.

De aanleiding was een ESLint-**warning** over een ongebruikte import — de laagste categorie melding
die er is. De achterliggende fout was een beveiligingsmaatregel die niets deed.

**Verder alle resterende warnings weg; de teller staat nu op 0 errors en 0 warnings.**

- `Navigation.tsx` — `useState`/`useEffect` geïmporteerd maar nergens gebruikt
- `send-email.js` — `catch (e)` zonder `e` te lezen, nu `catch {}` met de reden erbij
- `page.tsx` — de imports van `Referenties` en `GoogleReviews`, die in de JSX **uitgeschakeld**
  staan. De uitgecommentarieerde regels blijven staan: díe dragen de bedoeling, een ongebruikte
  import doet dat niet. Of die twee secties terugkomen is een contentvraag en blijft open
- `Hero.tsx` — de twee `no-img-element`-warnings zijn onderdrukt mét de afweging erbij, niet
  stilgezet. `next/image` levert hier weinig: deze repo draait op `images: { unoptimized: true }`
  (vereist voor de static export), dus er is geen resizing en geen formaatconversie — precies waar de
  regel om vraagt. Wat het wél toevoegt is lazy loading, en dat wil je voor een hero niet

**Bijvangst, gemeten en vastgelegd in de code:** achter die warning zit wél een echt probleem. Beide
hero-afbeeldingen staan in de DOM en worden met `display: none` geschakeld, terwijl een browser een
`<img src>` met `display:none` in de regel gewoon ophaalt. Een mobiele bezoeker downloadt daardoor
`hero_desktop.webp` (**105 KB**) bovenop de `hero_mobile.webp` (**56 KB**) die hij ziet — bijna
tweemaal de nuttige lading, juist op de verbinding waar dat het meest telt. De oplossing is
`<picture>` met een `<source media=...>`, maar die vraagt ook een samenvoeging in `hero.scss` en dus
een blik op het resultaat. Dat staat als aparte klus genoteerd in `Hero.tsx` zelf.

**En de alt-teksten van de hero zijn vervangen.** Er stond `alt="heroDesktop"` en `alt="heroMobile"`
— dat beschrijft het bestand, niet de foto, en wordt door een screenreader als betekenisloze ruis
voorgelezen. Het is een foto van DJ Cylow met koptelefoon achter zijn Pioneer-controller, en dat staat
er nu.

### Significance

#### Tier 0

Een ongebruikte import bleek een beveiligingsmaatregel te zijn die niets deed. Dat is precies waarom
de warning-teller op 0 hoort te staan in plaats van "acht, en die kennen we": in een lijst van acht
bekende meldingen valt niet op welke er één te veel is. De teller staat nu op 0/0, dus de volgende
melding is per definitie nieuw.

**Score:** 4

#### Tier 1

Het e-mailadres van de opdrachtgever stond geïndexeerd en scrape-baar op zes pagina's, terwijl de site
de indruk wekte dat het beschermd was. Dat is nu dicht. Merkbaar wordt het pas op termijn — in wat er
níet binnenkomt — en aan de pagina zelf verandert niets zichtbaars.

**Score:** 3

### Pull Request

[PR #39](https://github.com/DaveKJohn/djcylow-react/pull/39) · merged 2026-08-14

---

## `docs/release-route-volgt-de-bron` changelog

### Branch title

De release-route draait via cut-release, zoals de bron

### Branch ID

20260813-231530

### Branch type

docs

### What does the change on this branch bring to main?

Drie beslissingen van Dave zijn hiermee in de documentatie geland, en samen halen ze de release-route
van deze repo gelijk met de bron. De doorslaggevende: **`cut-release` moet hier draaien.** De repo is
daarom om het script heen gebogen in plaats van andersom.

**De release-branch is afgeschaft.** Uitzondering 2 op "nooit direct op `main`" was een
`docs/release-v<versie>`-branch met een scope-lijstje, gemerged via een kale `git merge --no-ff`. Dat
botste met het script: `cut-release.ps1` doet géén `git checkout main` maar commit op de branch waar je
op staat, dus vanaf een release-branch landde de commit daar terwijl de push naar `main` ging. De bron
heeft die branch niet en noemt dat expliciet *"deliberately no branch/PR — just like the fold"*.
Uitzondering 2 is nu de **release-commit** zelf, met de reden erbij die Dave in de bron gaf: *"aan het
product zelf verandert verder niks"* — een release herpubliceert wat al gemerged is, dus er is geen diff
om te beoordelen. En omdat het script met `git add -A` stageert, kan die uitzondering geen
bestandslijstje dragen zoals de fold; in plaats daarvan is de voorwaarde hard: **schone tree vóór de
cut**.

**De vijftien handmatige stappen zijn wat het script niet doet.** Een tabel bij de kop wijst aan wie wat
doet, en de route eronder is teruggebracht tot zeven punten: op `main` staan met een schone tree, niets
ongefold laten wachten, het script draaien, het audience-concept herschrijven, de aankondiging schrijven,
de GitHub Release maken en de bijlagen uploaden. Wat het script al deed staat eronder als noten, met hun
valkuilen — waaronder dat de development-note de **branchnaam** als kop houdt.

**De versienummertabel is vervangen door de tier-regel.** De tabel hing de bump aan de sóórt wijziging
(docs op patch, nieuwe mix op minor); de poort hangt hem aan de **tier** van de wachtende entries. Die
twee gaven op hetzelfde werk verschillende antwoorden, aantoonbaar bij v2.23.0: als minor gecut omdat
drie entries tier 1 droegen, terwijl de tabel dat docs- en datawerk op patch zette. Nu geldt: alleen
tier 0 is een patch, tier 1 of hoger een minor, en een major vraagt tien minors in de huidige
major-lijn. Deze repo blijft op **audience-tier 1**, dus een minor schrijft de note zonder
*For consumers*-sectie.

**En de stand van de vier pijlers is bijgewerkt in plaats van geschat.** Lint, CI, testsuite en branch
protection staan nu alle vier. Toch blijft site-werk op Dave's woord wachten, en de twee redenen daarvoor
staan er nu expliciet: geen poort kan bewijzen dat een pagina er góéd uitziet, en de ruleset heeft
`bypass_actors` voor Admin en Maintain — wat **moet**, anders blokkeert hij `cut-release`'s eigen push.
Voor een admin is de required check dus adviserend.

Meegenomen: `releases/README.md` zei nog dat de drie documenten hier met de hand worden geschreven en
kondigde deze branch aan als toekomstig werk; dat is bijgewerkt. En daar is één tegenspraak bij
opgeschreven die geen diff kan vinden: de gespiegelde helft van die pagina zegt *"this repo answers 2"*,
verbatim uit de bron waar "this repo" de bron zélf is, terwijl deze repo op tier 1 staat. Een
gespiegelde zin met de woorden "this repo" erin houdt niet op te bestaan bij het kopiëren — hij wordt
onwaar, en beide kopieën blijven byte-identiek.

### Significance

#### Tier 0

De release-route is niet langer een handmatige beschrijving naast een script dat iets anders doet. Wie
een release cut, leest nu wat er werkelijk gebeurt: waar hij moet staan, wat het script overneemt, en
waarom er geen branch meer is. De versieregel is bovendien van proza dat niets tegenhoudt veranderd in
dezelfde regel die de poort al afdwong.

**Score:** 4

#### Tier 1

De versienummers van deze repo gaan vanaf nu meebewegen met wie een wijziging merkt in plaats van met
hoe de wijziging heet, en dat is precies wat een versienummer aan een opdrachtgever hoort te vertellen.
Daarnaast staat nu zwart op wit waarom site-werk op Dave blijft wachten ook nu alle vier de poorten er
staan.

**Score:** 3

### Pull Request

[PR #34](https://github.com/DaveKJohn/djcylow-react/pull/34) · merged 2026-08-13

---

## `config/testsuite-mixdata-en-node-pin` changelog

### Branch title

Testsuite op de mix-data, Node gepind en de CI-poort onontkoombaar

### Branch ID

20260813-225720

### Branch type

config

### What does the change on this branch bring to main?

Deze repo had **nul testsuites** en pinde zijn Node-versie nergens vast. Dat waren twee van de drie
pijlers waar de gedeelde PR-default op leunt. Beide staan er nu.

**36 tests over de mix-data, en ze zijn gemeten in plaats van overgeschreven.** `src/data/mixes/README.md`
beschrijft tientallen veldregels, maar niets hield ze tegen: een fout erin haalt de build (JSON is
geldig, TypeScript tevreden) en wordt daarna op `djcylow.com` zichtbaar. De spec heeft echter een sectie
*"Known Inconsistencies in Legacy Data"*, dus die regels hard afdwingen levert een suite die op dag één
rood staat — en een suite die altijd rood staat bewaakt niets. Daarom is de data eerst gemeten:

- **23 regels haalt de data nu al volledig** en staan als harde assertie: `tracks` gelijk aan
  `tracklist.length`, unieke `id`/`title`/`id_spotify`/`title_spotify`/`description_nl`, `color` met
  hoofdletter en passend bij de bestandsnaam, ISO-`date` die met `jaar`/`maand`/`dag` en `id`
  overeenkomt, `genre` als familie van `subgenre`, 176 bpm voor Drum & Bass, titels onder 60 tekens,
  oplopende tracklist-tijden, en het bestaan van elk `image_wide_*`-bestand.
- **7 regels haalt de data niet** en staan als **ratchet**: het gemeten aantal is het plafond. Een
  nieuwe overtreding faalt, en een opgelóste overtreding faalt óók — met de melding dat het plafond
  omlaag moet. Zo blijft de achterstand zichtbaar in plaats van stil weer op te lopen. Die werking is
  in beide richtingen bewezen voordat de suite werd vastgelegd.

**En dat meten legde meteen een zichtbaar defect op de live site bloot.** 25 live mixen verwijzen naar
een `image_square` die niet bestaat, en dat veld wordt gerenderd door `BasiskleurenCarousel`,
`Erlenmeyers` en `VsKleurenCarousel` — dus de Music Mood Colours-pagina laadt daar 404's. Het is geen
extensie-mismatch: de `square/`-mappen bestaan grotendeels niet (`public/images/full/blue/` heeft alleen
`wide/`). Repareren vraagt echte afbeeldingen en is Dave's beslissing, dus de suite legt het exact vast
in plaats van het op te lossen. Tweede vondst van dezelfde soort: 25 live mixen staan op de legacy
R2-bucket, terwijl de veldspec beweert dat dat alleen `full-blue.json` betreft.

**De Node-versie staat vast in `.nvmrc`.** CI had `'22'` hardgecodeerd terwijl Netlify zijn eigen default
draaide, en niets meldde het als die twee uit elkaar liepen. Netlify **leest** `.nvmrc`, dus dit is nu de
enige plek waar de versie wordt verklaard; `ci.yml` haalt hem daar op via `node-version-file`.

**De poorten draaien de suite ook echt.** `Get-TestCommands` in `scripts/repo-config.ps1` geeft
`npx vitest run` terug — de seam die plugin 4.8.0 hiervoor toevoegde. Zonder die waarde meldde `open-pr`
eerlijk *"scripts\tests not found — test gate skipped"* en draaide er niets, terwijl de poort zegt "all
test suites green". In CI staat de suite als gewone `npm test`-stap: de gedeelde gate woont in
`native-capture-lib.ps1` van de bron, en dat bestand heeft een consumer niet in zijn repo.

### Significance

#### Tier 0

De derde pijler onder de PR-default bestaat nu. Waar de poort alleen bewees dat de code **bouwt**,
bewaakt de suite of het **gedrag** gelijk bleef — op precies de data waar de regels tot nu toe alleen in
proza stonden. En de eerste run leverde al twee defecten op die niemand kon zien.

**Score:** 4

#### Tier 1

De Node-versie van de live build kan niet meer stil divergeren van CI, en er ligt nu een exacte lijst van
25 mixen met een gebroken afbeelding op de Music Mood Colours-pagina — een zichtbaar defect dat
maandenlang onopgemerkt bleef omdat geen enkele poort ernaar keek.

**Score:** 3

### Pull Request

[PR #33](https://github.com/DaveKJohn/djcylow-react/pull/33) · merged 2026-08-13

---

## `docs/release-route-naar-script` changelog

### Branch title

Release Workflow gelijk aan wat cut-release werkelijk doet

### Branch ID

20260813-224225

### Branch type

docs

### What does the change on this branch bring to main?

`CLAUDE.md` beschreef de release-route zoals die ooit bedoeld was, niet zoals de gedeelde
`cut-release`-skill hem werkelijk uitvoert. Vijf plekken zijn rechtgezet, allemaal in dat ene bestand.

**De gevaarlijkste eerst: `cut-release` draait wél iets.** Er stond *"Het print commandoblokken in
vaste volgorde; het draait niets zelf."* Het script doet `git add -A`, `git commit`, `git tag -a` en
**twee pushes, waaronder `git push origin main`**. Alleen `gh release create` wordt geprint. Wie de
oude regel las, dacht dat proberen gratis was, terwijl het script precies de handeling doet die de
safety-rules aan Dave voorbehouden. Het blok heet in de bron `# --- Commit + tag directly on main ---`.

**Daaruit volgen twee botsingen met de grondwet, en die staan nu bij de safety-rules zelf.** Het script
doet geen `git checkout main` maar commit op de branch waar je op staat, terwijl stap 2 van de Release
Workflow je opdraagt eerst een release-branch te maken. En `git add -A` kent geen scope, terwijl beide
toegestane directe commits op `main` juist *"scope beperkt tot"* een lijstje bestanden zijn. Er staat nu
expliciet dat dit een derde weg zou zijn die niet is toegestaan zolang Dave hem niet heeft gewogen —
ook niet "even met `-NoPush`", want dat houdt alleen de push tegen en niet de ongescopete commit.

**De vijftien stappen zeggen nu wie wat doet.** Een tabel bij de kop wijst per stap aan wat het script
overneemt (3, 4, 5, 8, 9, 10, 12 en een concept voor 6) en wat handwerk blijft (7, 13, 14, 15). Dat is
gemeten aan het script, niet geschat: v2.23.0 is met de hand gelopen en dat blijft voorlopig zo.

**De taaltegenspraak is beslecht op Engels** (Dave, 2026-08-13). Stap 6 droeg op het audience-document
in het Nederlands te schrijven; de taalsectie zei dat `Get-ReleaseNoteWording` bewust leeg staat omdat
leeg Engels betekent. Beide stonden in hetzelfde bestand. Het meetbare gevolg: `session-status.ps1`
leest de "nog open"-sectie via `SectionOpen`, valt terug op het Engelse
`What was still open at this release`, en meldde bij `/continue` dat de note van v2.23.0 die sectie
niet had — terwijl hij er gevuld en wel in stond. Stap 6 is meebewogen en noemt nu de Engelse koppen
letterlijk; de seam blijft leeg. `v2.23.0` is de laatste Nederlandse note en wordt niet herschreven.

**En de versienummertabel spreekt de bump-poort tegen.** De tabel kijkt naar de soort wijziging en zet
docs- en workflow-werk op patch; de poort kijkt naar de tier van de wachtende entries en maakt tier 1
een minor. v2.23.0 is als minor gecut met precies zulk werk erin. Dat is nu opgeschreven met de
constatering dat in de praktijk de poort wint — die weigert, de tabel is proza. Welke van de twee
leidend wordt, is als beslissing bij Dave neergelegd en er is niets geschrapt.

Meegenomen: de vier skills die de plugin levert maar `CLAUDE.md` niet noemde — `adopt-config`,
`fix-mojibake`, `lock` en `continue` — staan nu in de skill-lijst.

### Significance

#### Tier 0

Een specialist die de oude regel las, kon `cut-release` draaien in de overtuiging dat het niets deed,
en daarmee ongevraagd naar `origin/main` pushen met een ongescopete commit. Dat gat is dicht, en de
route zegt nu per stap wie hem loopt in plaats van een handmatige volgorde te suggereren die het script
al grotendeels overlapt.

**Score:** 4

#### Tier 1

Drie beslissingen die alleen Dave kan nemen staan nu expliciet opgeschreven in plaats van verstopt te
zitten in een tegenspraak: de twee botsingen van `cut-release` met de grondwet, en welke van de
versienummertabel of de bump-poort leidend is. De taalkeuze die hij vanavond maakte is meteen
doorgevoerd, waardoor `/continue` voortaan kan rapporteren wat een release openliet.

**Score:** 3

### Pull Request

[PR #32](https://github.com/DaveKJohn/djcylow-react/pull/32) · merged 2026-08-13

---

## `config/pr-route-gelijk-aan-de-regel` changelog

### Branch title

PR-template gelijk aan de PR-regel

### Branch ID

20260813-212126

### Branch type

config

### What does the change on this branch bring to main?

`.github/pull_request_template.md` sprak op vijf punten de repo tegen die het beschrijft. Alle vijf zijn
rechtgezet in dat ene bestand; `scripts/repo-config.ps1` blijft ongemoeid.

**De placeholder wordt nu herkend.** De eerste regel was `<!-- Korte beschrijving van de wijziging en
waarom -->`, vier woorden en een punt naast een regel die `open-pr` verbatim herkent. Een near-miss is de
ene fout die op succes lijkt: het script laat de regel staan, vult geen beschrijving in en meldt niets.
Dat trof PR #26, #29 en #30 — elke keer met de hand rechtgezet via `gh pr edit`. De regel is nu de
canonieke placeholder die `Get-PrTemplateCanonicalPlaceholder` aanwijst, zodat de beschrijving uit
`branch/branch-changelog.md` er vanzelf in komt. Engels, want het is een machine-gelezen sleutel die
`open-pr` meteen vervangt — dezelfde categorie als de zes sectiekopjes van een entry.

**Het goedkeuringsvinkje draagt de tweedeling in plaats van die tegen te spreken.** `- [ ] Merge
goedgekeurd door: @DaveKJohn` vroeg op élke PR om een goedkeuring die de PR-regel sinds 2026-08-13 alleen
nog voor site-werk verlangt. Daarvoor staan nu twee keuzes: raakt de PR `src/`, `public/` of
`src/data/mixes/`, dan wacht hij op Dave; raakt hij dat niet, dan loopt hij door tot en met de fold. De
opener maakt daarmee per PR zichtbaar onder welke helft van de regel de branch valt, wat geen poort kan
vaststellen.

**Twee dode verwijzingen zijn weg.** Het template vroeg om bijgewerkte strings in `messages/en.json` +
`messages/nl.json` — een map die niet bestaat en niet meer komt, nu `feature/i18n-setup` is gesloten. En
het changelog-vakje wees naar `<branch-naam>.md` in de repo-root, het entry-model van vóór de migratie van
2026-08-11; de twee bestanden wonen in `branch/`.

**En de prefix-lijst is weer compleet.** `scripts/lib/branch-info.ps1` kent negen prefixen, het template
noemde er zeven: `chore/` ontbrak, en `docs`/`config` stonden in een andere volgorde dan de tabel. Wie een
opruimbranch opende, vond zijn type niet in de lijst die de repo zelf hanteert.

Onderweg gemeten en het opschrijven waard: het oude goedkeuringsvinkje werd **nooit** afgevinkt.
`open-pr.ps1` vinkt op de default `^- \[ \] (Aangevraagd door Dave|Requested by Dave)`, en
`Merge goedgekeurd door:` matchte daar niet op. Het stond dus op elke PR leeg — een vakje dat altijd
hetzelfde zegt, draagt geen informatie. Het changelog-vakje wordt wél afgevinkt, op de prefix
`- [ ] Changelog entry-bestand aangemaakt`; die formulering is daarom bewust behouden en alleen het pad
erachter is gecorrigeerd.

### Significance

#### Tier 0

De beschrijving van elke volgende PR komt er vanzelf in te staan, in plaats van drie keer op vier met de
hand te worden nagelopen. Het template stopt bovendien met het tegenspreken van de grondwet die het
samenvat, en dat was in het klein dezelfde constructie die PR #29 in het groot opruimde.

**Score:** 4

#### Tier 1

Dave wordt niet langer op elke PR om een goedkeuring gevraagd die de regel alleen nog voor site-werk
verlangt, en ziet in plaats daarvan per PR staan of deze op hem wacht of doorloopt.

**Score:** 3

### Pull Request

[PR #31](https://github.com/DaveKJohn/djcylow-react/pull/31) · merged 2026-08-13

---

## `style/dode-componenten-weg` changelog

### Branch title

De vijf slapende componenten en hun stylesheets zijn opgeruimd

### Branch ID

20260815-212111

### Branch type

style

De vijf componenten die nergens gerenderd werden zijn weg: `Diensten`, `MeetTheDJ`, `Verzoeknummers`,
`Referenties` en `GoogleReviews`, samen met hun drie stylesheets en `src/content/referenties.ts`. In
`page.tsx` stonden twee ervan uitgecommentarieerd, en zulke regels lezen als "staat klaar om aan te
zetten" — terwijl de referentiedata uit vier plaatsvullers bestond die één uncomment verwijderd waren
van publicatie op een boekingssite.

**Dat maakt ook `react-google-reviews` los**, de dependency die in PR #114 nog moest blijven omdat
`GoogleReviews.tsx` er als enige naar verwees. `dependencies` telt nu zes pakketten, en alle zes
worden gebruikt.

**De teksten in `src/content/home.ts` blijven wél staan**, en dat is bewust een ander oordeel dan bij
de code. De velden die alleen die componenten lazen — `intro_story_*`, `verzoeknummers_story_*`, de
vier `*_h3`-koppen — zijn geschreven tekst: een bio, een uitleg over verzoeknummers. Code die niets
doet is schuld; een alinea die nog nergens staat is voorraad. Er staat nu bovenaan dat bestand welke
velden gerenderd worden en welke klaarliggen.

**De test die deze slapers bewaakte is omgedraaid in plaats van weggegooid.** Hij controleerde of hun
imports ergens naartoe wezen; nu controleert hij of **elke** component in `src/components/home/` ook
daadwerkelijk gerenderd wordt — dus of er geen nieuwe slapers ontstaan. Dat is dezelfde regel die de
vijf destijds had gevangen, alleen een stap eerder. Plus een test dat er geen uitgecommentarieerde
JSX-secties achterblijven.

**Twee bestaande tests moesten mee, en één daarvan is er beter van geworden.** De alt-tekst-test las
een vaste lijst bestanden waaronder `Verzoeknummers.tsx`; die viel na het verwijderen op een
ontbrekend bestand in plaats van op een slechte alt-tekst. Hij loopt nu over de hele boom en dekt
daarmee ook nieuwe componenten.

### Significance

#### Tier 0

Negen bestanden en een dependency minder, en de regel die slapers vangt staat nu vóór ze ontstaan in
plaats van erna. Wat weg is staat in de git-historie; wat blijft is tekst, geen code.

**Score:** 3

#### Tier 1

De site levert exact dezelfde pagina's — 89, ongewijzigd. Het risico dat verdwijnt is dat iemand met
één uncomment vier verzonnen klantcitaten publiceert.

**Score:** 2

### Pull Request

[PR #135](https://github.com/DaveKJohn/djcylow-react/pull/135) · merged 2026-08-15

---

## `config/contactform-tests` changelog

### Branch title

Het contactformulier heeft eindelijk tests

### Branch ID

20260815-205505

### Branch type

config

Het contactformulier is het enige conversiepad van de site en had geen enkele test op de component
zelf. De Netlify-function erachter was al gedekt; dit is de clientkant.

**Negen tests over de vier dingen die stil kunnen breken:** de knop blijft uit tot de captcha is
opgelost, de velden gaan de deur uit onder de namen die de function verwacht, de bevestiging vervangt
het formulier, en na een fout wordt het captcha-token ververst.

**Twee daarvan bewaken bugs die hier écht zijn gebeurd**, en die zijn negatief getoetst:

- De veldnamen. De function las ooit `firstName` en `lastName`, die nergens bestonden, en elke
  aanvraag kwam binnen als *"Boekingsaanvraag: undefined undefined"*. Toets: `name` hernoemen naar
  `firstName` laat de test vallen.
- De token-reset. Een reCAPTCHA-token is eenmalig en ongeveer twee minuten geldig, dus zonder reset
  probeert de bezoeker het opnieuw met hetzelfde token, antwoordt Google `timeout-or-duplicate`, en
  herhaalt dat zich tot de pagina herlaadt — één tijdelijke serverfout kostte zo de hele aanvraag.
  Toets: de reset weghalen laat de test vallen.

Er staat ook een test op dat `bot-field` wordt meegestuurd. Dat sluit aan op de honeypot die vandaag
in de function is aangesloten: die kan alleen iets vangen als de clientkant het veld blijft
meesturen, en dat verband is nu vastgelegd in plaats van aangenomen.

**Twee omgevingsstubs waren nodig**, en beide staan met hun reden in het bestand. `IntersectionObserver`
bestaat niet in jsdom terwijl de component hem gebruikt om de captcha lui te laden — zonder stub zou
elke test op de zes-secondenfallback wachten. En de reCAPTCHA-widget is vervangen door een knop die
een token teruggeeft: die praat met Google, en wat hier telt is wat de component met het tóken doet.

### Significance

#### Tier 0

De belangrijkste ongeteste component van de repo is gedekt, met twee tests die precies de twee
storingen bewaken die hier eerder zijn opgetreden. Suite van 193 naar 202.

**Score:** 4

#### Tier 1

Er verandert vandaag niets aan het formulier; het werkt zoals het werkte. De waarde is dat een
volgende wijziging aan het verzendpad niet meer stil kan breken — en dit is het pad waarlangs boekingen
binnenkomen.

**Score:** 2

### Pull Request

[PR #132](https://github.com/DaveKJohn/djcylow-react/pull/132) · merged 2026-08-15

---

## `docs/mixspec-klopt-met-de-data` changelog

### Branch title

De veldspec beschrijft de mix-data zoals die werkelijk is

### Branch ID

20260815-205009

### Branch type

docs

De veldspec in `src/data/mixes/README.md` beschreef de data op vijf punten anders dan die werkelijk
is. Dat is de instructie die iedereen volgt bij het toevoegen van een mix, dus een fout daar
vermenigvuldigt zich.

**`permalink` stond beschreven als legacy field, "not used for routing".** Het tegenovergestelde is
waar: vier plekken leiden de URL eruit af. De spec instrueerde bovendien om *"de slug afgeleid uit
`id`, `color`, `power`, `frequency`, `genre` en BPM"* te gebruiken — zo'n afleiding bestaat nergens in
de codebase. Wie die instructie volgde voor een nieuwe mix, kreeg een entry **zonder pagina**, en de
build meldde succes. De sectie beschrijft nu de echte afleiding, met de vier regels die
`tests/mix-data.test.ts` sinds PR #111 afdwingt.

**De legacy R2-bucket stond als "some older mixes in `full-blue.json`".** Gemeten: het is elke
Full-mix, 25 entries over zeven bestanden. Wie op die zin afgaat bij het opheffen van de oude bucket
denkt twee URL's om te zetten en haalt in werkelijkheid 25 mixpagina's offline. Dat is een verkeerd
ingeschatte blast radius bij precies de handeling die risico draagt.

**De volume-regel beschreef 19 van de 32 series alsof het er 32 waren.** In de andere dertien is
`volume` in werkelijkheid per color+power geteld, dwars door subgenre en frequency heen. Hernummeren
is bewust níet de oplossing — dat zou tien bestaande titels en URL's herschrijven voor iets
cosmetisch. De regel geldt nu expliciet voor **nieuwe** mixen, met het aantal erbij; deze spec is
hier eerder al eens op gecorrigeerd en die correctie ging niet ver genoeg.

**De audio-naamconventie geldt voor nieuwe uploads**, en dat stond er niet bij. Vijf bestaande
bestanden wijken af en worden niet hernoemd: een object in R2 hernoemen breekt de live audio van een
gepubliceerde mix. De reden om dat op te schrijven is scherper dan netheid — twee entries droegen ooit
de byte-identieke `audioSrc` van een ándere mix, en het signaal was juist een naam die niet bij de
entry paste. Weten welke afwijkingen verwacht zijn, is wat de onverwachte zichtbaar maakt.

**En preview-entries mogen `tags` weglaten.** Alle acht doen dat, en terecht: previews worden uit de
playlist gefilterd en zijn dus nooit vindbaar. Dat stond al vastgelegd voor `date`, `volume` en
`description`; het ontbreken van `tags` in dat rijtje liet acht entries onvolledig lijken.

### Significance

#### Tier 0

De instructie die bij elke nieuwe mix wordt gevolgd, klopt weer — inclusief het veld waar de hele
routing aan hangt. En de zin die de blast radius van een bucket-migratie met een factor twaalf te
laag inschatte, staat nu op de gemeten stand.

**Score:** 4

#### Tier 1

Documentatie; de site verandert niet. De waarde zit in de volgende mix die wordt toegevoegd en in de
volgende keer dat iemand aan de oude bucket komt.

**Score:** 2

### Pull Request

[PR #131](https://github.com/DaveKJohn/djcylow-react/pull/131) · merged 2026-08-15

---

## `fix/dode-componenten-ontmanteld` changelog

### Branch title

De slapende componenten breken de build niet meer en de neptestimonials zijn weg

### Branch ID

20260815-204342

### Branch type

fix

### What does the change on this branch bring to main?

Vijf componenten bestaan wel maar worden nergens gerenderd. Ze zijn **niet verwijderd** — twee staan
uitgecommentarieerd in `page.tsx`, en dat leest als "later misschien weer". Dat is een beslissing over
het product en niet over de code. Wat wél weg moest, zijn de drie manieren waarop die slapers schade
aanrichten zodra iemand ze terugzet.

**De tijdbom.** `Diensten.tsx` importeerde `@/styles/components/home/diensten.scss`, en dat bestand
heeft nooit bestaan — die map bevat alleen hero, meetTheDJ, promo, referenties en verzoeknummers. Het
viel niet op omdat de bundler dode modules niet compileert, maar zet iemand `<Diensten />` terug, dan
faalt `npm run build` met *Module not found*, in een repo zonder staging. De import is weggehaald en
niet vervangen: de component leunt op de generieke layout-klassen en heeft nooit eigen styling gehad.

**De neptestimonials.** `src/content/referenties.ts` bevatte vier plaatsvullers — "Klant Naam", "Tech
Start-up", een citaat waarin letterlijk *"het formaat is exact 300 bij 300 pixels"* staat, en tags als
"React" en "Next.js" die bij een webbureau horen en niet bij een DJ. De sectie aanzetten is één regel
uncommenten, en dan staan er vier verzonnen klanten op een boekingssite. Het bestand levert nu een
lege array, met de vorm en de waarschuwing in het type ernaast.

**Het derde ding, dat het issue als aanpalend noemt:** `ReadMore` scrolde hard naar `#promo`, terwijl
`MeetTheDJ` en `Verzoeknummers` diezelfde component gebruiken — vanuit die twee sprong de pagina dus
naar een heel andere sectie. Het doel is nu een prop met `promo` als standaard.

**Tien tests die de dode code juist wél lezen.** Dat is de kern: de bundler kijkt er niet naar, dus
een fout blijft er onzichtbaar in zitten tot het moment waarop hij het duurst is. De suite controleert
dat elke import in die vijf bestanden ergens naartoe wijst, dat de referenties leeg zijn, en dat het
scrolldoel niet meer hardgecodeerd is. Negatief getoetst door de kapotte import terug te zetten: de
test viel om, met een melding die uitlegt wat er bij het terugzetten zou gebeuren.

Bij twee tests kijkt de assertie bewust alleen naar de **data** en niet naar de toelichting erboven:
die noemt de oude plaatsvullers letterlijk, als waarschuwing, en dat is precies de uitleg die je wilt
houden.

### Significance

#### Tier 0

Drie valstrikken die pas afgaan op het moment dat iemand een component terugzet — en dan een gebroken
build, een verkeerde scroll of vier neptestimonials opleveren. Met tests die de dode code lezen, want
niets anders doet dat.

**Score:** 4

#### Tier 1

Vandaag verandert er niets aan de site: alle drie zaten in code die niet draait. De waarde zit
volledig in wat er níet meer misgaat op het moment dat de Referenties- of Diensten-sectie terugkomt.

**Score:** 2

### Pull Request

[PR #130](https://github.com/DaveKJohn/djcylow-react/pull/130) · merged 2026-08-15

---

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

[PR #126](https://github.com/DaveKJohn/djcylow-react/pull/126) · merged 2026-08-15

---

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

[PR #125](https://github.com/DaveKJohn/djcylow-react/pull/125) · merged 2026-08-15

---

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

[PR #123](https://github.com/DaveKJohn/djcylow-react/pull/123) · merged 2026-08-15

---

## `fix/breakpoints-een-bron` changelog

### Branch title

De breakpoints in JS en SCSS kunnen niet meer stil uit elkaar lopen

### Branch ID

20260815-182139

### Branch type

fix

### What does the change on this branch bring to main?

De breakpoints `1774 / 1331 / 884` stonden op drie plekken los opgeschreven, en één daarvan werd door
niemand gelezen.

**Het comment bij de drawer noemde een getal dat nooit heeft bestaan.** `MobileContent.tsx` bouwt zijn
`matchMedia`-query uit `BREAKPOINTS.SMALL` en droeg het comment dat dit exact matcht met *"$breakpoints
small: 811px"*. Zowel `_config.scss` als `design.ts` zeggen 884. Dat is de gevaarlijkste soort fout in
een comment: het benoemt correct dát er een koppeling is, en geeft er dan de verkeerde waarde bij — dus
wie het geloofde en de constante "corrigeerde", verbrak precies de koppeling die het comment beweerde te
bewaken. De drawer zou dan omschakelen op een andere breedte dan de styling, zichtbaar in een smalle
band rond de breakpoint waar niemand kijkt.

**Er is nu een test in plaats van een afspraak.** `tests/breakpoints.test.ts` (negen tests) leest
`_config.scss` en `design.ts` allebei en vergelijkt ze op waarde, op sleutels en op volgorde. Dat is de
enige vorm die hier kan: Sass kan geen TypeScript lezen en de static export kan geen SCSS aan de
clientkant evalueren, dus één bron is technisch uitgesloten — maar aan elkaar binden kan wel. Negatief
getoetst met precies het scenario uit het issue: `SMALL` op 811 zetten laat de suite falen op *"small
komt overeen"*.

Twee kleinere wachten zitten er in dezelfde suite. Eén die eist dat de query uit `BREAKPOINTS.SMALL`
wordt afgeleid en niet uit een letterlijk getal, en één die **elk** pixelgetal in `MobileContent.tsx`
weigert dat geen echte breakpoint is — precies de vorm waarin deze fout binnenkwam. Die laatste sloeg
meteen aan op de historische verwijzing in het nieuwe comment, dus daar staat het oude getal nu voluit
geschreven in plaats van als cijfers.

**En de derde plek is verdwenen.** `base/_root.scss` genereerde `--screen-size-large/-medium/-small`
als CSS-variabelen. Ze werden uitgeleverd en door niemand gelezen — geen stylesheet, geen component.
Ze waren ook niet bruikbaar voor waar je ze voor zou willen: een custom property kan niet in een
`@media`-conditie staan, dus ze konden de media queries nooit voeden. Gemeten: drie declaraties in de
gebouwde CSS, nu nul.

Wat expliciet **niet** is aangeraakt: de manier waarop de SCSS zijn breakpoints leest. `_config.scss`
blijft de bron voor alle media queries via `fn.get-breakpoint()`, en er is geen enkele afwijkende
hardcoded media query in de repo — dat was al netjes en blijft zo.

### Significance

#### Tier 0

Een comment dat een verkeerd getal noemde bij een koppeling die er echt toe doet, is vervangen door een
test die de koppeling afdwingt. De suite groeit van 143 naar 152 tests.

**Score:** 3

#### Tier 1

Voorkomt dat het mobiele menu ooit op een andere breedte omklapt dan het uiterlijk, maar er is vandaag
niets zichtbaar mis. De waarde zit in de volgende keer dat iemand aan die getallen komt.

**Score:** 2

### Pull Request

[PR #122](https://github.com/DaveKJohn/djcylow-react/pull/122) · merged 2026-08-15

---

## `docs/ruleset-strict-aan` changelog

### Branch title

De ruleset eist nu een PR die bij is met main

### Branch ID

20260815-193142

### Branch type

docs

### What does the change on this branch bring to main?

`strict_required_status_checks_policy` op de ruleset `main-ci-gate` staat sinds 2026-08-15 op `true`,
op Dave's verzoek. Deze branch legt dat vast in `CLAUDE.md`, want die beschreef nog de oude stand.

**Wat het oplost.** Met `false` konden twee PR's die los groen zijn na elkaar mergen zonder dat `poort`
de combinatie ooit had gezien. De klasse fout die dat oplevert — een import die na de eerste merge niet
meer bestaat, een route die dubbel raakt — is precies wat de build zou vangen als hij tegen de juiste
basis had gedraaid. In deze repo staat het resultaat daarvan binnen minuten live, want er is geen
staging.

**Wat het kost, en dat hoort erbij te staan.** Een PR moet nu bij zijn met `main` vóór de merge. Hier
schuift `main` bij élke fold op, dus een PR die even blijft liggen wordt "out of date" en vraagt een
`Update branch` vóór hij te mergen is. Bij een reeks wachtende branches is dat één update-ronde per
branch.

**Hoe de wijziging is gedaan.** Een `PUT` op de ruleset met de volledige definitie terug en daarin
exact één gewijzigd veld. Dat is geverifieerd door de opgehaalde ruleset vóór en ná te diffen: precies
één verschil, en `bypass_actors`, `enforcement`, de drie regeltypes en de required check `poort` zijn
alle vier ongemoeid. De backup van de oude definitie stond klaar vóór de call.

**Het eerste voorstel uit #91 is bewust niet uitgevoerd.** Dat vraagt een tweede ruleset zónder bypass
voor `deletion` en `non_fast_forward`, en die zou `cut-release`'s eigen push naar `main` blokkeren —
precies waarom die bypass er staat. De bewering die daarover onjuist was, is al gecorrigeerd in PR #115.

### Significance

#### Tier 0

De poort kan niet langer groen staan op een combinatie die hij nooit heeft gezien. Dat kost een
update-ronde per PR, en die afweging staat er nu bij zodat de volgende lezer weet waarom die stap er is.

**Score:** 3

#### Tier 1

Voorkomt een storing die de bezoeker zou merken — twee losse groene PR's die samen breken — maar er is
vandaag niets mis en de site verandert niet.

**Score:** 2

### Pull Request

[PR #119](https://github.com/DaveKJohn/djcylow-react/pull/119) · merged 2026-08-15

---

## `config/testsuite-permalink-en-ratchets` changelog

### Branch title

De testsuite bewaakt permalink, telt overtredingen in plaats van entries, en dekt de sitemap

### Branch ID

20260815-165208

### Branch type

config

### What does the change on this branch bring to main?

De testsuite groeit van 107 naar 143 tests, en twee ratchets die in de praktijk uit stonden gaan aan.

**Twee ratchets telden entries in plaats van overtredingen, en stonden daardoor uit.** De tijd- en
scheidingsratchets telden entries met mínstens één overtreding: 73 en 33. Maar 73 van de 85 entries
zaten al in die ratchet, en zolang een entry erin zit is de regel voor die entry volledig
uitgeschakeld. Gemeten met een in-memory simulatie op de echte data: een track met tijd `"3:07"`
toevoegen aan zo'n entry liet de teller op 73 staan, en 41 overtredingen repareren óók. De nieuwe
tellers, op trackniveau (2444 en 70), bewogen in beide gevallen wél — naar 2445 en 2403. Dat verschil
is precies wat een ratchet hoort te doen, en het maakt elke losse reparatie zichtbaar in plaats van
alleen de laatste van een entry.

**`permalink` werd door niets bewaakt, terwijl de hele routing eraan hangt.** Vier plekken leiden de
URL-slug uit dat veld af en de suite noemde het geen enkele keer, terwijl `Playlist.tsx` er zonder
guard op `split('/')` en de data met een `as`-cast binnenkomt die namens de JSON liegt. Een mix zonder
`permalink` geeft dus een TypeError op de hele Luister-pagina, en de build merkt het niet.
Vijf harde asserties nu: niet-leeg, eindigt op `.html`, de afgeleide slug is niet leeg, de slugs zijn
uniek, en ze bevatten alleen url-veilige tekens. Alle vijf konden hard, want de data haalt ze vandaag.

**De sitemap en robots.txt hadden geen enkele test.** Er staan er nu dertien, en de belangrijkste is
niet een aantal maar een koppeling: `sitemap.ts` heeft zijn eigen kopie van de slug-afleiding, en de
test controleert dat die exact hetzelfde oplevert als `mixSlug`. Negatief getoetst door in
`sitemap.ts` tijdelijk de `.toLowerCase()` weg te halen — twee tests vielen om, wat meteen aantoont
dat álle 77 permalinks hoofdletters dragen en de sitemap zonder die bewerking 77 dode URL's zou
publiceren. Verder een wacht op een `disallow: '/'`, want dat haalt de site uit Google zonder dat er
iets rood wordt.

**Het filter van de Luister-pagina is getest** (dertien tests): kleur, genre, power, hun combinatie,
de letterkast die ongefilterd uit de URL komt, de sorteervolgorde, dat preview-entries er nooit in
verschijnen, en dat het actieve filter aan de mix-link blijft hangen. De verwachtingen worden uit de
data zelf afgeleid, zodat een nieuwe mix de suite niet rood maakt maar een veranderend filter wel.

**En de anti-scrape-eigenschap van `EmailDisplay` is nu een test in plaats van een eenmalige meting.**
Het bestand schreef die kant af als niet-testbaar omdat jsdom altijd de clientsnapshot rendert. Dat
klopt voor `render()`, maar niet voor `renderToStaticMarkup`, die precies de serversnapshot neemt die
de statische export uitlevert. Die eigenschap heeft geschiedenis: de bescherming was ooit begonnen en
niet afgemaakt, waarna het adres op zes pagina's scrape-baar stond.

Kleiner, uit dezelfde ronde: `description_en` wordt nu net als de Nederlandse op uniciteit getoetst
(de site is Engels, dus dat is de kant die Google leest), de dash-regel dekt eindelijk ook de en-dash
`–` zonder dat de plafonds bewegen, en het aantal live mixen ligt vast op 77 — dat leunde tot nu toe
op toevallige dekking via de andere ratchets, die juist de nieuwste en schoonste mixen het slechtst
dekt.

### Significance

#### Tier 0

Twee ratchets die uit stonden gaan aan, en het veld waar de hele routing aan hangt wordt voor het
eerst bewaakt. Wie hierna aan de mix-data of de routing werkt, krijgt een suite die daadwerkelijk
tegenspreekt in plaats van een die groen blijft omdat de eenheid van tellen verkeerd was.

**Score:** 4

#### Tier 1

Voorkomt drie storingen die de bezoeker zou merken — een omgevallen Luister-pagina, een halve
sitemap en een scrape-baar e-mailadres — maar er is vandaag niets zichtbaar mis en de site verandert
niet.

**Score:** 2

### Pull Request

[PR #111](https://github.com/DaveKJohn/djcylow-react/pull/111) · merged 2026-08-15

---

## `config/poort-isolatie-en-paginadrempel` changelog

### Branch title

De lint-poort checkt echt alleen de broncode en toetst het paginatal

### Branch ID

20260815-162801

### Branch type

config

### What does the change on this branch bring to main?

De lint-poort deed twee dingen niet die hij wel beloofde, en beide zijn nu mechanisme in plaats van
tekst.

**De isolatie van `tsconfig.lint.json` bestond niet.** Die config sluit `.next` uit en legde in zijn
eigen `"//"`-comment uit dat de poort daarom "puur de broncode checkt en zo reproduceerbaar is". Maar
een `exclude` filtert alleen wortelbestanden, niet wat via een import binnenkomt — en `next-env.d.ts`
doet op regel 3 een directe `import "./.next/types/routes.d.ts"`. Gemeten: de poort typechecktte 680
bestanden mét `.next/types/routes.d.ts` erin, dus juist de stale build-output van een vorige branch.
Daar kwam bij dat `next-env.d.ts` in `.gitignore` staat en in CI dus niet bestaat: lokaal en
server-side draaide dezelfde poort een ánder programma. `next-env.d.ts` staat nu in de `exclude`, wat
geen dekking kost — `declare module '*.scss'` komt uit `node_modules/next/types/global.d.ts` via de
gewone `next`-imports, en deze repo importeert geen afbeeldingen statisch. Gemeten: 677 bestanden,
exit 0, geen `.next` meer in `--listFiles`; exact wat CI al deed.

**Het paginatal werd geprint maar niet getoetst.** Er stond een comment dat een plotse daling "ook een
signaal" is, zonder drempel en zonder vergelijking. Die faalklasse is hier al eens live gegaan:
`/luister` leverde een lege Suspense-shell in plaats van 78 mixlinks, en een `generateStaticParams`
die stilvalt geeft een groene poort met een ander getal erin dat niemand naleest. Er staat nu een
ondergrens (`$MinStaticPages`, gemeten op 89) die blokkeert bij een daling én bij een paginatal dat
niet uit de buildoutput te lezen is — anders valt de toets stil uit zodra Next zijn output anders
formuleert, wat dezelfde stille uitval zou zijn. Groei blokkeert niet maar wordt gemeld met het
verzoek de ondergrens bewust te verhogen.

**En de reden onder een juiste conclusie in `CLAUDE.md` is gecorrigeerd.** Daar stond dat de zestien
overbodige `@ts-ignore`-regels weg konden omdat `next-env.d.ts` de declaratie levert. Dat klopte niet:
de declaratie komt uit `node_modules`, en `next-env.d.ts` bestaat in CI helemaal niet. Dezelfde
onwaarheid stond in de header van `lint-web.ps1` en is daar ook weg.

Beide poortstappen zijn negatief getoetst, niet alleen groen waargenomen: ondergrens tijdelijk op 999
gaf exit 1 met de daling-melding, en een opzettelijk kapotte regex gaf exit 1 met de
onleesbaar-melding.

### Significance

#### Tier 0

De enige wacht vóór een live deploy checkte aantoonbaar iets anders dan hij beweerde, en verschillend
lokaal versus in CI. Wie de poort lokaal groen kreeg, wist daarmee niet wat CI zou zeggen. Dat raakt
elke branch die hierlangs komt, en des te meer de negen SCSS-branches die hierna volgen.

**Score:** 4

#### Tier 1

Voorkomt een faalklasse die hier al één keer live is gegaan (`/luister` als lege shell), maar er is
vandaag niets zichtbaar mis en de site verandert niet. De waarde zit in de volgende keer dat een
`generateStaticParams` stilvalt.

**Score:** 2

### Pull Request

[PR #109](https://github.com/DaveKJohn/djcylow-react/pull/109) · merged 2026-08-15

---

## `config/tailwind-eruit` changelog

### Branch title

Tailwind verwijderd en de ongedefinieerde utility-klassen opgeruimd

### Branch ID

20260815-143542

### Branch type

config

### What does the change on this branch bring to main?

**Tailwind draaide niet, en dat wist niemand.** Tailwind v4 genereert alleen utilities voor een
stylesheet die `@import "tailwindcss"` bevat. De enige stylesheet die de app laadt is
`src/styles/main.scss`, en die had die regel niet. Het enige bestand met een Tailwind-at-rule was
`src/app/globals.scss` — dat **nergens werd geïmporteerd**, en de regel erin was bovendien
`@theme "tailwindcss"`, wat geen geldige entry is. Er is dus nooit één utility gegenereerd,
geverifieerd in de gebouwde CSS: nul Tailwind-signaturen (`--tw-`, `::backdrop`).

Dave heeft gekozen voor **eruit halen**. Aanzetten was de andere weg, maar die zet Preflight bovenop
de eigen reset in `base/_reset.scss` — een zichtbare wijziging op elke pagina, voor utilities die
niemand gebruikt. Weg zijn: `tailwindcss` en `@tailwindcss/postcss` uit `package.json`,
`postcss.config.mjs`, en `src/app/globals.scss`.

**Dat het niet draaide, is aantoonbaar in de markup gaan zitten** (#75). Er werden klassen
geschreven die stil niets deden:

| klasse | voorkomens | wat er gebeurt |
|---|---|---|
| `.w-fix` | 28× | **verwijderd** — bestond nergens, en niemand kon vaststellen welke breedte het hoorde te zetten |
| `.flex` | 6× | **verwijderd** — was Tailwind; de `.column`/`.row`-klassen zetten `display: flex` al |
| `.size-base` | 8× | **gedefinieerd** — de scale-key bestond al |
| `.size-lg` | 1× | **gedefinieerd** — idem |

De eerste twee zijn een no-op voor het uiterlijk: ze deden al niets, dus weghalen verandert geen
pixel en haalt alleen de suggestie weg dat er een regel achter zat. **De laatste twee zijn dat
niet.** Op de mixpagina staan `.size-base` en `.size-lg` náást wél werkende `.size-sm`/`.size-xs` in
dezelfde blokken; daar heeft iemand expliciet om een tekstgrootte gevraagd en de overgeërfde
gekregen. Die tekst krijgt nu de grootte die er stond — **dat is de enige zichtbare wijziging van
deze branch**, en precies wat op de preview bekeken moet worden.

Gemeten in de gebouwde CSS na afloop: `size-base` en `size-lg` staan er nu in (waren er niet),
`w-fix` nergens, en nog steeds geen enkele Tailwind-signatuur.

**En de documentatie beweerde het omgekeerde**, op drie plekken. `CLAUDE.md` zei "Tailwind v4 +
SCSS: beide worden naast elkaar gebruikt"; `README.md` had een tabelrij, een `tailwind.config` in
de mappenlijst die nooit heeft bestaan, en een eigen sectie die naar dat bestand verwees. Die zijn
vervangen door wat er werkelijk staat, inclusief een overzicht van de eigen utility-klassen.

Sluit #48 en #75.

### Significance

#### Tier 0

Er stond een frameworkafhankelijkheid in `package.json` die niets deed, en de documentatie stuurde
iedereen die hier styling schreef de verkeerde kant op — aantoonbaar, want er zijn 34 klassen in de
markup beland die nooit iets konden doen. De eigen utility-set is nu de enige, en staat beschreven.

**Score:** 3

#### Tier 1

Op de mixpagina's krijgt tekst die om `size-base`/`size-lg` vroeg eindelijk die grootte, dus de
typografische hiërarchie klopt daar weer met wat er in de code staat. Verder verandert er niets
zichtbaars: de verwijderde klassen deden al niets.

**Score:** 2

### Pull Request

[PR #102](https://github.com/DaveKJohn/djcylow-react/pull/102) · merged 2026-08-15

---

## `fix/shared-ps1-named-parameters` changelog

### Branch title

Named parameters komen weer aan door de wrapper heen

### Branch ID

20260815-160737

### Branch type

fix

### What does the change on this branch bring to main?

`scripts/task/shared.ps1` gaf zijn doorgegeven argumenten stil als positionele door in plaats van
als named. De wrapper draait de gedeelde workflow-scripts uit de plugin-cache, dus dit raakte elke
repo-eigen skill-ingang: `open-pr`, `fold-changelog` en `park`. Gemeten tegen de signature van
`open-pr.ps1` kwam `-Resolves 47` aan als `Title='-Resolves'` met een lege `Resolves` — de vlag
verdween, en de enige aanwijzing was een waarschuwing over `-Title`, een parameter die niemand
meegaf. Zo zijn PR's #98 tot en met #107 alle tien zonder hun `-Resolves` geopend.

De oorzaak is array-splatting: `& $doel @Rest` geeft elk element als positioneel argument door, dus
een `-Resolves` in die array is geen parameternaam meer maar een gewone string die op de eerste
positionele parameter landt. De argumenten gaan nu als losse tokens naar een nieuwe host, die de
parameterbinding zelf doet — zonder dat de wrapper hoeft te weten welke parameters switches zijn en
welke een waarde slikken. Getoetst op vijf argumentvormen, mét en zonder vlaggen, plus de
exitcode-doorgifte in beide richtingen.

Twee kandidaat-oorzaken zijn gemeten en verworpen in plaats van aangenomen: de `[string[]]`-typecast
op `$Rest` (een ongetypeerde `ValueFromRemainingArguments` gedraagt zich identiek) en
`[CmdletBinding()]` op de wrapper. De redenering staat in het script zelf, zodat een volgende lezer
niet opnieuw bij de titel gaat zoeken.

Daarnaast miste het `Draaien`-blok van `.claude/skills/fold-changelog/SKILL.md` de vlag `-Commit`,
terwijl stap 4 van diezelfde pagina belooft dat de fold `fold: <branch> changelog` commit. Zonder
die vlag schreef het script alleen naar schijf. `open-pr` en `park` zijn op hetzelfde soort gat
gecontroleerd en bleken schoon: hun scripts kennen geen commit-vlag en pushen zelf.

### Significance

#### Tier 0

De gereedschapskist die de resterende issues moet dragen, geeft vlaggen weer door. Zonder deze
reparatie loopt elke volgende branch erlangs, en de foutmelding wijst de verkeerde kant op: wie hem
leest zoekt in de titel en niet in het doorgeefmechanisme, wat een tweede lezer hetzelfde half uur
kost. De fold-skill deed bovendien niet wat zijn eigen pagina beloofde.

**Score:** 4

#### Tier 1

Raakt niets wat buiten de repo zichtbaar is: de website verandert niet en de build levert dezelfde
pagina's. Wat het oplevert is dat issue-koppeling op PR's weer werkt, en dat is administratie die
alleen binnen het ontwikkelwerk telt.

**Score:** N/A

### Pull Request

[PR #108](https://github.com/DaveKJohn/djcylow-react/pull/108) · merged 2026-08-15

---

## `docs/audit-correcties` changelog

### Branch title

Documentatie gelijkgetrokken met de machinerie die er werkelijk staat

### Branch ID

20260815-144049

### Branch type

docs

### What does the change on this branch bring to main?

De documentatie beschreef op een reeks plekken machinerie die er niet meer zo staat. Vier daarvan
waren niet passief-verouderd maar **stuurden de lezer actief de verkeerde kant op**.

**Chris' repo-lens beweerde dat er nul testsuites en geen branch protection waren** (#84). Er staan
vier testbestanden en de ruleset `main-ci-gate` bestaat sinds 2026-08-13. Dat woog het zwaarst van
alles hier: het is de **enige lens die automatisch meelaadt**, én het is het argument waarmee de
PR-grens wordt verantwoord — dus elke sessie woog iemand de merge-beslissing op feiten die niet meer
klopten, terwijl `CLAUDE.md` in een tabel het omgekeerde stelde. De conclusie blijft staan, maar rust
nu op de twee redenen die hem wél dragen: de suite dekt de mix-**data** en niet de vormgeving, en de
ruleset heeft `bypass_actors` waardoor de check voor een admin adviserend blijft.

**`CONTRIBUTING.md` gaf een opdracht tot werk dat al gedaan was, aan een seam die leeg hoort te
blijven** (#85). Het blok beweerde dat de PR-template nog een Nederlandse placeholder droeg en dat
`Get-PrDescriptionPlaceholder` gevuld moest worden op `docs/release-route-naar-script`. Vier
beweringen, alle vier onwaar: de template draagt de canonieke placeholder, het is gerepareerd via de
template-route juist *niet* via die seam, en die branch is gemerged en gefold.

**`scripts/repo-config.ps1` citeerde `CLAUDE.md` voor het tegendeel** (#89). Een comment bij
`Get-ReleaseMajorMinMinors` zei dat een major hier "een volledig redesign of een framework-migratie"
is "en niet een recap van tien minors zoals in de bron" — met bronvermelding, terwijl `CLAUDE.md`
sinds 2026-08-13 exact het omgekeerde zegt. Dat is de tekst waar iemand op terugvalt die die waarde
ooit wil zetten. Ook gecorrigeerd: het testaantal (stond op 36, waren er 71 — nu verwijst het naar
`npx vitest run` in plaats van een getal dat gegarandeerd veroudert) en de reden waarom de CI-check
adviserend is (niet "zonder branch protection", maar door `bypass_actors`).

**Vijftien repo-lenzen verwezen naar een plugin-id dat niet meer bestaat** (#90). Elke lens opende
met *"in `specialists` plugin"*, terwijl dat id gesplitst is in `team-alpha` en `workflow-davekjohn`.
Ze wijzen nu naar het bestand dat er werkelijk staat — en dat is **per lens gecontroleerd**: een
eerste poging zette er `personas/NN-NN-persona.md` neer, en die map bevat er maar vier. De vijftien
met de scaffold-header zijn precies de vijftien **agents**; één dode verwijzing was bijna vervangen
door vijftien.

Verder gelijkgetrokken met wat er staat:

| | was | is |
|---|---|---|
| `src/data/mixes/README.md` | vier plekken schreven een ander titelformaat voor dan de spec zelf eist (#88) | alle vier gelijk aan de vereiste vorm, die alle 77 live titels al volgen |
| idem | `description_en` "waiting on the parked `feature/i18n-setup`" | die branch is **gesloten** en gearchiveerd; hij komt niet vanzelf live |
| `CLAUDE.md`, `CONTRIBUTING.md` | de poort als "`tsc` + build", op drie plekken | drie stappen, met `eslint .` erbij |
| `CLAUDE.md` | "`npm run lint` = ESLint + TypeScript check" | alleen ESLint; de typecheck zit in `lint-web.ps1` |
| `CLAUDE.md` | "`npm run lint` staat nog buiten de poort" | zit er sinds 2026-08-14 in — het document sprak zichzelf drie alinea's verderop tegen |
| `CLAUDE.md` | versienummer en release-notes zijn "handwerk van Rendall" | het script doet ze; handwerk is het audience-concept en de Release |
| `CLAUDE.md` | tellingen van 60 documenten / 37 development | weggehaald — ze verouderen bij elke cut |
| `.github/pull_request_template.md` | "`npm run lint` gedraaid, geen nieuwe fouten" | de poort op 0/0, plus een regel voor de testsuite |

Sluit #84, #85, #87, #88, #89 en #90.

### Significance

#### Tier 0

Vier van deze correcties stuurden actief verkeerd werk aan: een lens die bij elke sessie meelaadt en
de PR-grens verkeerd verantwoordt, een opdracht tot werk aan een lege seam, een bronvermelding naar
het tegendeel, en vijftien verwijzingen naar een plugin die niet bestaat. Dat is duurder dan een
verouderde zin, want het kost iemand een dag aan de verkeerde reparatie.

**Score:** 4

#### Tier 1

N/A — dit raakt uitsluitend documentatie en comments. De build levert dezelfde pagina's.

**Score:** N/A

### Pull Request

[PR #101](https://github.com/DaveKJohn/djcylow-react/pull/101) · merged 2026-08-15

---

## `config/webp-veiligheid-en-ignore` changelog

### Branch title

images:webp verwijdert niets meer ongevraagd en faalt eerlijk

### Branch ID

20260815-142550

### Branch type

config

### What does the change on this branch bring to main?

Drie safety-rules stonden in `CLAUDE.md` en nergens in de machinerie. Die staan er nu wel.

**`npm run images:webp` verwijderde bestanden zonder iets te vragen.** Het liep recursief door
`public/images/`, converteerde, en `unlink`te het origineel — terwijl "bestanden verwijderen uit
`public/images/`" hierboven expliciet onder *Nooit zonder expliciete toestemming van Dave* staat,
juist omdat een pad in de mix-JSON er stil door breekt. Erger nog: via de `npm run *`-prefixregel op
de allowlist kon dat draaien **zonder permissieprompt**. Preview is nu de default; verwijderen
vraagt `--apply`. Alle vier de gedragingen zijn getoetst op een wegwerpbestand in plaats van
aangenomen:

| | resultaat |
|---|---|
| `npm run images:webp` | toont de lijst, `.jpg` staat er daarna nog |
| `npm run images:webp:apply` | converteert, origineel weg |
| tweede run met bestaande `.webp` | overgeslagen in plaats van overschreven |
| kapot bestand | `1 mislukt`, **exit 1** |

Die laatste was de ernstigste: het script zette nooit `process.exitCode`, dus het gaf **exit 0
terwijl elke conversie faalde**. Een bestaande `.webp` werd bovendien stil overschreven waarna het
origineel verdween — twee bestanden kwijt bij één naamconflict; `--force` doet dat nu alleen op
verzoek. En `main()` had geen `.catch()`.

**De vier beschermde bestanden hebben nu enforcement** (#62). `.claude/settings.json` draagt een
`ask`-lijst voor `next.config.ts`, `netlify.toml` en `public/images/**`. Bewust `ask` en geen
`deny`: `CLAUDE.md` vraagt om Dave's woord, niet om onbereikbaarheid. De denylist heeft er daarnaast
de refspec-vorm `git push origin +HEAD:main` bij gekregen, die langs de bestaande
`git push --force`-regels glipte.

> **Het issue nam aan dat dit niet zelf kon** — *"schrijfacties op settings-bestanden worden
> geblokkeerd, de route is `/permissions` of met de hand"*. Dat bleek niet zo: de wijziging is
> gewoon geschreven. De aanname is dus weerlegd en niet omzeild.

**`.claude/settings.local.json` staat nu in `.gitignore`** (#64). Het bleef hier alleen ongetrackt
door een **machine-globale** ignore (`~/.config/git/ignore`), niet door de repo zelf. In een verse
clone, op een andere machine of bij een collaborator staat het gewoon in `git status` — één
`git add -A` verwijderd van meecommitten, en `git add -A` is precies wat `cut-release.ps1` doet. Dan
landt een persoonlijke allowlist met lokale paden en een e-mailadres in een publieke repo.

**Wat hier bewust níet is gedaan: het snoeien van die allowlist zelf (#63).** Dat bestand is
machine-lokaal en staat vanaf nu in `.gitignore`, dus zo'n wijziging verschijnt in géén enkele diff
— en hij verandert wel wat er dagelijks zonder prompt mag draaien. Dat hoort niet ongezien te
gebeuren. Het voorstel staat in issue #63 en blijft open, inclusief de waarschuwing die daar staat:
de uitvoerregel voor de plugin-cache geeft `cut-release` vrije doorgang naar `origin/main`, dus die
mag alleen samen met het dichtzetten van de push-regels.

Sluit #61, #62 en #64.

### Significance

#### Tier 0

Drie regels die alleen bestonden zolang iedereen `CLAUDE.md` gelezen had en zich eraan hield, zijn
nu mechanisme. Het opruimscript kan niet meer stil bestanden verwijderen of een mislukking als
succes rapporteren, en een persoonlijke allowlist kan niet meer per ongeluk in de publieke repo
belanden.

**Score:** 4

#### Tier 1

N/A — dit raakt de gereedschapskist en de guardrails, niet djcylow.com. De build levert dezelfde
pagina's.

**Score:** N/A

### Pull Request

[PR #100](https://github.com/DaveKJohn/djcylow-react/pull/100) · merged 2026-08-15

---

## `fix/mix-add-schema` changelog

### Branch title

mix:add levert een entry die het schema en de testpoort haalt

### Branch ID

20260815-124609

### Branch type

fix

### What does the change on this branch bring to main?

`npm run mix:add` is stap 1 van de workflow *nieuwe mix toevoegen*, en het leverde een entry
op die de testpoort niet haalt. Vier dingen zijn gerepareerd, en het script controleert
voortaan zijn eigen uitkomst in plaats van erop te vertrouwen.

**Het beschrijvingsveld.** Het script schreef één veld `description`; de site, het schema en
`tests/mix-data.test.ts` lezen `description_nl` en `description_en`. Er worden er nu twee
gegenereerd, en er wordt per taal getoond of de tekst de spec haalt (120-160 tekens, geen
streepje) voordat je hem accepteert. De prompt vroeg tot nu toe **actief** om precies wat de
spec verbiedt: een em-dash in het opgelegde format, en "mention 2-4 notable artists". Dat is
wat de twee dash-ratchets in de testsuite tellen (13 en 15 overtredingen) — dit sluit de kraan
waar die achterstand uit liep.

**Het afbeeldingspad.** Het script zette de datum vóór het formaat en gebruikte een koppelteken
waar op schijf een underscore staat. Geen enkel gegenereerd pad bestond dus: `checkAndConvertImages`
meldde altijd "Ontbreekt" en converteerde daardoor nooit. Gemeten over vier bestaande mixen gaan
nu 11 van de 12 paden goed; de twaalfde is een bestand dat werkelijk ontbreekt (issue #66) en
geen fout in het patroon.

> De issuetekst noemde `image_square` correct. Dat klopte niet: juist dat veld produceerde
> `..._20240408_square.webp` terwijl op schijf `..._square_20240408.webp` staat, en dat is waar
> de 25 dode `image_square`-paden vandaan komen. Beide velden zijn nu tegen de schijf gemeten in
> plaats van tegen de beschrijving.

**Het genre in de Spotify-metadata.** `buildSpotifyId` en `buildSpotifyTitle` hardcodeerden
`edm`/`EDM` en kregen `genre` niet eens mee, terwijl het script de keuze wel opvraagt. Een Drum &
Bass-mix kondigde zichzelf dus als EDM aan. De afkorting staat nu op één plek (`genreSlug`) in
plaats van drie, en werkt door in beide velden.

**De audio-URL is eerlijk geworden over wat hij is.** De objectnamen op R2 volgen geen conventie
die te reproduceren valt — in de 77 live mixen staan `V1`/`V2`/`V3`/`V4` en `v1` door elkaar,
`Vol 1` zonder punt, een spatie waar een underscore hoort en een kleur met een kleine letter. De
gegenereerde URL is daarmee een beginwaarde en geen afleiding, en dat staat er nu bij. Het script
doet na afloop één HEAD-request en meldt het als het object er niet is. Dat is de bovenloop van
issue #45, waar twee mixen de audio van een andere mix afspelen: die fout is nu zichtbaar op het
moment dat hij ontstaat in plaats van als een bezoeker op play drukt.

Sluit issue #47, en deblokkeert #46, #66 en #67 — die repareren de data die dit gereedschap
anders bij de eerstvolgende mix opnieuw zou produceren.

### Significance

#### Tier 0

Het enige gereedschap voor het toevoegen van een mix leverde een entry op die de eigen poort
weigert, en produceerde stilzwijgend de datafouten die drie andere issues nu opruimen. Wie een
mix toevoegde, kreeg pas bij de PR te horen dat het mis was, zonder aanwijzing waar.

**Score:** 4

#### Tier 1

N/A — er verandert niets aan djcylow.com. Dit raakt het gereedschap, niet de site; de datafouten
die het veroorzaakte worden in eigen issues gerepareerd.

**Score:** N/A

### Pull Request

[PR #99](https://github.com/DaveKJohn/djcylow-react/pull/99) · merged 2026-08-15

---

## `config/lokale-workflow-skills` changelog

### Branch title

Repo-eigen slash-skills voor de workflow-stappen die de plugin niet autonoom aanbiedt

### Branch ID

20260815-125827

### Branch type

config

### What does the change on this branch bring to main?

Acht van de tien skills uit `workflow-davekjohn` dragen `disable-model-invocation: true`, en dat
kwam pas aan het licht toen een specialist stap 4 van de cyclus wilde zetten en de Skill-tool
weigerde met *"reserved for explicit user invocation"*. Het zijn precies de acht die naar buiten
schrijven: `open-pr`, `ship-pr`, `park`, `fold-changelog`, `cut-release`, `lock`, `continue` en
`fix-mojibake`. Dat is geen storing maar de guardrail van de bron — bij PR #155 beschreven als
*"closes the autonomous-invocation surface"* — en daarmee dezelfde regel als de safety-rules hier,
alleen gegoten in een mechanisme in plaats van in proza.

**Deze repo heeft die guardrail niet weggehaald maar verlegd**, en alleen waar `CLAUDE.md` de
uitzondering zelf al maakt. Drie skills krijgen een repo-eigen ingang in `.claude/skills/`:
`open-pr` (de PR-regel zegt al *doorlopen tenzij*), `fold-changelog` (uitzondering 1 op "nooit
direct op `main`", met een vastgelegde scope) en `park` (een push is geen PR). `cut-release` en
`ship-pr` krijgen er bewust géén: die staan hier aan Dave's expliciete verzoek, en dat blijft zo.

**Er wordt geen enkel gedeeld script gedupliceerd.** De drie ingangen roepen via het nieuwe
`scripts/task/shared.ps1` het origineel uit de plugin-cache aan — dezelfde kopie die een
plugin-skill zou draaien, dus de "cache om te draaien"-regel blijft intact. Dat helperscript lost de
versiemap op het moment van draaien op, want er staan acht versies in de cache en een skill die het
pad hardcodeert breekt bij de eerstvolgende plugin-update.

Twee dingen zijn gemeten in plaats van aangenomen, en beide bleken anders dan de eerste opzet:

- **De versiesortering moet op `[version]`**, niet op tekst. Anders wint `3.9.0` van `3.10.0`, en
  dat zijn allebei mappen die er nu werkelijk staan.
- **Een `--` tussen de argumenten werkt niet.** PowerShell leest die bij `-File` zelf als
  parameternaam en stopt met *"the parameter name '' is ambiguous"*. De eerste versie van de
  skill-documentatie schreef het voor; dat is gecorrigeerd nadat het faalde.

Ook de exitcode is gerepareerd: een `.ps1` die via `&` wordt aangeroepen en zelf geen `exit` doet,
laat de `LASTEXITCODE` van de vorige aanroep staan — een geslaagde run meldde daardoor 255.

### Significance

#### Tier 0

Zonder dit kan een specialist geen enkele stap van de cyclus afmaken: het werk staat op een branch
en blijft daar. Met 56 openstaande auditissues is dat het verschil tussen doorwerken en per branch
op een handmatig commando wachten. De guardrail die de bron bedoelde blijft staan waar `CLAUDE.md`
hem ook stelt — bij de release en bij site-werk.

**Score:** 4

#### Tier 1

N/A — dit raakt de gereedschapskist, niet djcylow.com. De build levert dezelfde pagina's.

**Score:** N/A

### Pull Request

[PR #98](https://github.com/DaveKJohn/djcylow-react/pull/98) · merged 2026-08-15

---

## `config/componenttests` changelog

### Branch title

Componenttests voor de drie componenten die de hooks-refactor raakte

### Branch ID

20260814-215519

### Branch type

config

### What does the change on this branch bring to main?

**De testsuite bewaakte tot nu toe alleen data. Geen enkele regel gedrag in `src/` stond onder een
test.** De 36 bestaande tests lezen de mix-JSON en controleren velden; de componenten die de bezoeker
daadwerkelijk bedient waren onbewaakt. Deze branch zet daar **35 componenttests** naast, op precies
de drie componenten die de hooks-refactor van PR #37 heeft aangeraakt: `AudioPlayer`, `MobileContent`
en `EmailDisplay`. De teller gaat van **36 naar 71**.

Die drie zijn niet willekeurig. PR #37 verving in alle drie een `useEffect`+`setState` door een
constructie die hetzelfde doet zonder de extra renderronde — en in twee gevallen was de fix een
**verwijdering**. Dat is de gevaarlijkste soort wijziging om onbewaakt te laten: er staat daarna
niets meer in de code dat naar de weggehaalde regel wijst, dus wie later "opruimt" heeft geen enkel
signaal dat hij gedrag sloopt.

- **`AudioPlayer`** — de losse `setIsPlaying(false)` in het pauzeer-effect is weg, omdat `pause()`
  het audio-element zelf een `pause`-event laat vuren dat de `onPause`-handler opvangt. De speler
  hangt daarmee volledig aan dat event. Haalt iemand die handler weg, dan blijft de speler er
  spelend uitzien terwijl er niets klinkt. Eén test staat daar op de wacht.
- **`MobileContent`** — het sluiten van de drawer gebeurt tijdens de render in plaats van in een
  effect, op twee momenten: schalen naar desktop, en navigeren. Beide hebben een eigen test, want
  een render-phase reset is precies het soort constructie dat een latere lezer voor een vergissing
  aanziet en terugzet naar een `useEffect`.
- **`EmailDisplay`** — het adres wordt in de browser samengesteld; "leeg" is sinds #37 de
  serversnapshot in plaats van een beginstate die een effect overschrijft.

**Dat deze tests écht een wacht zijn, is gemeten en niet aangenomen.** De render-phase reset in
`MobileContent` en de `onPause`-handler in `AudioPlayer` zijn tijdelijk gesloopt om te kijken wat er
gebeurt: **beide werden gevangen door precies de bedoelde test, en door geen andere.** Dat tweede
telt even zwaar als het eerste — een suite waarin twintig tests tegelijk roodkleuren wijst niet aan
wát er stuk is. Daarna is `src/` teruggezet; deze branch wijzigt geen regel applicatiecode. Het is
dezelfde toets als bij de ESLint-poort van 2026-08-14: een poort die alleen groen is waargenomen, is
niet aantoonbaar een poort.

**Het gereedschap eronder is bewust per bestand geregeld en niet globaal.** `vitest.config.mts` houdt
`node` als default-omgeving; de componenttests vragen jsdom zelf aan met een regel bovenaan het
bestand. `mix-data.test.ts` heeft geen DOM nodig en betaalt er zo ook niet voor. Om dezelfde reden
staat de gedeelde opstart in `tests/setup-dom.ts` die de componenttests importeren, in plaats van in
`setupFiles`: dan zou de datasuite React Testing Library meeladen zonder hem te gebruiken. De hele
suite draait in **1,2 seconde**.

**Drie dingen die het bouwen zelf opleverde**, alle drie gemeten in plaats van vermoed:

- **Vitest ruimt de vorige render niet vanzelf op.** De automatische cleanup van React Testing
  Library hangt aan `globals: true`, en die staat hier uit omdat de tests hun `describe`/`it`/`expect`
  expliciet importeren. Zonder `afterEach(cleanup)` stapelen alle renders in dezelfde `document.body`
  en faalt élke query met "found multiple elements" — 17 van de 71 tests, allemaal op die ene
  oorzaak, en geen daarvan wees naar het echte probleem.
- **jsdom implementeert `HTMLMediaElement.play()`/`pause()` niet en kent geen `window.matchMedia`.**
  Beide zijn gestubd in het testbestand dat ze nodig heeft. De `matchMedia`-stub heeft wérkende
  listeners gekregen: met een stub die alleen `matches` teruggeeft zou de belangrijkste test —
  schalen naar desktop sluit de drawer — slagen zonder iets te bewijzen.
- **`@testing-library/jest-dom` stond geïnstalleerd maar werd nergens gebruikt.** De bestaande test
  gebruikte `toBeTruthy()` en er was geen setup die de matchers laadt. Dat is dezelfde klasse fout
  als de ongebruikte `EmailDisplay`-import van PR #39, alleen een branch eerder betrapt: de
  dependency is nu in gebruik via `setup-dom.ts`, en alle drie de suites gebruiken dezelfde matchers.

`vitest.config.ts` heet nu `vitest.config.mts`. Vitest waarschuwde bij elke run dat het bestand
ESM-syntax bevat maar als CommonJS geladen wordt — nu een waarschuwing, in een volgende Vite-major
een fout. De alternatieve remedie (`"type": "module"` in `package.json`) raakt de Next-build en hoort
niet in een testbranch thuis.

**Wat er bewust niet in zit, gemeld als testgat in plaats van stilgehouden.** De timeline-klik in
`AudioPlayer` rekent met `getBoundingClientRect()`, waar jsdom overal nullen op geeft — een test
daarop legt een NaN-berekening vast in plaats van gedrag. En dat het e-mailadres níét in de gebouwde
HTML staat is hier principieel niet te bewijzen, want jsdom rendert altijd de clientsnapshot; die
kant is en blijft gemeten op de echte build. `Playlist` heeft dezelfde render-phase-reset uit een
eerdere wijziging en staat nog onbewaakt — buiten de scope van deze branchtitel, genoteerd als
kandidaat.

### Significance

#### Tier 0

Voor wie hierna een component in `src/` aanraakt verandert er iets categorisch: er is voor het eerst
een net dat gedrág vangt in plaats van data. Dat weegt hier zwaarder dan het getal 35, omdat de drie
gedekte componenten juist die zijn waar een refactor stille aannames heeft achtergelaten — twee ervan
door een regel te verwíjderen, wat in de code geen spoor nalaat om op terug te vallen. De speler en
de mobiele navigatie zijn bovendien de twee dingen die elke bezoeker aanraakt, en tot nu toe kon een
regressie daar alleen door met de hand kijken gevonden worden. Dat de suite aantoonbaar rood kán
worden is onderdeel van de opbrengst, niet een formaliteit erbij.

**Score:** 4

#### Tier 1

N/A — dit raakt uitsluitend het gereedschap. Er verandert geen regel applicatiecode, de build levert
dezelfde 89 pagina's, en aan de site is niets te zien.

**Score:** N/A

### Pull Request

[PR #40](https://github.com/DaveKJohn/djcylow-react/pull/40) · merged 2026-08-15

---

## `config/eslint-in-de-poort` changelog

### Branch title

ESLint wordt een echte poort in plaats van een handmatige telling

### Branch ID

20260814-212924

### Branch type

config

### What does the change on this branch bring to main?

`scripts/lint/lint-web.ps1` draait ESLint als tweede van drie stappen, tussen `tsc --noEmit` en
`npm run build`. Errors blokkeren de poort; warnings niet, maar hun aantal wordt wel gemeld.

Hiermee eindigt een constructie die deze repo lang heeft gedragen: ESLint stond buiten de poort omdat
er 37 pre-existing errors waren, met in `CLAUDE.md` de instructie om *"het **aantal** te vergelijken,
niet de exitcode"*. Dat maakte dit de enige poort die een mens met het blote oog moest aflezen, en
niets controleerde of dat ook gebeurde. Vandaag zijn die 37 in drie branches naar 0 gebracht (#35,
#36, #37), en daarmee verviel de reden. De telling is nu een check.

**Dat hij ook echt blokkeert is getoetst, niet aangenomen.** Er is tijdelijk een bestand met één
`any` neergezet; de poort gaf exit 1 met de fout erbij, waarna het bestand weer weg is. Een poort die
alleen groen is waargenomen bewijst niet dat hij rood kán worden — en dat is nu net de eigenschap
waarvoor hij bestaat.

**In CI hoefde niets aangesloten te worden**, en dat is de opbrengst van een eerdere keuze.
[`ci.yml`](.github/workflows/ci.yml) roept `lint-web.ps1` aan in plaats van de checks over te
schrijven, dus ESLint draait server-side gewoon mee. Alleen de **naam** van de stap moest mee, want
die somt de checks op. Was de workflow een kopie geweest, dan had deze branch twee plekken moeten
raken en zou de tweede vroeg of laat achterlopen.

De warnings blijven staan: 8 stuks, waarvan 2× `next/no-img-element` in `Hero`. Die laatste vragen
een afweging over `next/image` bij `unoptimized: true`, en dat is een ontwerpbeslissing van Dave — een
poort hoort daar geen positie in te kiezen. Ze worden geteld en gemeld, zodat het aantal niet
ongemerkt terugloopt naar een nieuwe achterstand.

### Significance

#### Tier 0

Sluit de laatste poort die op een menselijke afspraak leunde in plaats van op een check, en maakt
daarmee de reeks van vandaag af: van 37 errors met een leesinstructie naar 0 errors met een gate die
aantoonbaar weigert. Voor wie hierna een `.ts` of `.tsx` aanraakt is het verschil concreet — een
nieuwe lint-error komt niet meer ongemerkt langs de PR, niet lokaal en niet in CI.

**Score:** 4

#### Tier 1

N/A — dit raakt uitsluitend het gereedschap. Er verandert geen regel aan de site en de build levert
dezelfde 89 pagina's.

**Score:** N/A

### Pull Request

[PR #38](https://github.com/DaveKJohn/djcylow-react/pull/38) · merged 2026-08-14

---

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

[PR #37](https://github.com/DaveKJohn/djcylow-react/pull/37) · merged 2026-08-14

---

## `style/scss-opruiming` changelog

### Branch title

Dode stylesheets eruit en het kleurenpalet staat nog maar op een plek

### Branch ID

20260815-182601

### Branch type

style

### What does the change on this branch bring to main?

Opruimwerk in de styling. Niets hiervan veroorzaakte een fout; het kostte leesbaarheid en liet een
lezer denken dat er iets gebeurde.

**Het kleurenpalet stond twee keer, en dat is het punt dat het meest kon bijten.**
`basiskleurenCarousel.scss` droeg de acht moodkleuren opnieuw als losse hex-waarden. Ze waren
vandaag stuk voor stuk identiek aan de `default`-tinten in `_colors.scss`, maar niets hield dat zo —
wijzigde daar ooit een merkkleur, dan liep deze kopie er stil uit, en juist op de pagina die over
die kleuren gáát. Ze gebruiken nu `var(--<kleur>-default)`, en die variabelen bestonden al: `_root.scss`
genereert ze voor het hele palet. Er is dus niets bijgekomen, alleen een kopie weg. Geverifieerd in de
gebouwde CSS dat de acht regels nu naar de variabelen wijzen, en dat die nergens buiten `:root` worden
overschreven — dus visueel identiek.

**Vier dode stylesheets zijn weg**, samen 332 regels: `assen.scss` (nergens geïmporteerd, en er
bestaat geen `Assen.tsx`), `_onderhoud.scss` (wél in `main.scss`, maar `#onderhoud` komt in geen
enkele component voor en de regel stond zelf op `display: none`), en `home.module.scss` +
`luister.module.scss` (allebei leeg op de `@use`-regels na). Die laatste twee werden wél
geïmporteerd, en `className={styles.pageWrapper}` gaf `undefined` — gemeten blijkt dat onschadelijk,
want React laat een `undefined` className gewoon weg en er staat geen `class="undefined"` in de HTML.
De imports en de twee expressies zijn mee opgeruimd.

**In de carousel stonden drie ongebruikte Sass-variabelen** (`$row-1-h`, `$row-2-h`, `$gap`) en drie
declaraties die twee keer met dezelfde waarde stonden (`align-items`, `justify-content`, `transform`).
Ook `height: var(--card_height)` viel daar stil terug op `auto`, want die variabele wordt alleen gezet
door `referenties.scss` en die component wordt niet gerenderd. Dat is nu `var(--card_height, auto)`:
even expliciet als wat er feitelijk gebeurde, en het werkt weer zodra Referenties terugkomt.

**Drie media queries in `musicmoodcolours.module.scss` zetten exact dezelfde waarden als daarbuiten.**
Ze deden niets, maar suggereerden dat de kaarten op medium schermen van formaat veranderen — wat het
juist lastig maakt te zien dat dat níet gebeurt.

En het overbodige `!important` op `.carousels .hidden` is weg; dat kwam boven water bij #78, waarvan
de hoofdbewering juist niet standhield.

**Twee punten uit het issue zijn níet uitgevoerd, met reden.** `src/app/globals.scss` bestond al niet
meer — dat is bij de Tailwind-verwijdering van 2026-08-15 al opgeruimd. En de mixin
`cta-hover-effect` staat in het issue als dood, maar dat is hij sinds diezelfde dag niet meer: de
branch `fix/scss-hover-en-alignment` roept hem juist aan om het kapotte hover-effect van de CTA-knop
te herstellen. Hem hier verwijderen zou die branch breken.

### Significance

#### Tier 0

332 regels dode stylesheet weg en het kleurenpalet terug naar één bron. Wie hierna aan de styling
werkt, leest alleen nog wat er werkelijk gebeurt — en een merkkleur wijzigen doet nu wat je verwacht.

**Score:** 3

#### Tier 1

Zuiver opruimwerk: de site ziet er precies hetzelfde uit, gemeten in de gebouwde CSS.

**Score:** N/A

### Pull Request

[PR #124](https://github.com/DaveKJohn/djcylow-react/pull/124) · merged 2026-08-15

---

## `docs/readme-en-ruleset-kloppend` changelog

### Branch title

De README en de ruleset-bewering beschrijven weer wat er werkelijk staat

### Branch ID

20260815-172021

### Branch type

docs

### What does the change on this branch bring to main?

Twee documenten die iets anders beweerden dan er staat, kloppen weer.

**De `README.md` liep op zes punten uit de pas** (het issue noemde er zeven; punt 3 over
`tailwind.config` bleek al gerepareerd bij de Tailwind-verwijdering, dus dat is geverifieerd en niet
opnieuw gedaan):

- **30 mix-JSON-bestanden** terwijl het er 15 zijn — het document sprak zichzelf twee regels verderop
  tegen, want de eigen kleurentabel somt precies 15 combinaties op
- **`genre` is "either `EDM` or `Drum & Bass`"** terwijl géén enkele mix `genre: "EDM"` draagt.
  Gemeten over 77 live mixen: Drum & Bass 46, House 18, Nu-Disco 10, Techno 3. Die waarde overleeft
  alleen nog binnen oudere `permalink`-bestandsnamen, en dat staat er nu bij — anders lijkt de
  correctie zelf weer onjuist zodra iemand een permalink openslaat
- **Een homepage met zeven secties** terwijl er drie renderen. De vijf andere componenten bestaan nog
  wel; dat ze er staan zonder te renderen is nu expliciet, met de opmerking dat hun verwijdering apart
  loopt omdat het `src/` raakt
- **Het slugformaat** stond er als iets dat `generateStaticParams` construeert. Dat doet het niet: de
  slug komt uit `permalink`. Het gedocumenteerde patroon miste bovendien het BPM-segment, dus het zou
  voor een nieuwe mix de verkeerde URL opleveren. Nu beschreven als afleiding, met de echte bewerking
  erbij en een verwijzing naar de tests die het afdwingen
- **`X-Frame-Options: DENY`** terwijl `netlify.toml` `SAMEORIGIN` zet. De **doc** is naar de config
  bewogen en niet andersom: dat bestand is beschermd, en een live security-header aanscherpen is een
  bewuste wijziging, geen documentatiereparatie
- **Facebook ontbrak** in de opsomming van sociale links in de footer

**En de bewering over de ruleset klopte niet, op vier plekken.** `CLAUDE.md` stelde dat
`main-ci-gate` "force-push, het verwijderen van `main` en merges door niet-admins" hard tegenhoudt.
Geverifieerd via de API (ruleset 20818953): `bypass_mode` staat op `"always"` voor Admin en Maintain,
en GitHub kent geen bypass per regel — dus de **hele** ruleset staat opzij, inclusief `deletion` en
`non_fast_forward`. Voor de enige persoon die hier werkt houdt hij dus niets tegen.

Dat is precies de verkeerde kant om je in te vergissen: wie het las kon aannemen dat een force-push
server-side wordt geweigerd, en de lokale denylist als tweede lijn beschouwen in plaats van als de
enige — terwijl die denylist alleen binnen Claude Code geldt en niet in een terminal. De vierde plek
is de lens van Chris, die bij **elke sessie** meelaadt en waar die zin het argument onder de PR-grens
draagt. Dat argument blijft staan en wordt door de correctie sterker: de menselijke blik is hier niet
de tweede lijn maar de enige.

### Significance

#### Tier 0

De README is wat iemand als eerste leest om deze repo te begrijpen, en hij beschreef een genre-indeling
die niet bestaat, een slugafleiding die andersom werkt en een homepage die er niet zo uitziet. De
ruleset-correctie raakt bovendien het document dat elke sessie meelaadt, en ging over hoeveel
bescherming er werkelijk is.

**Score:** 3

#### Tier 1

Documentatie over de repo; de site verandert niet.

**Score:** N/A

### Pull Request

[PR #115](https://github.com/DaveKJohn/djcylow-react/pull/115) · merged 2026-08-15

---

## `config/onderhoud-deno-engines-ci` changelog

### Branch title

deno.lock eruit, de Node-versie afgedwongen en CI annuleert verouderde runs

### Branch ID

20260815-170941

### Branch type

config

### What does the change on this branch bring to main?

Drie stukjes onderhoud aan de machinerie, elk te klein voor een eigen branch en samen wel de moeite.

**`deno.lock` stond in de tree zonder dat er iets is dat hem gebruikt.** Het is de lockfile van de
Netlify Edge Functions-bootstrap, achtergelaten door een `netlify dev`-run, terwijl deze repo geen
`netlify/edge-functions/` heeft. Dat hij stale was is niet aangenomen maar te lezen: hij noemde nog
`@tailwindcss/postcss`, dat er in augustus is uitgehaald. Untracked en in `.gitignore`.

**De Node-versie stond alleen in `.nvmrc`, en dat bestand leest `npm ci` op je eigen machine niet.**
Alleen `setup-node` in CI en Netlify kijken ernaar. Wie hier Node 20 of 24 draaide kreeg dus geen
enkele melding; de eerste rode vlag was een lockfile-conflict of een subtiel ander buildresultaat — en
`ci.yml` documenteert al een halve dag debugwerk aan precies zo'n divergentie, de `yaml`-peer die per
platform anders resolvet. Er staat nu een `engines`-regel in `package.json` met `engine-strict=true`
in `.npmrc`, zodat het een blokkade is en geen waarschuwing tussen honderd regels output. Getoetst in
beide richtingen: `npm ci` slaagt op 22.15.1 en faalt met `EBADENGINE` zodra de range niet wordt
gehaald. Bewust een **range** (`>=22.15.1 <23`) en geen exacte pin — die zou bij elke patch-upgrade op
twee plekken bijgewerkt moeten worden, wat juist de drift is die deze regel moet voorkomen.
Meegemeten: geen enkele dependency blokkeert op zijn eigen `engines`, wat het echte risico van die
vlag is.

**CI liet verouderde runs doorlopen en had geen tijdslimiet.** Bij een push bovenop een openstaande PR
bleef de vorige run draaien, en de required check kan dan kortstondig groen staan op een commit die
niet meer bovenaan ligt — precies het moment waarop iemand mergt. Een hangende `npm run build` liep
bovendien tot GitHub's default van zes uur. Nu `concurrency` met `cancel-in-progress` en
`timeout-minutes: 10`. De jobnaam `poort` is ongemoeid gelaten: dat is de required-check-context van
de ruleset, en hernoemen zou de poort stil uitzetten.

### Significance

#### Tier 0

Drie stille valkuilen weg: een lockfile die niets meer beschrijft, een versie-eis die alleen op twee
van de drie plekken gold, en een CI die een groene check op een achterhaalde commit kon tonen. Geen
ervan gaf ooit een foutmelding, en dat is precies wat ze duur maakt als ze toeslaan.

**Score:** 3

#### Tier 1

Ontwikkel- en CI-onderhoud; de site verandert niet en buiten de repo merkt niemand er iets van.

**Score:** N/A

### Pull Request

[PR #113](https://github.com/DaveKJohn/djcylow-react/pull/113) · merged 2026-08-15

---

## `fix/switch-account-herstelpad` changelog

### Branch title

switch-account bereikt zijn eigen herstelpad, en het priveadres staat niet meer in de tree

### Branch ID

20260815-170314

### Branch type

fix

### What does the change on this branch bring to main?

**`switch-account.ps1` stierf precies in het geval dat het zegt op te vangen.** Het script zet
`$ErrorActionPreference = "Stop"` en haalde daarna `gh auth status` op met `2>&1`. Maar `gh auth
status` schrijft naar stderr en geeft exit 1 zodra er géén account is ingelogd — exact de situatie
waarvoor het herstelpad eronder bestaat ("nog niet ingelogd → start de browser-flow"). Onder PS 5.1
maakt `2>&1` van die stderr een ErrorRecord die als terminating error wordt gegooid, dus het script
brak af vóór de `if`. Wie wél was ingelogd merkte niets — 0 bytes stderr, exit 0 — en daarom is het
nooit opgevallen. Gereproduceerd in een los proces: `& cmd /c 'echo oops 1>&2 & exit 1' 2>&1` gooit
`RemoteException`.

Beide aanroepen lopen nu via één `Get-GhAuthStatus`, die `$ErrorActionPreference` lokaal op
`Continue` zet en op de tékst beoordeelt in plaats van op de exitcode — bij "geen account" ís die
melding namelijk het antwoord dat de aanroeper nodig heeft. Dat is dezelfde aanpak die
`scripts/lint/lint-web.ps1` al kiest en daar uitgebreid documenteert; die kennis was hierheen niet
gereisd, en dat is de eigenlijke les.

**En het privéadres staat niet meer in de tree.** Er stond een persoonlijk gmail-adres voluit in dit
gecommitte script, in een **publieke** repo, dus via GitHub-codesearch te vinden — in dezelfde repo
die op `src`-niveau juist moeite doet om `info@djcylow.com` uit de HTML te houden. De adressen komen
nu uit een gitignored `scripts/env/accounts.local.ps1`, met een `.example` ernaast die wel meegaat.
Ontbreekt dat bestand, dan draait de Claude-login gewoon zonder `--email` en kies je het account in
de browser: het script blijft dus bruikbaar zonder setup, en er is geen stap die je eerst moet doen.

Dit haalt het adres uit de **huidige tree**, niet uit de git-history — daar staat het nog in commit
`3c8418a`. Dat opschonen vraagt een rewrite van gepubliceerde commits en is een aparte beslissing.

### Significance

#### Tier 0

Een hulpscript dat afbreekt op het enige pad waarvoor de helft van zijn code geschreven is, plus een
privéadres dat uit een publieke repo verdwijnt. Het eerste kost tijd op precies het moment dat je
haast hebt (je bent net uitgelogd); het tweede is een lek dat vanzelf niet weggaat.

**Score:** 3

#### Tier 1

Een lokaal ontwikkelhulpmiddel; het raakt de site niet en niemand buiten de machine van de
ontwikkelaar merkt er iets van.

**Score:** N/A

### Pull Request

[PR #112](https://github.com/DaveKJohn/djcylow-react/pull/112) · merged 2026-08-15

---

## `docs/vooruitlopende-main-en-scriptkopie` changelog

### Branch title

Twee valkuilen die deze week zijn gemeten staan nu opgeschreven

### Branch ID

20260815-164708

### Branch type

docs

### What does the change on this branch bring to main?

Twee dingen die deze week gemeten zijn maar alleen in een sessie stonden, staan nu in de documenten.

**`CONTRIBUTING.md` waarschuwt bij stap 1 dat een vooruitlopende `main` meereist.** Takt een branch af
van een lokale `main` die vóór ligt op `origin` — hier de normale stand, want de fold-commit blijft
bewust lokaal — dan draagt hij die commits mee, en bij de merge landen ze allemaal op `origin/main`
zonder dat er ooit `git push origin main` is gedraaid. Gemeten bij PR #108 (negentien commits) en
opnieuw bij #109. Er gaat niets stuk, maar het verklaart waarom `main` na een merge ineens gelijkloopt
terwijl niemand heeft gepusht; wie dat niet weet, gaat zoeken naar een push die niet bestaat. Met de
uitweg erbij: `git checkout -b <naam> origin/main` als je die commits niet wilt meedragen.

**`CLAUDE.md` krijgt het tweede gemeten geval van de cache-versus-marketplace-val**, en dat is de
nuttige kant ervan. `session-status.ps1` uit de cache print de open issues als één regel
`#System.Object[]`, gereproduceerd onder Windows PowerShell 5.1 waar `ConvertFrom-Json` een JSON-array
als één object teruggeeft. De reflex is een `inbound`-issue; de marketplace-clone laat zien dat de bron
het al heeft gerepareerd, en die reparatie is hier nagemeten onder 5.1 (29 issues, correct
geformatteerd). Het onderscheid bespaarde dus een overbodig issue, waar het de vorige keer een
verkeerde repo-brede verhuizing tegenhield.

**En de poortbeschrijving in `CONTRIBUTING.md` is bijgewerkt**: die noemde alleen `tsc` en de build,
terwijl ESLint er sinds 2026-08-14 in zit en de paginadrempel sinds gisteren.

### Significance

#### Tier 0

Twee valkuilen die allebei tot een verkeerde diagnose leiden in plaats van tot een foutmelding: zoeken
naar een push die niet bestaat, en een inbound-issue indienen voor iets dat al gerepareerd is. Precies
het soort kennis dat anders per sessie opnieuw wordt ontdekt.

**Score:** 3

#### Tier 1

Documentatie over de eigen werkwijze; buiten de mensen die in deze repo werken merkt niemand er iets
van, en de site verandert niet.

**Score:** N/A

### Pull Request

[PR #110](https://github.com/DaveKJohn/djcylow-react/pull/110) · merged 2026-08-15

---

## `docs/welke-scriptkopie-draait` changelog

### Branch title

Borg welke kopie van een gedeeld workflow-script hier draait

### Branch ID

20260815-111453

### Branch type

docs

### What does the change on this branch bring to main?

De sectie **Scripts** in `CLAUDE.md` zegt nu waarvandaan een gedeeld workflow-script draait. Er staan
twee kopieën van elk script op de machine — de **plugin-cache** met de uitgebrachte release, waar
`${CLAUDE_PLUGIN_ROOT}` naar wijst en die dus werkelijk uitvoert, en de **marketplace-clone**, de
bron-checkout die vóórloopt met alles wat sinds de laatste cut is gemerged. De regel is **cache om te
dráaien, marketplace om te lézen**: die tweede is waar `.claude/specialists/SPECIALISTS.md` de persona's
vandaan `@`-importeert, en dat is daar juist. Het makkelijkste advies staat erbij: roep de skill aan in
plaats van het script, want elke skill print zijn eigen commando met de volledige cache-URL erin.

Daar hoort de verantwoording bij, want deze val is op 2026-08-15 dichtgelopen: een `open-pr.ps1` uit de
clone zocht de changelog-entry op `workflow-davekjohn/branch/` — een verplaatsing die in de bron zit maar
nog niet is uitgebracht — en faalde met *"the entry's title section is empty"* terwijl de entry gevuld
was. De conclusie die daaruit rolde was dat déze repo achterliep en zijn `branch/`-map moest verhuizen;
het omgekeerde was waar, en die migratie is ingetrokken vóór er iets verplaatst was. De alinea legt
daarom óók vast dat `branch/` blijft staan zolang de cache hem daar leest, en dat dit géén inbound-issue
voor de bron is: een bron-checkout die vóórloopt is precies wat een bron-checkout hoort te zijn.

De bestaande waarschuwing in `CONTRIBUTING.md` is meegenomen in plaats van herhaald. Die stond er sinds
2026-08-13 en heeft de val niet gevangen, want hij dekte alleen de **versie-as** (welke versie staat er
geïnstalleerd). De **map-as** — welke van twee bomen lees je — is er nu naast gezet, met een verwijzing
naar de regel in `CLAUDE.md` in plaats van een tweede formulering ervan.

### Significance

#### Tier 0

Voorkomt een verkeerde diagnose over de repo zelf, en dat is een zwaardere fout dan een verouderd
script: de vorige keer leidde hij tot een voorgestelde verhuizing van `branch/` die de repo vooruit zou
laten lopen op een ongereleasede wijziging, waarna de geïnstalleerde 4.8.0 de bestanden niet meer zou
vinden. De waarschuwing die dit had moeten vangen stond er al en dekte de verkeerde as, dus de kans op
herhaling was aantoonbaar, niet hypothetisch.

**Score:** 3

#### Tier 1

N/A — dit raakt de werkwijze van wie in deze repo werkt, niet het product. `djcylow.com` levert dezelfde
pagina's.

**Score:** N/A

### Pull Request

[PR #41](https://github.com/DaveKJohn/djcylow-react/pull/41) · merged 2026-08-15

---

## `config/overbodige-ts-ignores` changelog

### Branch title

Zestien overbodige ts-ignores verdwijnen boven de stylesheet-imports

### Branch ID

20260814-204723

### Branch type

config

### What does the change on this branch bring to main?

Zestien `// @ts-ignore`-regels verdwijnen uit `src/`, elk boven een stylesheet-import. Ze waren
overbodig: `tsc` accepteert die imports gewoon, want `next-env.d.ts` levert de declaratie al via
`/// <reference types="next" />`. Wat er stond was dus een onderdrukking van een fout die er niet is —
en een `@ts-ignore` is niet ongevaarlijk, want hij dempt élke fout op de regel eronder, ook een echte
die er later bij komt.

Twee van de zestien stonden niet in de ESLint-telling: in `Playlist.tsx` en `Filter.tsx` lag er een
`// eslint-disable-next-line @typescript-eslint/ban-ts-comment` overheen. Daar was de melding ooit
gesmoord in plaats van de oorzaak weggenomen; die twee disable-regels gaan mee weg.

Daarmee gaat het aantal pre-existing ESLint-errors van **27 naar 13** en is `ban-ts-comment` volledig
verdwenen. De vier tekstplekken die het getal noemen zijn opnieuw meegegaan.

**Het plan was een ander, en het verschil is de moeite van het opschrijven waard.** Het voorstel waar
deze branch uit voortkwam stelde een eigen `src/types/scss.d.ts` voor met `declare module '*.scss'`.
Bij het meten — één `@ts-ignore` weghalen en `tsc` draaien — bleek dat bestand niet nodig, en ook nooit
nodig geweest. Was het plan zonder die meting uitgevoerd, dan stond er nu een declaratiebestand in de
repo dat niets doet en dat een latere lezer als noodzakelijk zou lezen. De remedie van een plan is een
aparte aanname dan de diagnose, en faalt onafhankelijk daarvan.

De branch heette daarom eerst `config/scss-typedeclaratie` en is vóór de push hernoemd: een naam die
een bestand belooft dat er niet komt, misleidt precies de lezer die later terugzoekt waaróm iets zo
is opgelost.

Aan de site verandert niets: geen regel gedragscode is aangeraakt, alleen commentaarregels. De diff is
achttien verwijderde regels in `src/` en nul toegevoegde. De build levert dezelfde 89 pagina's.

### Significance

#### Tier 0

Haalt zestien blinde vlekken weg. Elke `@ts-ignore` die er stond dempte niet alleen de fout die er
niet was, maar zou ook een echte typefout op die importregel hebben verzwegen — en juist een
verkeerd gespeld stylesheet-pad is de klasse fout die deze repo op Linux breekt en op Windows niet.
Daarnaast is dit de tweede van vier stappen naar een ESLint-poort die zichzelf bewaakt in plaats van
door een mens geteld te worden; na deze stap is meer dan tweederde van de achterstand weg.

**Score:** 3

#### Tier 1

N/A — de opdrachtgever merkt hier niets van. De site levert exact dezelfde 89 pagina's; er zijn
uitsluitend commentaarregels verwijderd.

**Score:** N/A

### Pull Request

[PR #36](https://github.com/DaveKJohn/djcylow-react/pull/36) · merged 2026-08-14

---

## `config/eslint-node-overrides` changelog

### Branch title

ESLint stopt met Node-scripts als browsercode te lezen

### Branch ID

20260814-203611

### Branch type

config

### What does the change on this branch bring to main?

`eslint.config.mjs` krijgt een override voor `scripts/**/*.js` en `netlify/functions/**/*.js`: daar
staat `@typescript-eslint/no-require-imports` uit. Die drie bestanden — `add-mix.js`,
`convert-to-webp.js` en de Netlify-function `send-email.js` — draaien op Node en niet in de browser,
en gaan niet door de Next-bundler heen. CommonJS is er het juiste module-systeem, dus de tien errors
die ESLint er meldde waren geen fouten in die bestanden maar een ontbrekende override in de config:
een Next-*browser*-config las Node-scripts alsof het frontend was.

Daarmee gaat het aantal pre-existing ESLint-errors van **37 naar 27**, en dat getal is hier geen
detail maar een instructie. `CLAUDE.md` schrijft over deze poort letterlijk *"vergelijk het aantal,
niet de exitcode"* — de enige poort in deze repo die een mens met het blote oog moet aflezen. Alle
vier de plekken die het oude getal noemden zijn meegegaan: `CLAUDE.md` (2×), `CONTRIBUTING.md`,
`scripts/repo-config.ps1` en de header plus het TODO-blok van `scripts/lint/lint-web.ps1`. De
vindplaatsen in `releases/` blijven staan: dat is historie, en een record herschrijf je niet.

Wat het bovendien oplevert is een afgebakende route naar een dichte poort. De 27 die resteren zijn
gemeten en het is allemaal code in plaats van config: 14× een `@ts-ignore` boven een SCSS-import (één
module-declaratie maakt ze alle veertien overbodig), 4× `react-hooks/set-state-in-effect` in de
audioplayer en de mobiele navigatie, 5× `no-explicit-any` en 4× `no-unescaped-entities`. Die twee
vervolgstappen raken `src/` en wachten dus op Dave's woord; deze niet.

### Significance

#### Tier 0

Haalt de ruis weg die deze poort onbetrouwbaar maakt: wie nu `npm run lint` draait, ziet geen tien
meldingen meer over bestanden waarin niets mis is. Dat maakt de handmatige telling waar `CLAUDE.md`
op leunt aantoonbaar makkelijker vol te houden — en het is de eerste van vier stappen naar een poort
die zichzelf bewaakt in plaats van door een mens geteld te worden.

**Score:** 3

#### Tier 1

N/A — de opdrachtgever merkt hier niets van. De site levert exact dezelfde 89 pagina's: er is geen
regel gedragscode aangeraakt, alleen een lint-override en de documentatie die het getal noemt.

**Score:** N/A

### Pull Request

[PR #35](https://github.com/DaveKJohn/djcylow-react/pull/35) · merged 2026-08-14

---

## `config/dode-dependencies` changelog

### Branch title

Twee ongebruikte dependencies uit de build gehaald

### Branch ID

20260815-171604

### Branch type

config

### What does the change on this branch bring to main?

`gray-matter` en `@next/third-parties` stonden in `dependencies` — niet in `dev` — en werden nergens
geïmporteerd. Gemeten met een grep over `src/`, `netlify/`, `scripts/` en `tests/`: nul treffers voor
allebei. Ze reisden dus mee in elke `npm ci` en elke Netlify-build zonder ooit iets te doen. Uit de
lockfile verdwijnen er daarmee 129 regels.

Vóór het verwijderen is met `npm ls` gecontroleerd dat geen van beide transitief nodig is: ze stonden
alleen als directe dependency in de boom. De poort daarna is groen en de build levert nog steeds
**89** statische pagina's — dat laatste is precies de wacht die gisteren is gebouwd, en dit is de
eerste keer dat hij iets bewijst in plaats van alleen groen te zijn.

**`react-google-reviews` blijft staan**, en dat is een bewuste keuze en geen omissie. Dat pakket heeft
wél twee treffers, allebei in `src/components/home/GoogleReviews.tsx` — een component die in
`page.tsx` is uitgecommentarieerd maar nog bestaat. De dependency verwijderen zou die component
breken. Hij hoort thuis bij de opruiming van de dode componenten (#59), die `src/` raakt en dus op
Dave's woord wacht.

**`yaml` blijft ook staan**, ook al is dat óók nul treffers. Dat is geen dode dependency maar een
expliciet gedeclareerde optionele peer van vite, en `ci.yml` legt in twaalf regels uit waarom: zonder
die declaratie resolvet de boom per platform anders en faalde `npm ci` op Linux terwijl hij lokaal
slaagde.

### Significance

#### Tier 0

Twee pakketten minder in elke install en elke build. Klein in tijd, maar het houdt de
dependency-boom eerlijk: wat erin staat, wordt gebruikt.

**Score:** 2

#### Tier 1

De site verandert niet — zelfde 89 pagina's, zelfde uitvoer. Alleen het bouwproces wordt iets lichter.

**Score:** N/A

### Pull Request

[PR #114](https://github.com/DaveKJohn/djcylow-react/pull/114) · merged 2026-08-15

---

