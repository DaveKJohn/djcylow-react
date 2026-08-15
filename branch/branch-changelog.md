## `chore/overflow-propagatie-vastgelegd` changelog

### Branch title

De reden dat de sticky filter werkt staat nu in een test in plaats van in niemands hoofd

### Branch type

chore

### What does the change on this branch bring to main?

Issue #79 had twee punten over `body { overflow-x: hidden }` in `_reset.scss`. Het tweede is
gemeten en blijkt **niet te kloppen** — en juist die weerlegging leverde iets op dat wél bewaakt
moet worden.

**Punt (b) van het issue: `body` als scroll-container zou `position: sticky` breken bij
afstammelingen, en `#luister_content_filter` is sticky.** Dat klopt niet, om een reden die het issue
niet meewoog: de overflow-propagatieregel uit css-overflow-3. Staat de gebruikte overflow van het
**root**-element (`html`) op `visible`, dan wordt `body`'s overflow doorgegeven aan de **viewport**
en is de gebruikte waarde op `body` zelf weer `visible`. Geen scroll-container, dus sticky werkt.
Het is ook precies waarom `body { overflow: hidden }` de páginascroll uitzet in plaats van alleen
die van de body.

Gemeten in de gebouwde CSS: er staat **geen enkele `html`-selector** in — nul treffers over alle vier
de stylesheets — en de HTML draagt geen inline style. `html` staat dus op zijn initiële `visible`, en
de propagatie treedt op.

**Maar dat hangt op één voorwaarde, en die stond nergens.** `html` mag geen eigen overflow krijgen —
en `html { overflow-x: hidden }` is nu juist de meest voor de hand liggende reparatie van
horizontale overflow die er is. Wie hem toevoegt, stopt de propagatie, maakt `body` alsnog een
scroll-container en breekt de filter op de luisterpagina. Zonder foutmelding, en alleen zichtbaar
door daar te scrollen.

Dat is nu vastgelegd op twee plekken: `tests/overflow-propagatie.test.ts` leest de gebouwde CSS en
faalt op een overflow op het root-element, met de uitleg in de assertion zelf; en `_reset.scss`
draagt de redenering waar iemand hem tegenkomt. De test slaat zichzelf over als er geen build staat,
zodat `npm test` zonder voorafgaande build niet struikelt — in de poort en in CI gaat `npm run build`
er wel aan vooraf.

**De negatieve toets liep in eerste instantie fout, en dat is de les die blijft.** De eerste poging
zette `html { overflow-x: hidden }` bóven de `@use`-regels van het bestand. Sass weigert dat, de
build faalde, `out/` bleef op de vorige versie staan — en de test kwam groen terug. Dat las als
"de test werkt niet", terwijl hij correct was en de opzet fout. Na plaatsing ónder de `@use`-regels
faalde hij zoals bedoeld, met de bedoelde melding. **Een negatieve toets die groen blijft, kan net
zo goed betekenen dat de toets zichzelf niet heeft uitgevoerd** — controleer dat de build wérkelijk
opnieuw draaide voordat je concludeert dat de test niet bijt.

Punt (a) van het issue — dat `overflow-x: hidden` echte overflow maskeert — blijft staan en is
eerder deze week al gemeten: na de reparatie van de hero steekt er niets meer uit behalve de
carousels op `musicmoodcolours`, en die zijn horizontaal scrollend bedoeld. De regel blijft daarom
staan.

### Significance

#### Tier 0

Er lag een openstaand voorstel om `overflow-x: hidden` te verwijderen op grond van een gevolg dat
zich niet voordoet. Wie dat had uitgevoerd, had een werkende regel weggehaald om een probleem op te
lossen dat er niet was. Belangrijker is wat ervoor in de plaats komt: de échte breekbaarheid zit een
niveau hoger, bij `html`, en die was nergens opgeschreven.

**Score:** 3

#### Tier 1

Geen zichtbaar effect op de site vandaag. Wat het voorkomt is een sticky filter die stilletjes stopt
met plakken op de luisterpagina, door een wijziging die er volstrekt redelijk uitziet.

**Score:** 2

### Pull Request

