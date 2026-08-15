## `fix/hero-padding-en-overflow` changelog

### Branch title

De hero-afbeelding valt niet meer weg tussen 1332 en 1400 pixels

### Branch ID

20260815-175300

### Branch type

fix

### What does the change on this branch bring to main?

**De hero-afbeelding werd afgeknipt, en dat gebeurde stil.** `hero.scss` duwde hem naar rechts met drie
losse magic numbers: 900px boven 1331px, 400px daaronder, 0 onder 884px. Wat buiten de container viel
werd weggeknipt door `overflow: hidden` op `.stack`, dus er kwam geen scrollbar en geen foutmelding —
alleen een hero die er deels niet was.

Het issue noemde dit expliciet **niet gemeten**, dus dat is eerst gedaan: in Chrome, met de pagina in
een iframe van een exacte breedte zodat de media queries echt meedoen. Hoeveel procent van de
afbeelding zichtbaar was, per viewportbreedte:

| breedte | vóór | ná |
|---|---|---|
| 900 px | 86 % | **100 %** |
| 1330 px | 100 % | 100 % |
| 1332 px | 81 % | **100 %** |
| 1400 px | 86 % | 100 % |
| 1560 px | 98 % | 100 % |
| 1600 px | 100 % | 100 % |

**Twee dingen stellen het oorspronkelijke vermoeden bij.** Het issue verwachtte het probleem in het
venster 1332–1400px; in werkelijkheid knipte **ook het hele medium-bereik**, wat niemand had opgemerkt
— bij 900px viel er 91px af. En de kern is niet dat venster maar de **sprong** op 1331px: de afbeelding
werd slechter naarmate het scherm bréder werd, en dat is precies de richting waarin niemand kijkt.

Alle metingen passen op één formule — wat er buiten valt is `341 - viewport/2 + padding/2` — dus nul
afknipping vraagt `padding ≤ viewport - 682px`. De drie waarden zijn vervangen door
`clamp(0px, 100vw - 700px, 900px)`: vloeiend, 18px marge op die grens, en bij 1600px exact dezelfde
900px als voorheen. Boven de 1600 verandert er dus niets aan wat er nu staat.

**Wat de clamp níet oplost, en dat staat in de code.** De afbeelding heeft `height: 110%; width: auto`,
dus hij wordt breder naarmate het venster hóger is: bij 1332×1000 is hij 749px in plaats van 667px.
Na deze fix is dat 96% zichtbaar in plaats van 78% — een grote verbetering, maar geen 100%. Die rest is
niet met een `vw`-formule weg te nemen en zou een andere manier van schalen vragen.

**En de vraag van #79 is beantwoord zonder er iets aan te veranderen.** Dat issue vroeg om te meten wát
er uitsteekt als `body { overflow-x: hidden }` weg is. Gemeten: op de home-pagina exact één ding — deze
hero-afbeelding. Op `/luister` steekt er bij 890px en 1000px níets uit, wat de belangrijkste zorg van
dat issue weerlegt. Op `/musicmoodcolours` steken 120 elementen uit, maar dat is een pagina vol
carousels waar horizontale overflow binnen een container normaal gedrag is. De regel is daarom blijven
staan en de metingen zijn in #79 vastgelegd; dat issue blijft open.

### Significance

#### Tier 0

De drie magic numbers zijn vervangen door één formule met de meting ernaast, dus de volgende die hieraan
werkt hoeft niet opnieuw te ontdekken waar de randen liggen. En het toont de faalvorm die deze repo het
vaakst raakt: een fout die geen enkele poort kan zien, alleen een oog.

**Score:** 3

#### Tier 1

De hero is het eerste wat een bezoeker ziet, en hij was op een flink deel van de gangbare
schermbreedtes voor 14 tot 19 procent afgeknipt — inclusief het hele bereik rond 900px. Dat is nu
overal heel.

**Score:** 4

### Pull Request

