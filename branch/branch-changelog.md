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

