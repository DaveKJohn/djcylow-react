## `config/contactform-tests` changelog

### Branch title

Het contactformulier heeft eindelijk tests

### Branch ID

20260815-205505

### Branch type

config

Het contactformulier is het enige conversiepad van de site en had geen enkele test op de component
zelf. De Netlify-function erachter was al gedekt; dit is de clientkant.

**Negen tests over de vier dingen die stil kunnen breken:** de knop blijft uit tot de captcha is
opgelost, de velden gaan de deur uit onder de namen die de function verwacht, de bevestiging vervangt
het formulier, en na een fout wordt het captcha-token ververst.

**Twee daarvan bewaken bugs die hier écht zijn gebeurd**, en die zijn negatief getoetst:

- De veldnamen. De function las ooit `firstName` en `lastName`, die nergens bestonden, en elke
  aanvraag kwam binnen als *"Boekingsaanvraag: undefined undefined"*. Toets: `name` hernoemen naar
  `firstName` laat de test vallen.
- De token-reset. Een reCAPTCHA-token is eenmalig en ongeveer twee minuten geldig, dus zonder reset
  probeert de bezoeker het opnieuw met hetzelfde token, antwoordt Google `timeout-or-duplicate`, en
  herhaalt dat zich tot de pagina herlaadt — één tijdelijke serverfout kostte zo de hele aanvraag.
  Toets: de reset weghalen laat de test vallen.

Er staat ook een test op dat `bot-field` wordt meegestuurd. Dat sluit aan op de honeypot die vandaag
in de function is aangesloten: die kan alleen iets vangen als de clientkant het veld blijft
meesturen, en dat verband is nu vastgelegd in plaats van aangenomen.

**Twee omgevingsstubs waren nodig**, en beide staan met hun reden in het bestand. `IntersectionObserver`
bestaat niet in jsdom terwijl de component hem gebruikt om de captcha lui te laden — zonder stub zou
elke test op de zes-secondenfallback wachten. En de reCAPTCHA-widget is vervangen door een knop die
een token teruggeeft: die praat met Google, en wat hier telt is wat de component met het tóken doet.

### Significance

#### Tier 0

De belangrijkste ongeteste component van de repo is gedekt, met twee tests die precies de twee
storingen bewaken die hier eerder zijn opgetreden. Suite van 193 naar 202.

**Score:** 4

#### Tier 1

Er verandert vandaag niets aan het formulier; het werkt zoals het werkte. De waarde is dat een
volgende wijziging aan het verzendpad niet meer stil kan breken — en dit is het pad waarlangs boekingen
binnenkomen.

**Score:** 2

### Pull Request

