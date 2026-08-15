## `style/contrast-rood-en-magenta` progress

### Steps

- [x] Het contrast per moodkleur berekend voor zowel wit als zwart, in plaats van alleen de twee
      gemelde gevallen na te rekenen — dat maakte meteen zichtbaar dat purple en blue juist wit
      moeten hóuden
- [x] `red` en `magenta` toegevoegd aan `$dark-text-colors`, met de meetwaarden in het bestand
- [x] De merkkleuren zelf niet aangeraakt; alleen de tekstkleur erop
- [x] Geverifieerd in de gebouwde CSS dat `.red p` en `.magenta p` nu `var(--black-100)` krijgen
- [x] Poort groen

### Where I left off

Af. Zichtbare wijziging: de labels van rood en magenta krijgen zwarte tekst in plaats van witte —
op de luister-filter en op Music Mood Colours.

Sluit #54.
