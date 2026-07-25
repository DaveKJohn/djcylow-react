### GTM Laag 3 — content_group op mix_id, en de GA4-dimensie Mix ID

**Branch naam** config/ga4-content-group-v2
**Datum merge op main**
**Branch type** Config

Vastlegging van twee analytics-wijzigingen die al sinds **27 juni 2026** live staan in Google Tag
Manager en GA4, maar tot nu toe nergens in deze repo waren gedocumenteerd. Er verandert dus niets
aan de configuratie zelf; dit haalt alleen de administratie bij.

**GTM.** De parameter `content_group` is toegevoegd aan de tag `GA4 - view_mix`, met als waarde
`{{DLV - mix_id}}` (bijvoorbeeld `2026-06-15`). Gepubliceerd als GTM-versie 5 op 2026-06-27 16:59.
Hierdoor worden mix-weergaven in GA4 samengevoegd per mix-ID, ongeacht de URL-variant: met of zonder
`/en/`, met of zonder `.html`.

**GA4.** De aangepaste dimensie **Mix ID** is aangemaakt met bereik Gebeurtenis en parameternaam
`content_group`. Bruikbaar via Verkennen → vrije vorm → dimensie "Mix ID" als rij; dat toont de
weergaven per mix samengevoegd, ongeacht URL-variant.

**Waarom dit alsnog landt.** Het werk stond op de branch `config/ga4-content-group`, aangemaakt op
27 juni, die nooit is gemergd. Die branch bewerkte `CHANGELOG.md` rechtstreeks — de werkwijze van
vóór de omslag naar per-branch entry-bestanden — waardoor hij inmiddels zou conflicteren. De inhoud
is daarom overgezet naar het huidige entry-formaat en de oude branch is opgeruimd. Zonder deze stap
zou er een live analytics-configuratie bestaan waarvan in de repo geen spoor te vinden is.
