# Changelog

## [Unreleased]

**4 / 14 minor entries** <!-- pending-tally -->

### DEPLOY: feat/179-dev-preview-product · 20261027-202409Z

Every session in this repo now starts the site's own `next dev` as the product card on the plugin's
hub, on 127.0.0.1:3020-3029, and opens the hub in VS Code's Simple Browser instead of the system
browser. The agent-rules block `next dev` writes now lives in `AGENTS.md`, so `CLAUDE.md` stays
imports-only.

**Score:** 3

#### What makes this deploy extra special

Developer tooling only; the website itself does not change.

**Score:** N/A

#### Pull Request

State the Next.js product for the plugin's hub and route its ports to the Simple Browser

[PR #180](https://github.com/DaveKJohn/djcylow-react/pull/180)

---

### DEPLOY: config/enable-dkj-solutions · 20261013-085112Z

This repo enables the `dkj-solutions` extension. Every session here now reads the DKJ-Solutions house style rules: visual work starts from the stylesheet in [DKJ-Solutions/dkj-brandbook](https://github.com/DKJ-Solutions/dkj-brandbook), and a change to the house style itself is filed as an issue there instead of being made in this repo. Nothing renders differently yet.

**Score:** 2

#### What makes this deploy extra special

This app now follows the same look as every other DKJ-Solutions app, and a styling fix to the shared house style lands once, in the brand book, instead of drifting into a local variant.

**Score:** 2

#### Pull Request

Enable dkj-solutions: the house style comes from dkj-brandbook

[PR #177](https://github.com/DKJ-Solutions/djcylow-react/pull/177)

---

### DEPLOY: data/tracklist-green-light-f-20260726 · 20260930-214053Z

De Deep House-mix in Green Light (f), Vol. 4, van 26 juli 2026 heeft nu zijn tracklist: 29 tracks met
tijden, plus Kaskade, Ben Böhmer en Shingo Nakamura als top-artiesten.

**Score:** 2

#### What makes this deploy extra special

Bezoekers van de mixpagina zien nu welke tracks er in de mix zitten, en de artiestnamen worden
doorzoekbaar voor zoekmachines.

**Score:** 2

#### Pull Request

tracklist voor Deep House, Green Light (f), 26 juli 2026

[PR #176](https://github.com/DKJ-Solutions/djcylow-react/pull/176)

---

### DEPLOY: data/mix-green-light-f-deep-house-20260726 · 20260928-194647Z

Nieuwe mix-entry voor de Deep House-mix in Green Light (f), 128 BPM, van 26 juli 2026, met cover en
audio. De live-ratchet gaat van 77 naar 78 mixen. De tracklist ontbreekt nog en volgt later.

**Score:** 2

#### What makes this deploy extra special

Er staat een nieuwe mix op de site: Deep House, Green Light (f), Vol. 4, af te spelen op de Luister-pagina
en met een eigen mixpagina. Nog zonder tracklist.

**Score:** 3

#### Pull Request

nieuwe mix: Deep House, Green Light (f), 26 juli 2026

[PR #175](https://github.com/DKJ-Solutions/djcylow-react/pull/175)

---

### DEPLOY: config/permissies-workflowscripts · 20260928-140321Z

Routinematig `git`-werk (status, diff, log, branch, fetch, pull, add, commit, checkout, merge, push, tag e.d.) en de `gh`-commando's `pr`, `issue`, `run`, `label`, `workflow` en `repo view` vragen niet langer om toestemming, in Bash en in PowerShell. De regels staan in `.claude/settings.json` onder `allow`. De `deny`-lijst gaat voor, dus force-push, `reset --hard`, `rebase` en `rm -rf` blijven geblokkeerd.

**Score:** 2

#### What makes this deploy extra special

N/A -- alleen de werkomgeving van Claude Code verandert; de site niet.

**Score:** N/A

#### Pull Request

git- en gh-routine zonder permissieprompt

[PR #174](https://github.com/DKJ-Solutions/djcylow-react/pull/174)

---

### DEPLOY: config/repo-naar-dkj-solutions · 20260928-140058Z

De repo woont nu onder de organisatie `DKJ-Solutions` in plaats van onder het persoonlijke account `DaveKJohn`. `Get-RepoName` wijst daarom naar `DKJ-Solutions/djcylow-react`, zodat de workflowscripts hun `gh`-aanroepen op het nieuwe adres doen in plaats van op de redirect van GitHub te leunen. Oude links blijven werken dankzij die redirect; historische changelog-regels zijn bewust niet herschreven.

**Score:** 2

#### What makes this deploy extra special

N/A -- de website en wat bezoekers zien veranderen niet; alleen waar de broncode staat.

**Score:** N/A

#### Pull Request

repo verhuisd naar DKJ-Solutions

[PR #173](https://github.com/DKJ-Solutions/djcylow-react/pull/173)

---

### DEPLOY: config/adoptie-afronden · 20260928-133610Z

De adoptie van dkj-policy is af, op Part 3 na, dat wacht op de verhuizing naar DKJ-Solutions. De
beschermde bestanden (`next.config.ts`, `netlify.toml`, `public/images/`) en het verbod op
force-push, `reset --hard`, `rebase` en `gh repo delete` staan weer in `.claude/settings.json`,
na één dag zonder. Zes GitHub-instellingen, waaronder de ruleset `main-ci-gate`, zijn nu verklaard,
zodat een drift gemeld wordt in plaats van onopgemerkt te blijven.

**Score:** 3

#### What makes this deploy extra special

N/A: alleen de werkomgeving en configuratie; `djcylow.com` levert dezelfde pagina's.

**Score:** N/A

#### Pull Request

Adoptie afgerond: bewaakte repo-instellingen, voortgangsbalk, beveiligingsregels terug

[PR #172](https://github.com/DaveKJohn/djcylow-react/pull/172)

---

### DEPLOY: config/adopt-config · 20260928-133000Z

De gedeelde workflow-scripts draaien in deze repo nu op antwoorden die hier gekozen zijn, in plaats
van op fallbacks die niemand koos: de verplichte CI-check (`poort`), de merge-methode, de naam op de
release-pagina (`DJ Cylow`) en de regel voor wanneer een major mag. Part 3 van de adoptie staat bewust
uit tot de repo naar DKJ-Solutions verhuist, omdat de runners daar pas bij `FOLD_PUSH_TOKEN` kunnen.

**Score:** 2

#### What makes this deploy extra special

N/A: alleen configuratie van de werkwijze; `djcylow.com` levert dezelfde pagina's.

**Score:** N/A

#### Pull Request

Adoptie Part 2: de configuratie van dkj-policy

[PR #171](https://github.com/DaveKJohn/djcylow-react/pull/171)

---

### DEPLOY: config/schone-lei · 20260928-132419Z

De oude, repo-eigen Claude-werkwijze is weg: `CLAUDE.md` bevat alleen nog de import van de
dkj-policy-grondwet, `.claude/` alleen de plugin-instellingen, en de root-`README.md` is verwijderd.
De release-historie is bewaard en staat nu in `dkj-policy/`, met het overzicht als
[`releases/history.md`](releases/history.md), zoals bij de andere consumers. De site zelf verandert niet.

**Score:** 4

#### What makes this deploy extra special

N/A: dit raakt alleen hoe er aan de repo gewerkt wordt; `djcylow.com` levert dezelfde pagina's.

**Score:** N/A

#### Pull Request

Schone lei: oude werkwijze weg, plugins opnieuw geïnstalleerd, release-historie naar dkj-policy/

[PR #170](https://github.com/DaveKJohn/djcylow-react/pull/170)

---

### DEPLOY: config/1769-marketplace-hernoemen · 20260910-222602

Deze repo volgt de hernoeming van de marketplace naar `dkj-claude-plugins` en haalt tegelijk twee
gemiste plugin-hernoemingen in: `team-alpha` wordt `dkj-subagents-alpha` en `contributing-davekjohn`
wordt `dkj-policy`. De `@`-importpaden naar de persona's wezen nog naar `plugins/teams/...`, een pad
dat sinds begin augustus niet meer bestaat.

**Score:** 5

#### What makes this deploy extra special

Dat de `@`-import naar een pad wees dat er niet meer is, is het soort fout dat geen foutmelding geeft:
Claude Code laat een dode import stil vallen, en dan leest een orkestrator die nooit laadt als een
modelprobleem in plaats van een padprobleem. Deze branch repareert dat als bijvangst van de hernoeming.

**Score:** 4

#### Pull Request

Marketplace hernoemd naar dkj-claude-plugins

[PR #169](https://github.com/DaveKJohn/djcylow-react/pull/169)

---

### DEPLOY: `docs/workflow-davekjohn-is-weg-v1` · 20260828-213725

`CLAUDE.md` zei over de twee `workflow-davekjohn`-cache-mappen dat alleen de eerste een restant was, en
dat `4.18.0` het *actieve* install-record van de bron-repo `claude-code-specialists` was. Beide onjuist,
en beide na te meten: het pakket bestaat sinds v4.20.0 niet meer — de marketplace-manifest biedt vijf
plugins aan en de oude naam staat er bij geen van de vijf — en de bron-repo was zelf al meegegaan, met
`team-alpha` en `contributing-davekjohn` in `enabledPlugins` en een install-record op 4.21.0. Beide
mappen waren dus restanten.

De passage staat nu op de meting, met de les die het onderscheid draagt: **een install-record bewijst
niet dat het pakket nog bestaat.** Een record in `installed_plugins.json` is een spoor van een install
die eens is gedaan, niet van een pakket dat er nog is — dus check de manifest én `enabledPlugins`. Dat
is een derde as bovenop de twee waarschuwingen die deze sectie al draagt (cache vs. marketplace-clone):
niet welke boom je leest, maar of het pakket dat een record noemt nog bestaat.

Dezelfde bewering stond op twee andere plekken. `contributing-davekjohn/CONTRIBUTING.md` noemde de oude
cache-map een niet-opgeruimde vorige installatie en zette deze repo op 4.20.0 — het eerste is nu
verholpen, het tweede is 4.22.0. En de wachtende entry van PR #166 in `CHANGELOG.md` droeg de onjuiste
meting; die zou de release-note er straks mee publiceren, dus daar staat nu bij dat ze is weerlegd. Wat
het kostte: bij de cache-opruiming van 2026-08-28 is `4.18.0` op grond van deze passage bewust laten
staan.

**Score:** 2

#### What makes this deploy extra special

N/A. Dit raakt geen pagina op `djcylow.com` en geen proces dat de opdrachtgever ziet: het is interne
workflow-documentatie over de plugin-topologie op de machine.

**Score:** N/A

#### Pull Request

een install-record bewijst niet dat het pakket nog bestaat

[PR #168](https://github.com/DaveKJohn/djcylow-react/pull/168)

---

### DEPLOY: `docs/plugin-4-22-en-scriptpaden-v1` · 20260828-211330

Plugin 4.22.0 hernoemde het branch-eigen document van `development-cycle.md` naar `development.md`, en
de gedeelde scripts schrijven sindsdien alleen die nieuwe naam. Deze branch laat de repo-documentatie dat
volgen: 25 verwijzingen in `../CLAUDE.md`, `CONTRIBUTING.md`, de `fold-changelog`-skill, beide
README's en een comment in `../scripts/repo-config.ps1`, plus de drie ankers naar stap 3, die met de
hernoemde kop meeschoven. De zes voorkomens in `releases/` en `CHANGELOG.md` blijven staan -- dat is
historie, en een record wordt niet herschreven.

Twee dingen die geen zoek-vervang zijn. **De PR-template kreeg de canonieke placeholder** in plaats van
een vervangen pad: `open-pr` matcht die regel als hele regel tegen een vaste lijst, en de plain-body
variant bestaat voor `development.md` niet -- een plat zoek-vervang had de regel dus buiten de lijst
geduwd en elke PR-body stil leeg gelaten, precies faalmodus #573. De nieuwe regel is getoetst tegen
`Get-PrTemplateCanonicalPlaceholder` en is er byte-identiek aan. Daarmee wordt de bewering in stap 4 van
`CONTRIBUTING.md` -- dat de template de canonieke placeholder draagt -- ook voor het eerst waar; tot nu toe
droeg hij een variant die alleen *geaccepteerd* was. **En het versieblok in `../CLAUDE.md`** noemt nu
4.22.0 in plaats van 4.20.0, met de update-route erbij: vanuit de consumer en met `--scope project`, want
de default van `claude plugin update` is `--scope user` en die zet een tweede record naast het bestaande.

Drie correcties die bij het nalopen bovenkwamen. `../CLAUDE.md` noemde `workflow-davekjohn/4.18.0` een
niet-opgeruimd restant; die correctie stelde er het *actieve* install-record van de bron-repo tegenover.
**Dat laatste is op 2026-08-28 zelf weerlegd** — het pakket bestond toen al niet meer, dus beide mappen
waren restanten; zie de entry hieronder. Twee scriptpaden
in de `new-branch`-bullet werden als repo-paden gepresenteerd terwijl ze in de plugin wonen -- wie ze hier
in `scripts/` zocht, vond niets. En `../README.md` beschreef een root-`releases/` die sinds 2026-08-27
niet meer bestaat.

**Score:** 3

#### What makes this deploy extra special

N/A. Dit raakt geen enkele pagina op `djcylow.com` en geen enkel proces dat de opdrachtgever ziet: het is
interne workflow-documentatie plus een PR-template. De build levert dezelfde pagina's.

**Score:** N/A

#### Pull Request

De repo-docs volgen plugin 4.22.0: het branch-document heet development.md

[PR #166](https://github.com/DaveKJohn/djcylow-react/pull/166)

---

### DEPLOY: `docs/github-body-is-gegenereerd-v1` · 20260827-151641

De Release Workflow droeg op om een document te schrijven dat het script zelf al had neergezet. Wie stap 5
volgde deed dubbel werk of overschreef de `## What landed`-lijst -- en die is na de cut niet meer te
reconstrueren, want `CHANGELOG.md` is dan geleegd. De aankondiging in `github/` staat nu op alle vijf de
plekken als gegenereerd, met de reden waarom het niet later kan, en stap 5 is omgekeerd naar nalezen voor
de publicatie: het enige moment waarop iemand die body ziet voordat hij publiek is. Onderweg bleek de
kostenraming onder de v2.24.0-tabel dezelfde fout te dragen -- vijf zesde van de tijd werd toegeschreven
aan "stap 4 en 5", terwijl stap 5 in die run nul seconden kostte.

**Score:** 3

#### What makes this deploy extra special

N/A -- dit is de interne routebeschrijving van een release. De opdrachtgever leest de release-documenten,
niet de instructie waarmee ze worden gemaakt, en aan die documenten verandert niets.

**Score:** N/A

#### Pull Request

CLAUDE.md noemt het github/-aankondigingsdocument gegenereerd in plaats van handwerk

[PR #165](https://github.com/DaveKJohn/djcylow-react/pull/165)

---

### DEPLOY: `docs/derde-directe-main-uitzondering-v1` · 20260827-150513

De grondwet kent de derde directe-`main`-uitzondering nu wél: het committen van het handgeschreven
release-document tijdens een cut, mét de begrenzing die hem veilig maakt. Wie een cut draait leest zijn
eigen twee commits niet meer als een overtreding, en wie er een inplant leest een kostenraming die op
de laatste run is gemeten in plaats van op de vorige: 5m 15s bij v2.25.0 tegen 35m 40s bij v2.24.0,
met de PR-leg die dat verschil structureel maakt. De v2.24.0-tabel blijft staan als het record van die
run — er is niets vervangen, er is een meting naast gezet.

**Score:** 4

#### What makes this deploy extra special

Raakt de website, de levering of de opdrachtgever niet: dit is de interne werkwijze van de repo.

**Score:** N/A

#### Pull Request

CLAUDE.md kent de derde directe-main-uitzondering en de gemeten kosten van v2.25.0

[PR #164](https://github.com/DaveKJohn/djcylow-react/pull/164)

---

