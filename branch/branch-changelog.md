## `style/contrast-rood-en-magenta` changelog

### Branch title

Tekst op rood en magenta haalt WCAG AA

### Branch ID

20260815-211304

### Branch type

style

### What does the change on this branch bring to main?

Tekst op de moodkleuren **rood** en **magenta** zakte door WCAG AA voor normale tekst. Berekend
volgens de relatieve luminantie uit WCAG 2.x, met de #eeeeee die `--white-100` levert:

| kleur | wit #eee | zwart | gekozen |
|---|---|---|---|
| red `#ff0000` | 3,45 ✗ | **5,25** ✓ | zwart |
| magenta `#ff00ff` | 2,70 ✗ | **6,70** ✓ | zwart |
| purple `#7f00ff` | 5,41 ✓ | 3,35 | wit blijft |
| blue `#0000ff` | 7,41 ✓ | 2,44 | wit blijft |

Beide staan nu in `$dark-text-colors`, waardoor ze zwarte tekst krijgen in plaats van wit.

**De merkkleuren zelf zijn niet aangeraakt**, en dat is precies waarom deze oplossing is gekozen
boven het bijstellen van `#ff0000` en `#ff00ff`. Alleen de tekstkleur eróp draait om; het contrast
komt in orde zonder dat de huisstijl verandert. Purple en blue houden wit, want daar zou zwart juist
zakken — de keuze is per kleur gemeten en niet als groep gemaakt.

Dit is geen randgeval: juist rood en magenta worden als labels **met tekst** gerenderd op de
luister-filter en op Music Mood Colours. Geverifieerd in de gebouwde CSS dat `.red p` en `.magenta p`
nu `var(--black-100)` krijgen.

### Significance

#### Tier 0

De meetwaarden en de afweging staan nu in de code, zodat een volgende kleur niet op gevoel bij die
lijst wordt gezet.

**Score:** 2

#### Tier 1

Twee van de acht moodkleuren waren met normale tekst slecht leesbaar — magenta op 2,70:1, ver onder de
norm. Dat raakt elke bezoeker van de luister-filter en van Music Mood Colours, en het meest de mensen
voor wie de norm bestaat.

**Score:** 4

### Pull Request

