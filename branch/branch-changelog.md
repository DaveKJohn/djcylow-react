## `fix/dode-componenten-ontmanteld` changelog

### Branch title

De slapende componenten breken de build niet meer en de neptestimonials zijn weg

### Branch ID

20260815-204342

### Branch type

fix

### What does the change on this branch bring to main?

Vijf componenten bestaan wel maar worden nergens gerenderd. Ze zijn **niet verwijderd** — twee staan
uitgecommentarieerd in `page.tsx`, en dat leest als "later misschien weer". Dat is een beslissing over
het product en niet over de code. Wat wél weg moest, zijn de drie manieren waarop die slapers schade
aanrichten zodra iemand ze terugzet.

**De tijdbom.** `Diensten.tsx` importeerde `@/styles/components/home/diensten.scss`, en dat bestand
heeft nooit bestaan — die map bevat alleen hero, meetTheDJ, promo, referenties en verzoeknummers. Het
viel niet op omdat de bundler dode modules niet compileert, maar zet iemand `<Diensten />` terug, dan
faalt `npm run build` met *Module not found*, in een repo zonder staging. De import is weggehaald en
niet vervangen: de component leunt op de generieke layout-klassen en heeft nooit eigen styling gehad.

**De neptestimonials.** `src/content/referenties.ts` bevatte vier plaatsvullers — "Klant Naam", "Tech
Start-up", een citaat waarin letterlijk *"het formaat is exact 300 bij 300 pixels"* staat, en tags als
"React" en "Next.js" die bij een webbureau horen en niet bij een DJ. De sectie aanzetten is één regel
uncommenten, en dan staan er vier verzonnen klanten op een boekingssite. Het bestand levert nu een
lege array, met de vorm en de waarschuwing in het type ernaast.

**Het derde ding, dat het issue als aanpalend noemt:** `ReadMore` scrolde hard naar `#promo`, terwijl
`MeetTheDJ` en `Verzoeknummers` diezelfde component gebruiken — vanuit die twee sprong de pagina dus
naar een heel andere sectie. Het doel is nu een prop met `promo` als standaard.

**Tien tests die de dode code juist wél lezen.** Dat is de kern: de bundler kijkt er niet naar, dus
een fout blijft er onzichtbaar in zitten tot het moment waarop hij het duurst is. De suite controleert
dat elke import in die vijf bestanden ergens naartoe wijst, dat de referenties leeg zijn, en dat het
scrolldoel niet meer hardgecodeerd is. Negatief getoetst door de kapotte import terug te zetten: de
test viel om, met een melding die uitlegt wat er bij het terugzetten zou gebeuren.

Bij twee tests kijkt de assertie bewust alleen naar de **data** en niet naar de toelichting erboven:
die noemt de oude plaatsvullers letterlijk, als waarschuwing, en dat is precies de uitleg die je wilt
houden.

### Significance

#### Tier 0

Drie valstrikken die pas afgaan op het moment dat iemand een component terugzet — en dan een gebroken
build, een verkeerde scroll of vier neptestimonials opleveren. Met tests die de dode code lezen, want
niets anders doet dat.

**Score:** 4

#### Tier 1

Vandaag verandert er niets aan de site: alle drie zaten in code die niet draait. De waarde zit
volledig in wat er níet meer misgaat op het moment dat de Referenties- of Diensten-sectie terugkomt.

**Score:** 2

### Pull Request

