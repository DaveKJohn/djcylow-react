## `fix/green-full-vol2-audio-404` changelog

### Branch title

De audio van Green Full Vol. 2 speelt weer; hij stond 404 op de live site

### Branch type

fix

### What does the change on this branch bring to main?

**Er stond een mixpagina live waarvan de audio het niet deed.** `Green Full (m) Vol. 2` (id
`20231127`) verwees naar een bestand dat op de bucket niet bestaat: HTTP 404. De pagina bouwde
gewoon, de speler stond er, en alleen wie op play drukte merkte het. Sinds wanneer is niet te zeggen.

Het bestand bestaat wél — het heet op de bucket `Green_Full_**f**_…` terwijl de entry `_m_` zegt. De
data is intern consistent (`frequency`, `title` en `permalink` zeggen alle drie `m`); de upload wijkt
af. De `audioSrc` wijst nu naar de naam die er echt staat, want een werkende pagina gaat voor een
nette URL. Dat het ook werkelijk de juiste opname is, is gemeten en niet aangenomen: het bestand
duurt 57m45s (83,2 MB bij 192 kbps, uit de MP3-header) en de laatste track van deze tracklist begint
op 56m14s.

**Deze fout is gevonden bij het meten van iets anders**, en dat is precies waarom er nu een commando
voor is. `scripts/check-audio.js` (`npm run mix:check-audio`) vraagt alle 85 `audioSrc`-velden op en
meldt wat niet bereikbaar is, met exit 1. Alle 85 staan nu op 200. Het script is negatief getoetst:
met een moedwillig kapotgemaakte URL meldt het die als enige en geeft exit 1.

**Bewust géén test en geen poortstap.** Het doet 85 netwerkverzoeken naar een bucket buiten deze
repo. Als R2 hikt, faalt daarmee een PR die niets met audio te maken heeft — en een poort die om een
externe oorzaak rood staat wordt genegeerd, waarna hij niets meer bewaakt.

Daarnaast is issue #68 verder gemeten dan het zelf ging. Het stelde de migratie van de 25 Full-mixen
naar de actieve bucket voor als het resterende werk. **Die migratie is geblokkeerd op een upload, niet
op een herschrijving:** alle 25 URL's zijn ook tegen de actieve bucket opgevraagd en daar staat er
**0 van de 25**. De bestanden moeten eerst gekopieerd worden, en dat vraagt R2-toegang — Dave's stap.
De URL's herschrijven vóór die kopie zou alle 25 mixpagina's offline halen, precies de fout waar het
issue zelf voor waarschuwt, maar dan van de andere kant. Dat staat nu in
`src/data/mixes/README.md`, samen met de afwijkende bestandsnaam hierboven, zodat wie ooit de oude
bucket opheft weet wat hij aantreft.

### Significance

#### Tier 0

De README beschreef de migratie als een herschrijfklus. Wie daaraan begon, zou na 25 bewerkte velden
ontdekken dat er niets staat om naar te wijzen — en dan staan er 25 pagina's zonder audio. Nu staat
er wat er nodig is en in welke volgorde.

**Score:** 3

#### Tier 1

Een van de mixen op de site kon niet worden afgespeeld en dat kan lang zo hebben gestaan. Dat is een
bezoeker die op play drukt en niets krijgt, op de pagina waar de hele site voor bestaat.

**Score:** 4

### Pull Request

