## `fix/live-tekst-en-debugtoets` changelog

### Branch title

Spelfouten op de live site hersteld en de debug-sneltoets uit productie

### Branch ID

20260815-132811

### Branch type

fix

### What does the change on this branch bring to main?

**De debug-sneltoets stond live.** `src/app/layout.tsx` registreerde op elke pagina een globale
`keydown`-listener op de losse toets **`w`**. Elke bezoeker die daar buiten een invoerveld op drukte,
zette de klasse `ux-mode` op `<html>` en `<body>` en veranderde daarmee het uiterlijk van de site —
bereikbaar bij gewone toetsenbordnavigatie en bij type-ahead-zoeken op een pagina zonder gefocust
veld. Het script staat nu achter `process.env.NODE_ENV !== 'production'`, en de combinatie is
meteen `Ctrl+Shift+W` geworden: ook in ontwikkeling is een enkele letter te makkelijk per ongeluk te
raken. Gemeten in de verse build: `ux-mode-toggle` en `KeyW` komen in **nul** van de 89 gebouwde
pagina's nog voor.

**Zes tekstfouten die alle zes live stonden**, geverifieerd in `out/`:

| was | wordt | waar |
|---|---|---|
| `Muziekale kaart` | `Muzikale kaart` | `musicmoodcolours/page.tsx`, een `<h2>` |
| `© 2025 DJ Cylow` | `© {buildjaar}` | `Footer.tsx`, op elke pagina |
| `Geirriteerd` | `Geïrriteerd` | `Erlenmeyers.tsx` |
| `(nor)Adrenaline` | `Adrenaline` | `musicmoodcolours/page.tsx`, een `<h3>` |
| `top-producers` | `topproducers` | de fallback-beschrijving op elke mixpagina |
| `Direct Contact` | `Direct contact` | *al meegenomen in `fix/contactformulier-endpoint`* |

Twee daarvan verdienen een woord. Het **copyrightjaar** is nu `new Date().getFullYear()`, wat bij
static export het **buildjaar** vastlegt — hier precies goed, want elke merge naar `main` triggert
een Netlify-build. Een verouderd jaartal in de footer leest op een boekingssite als "wordt niet
onderhouden", bij precies de bezoeker die op het punt staat contact op te nemen. En **`Geirriteerd`**
stond naast `Geïrriteerd` in een tweede component op dezelfde pagina; het verschil is binnen één
scroll te zien, maar de variant zonder trema verschijnt pas na interactie en is daardoor nooit
opgevallen.

De laatste tekstfout uit issue #49 zat in `ContactForm.tsx` en is in de contactformulier-branch
meegenomen, omdat die hetzelfde bestand aanraakte.

Sluit #49 en #55.

### Significance

#### Tier 0

N/A — dit raakt alleen wat de bezoeker ziet. De code eromheen blijft zoals hij was.

**Score:** N/A

#### Tier 1

Elke bezoeker kon met één toetsaanslag het uiterlijk van de site veranderen, en er stonden zes
tekstfouten live waarvan er twee in een `<h2>`/`<h3>` staan en dus meetellen in de koppenstructuur
die Google leest. Het copyrightjaar stond een jaar achter op elke pagina.

**Score:** 4

### Pull Request

