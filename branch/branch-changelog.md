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

