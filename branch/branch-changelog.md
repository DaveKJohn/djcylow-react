## `fix/scroll-lock-met-cleanup` changelog

### Branch title

De scroll-lock laat de pagina niet meer onscrollbaar achter

### Branch ID

20260815-201522

### Branch type

fix

### What does the change on this branch bring to main?

`MobileContent` schreef rechtstreeks naar `document.body.style.overflow` en gaf **geen cleanup**
terug. Op `/luister` leven er twee instanties naast elkaar — de nav-drawer en de filter-drawer — en
dat gaf twee manieren om de pagina onbruikbaar of onbeschermd achter te laten:

- **Unmount met de drawer open.** Browser-back weg van `/luister` met het filterpaneel open liet
  `overflow: hidden` staan, en dan was de **volgende** pagina niet meer scrollbaar.
- **De ene instantie wiste de lock van de andere.** Het volstond dat de nav-instantie zijn effect
  opnieuw draaide — een oriëntatiewissel klapt `isMobile` voor beide om — om met `isOpen === false`
  de lock te wissen terwijl de filterdrawer nog openstond.

De lock is nu **geteld** in plaats van geschreven: hij gaat aan bij de eerste die hem neemt en pas uit
bij de laatste die hem teruggeeft, met een cleanup uit het effect. De teller staat op module-scope, en
dat is precies het punt — de twee instanties moeten dezelfde teller delen.

**Een derde ding dat het issue niet noemt en dat bij het bouwen bleek:** de oude code zette `overflow`
bij het vrijgeven hard op `''`. Dat wiste ook een waarde die er al stond, en `base/_reset.scss` zet
`body { overflow-y: auto }`. De vorige waarde wordt nu bewaard en teruggezet.

**Zes tests**, waarvan er vier precies de faalscenario's uit het issue reproduceren. Negatief getoetst
door de oude implementatie terug te zetten: **vier van de zes vielen om**, inclusief beide gemelde
scenario's en het herstel van de bestaande waarde.

De cleanup draagt een guard tegen dubbel vrijgeven, want React kan een cleanup in StrictMode twee keer
aanroepen — dan zou de teller onder nul zakken en de lock te vroeg loslaten.

### Significance

#### Tier 0

Een globale bijwerking die twee componenten deelden loopt nu via één geteld mechanisme, met tests die
beide faalpaden vastleggen. De suite gaat van 152 naar 165.

**Score:** 3

#### Tier 1

Dit is een bug die de bezoeker écht kan raken: een pagina die na browser-back niet meer scrollt is
onbruikbaar, en er is geen foutmelding die verraadt waarom. Op mobiel, waar de drawers juist bestaan.

**Score:** 4

### Pull Request

