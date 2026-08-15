## `fix/contactformulier-endpoint` progress

### Steps

- [x] `name` lezen i.p.v. `firstName`/`lastName`, in onderwerp én body (#42)
- [x] Invoervalidatie: aanwezigheid, type, lengte, adresvorm (#51.1)
- [x] Escaping via één helper, plus een `text:`-variant (#51.2)
- [x] CORS beperkt tot de eigen domeinen + deploy previews; hostname-check op reCAPTCHA (#51.3)
- [x] `details` uit de 500-response (#51.4)
- [x] Foutlus opgeheven: verse challenge na een mislukking (#57)
- [x] Testsuite voor de function, 23 tests (#71)
- [x] `axios` vervangen door de ingebouwde `fetch` en uit `package.json`
- [x] Lint-poort groen op 0 errors / 0 warnings, 94 tests

### Where I left off

Klaar voor PR, maar **dit is site-werk en wacht dus op Dave**: het raakt `src/` en het endpoint dat
de live site gebruikt. De deploy preview is hier ook echt nodig, want twee dingen zijn alleen in de
praktijk te zien — of een echte aanvraag aankomt met naam, en of de reCAPTCHA-hostnamecontrole geen
legitiem verkeer weigert. Die tweede is het risico van deze branch: als Google's antwoord een
hostname bevat die niet in de lijst staat, wordt een geldige aanvraag geweigerd. De lijst dekt
`djcylow.com`, `www.djcylow.com`, `djcylow-react.netlify.app` en het deploy-preview-patroon.

Test op de preview: vul het formulier in en kijk of de mail aankomt met de juiste naam.

