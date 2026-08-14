## `config/scss-typedeclaratie` changelog

### Branch title

Een typedeclaratie voor SCSS-imports vervangt veertien ts-ignores

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

