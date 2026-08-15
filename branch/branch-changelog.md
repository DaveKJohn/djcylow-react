## `data/covers-en-afbeeldingspaden` changelog

### Branch title

Dode afbeeldingspaden in de mix-data hersteld en de spec op de werkelijkheid gezet

### Branch ID

20260815-140951

### Branch type

data

### What does the change on this branch bring to main?

**Er stonden 30 dode afbeeldingspaden in de mix-data. Dat zijn er nu nul**, gemeten over alle 85
entries tegen de schijf. De inventaris week op één punt af van wat de issues beschreven: er waren
28 dode `image_square` en niet 23+3 — de twee extra zijn de 2026-mixen uit #67, die in geen van
beide tellingen zaten.

**De drie kapotte covers zijn de goedkoopste kritieke reparatie** (#46). Purple, Red en Yellow
wezen naar een bestand dat op twee manieren tegelijk fout was: een hoofdletter in de mapnaam —
fataal op Linux, en Netlify bouwt op Linux — en `_preview_square` in plaats van `_square_preview`,
waardoor het ook lokaal al faalde. Die drie zijn drie van de acht covers op `/musicmoodcolours`, in
alle drie de componenten die ze tonen.

> Deze drie entries dragen `ignore: true`, en `CLAUDE.md` zegt die nooit te wijzigen. Die regel gaat
> over de *inhoud* van een preview — het zijn voorbeelden — en niet over een bestandspad dat
> aantoonbaar nergens naar wijst. Ze dragen bovendien `featured: true` en zijn dus zichtbaar.

**De 25 overige dode `image_square` zijn leeggemaakt, niet gerepareerd, en dat is een beslissing die
op een meting rust.** Issue #66 bood twee wegen: de afbeeldingen genereren, of het veld leegmaken en
de spec bijstellen. De eerste weg is dicht, en dat was niet vooraf bekend: een bestaande square is
**geen uitsnede** van de bijbehorende wide-afbeelding maar een aparte foto. Gemeten op een paar
waarvan beide bestaan is het gemiddelde kanaalverschil met een centrale crop **87.9 van 255** — bij
een echte crop was dat een handvol geweest. Een gegenereerde square zou dus verzonnen beeldmateriaal
zijn geweest dat er als origineel uitziet. Wil je vierkante covers voor de Full-mixen, dan moeten de
afbeeldingen aangeleverd worden; tot die tijd is leeg de eerlijke waarde.

**De twee ontbrekende `small`-varianten zijn wél gegenereerd** (#67), want daar gold het omgekeerde:
`small` ís aantoonbaar een verkleining van `large` (verschil 3.1 en 9.8 — compressieruis), dus die
zijn mechanisch af te leiden. `20260101` en `20260507` droegen het `_large`-pad in hun `small`-veld,
waardoor elke bezoeker van `/luister` daar 1920x1080 binnenhaalde voor een kaartje. Er staan nu twee
echte 480x270-bestanden, en de paden wijzen ernaar.

**De testsuite is meebewogen, en één ratchet is opgeheven.** `liveZonderSquareAfbeelding` stond op
25 en is weg: `image_square` is nu een harde assertie. Daar is een nieuwe wacht bij gekomen die
dekt wat het leegmaken openlaat — **elke `featured` entry moet een bestaand `image_square` hebben**,
want dat zijn precies de acht die gerenderd worden. Die test kijkt naar álle entries en niet alleen
de live, omdat de acht covers preview-entries zijn.

**En de spec beschreef twee dingen verkeerd.** `image_square` heette "required" terwijl 25 entries
het tegendeel bewezen; dat is nu "required for `featured`, may be empty otherwise", met de meting
erbij. Daarnaast schreven `image_wide_small` en `image_square` `.jpg` voor, terwijl elk bestand op
schijf `.webp` is en altijd is geweest.

Bijvangst: `Green_Light_Preview` was de enige preview met ingevulde `image_wide_*`-velden, en die
wezen naar bestanden die nooit hebben bestaan — previews staan uitsluitend als square op schijf. De
andere zeven laten die velden leeg; deze is daarmee gelijkgetrokken.

Sluit #46, #66 en #67.

### Significance

#### Tier 0

De data klopt weer met de schijf, en dat is nu afgedwongen in plaats van geteld: een ratchet is
vervangen door een harde assertie plus een nieuwe wacht op de featured-covers. De spec belooft niet
langer iets wat de data niet levert.

**Score:** 3

#### Tier 1

Drie van de acht covers op `/musicmoodcolours` waren gebroken afbeeldingen, in alle drie de
componenten die ze tonen. Daarnaast haalde elke bezoeker van `/luister` voor twee mixen een
1920x1080-bestand binnen waar een 480x270-kaartje stond.

**Score:** 4

### Pull Request

