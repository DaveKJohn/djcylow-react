## `fix/breakpoints-een-bron` progress

### Steps

- [x] De drie plekken uit #97 geverifieerd: `design.ts` en `_config.scss` zeggen allebei 1774/1331/884,
      en `_root.scss` genereert er CSS-variabelen uit
- [x] Gemeten dat `--screen-size-*` echt dood is: geen enkele verwijzing in `src/` buiten `_root.scss`,
      en drie declaraties in de gebouwde CSS die niemand leest
- [x] Vastgesteld dat `BREAKPOINTS` precies één gebruiker heeft (`MobileContent.tsx`), dus dat de
      koppeling smal en goed te bewaken is
- [x] Het misleidende comment in `MobileContent.tsx` vervangen door een dat klopt en naar de test wijst
- [x] `--screen-size-*` uit `_root.scss`, met de reden erbij dat een custom property sowieso niet in een
      `@media`-conditie kan staan — dus ze hadden nooit kunnen doen waarvoor ze bedoeld leken
- [x] `tests/breakpoints.test.ts` geschreven: negen tests over waarde, sleutels, volgorde, de afleiding
      van de query, en een verbod op vreemde pixelgetallen in dat bestand
- [x] De suite luid laten falen als de SCSS-vorm verandert, in plaats van stil nul paren te vergelijken
      — een test die niets vindt en daarom groen blijft is precies het probleem dat dit oplost
- [x] Negatief getoetst met het scenario uit het issue: `SMALL` op 811 zetten laat *"small komt
      overeen"* falen. Daarna hersteld en geverifieerd dat er weer 884 staat
- [x] Gemeten dat `screen-size` uit de gebouwde CSS verdwenen is: 3 → 0
- [x] Poort groen, volledige suite 152 tests groen (was 143)
- [~] `$breakpoints` genereren uit `design.ts` — technisch uitgesloten: Sass kan geen TypeScript lezen,
      en de static export kan geen SCSS aan de clientkant evalueren. Het issue bood dit als eerste van
      twee wegen; de tweede (de koppeling vastleggen) is genomen, maar als test in plaats van als
      comment, want een comment was juist wat hier faalde

### Where I left off

Af, poort groen, **geparkeerd**: deze branch raakt `src/`, dus de merge wacht op Dave.

**Wat er te bekijken is.** Visueel hoort er niets veranderd te zijn — de breakpoints zijn dezelfde
getallen gebleven, er is alleen dode CSS weg. Het punt om te controleren is het **mobiele menu**: sleep
het venster door de 884px-grens en kijk of de hamburger op hetzelfde moment verschijnt als de layout
omschakelt. Dat werkte al en hoort te blijven werken.

Sluit #97 bij een merge.
