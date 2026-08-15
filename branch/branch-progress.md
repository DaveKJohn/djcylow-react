## `config/netlify-publish-en-csp` progress

### Steps

- [x] De live site gemeten in plaats van alleen de repo gelezen: `curl -I` op `djcylow.com` bevestigt
      dat de drie bestaande headers doorkomen en dat CSP en Permissions-Policy ontbreken
- [x] Daarbij ontdekt dat er **Cloudflare** vóór Netlify zit en dat `www` een 301 naar de apex doet —
      dat staat in geen enkel issue en verklaart waar de HSTS-header vandaan komt
- [x] De bronnen voor de CSP gemeten aan de gebouwde HTML en de componenten, niet geraden:
      googletagmanager, google/gstatic, youtube-nocookie, i.ytimg, de R2-bucket
- [x] Geverifieerd dat de fonts self-hosted zijn (`/_next/static/media/*.woff2`, 0 verwijzingen naar
      `fonts.gstatic.com`), zodat `font-src 'self'` volstaat
- [x] Geteld dat er 13 inline scripts in de export staan — daarom is `'unsafe-inline'` hier
      onvermijdelijk, en dat staat als zodanig in het bestand in plaats van als stilzwijgende keuze
- [x] `publish` van `.next` naar `out`, met de redenering en het toetsplan in het bestand zelf
- [x] De twee documentatieregels meegenomen die de build naar `.next` lieten gaan (`CLAUDE.md:293` en
      `README.md:69`), plus het `netlify.toml`-citaat in de README
- [x] Poort groen
- [x] De PR geopend als **meetinstrument** en de preview gemeten: `publish = "out"` levert 200 met
      HTML op `/`, `/luister`, `/musicmoodcolours` en `/diensten`. Daarmee is de publicatiemap
      aangetoond in plaats van beredeneerd
- [x] Bij diezelfde meting ontdekt dat de **twee nieuwe headers stil niet werden uitgeleverd** terwijl
      de drie bestaande dat wel deden — zonder foutmelding, met Netlify's "Header rules"-check op
      `pass`
- [x] De oorzaak geïsoleerd met een tijdelijke `X-Csp-Test`-header, zodat een structuurprobleem te
      onderscheiden viel van een waardeprobleem: het waren de **comments binnen `[headers.values]`**
- [x] De comments naar bóven het blok verplaatst, de testheader weer verwijderd, en in de eindmeting
      bevestigd dat alle vijf headers doorkomen
- [x] Die val als waarschuwing in `netlify.toml` gezet — hij faalt stil, en dat is precies waarom hij
      opgeschreven hoort te worden
- [~] HSTS `includeSubDomains` toevoegen — **niet gedaan**, en dat is een correctie op #52: die header
      komt niet uit `netlify.toml`. Gemeten levert Netlify zelf al
      `max-age=31536000; includeSubDomains; preload`

### Where I left off

Af en **gemeten op een draaiende deploy**, wat deze branch onderscheidt van de andere geparkeerde
branches: hier was de preview geen extraatje maar het bewijsmiddel. Er is geen staging, en of `out`
de juiste publicatiemap is valt alleen te toetsen door Netlify ermee te laten bouwen.

De PR staat open ([#118](https://github.com/DaveKJohn/djcylow-react/pull/118)) en is **niet gemerged**
— dat blijft Dave's beslissing, want dit is het bestand dat de safety-rules beschermen.

**Wat de preview bewijst:**

| meting | uitkomst |
|---|---|
| `/`, `/luister`, `/musicmoodcolours`, `/diensten` met `publish = "out"` | alle vier **200** met HTML |
| `Content-Security-Policy-Report-Only` | aanwezig |
| `Permissions-Policy` | aanwezig |
| de drie bestaande headers | onveranderd aanwezig |

**Wat er nog te doen is en waarom het niet hier kan.** De CSP staat op `Report-Only`, dus hij meet
alleen. Open de preview in een browser, kijk in de console naar de CSP-meldingen, en zet hem op basis
daarvan om naar de blokkerende `Content-Security-Policy`. Dat kan pas als er echt verkeer langs is
geweest — GTM laadt bijvoorbeeld pas na scroll, muisbeweging of zes seconden, dus een `curl` ziet
nooit wat die container werkelijk binnenhaalt.

Sluit #52 en #65 bij een merge.
