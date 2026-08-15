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

