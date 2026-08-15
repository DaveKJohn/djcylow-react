## `fix/hero-padding-en-overflow` progress

### Steps

- [x] Een dev-server plus Chrome opgezet om te kunnen meten, want beide issues stonden expliciet als
      "niet gemeten" en het gaat om gedrag dat alleen in een browser zichtbaar is
- [x] De metingen in een **iframe van exacte breedte** gedaan in plaats van het venster te resizen: het
      venster liet zich niet onder de schermbreedte krijgen, en een iframe heeft een echte eigen
      viewport waar de media queries op reageren
- [x] #80 gemeten vóór de fix: 900px → 86%, 1330px → 100%, 1332px → 81%, 1400px → 86%, 1560px → 98%,
      1600px → 100%
- [x] Twee correcties op het issue vastgesteld: het knipte **ook** in het medium-bereik (niet alleen
      1332–1400), en de kern is de sprong op 1331px waar een bréder scherm mínder beeld gaf
- [x] Uit de metingen een formule afgeleid (`buiten = 341 - viewport/2 + padding/2`) en die op vijf
      meetpunten gecontroleerd voordat er iets op gebaseerd werd
- [x] De drie magic numbers vervangen door `clamp(0px, 100vw - 700px, 900px)`
- [x] Ná de fix opnieuw gemeten: 900px → 100%, 1332px → 100%, 1600px → 100% mét dezelfde 900px padding
      als voorheen, en de mobiele tak (400px) ongewijzigd
- [x] De grens van de oplossing gemeten in plaats van hem te verzwijgen: bij een venster van 1000px
      hóóg blijft 4% afknipping over (was 78% zichtbaar, nu 96%), omdat `height: 110%` de afbeelding
      breder maakt. Dat staat in de code
- [x] #79's gevraagde meting gedaan: met alleen `body{overflow-x:visible}` steekt op de home-pagina
      **alleen** de hero-afbeelding uit (96px bij 890px, 125px bij 1332px)
- [x] `/luister` gemeten bij 890px en 1000px: **0** uitstekende elementen — dat weerlegt de
      belangrijkste zorg van #79 over het bereik 884–1331
- [x] `/musicmoodcolours` gemeten: 120 uitstekende elementen, maar `overschot` blijft 0 en het is een
      pagina vol carousels
- [x] De meetresultaten als comment in #79 gezet, want dat issue vroeg er expliciet om
- [x] De poort groen: tsc, ESLint, build, 89 pagina's
- [~] `body { overflow-x: hidden }` verwijderen — bewust **niet** gedaan, precies zoals #79 zelf
      adviseert. Op home en luister zou het na deze fix veilig zijn, maar op musicmoodcolours kan de
      meting niet uitwijzen of die 120 elementen legitiem zijn. #79 blijft daarom open
- [~] Punt (b) van #79, het sticky-gedrag in Safari/WebKit — niet gemeten. Daar is een echte Safari
      voor nodig; dit is in Chrome gedaan
- [~] De vaste breedtes (`#contact-form` 700px, filter 400px, `.audioplayer-wrapper` 380px) naar
      `max-width` brengen — ze veroorzaken aantoonbaar geen overflow, dus dat is opruimwerk en geen
      reparatie

### Where I left off

Af, poort groen, **geparkeerd**: dit is site-werk, dus de merge wacht op Dave.

**Wat er te bekijken is.** Draai `npm run dev` en zet het browservenster op verschillende breedtes —
de interessante zijn rond **900px** en rond **1332px**, want daar zat de afknipping. De hero hoort nu
op elke breedte volledig in beeld te staan, zonder sprong als je het venster langzaam breder sleept.
Boven 1600px hoort er niets veranderd te zijn: daar is de padding exact dezelfde 900px als voorheen.

**Eén ding dat ik tegenkwam maar niet heb aangeraakt:** op een smal scherm (400px) valt de **mobiele**
hero-afbeelding voor 39% buiten beeld. Dat is pre-existent — die tak zet `padding-left: 0` en is niet
gewijzigd — en het kan een bewuste keuze zijn voor een doorlopend sfeerbeeld. Als het dat niet is, is
het een eigen issue waard.

Sluit #80 bij een merge. #79 blijft open met de metingen erin.
