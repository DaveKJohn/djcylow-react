## `feat/link-en-anker-checker` changelog

### Branch title

Een link- en anker-checker in de poort

### Branch ID

20260816-171041

### Branch type

feat

### What does the change on this branch bring to main?

De poort krijgt een vierde stap: `scripts/lint/check-links.ps1` houdt elke relatieve link en elk
anker in alle 107 markdown-bestanden tegen de tree. Daarmee is de governance-documentatie voor het
eerst bewaakt — het enige deel van deze repo dat `tsc`, ESLint en de build niet aanraken, terwijl het
wel het deel is dat élke sessie meeleest.

Aanleiding is een gemeten fout, geen vermoeden: de mapverhuizing naar `workflow-davekjohn/` (PR #145)
liet **vijftien dode links** achter — veertien in `workflow-davekjohn/releases/README.md` naar een
`development/`-boom die in de repo-root bleef staan, plus een verwijzing naar een `CONTRIBUTING.md`
die op dat moment niet bestond. Ze stonden er een etmaal met een groene poort en groene CI, en zijn
alleen gevonden doordat er toevallig een tweede verhuizing overheen ging.

Drie ontwerpbesluiten die de check bruikbaar houden in plaats van luidruchtig:

- **Hij toetst tegen `git ls-files`, hoofdlettergevoelig, en niet tegen `Test-Path`.** Een bestand
  dat niet in git zit bestaat niet voor een lezer op GitHub, en `Test-Path` is op Windows
  hoofdletterongevoelig — dat is precies de letterkast-klasse waarvoor CI hier op ubuntu draait. Een
  doel dat alleen op letterkast afwijkt krijgt daarom een eigen melding, want dat is een andere
  reparatie dan een verkeerd pad.
- **Code-spans gaan eruit vóór hij op links matcht, maar níet uit koppen.** Beide richtingen zijn
  tijdens het bouwen fout gegaan en allebei leverden ze false positives op de gevaarlijkste plek op:
  `` `[x](next.config.ts)` `` in `workflow-davekjohn/branch/README.md` is een *illustratie* van een
  link die maar op één plek klopt, en werd als dode link gemeld — terwijl GitHub de tekst binnen
  backticks juist wél meerekent in een anker, zodat `#nooit-direct-op-main--via-branch--pr` het woord
  `main` bevat. Wie zo'n melding gelooft, "repareert" werkende tekst kapot.
- **Hij doet geen enkel netwerkverzoek.** Externe links worden niet opgevraagd — dezelfde afweging
  als bij `check-audio.js`: een poort die om een externe oorzaak rood staat, wordt genegeerd, en dan
  bewaakt hij niets meer.

De stap staat bewust áchter de build: een kapotte build is het ergste dat hier kan gebeuren en hoort
als eerste te blokkeren. `-SkipBuild` slaat de link-check níet over, want dode links repareren is
precies het werk waarbij je de build niet nodig hebt.

Getoetst in beide richtingen, zoals bij de ESLint-stap: een tijdelijk proefbestand met een dood pad,
een dood anker, een letterkast-afwijking, een code-span-illustratie en een link binnen een fence gaf
exit 1 met exact de eerste drie gemeld en de laatste twee stil — en de schone tree geeft exit 0 over
200 interne links.

Twee cross-platform breekpunten zijn eruit gehaald vóór ze CI in gingen: het script zette paden om
naar backslashes en gebruikte `Split-Path`, wat op Linux — waar CI draait — geen scheidingsteken is
en dus elk relatief pad verkeerd zou oplossen.

`CLAUDE.md` beschrijft de poort op drie plekken en zei overal "drie stappen"; die staan nu op vier,
met het nieuwe script in de scriptlijst.

### Significance

#### Tier 0

De klasse fout die dit vangt is hier aantoonbaar opgetreden en bleef een etmaal onzichtbaar met alle
bestaande poorten groen. Vanaf nu kan een verhuizing of een hernoemde kop de documentatie niet meer
stil aan flarden schieten, en dat raakt het bestand dat elke sessie als eerste leest. Het is
bovendien de tweede keer dat dit met de hand werd nagerekend — de audit van 2026-08-15 was de eerste
— dus het is precies het handwerk dat volgens de huisregel een script hoort te worden.

**Score:** 4

#### Tier 1

Een poort die alleen de ontwikkelaars van deze repo raakt: er verandert niets aan `djcylow.com`, de
build levert dezelfde pagina's, en er is voor de opdrachtgever niets te merken of te doen.

**Score:** N/A

### Pull Request

