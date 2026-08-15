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

