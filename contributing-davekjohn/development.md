## Development: `docs/plugin-4-22-en-scriptpaden-v1` · 20260828-210010

> **How this file is read.** A step is `- [ ]` until it is resolved -- `- [x]` done, or
> `- [~]` dropped with the reason, which exists so nobody ticks a box for work they did not do.
> open-pr and ship-pr both refuse while one is still open, and there is no `-Force`.
>
> **FOUR `###` HEADINGS, AND NEVER A FIFTH** -- PLAN, CREATE, TEST, DEPLOY are the whole top
> level. A section needing its own heading goes in as a `####` UNDER whichever of the four owns
> it. No gate sees a heading, so this one is on you (Dave, August 26, 2026).
>
> **AND NOTHING BRANCH-SPECIFIC ABOVE `### PLAN

#### Waar dit vandaan komt

Dave: "update plugins to 4.22". De connector-check bij de sessiestart meldde dat de machine-records
voor deze repo op 4.20.0 stonden terwijl de bron op 4.22.0 zit. De update zelf is machinewerk en staat
niet in deze branch; wat hier in zit is de repo-zijdige adoptie ervan.

De 4.22-release hernoemt het branch-eigen document van `development-cycle.md` naar `development.md`
(bron-issue #963/#958, hernoemd op 2026-08-27). Net als bij de mapverhuizing van 4.20.0 migreert de
plugin de repo-documentatie niet en waarschuwt er ook niet voor. Gemeten: 27 verwijzingen naar het oude
pad in de levende docs, plus 6 in `releases/` en `CHANGELOG.md` die historie zijn en dus blijven staan.

- [x] Meten welke bestanden het oude pad noemen, en per voorkomen bepalen of het een levende bewering
      of historie is
- [x] Nakijken of er iets functioneel stukgaat door de hernoeming (antwoord: nee -- `Get-BranchFilePaths`
      leest de oude naam als `PriorNameFile`, en de PR-template stond nog in de placeholder-lijst)

### CREATE

- [x] Het documentpad bijwerken in de zes levende docs: `../CLAUDE.md` (8x), `CONTRIBUTING.md` (7x),
      `../.claude/skills/fold-changelog/SKILL.md` (5x), `README.md` (3x), `../README.md` (1x) en de
      comment in `../scripts/repo-config.ps1` (1x)
- [x] De drie ankerverwijzingen naar stap 3 meeverhuizen, want de kop van die stap noemt het bestand
- [x] `../.github/pull_request_template.md`: de **canonieke** placeholder overnemen in plaats van het
      pad te vervangen -- een plat zoek-vervang had de regel buiten de lijst geduwd
- [x] `../CLAUDE.md`: het versieblok bijwerken naar 4.22.0, met de update-route erbij
- [x] `../CLAUDE.md`: de hernoeming zelf documenteren als noot bij het documentmodel
- [x] `../CLAUDE.md`: twee scriptpaden die als repo-paden gepresenteerd werden bij de plugin plaatsen
- [x] `../README.md`: de niet-bestaande root-`releases/` uit het boomdiagram halen
- [~] Cache-mappen opruimen -- geweigerd bij de permissie-prompt, dus niet gedaan; het is machinewerk
      en hoort ook niet in een branch

### TEST

- [x] De nieuwe template-regel toetsen tegen `Get-PrTemplateCanonicalPlaceholder` en
      `Get-PrDescriptionPlaceholderDefaults` uit de plugin: identiek aan de canonieke, en staat in de lijst
- [x] De contract-check van 4.22.0 draaien: 0 errors, 14 info-signalen (alle optioneel, computed default)
- [x] De poort draaien -- `../scripts/lint/lint-web.ps1`, inclusief de link- en anker-check die de drie
      verhuisde ankers moet goedkeuren
- [x] `npm test`

### DEPLOY: `docs/plugin-4-22-en-scriptpaden-v1`

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
niet-opgeruimd restant; nagemeten is dat het *actieve* install-record van de bron-repo. Twee scriptpaden
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
