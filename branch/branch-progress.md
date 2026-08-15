## `style/inline-styles-naar-scss` progress

### Steps

- [x] De vijftien gevallen zelf nagelopen en tegen de uitzondering in `CLAUDE.md` gehouden, in plaats
      van de indeling uit het issue over te nemen
- [x] Ontdekt dat twee van de elf duplicaten waren van CSS die er al stond: `#honeypot` en de
      error-kleur. Die zijn dus niet verplaatst maar simpelweg aangesloten op wat er al was
- [x] De reCAPTCHA-hoogte behouden als klasse mét de reden erbij — het is layout-shift-preventie en
      geen opmaak, en zonder die uitleg leest 78px als een willekeurig getal
- [x] **Het voorstel van het issue voor `marginTop` gemeten en verworpen**: `top-push-*` zet
      `padding-top` (gemeten: `top-push-xl` = 11px), niet `margin-top`. Padding verandert de knop
      zelf, margin de afstand eromheen — dat had de knop zichtbaar anders gemaakt
- [x] De twee Footer-SVG's en het Filter-icoon omgezet naar SVG-presentatieattributen in plaats van
      naar CSS, zoals het issue voorstelde
- [x] De hardcoded `#000000` in de Facebook-icoon vervangen door `var(--black-100)`
- [x] Gevonden dat `placeholder-mix` in `VsKleurenCarousel` wél werd gebruikt maar **nergens
      gedefinieerd** was — dus daar had de placeholder geen hoogte. Eén gedeelde klasse dekt nu alle
      drie de carousels
- [x] Die klasse bewust níet genest onder `.carousels`, want `Erlenmeyers` gebruikt de
      Carousel-component niet en zou de regel dan mislopen
- [x] Poort groen; in de gebouwde CSS geverifieerd dat alle vijf nieuwe klassen erin staan met de
      juiste waarden
- [x] Geteld: van 15 inline styles naar 5, en die vijf zijn de vier toegestane plus `MeetTheDJ`
- [~] `MeetTheDJ.tsx` (`height/width: 'auto'`) — niet aangeraakt. Die component wordt nergens
      gerenderd; opruimen daar is werk aan dode code en hoort bij #59

### Where I left off

Af, poort groen. **Geparkeerd**: site-werk, dus de merge wacht op Dave.

**Wat er te bekijken is.** Twee dingen veranderen zichtbaar, allebei ten goede:

- **Het contactformulier**: verstuur het met een lege verplichte veld of een fout adres, en kijk naar
  de foutmelding. Die is nu `#d93025` in plaats van puur `red` — dezelfde kleur als de melding die er
  al onder stond, en beter leesbaar.
- **Music Mood Colours**: de placeholder in de vs-carousel (waar een kleur geen mix heeft) heeft nu
  hoogte, waar hij eerder inklapte.

De rest hoort identiek te zijn: de ✅ in de bevestiging (48px in plaats van 3rem ≈ 48px), de knop
eronder, en de Facebook-icoon in de footer.

Sluit #82 bij een merge.
