## `fix/live-tekst-en-debugtoets` progress

### Steps

- [x] UX-toggle achter `NODE_ENV !== 'production'` en op `Ctrl+Shift+W` (#55)
- [x] Geverifieerd in `out/`: `ux-mode-toggle` en `KeyW` in 0 van 89 pagina's
- [x] `Muziekale` → `Muzikale`, in de kop én de comment erboven (#49)
- [x] Copyrightjaar dynamisch; buildjaar, wat hier het juiste antwoord is (#49)
- [x] `Geirriteerd` → `Geïrriteerd` (#49)
- [x] `(nor)Adrenaline` → `Adrenaline` (#49)
- [x] `top-producers` → `topproducers` in de fallback-beschrijving (#49)
- [~] `Direct Contact` → `Direct contact`: al gedaan in `fix/contactformulier-endpoint`, dat
      hetzelfde bestand aanraakte — hier nogmaals doen zou een conflict opleveren
- [x] Alle zes gecontroleerd in de gebouwde HTML
- [x] Lint-poort groen

### Where I left off

Klaar voor PR, maar **dit is site-werk en wacht op Dave**. Op de deploy preview zijn twee dingen
het bekijken waard: het jaartal in de footer (moet nu 2026 zijn) en de kop *Muzikale kaart* op
`/musicmoodcolours`.

Let op de volgorde met `fix/contactformulier-endpoint`: die branch draagt de zesde tekstfout. Welke
van de twee als eerste mergt maakt niet uit — ze raken verschillende bestanden.
