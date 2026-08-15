## `config/netlify-publish-en-csp` changelog

### Branch title

netlify.toml wijst de juiste publicatiemap aan en meet een Content-Security-Policy

### Branch ID

20260815-191055

### Branch type

config

### What does the change on this branch bring to main?

Twee dingen in `netlify.toml`, het bestand dat de safety-rules beschermen omdat een fout erin de live
site plat legt.

**De publicatiemap wees naar `.next`, waar geen `index.html` staat.** `next.config.ts` zet
`output: 'export'`, en dan schrijft `next build` de complete site naar `out/`. Als Netlify `.next`
letterlijk zou publiceren, was de hele site een 404. Dat hij tóch werkt komt doordat de Netlify
Next.js-runtime `output: 'export'` herkent en zelf de export-map neemt — maar die runtime staat
nergens in dit bestand verklaard, dus de configuratie leunde op een detectie die de repo niet
vastlegt. Nu staat er `publish = "out"`, wat de aanname expliciet maakt zonder het resultaat te
veranderen.

**Er was geen Content-Security-Policy en geen Permissions-Policy.** Live gemeten: `x-frame-options`,
`x-content-type-options` en `referrer-policy` komen wel door, die twee niet. Dat weegt hier zwaarder
dan gemiddeld omdat de site GTM laadt — een mechanisme dat per ontwerp willekeurige tags injecteert,
met een container waarvan de inhoud buiten deze repo wordt beheerd. Zonder CSP is er geen enkele
begrenzing op wat daarlangs in de pagina van de bezoeker draait.

De CSP staat **bewust als `Report-Only`**. Die blokkeert niets en meldt alleen in de console; dat is
de juiste eerste stap, want een te strakke policy breekt de site zonder dat een build of test het
ziet, en er is geen staging. De bronnenlijst is gemeten aan de gebouwde HTML en de componenten:
googletagmanager, google/gstatic voor reCAPTCHA, youtube-nocookie en i.ytimg voor de promo, en de
R2-bucket voor de audio. Fonts staan er niet bij, want `next/font/google` haalt die bij de build
binnen en serveert ze self-hosted — geverifieerd: nul verwijzingen naar `fonts.gstatic.com` in de
uitgeleverde HTML.

De Permissions-Policy sluit camera, microfoon en locatie af. Die stonden open voor elke ingesloten
frame, en de site sluit er twee in.

**Onderweg bleek er iets dat in geen enkel issue staat:** er zit **Cloudflare** vóór Netlify, en
`www.djcylow.com` doet een 301 naar de apex. De `strict-transport-security`-header komt daar
vandaan en niet uit dit bestand — dat is de reden dat het HSTS-voorstel uit #52 hier níet is
uitgevoerd: die header aanpassen in `netlify.toml` raakt niet wat de bezoeker krijgt.

### Significance

#### Tier 0

De config beschrijft nu wat er werkelijk gebeurt in plaats van te leunen op auto-detectie, en de
documentatie in `CLAUDE.md` en `README.md` die de build naar `.next` liet gaan is meegecorrigeerd.

**Score:** 3

#### Tier 1

Twee beveiligingsheaders erbij op de live site, waarvan er één voorlopig alleen meet. De bezoeker
merkt er niets van — dat is precies de bedoeling bij `Report-Only`.

**Score:** 3

### Pull Request

