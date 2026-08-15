## `fix/breakpoints-een-bron` changelog

### Branch title

De breakpoints in JS en SCSS kunnen niet meer stil uit elkaar lopen

### Branch ID

20260815-182139

### Branch type

fix

### What does the change on this branch bring to main?

De breakpoints `1774 / 1331 / 884` stonden op drie plekken los opgeschreven, en één daarvan werd door
niemand gelezen.

**Het comment bij de drawer noemde een getal dat nooit heeft bestaan.** `MobileContent.tsx` bouwt zijn
`matchMedia`-query uit `BREAKPOINTS.SMALL` en droeg het comment dat dit exact matcht met *"$breakpoints
small: 811px"*. Zowel `_config.scss` als `design.ts` zeggen 884. Dat is de gevaarlijkste soort fout in
een comment: het benoemt correct dát er een koppeling is, en geeft er dan de verkeerde waarde bij — dus
wie het geloofde en de constante "corrigeerde", verbrak precies de koppeling die het comment beweerde te
bewaken. De drawer zou dan omschakelen op een andere breedte dan de styling, zichtbaar in een smalle
band rond de breakpoint waar niemand kijkt.

**Er is nu een test in plaats van een afspraak.** `tests/breakpoints.test.ts` (negen tests) leest
`_config.scss` en `design.ts` allebei en vergelijkt ze op waarde, op sleutels en op volgorde. Dat is de
enige vorm die hier kan: Sass kan geen TypeScript lezen en de static export kan geen SCSS aan de
clientkant evalueren, dus één bron is technisch uitgesloten — maar aan elkaar binden kan wel. Negatief
getoetst met precies het scenario uit het issue: `SMALL` op 811 zetten laat de suite falen op *"small
komt overeen"*.

Twee kleinere wachten zitten er in dezelfde suite. Eén die eist dat de query uit `BREAKPOINTS.SMALL`
wordt afgeleid en niet uit een letterlijk getal, en één die **elk** pixelgetal in `MobileContent.tsx`
weigert dat geen echte breakpoint is — precies de vorm waarin deze fout binnenkwam. Die laatste sloeg
meteen aan op de historische verwijzing in het nieuwe comment, dus daar staat het oude getal nu voluit
geschreven in plaats van als cijfers.

**En de derde plek is verdwenen.** `base/_root.scss` genereerde `--screen-size-large/-medium/-small`
als CSS-variabelen. Ze werden uitgeleverd en door niemand gelezen — geen stylesheet, geen component.
Ze waren ook niet bruikbaar voor waar je ze voor zou willen: een custom property kan niet in een
`@media`-conditie staan, dus ze konden de media queries nooit voeden. Gemeten: drie declaraties in de
gebouwde CSS, nu nul.

Wat expliciet **niet** is aangeraakt: de manier waarop de SCSS zijn breakpoints leest. `_config.scss`
blijft de bron voor alle media queries via `fn.get-breakpoint()`, en er is geen enkele afwijkende
hardcoded media query in de repo — dat was al netjes en blijft zo.

### Significance

#### Tier 0

Een comment dat een verkeerd getal noemde bij een koppeling die er echt toe doet, is vervangen door een
test die de koppeling afdwingt. De suite groeit van 143 naar 152 tests.

**Score:** 3

#### Tier 1

Voorkomt dat het mobiele menu ooit op een andere breedte omklapt dan het uiterlijk, maar er is vandaag
niets zichtbaar mis. De waarde zit in de volgende keer dat iemand aan die getallen komt.

**Score:** 2

### Pull Request

