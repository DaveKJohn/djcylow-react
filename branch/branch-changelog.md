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

