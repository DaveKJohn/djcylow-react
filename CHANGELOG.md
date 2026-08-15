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

