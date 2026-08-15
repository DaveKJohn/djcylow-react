## `style/kleuren-uit-het-palet` changelog

### Branch title

De losse hexwaarden komen uit het palet en de splitter-vraag is beslecht

### Branch ID

20260815-213340

### Branch type

style

### What does the change on this branch bring to main?

Er stonden dertien losse hexwaarden in de SCSS buiten de paletdefinitie (issue #81). Het onderzoek
eronder leverde op dat ze niet één ding waren maar drie, met drie verschillende antwoorden — en dat
onderscheid is het eigenlijke resultaat van deze branch, want een blinde vervangactie zou de
YouTube-knop hebben meegenomen.

**Tien waren het palet, overgetypt.** Het gradientbalkje in `basiskleurenCarousel.scss` somde de acht
basiskleuren op als letterlijke hex. Dat balkje hoort onder elke kaart precies de kleur te tonen die
die kaart draagt, en dat blijft alleen kloppen zolang beide dezelfde bron lezen. Ze halen hun waarde
nu op met `map.get(v.$colors, …)`. **De gebouwde CSS is byte-identiek** — dezelfde tien stops,
dezelfde percentages — dus dit is nul zichtbare wijziging en enkel het dichten van de mogelijkheid
dat de twee ooit uiteenlopen. De twee uiteinden zijn géén basiskleur maar het punt waar de
kleurencirkel van blauw terugloopt naar cyaan; die staan nu als benoemde variabele met die uitleg
erbij, in plaats van als twee anonieme hexwaarden tussen acht die dat wél zijn.

**Twee waren het palet dat níet gelezen werd.** `#fff` in `filter.scss` en `#000000` in
`_tools.scss` zijn nu `var(--white-100)` en `map.get(v.$colors, "black", "100")`. De zwarte is
byte-identiek in de output (32 declaraties voor en na). De witte verschuift wél echt: van `#ffffff`
naar `#eeeeee`, het wit dat de rest van de site gebruikt. Gemeten op de drie donkere achtergronden
van deze site gaat het contrast van 21,0/18,6/13,6 naar 18,1/16,0/11,7 — alle zes ruim boven de
AAA-grens van 7,0.

**Drie horen hier expliciet niet.** De play-knop op de homepage imiteert bewust die van YouTube,
want daar linkt hij heen. `#ff0000`, `#cd201f` en het witte driehoekje zijn dus **merkkleuren van
iemand anders**. Ze zijn niet naar het palet verhuisd maar juist stevig buiten gehouden, als drie
variabelen met de reden erboven: ze mogen niet meebewegen als DJ Cylow's palet verandert, en het
driehoekje is `#ffffff` en niet `--white-100` omdat het YouTube's wit is. Dat is de wijziging die
een latere lezer behoedt voor de opruimactie die deze branch bijna zelf werd.

Daarnaast is issue #116 beslecht in plaats van doorgeschoven: **de splitter krijgt in ux-mode geen
eigen kleur.** De ux-modus hertint inhoud, en een haarlijn van 1px geeft niets te lezen. Doorslaggevend
is het tweede argument: de key waar het oude blok naar greep (`"50"`) heeft nooit bestaan, dus wat
daar al die jaren te zien was ís `--black-70`. Er valt niets te herstellen — een ux-kleur kiezen zou
een nieuwe zichtbare wijziging zijn op grond van een bedoeling die niemand heeft opgeschreven. Dat
staat nu als beslissing in de code, waar de open vraag stond.

Tot slot ging de ESLint-teller terug naar 0: mijn eigen honeypot-test uit een eerdere branch liet een
ongebruikte `res` staan. Die teller staat op 0/0 juist zodat elke melding nieuw is; hem op 1 laten
staan haalt dat weg.

### Significance

#### Tier 0

Het gradientbalkje en de acht kaarten eronder konden uiteenlopen zodra iemand het palet aanraakte —
niet omdat dat fout gaat, maar omdat niets het tegenhield. Belangrijker voor een latere lezer is dat
de YouTube-kleuren nu zeggen dat ze van YouTube zijn: de volgende opruimactie op losse hexwaarden
gaat ze niet meer meenemen, en dat is precies de fout die hier bijna is gemaakt.

**Score:** 2

#### Tier 1

De witte filterknop op mobiel gaat van `#ffffff` naar `#eeeeee`. Dat is zichtbaar noch merkbaar in de
praktijk — contrast blijft ruim boven AAA — maar het is de enige echte kleurverandering die op de
site landt, dus hij hoort genoemd.

**Score:** 1

### Pull Request

