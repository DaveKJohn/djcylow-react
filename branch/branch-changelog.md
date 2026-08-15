## `docs/readme-en-ruleset-kloppend` changelog

### Branch title

De README en de ruleset-bewering beschrijven weer wat er werkelijk staat

### Branch ID

20260815-172021

### Branch type

docs

### What does the change on this branch bring to main?

Twee documenten die iets anders beweerden dan er staat, kloppen weer.

**De `README.md` liep op zes punten uit de pas** (het issue noemde er zeven; punt 3 over
`tailwind.config` bleek al gerepareerd bij de Tailwind-verwijdering, dus dat is geverifieerd en niet
opnieuw gedaan):

- **30 mix-JSON-bestanden** terwijl het er 15 zijn — het document sprak zichzelf twee regels verderop
  tegen, want de eigen kleurentabel somt precies 15 combinaties op
- **`genre` is "either `EDM` or `Drum & Bass`"** terwijl géén enkele mix `genre: "EDM"` draagt.
  Gemeten over 77 live mixen: Drum & Bass 46, House 18, Nu-Disco 10, Techno 3. Die waarde overleeft
  alleen nog binnen oudere `permalink`-bestandsnamen, en dat staat er nu bij — anders lijkt de
  correctie zelf weer onjuist zodra iemand een permalink openslaat
- **Een homepage met zeven secties** terwijl er drie renderen. De vijf andere componenten bestaan nog
  wel; dat ze er staan zonder te renderen is nu expliciet, met de opmerking dat hun verwijdering apart
  loopt omdat het `src/` raakt
- **Het slugformaat** stond er als iets dat `generateStaticParams` construeert. Dat doet het niet: de
  slug komt uit `permalink`. Het gedocumenteerde patroon miste bovendien het BPM-segment, dus het zou
  voor een nieuwe mix de verkeerde URL opleveren. Nu beschreven als afleiding, met de echte bewerking
  erbij en een verwijzing naar de tests die het afdwingen
- **`X-Frame-Options: DENY`** terwijl `netlify.toml` `SAMEORIGIN` zet. De **doc** is naar de config
  bewogen en niet andersom: dat bestand is beschermd, en een live security-header aanscherpen is een
  bewuste wijziging, geen documentatiereparatie
- **Facebook ontbrak** in de opsomming van sociale links in de footer

**En de bewering over de ruleset klopte niet, op vier plekken.** `CLAUDE.md` stelde dat
`main-ci-gate` "force-push, het verwijderen van `main` en merges door niet-admins" hard tegenhoudt.
Geverifieerd via de API (ruleset 20818953): `bypass_mode` staat op `"always"` voor Admin en Maintain,
en GitHub kent geen bypass per regel — dus de **hele** ruleset staat opzij, inclusief `deletion` en
`non_fast_forward`. Voor de enige persoon die hier werkt houdt hij dus niets tegen.

Dat is precies de verkeerde kant om je in te vergissen: wie het las kon aannemen dat een force-push
server-side wordt geweigerd, en de lokale denylist als tweede lijn beschouwen in plaats van als de
enige — terwijl die denylist alleen binnen Claude Code geldt en niet in een terminal. De vierde plek
is de lens van Chris, die bij **elke sessie** meelaadt en waar die zin het argument onder de PR-grens
draagt. Dat argument blijft staan en wordt door de correctie sterker: de menselijke blik is hier niet
de tweede lijn maar de enige.

### Significance

#### Tier 0

De README is wat iemand als eerste leest om deze repo te begrijpen, en hij beschreef een genre-indeling
die niet bestaat, een slugafleiding die andersom werkt en een homepage die er niet zo uitziet. De
ruleset-correctie raakt bovendien het document dat elke sessie meelaadt, en ging over hoeveel
bescherming er werkelijk is.

**Score:** 3

#### Tier 1

Documentatie over de repo; de site verandert niet.

**Score:** N/A

### Pull Request

