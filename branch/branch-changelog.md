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

