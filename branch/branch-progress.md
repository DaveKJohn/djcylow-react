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
- [~] HSTS `includeSubDomains` toevoegen — **niet gedaan**, en dat is een correctie op #52: die header
      komt niet uit `netlify.toml` maar van Cloudflare/Netlify zelf. Hem hier zetten verandert niet
      wat de bezoeker krijgt. Dat hoort thuis waar hij vandaan komt

### Where I left off

De poort staat groen, maar deze branch is **anders dan de andere geparkeerde branches**: hier is de
deploy preview geen extraatje maar het bewijsmiddel. Er is geen staging, en of `out` de juiste
publicatiemap is valt alleen te toetsen door Netlify ermee te laten bouwen.

**Daarom is de vraag aan Dave hier anders.** Bij de andere branches is het "kijk of het er goed
uitziet". Hier is het:

1. Mag de PR open, zodat de preview bouwt? (Openen is geen mergen; er gaat niets live.)
2. Werkt die preview — laadt de homepage, en werken /luister en een mixpagina? Zo ja, dan is `out`
   bewezen juist. Zo nee, dan is `.next` de juiste waarde en hoort het comment in `netlify.toml`
   omgedraaid te worden.

Pas daarna is de merge een geïnformeerde beslissing in plaats van een gok.

**Wat je in de preview ook kunt zien:** open de browserconsole en kijk naar de
`Content-Security-Policy-Report-Only`-meldingen. Die vertellen precies wat er zou breken als de policy
blokkerend wordt — dat is de meting waarvoor `Report-Only` bestaat, en de volgende stap zou zijn hem
op basis daarvan om te zetten.

Sluit #52 en #65 bij een merge.
