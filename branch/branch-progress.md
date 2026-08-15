## `fix/honeypot-wordt-uitgelezen` progress

### Steps

- [x] Bevestigd dat `bot-field` nergens in `send-email.js` voorkwam — de val stond er wel, maar ving
      niets
- [x] De check direct na het parsen gezet, vóór de veldvalidatie en vóór de reCAPTCHA-call, zodat een
      bot geen enkel signaal terugkrijgt
- [x] Bewust een 200 in plaats van een fout: een bot die "verzonden" leest, probeert het niet nog eens
- [x] Het veld rechtstreeks gelezen en niet via `leesVeld` — die toetst op `MAX_LENGTE[naam]`, en dat
      bestaat voor dit veld niet
- [x] Vijf tests, waaronder de randgevallen: leeg veld door, alleen spaties door, ingevuld veld stopt
      zelfs zonder reCAPTCHA-token
- [x] Negatief getoetst door de conditie op `false` te zetten: twee tests vielen om. (Een eerdere
      poging waarbij ik het blok wegknipte brak het bestand en gaf "no tests" — dat is geen geldige
      toets, dus opnieuw gedaan)
- [x] Poort groen; volledige suite 183 tests groen (was 178)

### Where I left off

Af. Raakt `netlify/functions/` en de tests; loopt door onder het yolo-akkoord.

Sluit #117.
