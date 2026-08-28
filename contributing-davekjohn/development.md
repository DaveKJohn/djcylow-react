## Development: `docs/workflow-davekjohn-is-weg-v1` · 20260828-213306

> **How this file is read.** A step is `- [ ]` until it is resolved -- `- [x]` done, or
> `- [~]` dropped with the reason, which exists so nobody ticks a box for work they did not do.
> open-pr and ship-pr both refuse while one is still open, and there is no `-Force`.
>
> **FOUR `###` HEADINGS, AND NEVER A FIFTH** -- PLAN, CREATE, TEST, DEPLOY are the whole top
> level. A section needing its own heading goes in as a `####` UNDER whichever of the four owns
> it. No gate sees a heading, so this one is on you (Dave, August 26, 2026).
>
> **AND NOTHING BRANCH-SPECIFIC ABOVE `### PLAN

Issue #167: de passage in `CLAUDE.md` onder **Scripts** noemt `workflow-davekjohn/4.18.0` het actieve
install-record van de bron-repo, en dus geen restant. Beide beweringen zijn onjuist. Meten vóór
schrijven, en de hele tree nalopen op dezelfde bewering — `CLAUDE.md` laadt elke sessie mee, dus dit is
een onjuistheid die iedere sessie meeneemt.

### CREATE

- [x] De drie metingen uit het issue narekenen: marketplace-manifest, cache-mappen, `installed_plugins.json`,
      plus `enabledPlugins` en het install-record van de bron-repo
- [x] De passage in `CLAUDE.md` (sectie **Scripts**) herschrijven: het pakket bestaat niet meer, beide
      mappen waren restanten, de bron-repo zit sinds 2026-08-27 op `contributing-davekjohn`
- [x] De les erbij zetten die het onderscheid draagt: een install-record bewijst niet dat het pakket nog
      bestaat — check de manifest én `enabledPlugins`, niet alleen `installed_plugins.json`
- [x] De tree nalopen op dezelfde bewering elders: `contributing-davekjohn/CONTRIBUTING.md` (verouderd op
      twee punten) en de wachtende entry in `contributing-davekjohn/CHANGELOG.md` (publiceert de
      onjuistheid straks in de release-note)
- [~] `.claude/handover.md` noemt de oude naam ook, maar als gestempelde momentopname van 2026-08-16 —
      juist voor zijn stempel, dus niet aangeraakt

### TEST

- [x] De lint-poort (`scripts/lint/lint-web.ps1`) groen, inclusief de link- en anker-check over alle
      markdown — deze branch voegt één interne link toe naar `../CLAUDE.md#scripts`
- [x] De testsuite groen

### DEPLOY: `docs/workflow-davekjohn-is-weg-v1`

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
