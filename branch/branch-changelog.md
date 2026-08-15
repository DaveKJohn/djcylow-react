## `config/poort-isolatie-en-paginadrempel` changelog

### Branch title

De lint-poort checkt echt alleen de broncode en toetst het paginatal

### Branch ID

20260815-162801

### Branch type

config

### What does the change on this branch bring to main?

De lint-poort deed twee dingen niet die hij wel beloofde, en beide zijn nu mechanisme in plaats van
tekst.

**De isolatie van `tsconfig.lint.json` bestond niet.** Die config sluit `.next` uit en legde in zijn
eigen `"//"`-comment uit dat de poort daarom "puur de broncode checkt en zo reproduceerbaar is". Maar
een `exclude` filtert alleen wortelbestanden, niet wat via een import binnenkomt — en `next-env.d.ts`
doet op regel 3 een directe `import "./.next/types/routes.d.ts"`. Gemeten: de poort typechecktte 680
bestanden mét `.next/types/routes.d.ts` erin, dus juist de stale build-output van een vorige branch.
Daar kwam bij dat `next-env.d.ts` in `.gitignore` staat en in CI dus niet bestaat: lokaal en
server-side draaide dezelfde poort een ánder programma. `next-env.d.ts` staat nu in de `exclude`, wat
geen dekking kost — `declare module '*.scss'` komt uit `node_modules/next/types/global.d.ts` via de
gewone `next`-imports, en deze repo importeert geen afbeeldingen statisch. Gemeten: 677 bestanden,
exit 0, geen `.next` meer in `--listFiles`; exact wat CI al deed.

**Het paginatal werd geprint maar niet getoetst.** Er stond een comment dat een plotse daling "ook een
signaal" is, zonder drempel en zonder vergelijking. Die faalklasse is hier al eens live gegaan:
`/luister` leverde een lege Suspense-shell in plaats van 78 mixlinks, en een `generateStaticParams`
die stilvalt geeft een groene poort met een ander getal erin dat niemand naleest. Er staat nu een
ondergrens (`$MinStaticPages`, gemeten op 89) die blokkeert bij een daling én bij een paginatal dat
niet uit de buildoutput te lezen is — anders valt de toets stil uit zodra Next zijn output anders
formuleert, wat dezelfde stille uitval zou zijn. Groei blokkeert niet maar wordt gemeld met het
verzoek de ondergrens bewust te verhogen.

**En de reden onder een juiste conclusie in `CLAUDE.md` is gecorrigeerd.** Daar stond dat de zestien
overbodige `@ts-ignore`-regels weg konden omdat `next-env.d.ts` de declaratie levert. Dat klopte niet:
de declaratie komt uit `node_modules`, en `next-env.d.ts` bestaat in CI helemaal niet. Dezelfde
onwaarheid stond in de header van `lint-web.ps1` en is daar ook weg.

Beide poortstappen zijn negatief getoetst, niet alleen groen waargenomen: ondergrens tijdelijk op 999
gaf exit 1 met de daling-melding, en een opzettelijk kapotte regex gaf exit 1 met de
onleesbaar-melding.

### Significance

#### Tier 0

De enige wacht vóór een live deploy checkte aantoonbaar iets anders dan hij beweerde, en verschillend
lokaal versus in CI. Wie de poort lokaal groen kreeg, wist daarmee niet wat CI zou zeggen. Dat raakt
elke branch die hierlangs komt, en des te meer de negen SCSS-branches die hierna volgen.

**Score:** 4

#### Tier 1

Voorkomt een faalklasse die hier al één keer live is gegaan (`/luister` als lege shell), maar er is
vandaag niets zichtbaar mis en de site verandert niet. De waarde zit in de volgende keer dat een
`generateStaticParams` stilvalt.

**Score:** 2

### Pull Request

