## `fix/toegankelijkheid-focus-en-toetsenbord` progress

### Steps

- [x] Geverifieerd dat `--primary-color` nergens bestaat en dat dit de **enige** `:focus`-regel in de
      hele styles-boom was — de site had dus geen eigen focus-systeem dat het opving
- [x] `:focus-visible` in de reset én op de invoervelden, in de accentkleur van de CTA
- [x] De vier `<div onClick>` omgezet: filterknop, erlenmeyers, video-starter, en de tijdlijn
- [x] Bij de video-starter twee takken gemaakt in plaats van één element: een `<button>` zolang hij
      niet speelt, een `<div>` zodra de iframe erin zit — interactieve inhoud in een knop is
      ongeldige HTML
- [x] De knop-opmaak geneutraliseerd in `promo.scss`, zodat de starter er precies zo uitziet als
      daarvoor
- [x] **Gevonden wat het issue niet noemt:** de carousel-pijlen hadden hun `onClick` op de omhullende
      div en niet op de knop — dezelfde vorm als de filterknop
- [x] **Nog een vondst:** `#errorMessage` in de SCSS is dode code (geen component draagt dat id) en
      bevatte een te lage contrastkleur. Weggehaald in plaats van de kleur te repareren
- [x] Namen voor de drie naamloze knoppen, en beschrijvende alt-teksten
- [x] Uit #54: de foutmelding van het formulier op `.feedback-message.error`. Contrast berekend vóór
      en ná: 4,30:1 → 6,80:1
- [x] Dertien tests, waaronder de regel "een `role` die iets belooft moet ook een toets afhandelen"
- [x] Twee valse rode tests in mijn eigen suite opgelost: de comments citeren de oude waarden, dus de
      SCSS-tests kijken nu naar declaraties en niet naar documentatie. En een tag-regex brak op de
      `>` in een arrow function
- [x] **Twee echte regressies in bestaande tests meegecorrigeerd**: de volumeschuif-test zocht op
      `role="slider"` zonder naam (en vond nu ook de tijdlijn), de sluitknop-test op de tekst `✕`
- [x] Poort groen; volledige suite 178 tests groen (was 165)
- [~] De moodkleuren uit #54 — wit op rood (3,4:1) en op magenta (2,7:1) zakken door AA, maar dat
      raakt de merkkleuren. Het issue merkt zelf aan dat dit Dave's keuze is, dus #54 blijft open
- [~] `MeetTheDJ.tsx` (`alt="Dave Kok"`) — niet aangeraakt: die component wordt niet gerenderd, en
      een naam is voor een portret bovendien een redelijke alt

### Where I left off

Af, poort groen, 178 tests groen.

**Wat er te bekijken is:** tab door het contactformulier — er hoort nu een gele ring om het actieve
veld te staan. En op `/musicmoodcolours` zijn de drie kolven met Tab en Enter te bedienen.

Sluit #53. **#54 blijft open** voor de moodkleuren.
