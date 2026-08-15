## `data/covers-en-afbeeldingspaden` progress

### Steps

- [x] Alle 85 entries tegen de schijf gemeten: 30 dode paden gevonden (issues telden er 28)
- [x] Gemeten of een square een crop van de wide is — **nee**, 87.9/255 verschil, aparte foto
- [x] Gemeten of small een verkleining van large is — **ja**, 3.1 en 9.8 verschil
- [x] Twee ontbrekende `_small.webp` gegenereerd uit `_large` (480x270)
- [x] #46: drie covers hersteld (mapcasing + omgedraaide suffix)
- [x] #67: twee `image_wide_small` van `_large` naar `_small`
- [x] #66: 25 niet-afleidbare `image_square` leeggemaakt
- [x] Bijvangst: dode wide-paden van `Green_Light_Preview` leeggemaakt
- [x] Ratchet `liveZonderSquareAfbeelding` opgeheven, harde assertie in de plaats
- [x] Nieuwe test: elke `featured` entry heeft een bestaand `image_square`
- [x] Spec bijgesteld: `required` genuanceerd, en `.jpg` → `.webp` op twee plekken
- [x] Hertelling: **0 dode paden**, 214 geldige, 41 lege velden
- [x] Lint-poort groen, 72 tests

### Where I left off

Klaar voor PR, maar **dit is site-werk en wacht op Dave**. Wat er op de deploy preview te zien is:
de acht covers op `/musicmoodcolours` horen nu alle acht een afbeelding te tonen — Purple, Red en
Yellow waren gebroken.

**Eén ding staat open en is jouw beslissing:** de 25 leeggemaakte `image_square`-velden. De
afbeeldingen zijn niet af te leiden (gemeten), dus als Full-mixen ooit vierkante covers moeten
krijgen, moeten die aangeleverd worden. Zolang dat niet gebeurt is er niets zichtbaars aan de hand:
de drie componenten die dit veld lezen filteren op `featured`, en geen enkele Full-mix is dat.

Nog niet gedaan uit dit spoor: #68 (alle 25 Full-mixen op de legacy R2-bucket), #95 (volume-nummering,
Cyan-emoji, drie te lange descriptions) en #45 (twee mixen spelen andermans audio).
