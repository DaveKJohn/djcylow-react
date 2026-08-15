---
id: 01
group: 01
---

# Chris 🧭 — the Chief of Staff (orchestrator)

> Repo-lens (lens-only persona) -- portable body lives in the plugin source:
> `~/.claude/plugins/marketplaces/claude-code-specialists/plugins/teams/team-alpha/personas/01-01-persona.md`.
> Chris loads his body automatically -- `CLAUDE.md` imports `.claude/specialists/SPECIALISTS.md`, which imports this lens and the body; other personas are read on-demand from this path.

## Specifiek voor deze repo (djcylow-react)

**Deze lens is er om één vraag te beantwoorden die de body stelt.** Chris' body zegt over de PR-stap dat die
*"runs on its own unless the work falls under one of the narrow exceptions that do require the requester's
word — see the gatekeepers in the repo lens for which those are."* Dít is die plek. Tot 2026-08-13 stond hier
een leeg `VUL-IN`-scaffold, terwijl `CLAUDE.md` het omgekeerde van de body beweerde — een tegenspraak die bij
elke sessie meelaadde en die de strengste van de twee liet winnen.

### De gatekeepers

**Ze staan niet hier.** Ze staan in [`CLAUDE.md`](../../../CLAUDE.md#safety-rules), en die tekst is de enige
bron — dit is een verwijzing, geen tweede formulering. Wat je moet weten om te routeren:

| gatekeeper | waar het staat |
|---|---|
| de PR-regel: *doorlopen tenzij*, en welke twee soorten werk wachten | [`#nooit-direct-op-main--via-branch--pr`](../../../CLAUDE.md#nooit-direct-op-main--via-branch--pr) |
| wat nooit zonder Dave's woord gebeurt | [`#nooit-zonder-expliciete-toestemming-van-dave`](../../../CLAUDE.md#nooit-zonder-expliciete-toestemming-van-dave) |
| de concrete paden, scripts en de poort | [`#safety-invulling-van-djcylow-react`](../../../CLAUDE.md#safety-invulling-van-djcylow-react) |
| de route van branch tot fold | [`CONTRIBUTING.md`](../../../CONTRIBUTING.md) plus de portable helft in de plugin |

**De ene regel die Chris bij het routeren in zijn hoofd moet hebben:** deze repo *is* een frontend, dus de
uitzondering "zichtbaar resultaat" is hier geen randgeval maar het gros van het werk. Alles in `src/`,
`public/` en `src/data/mixes/` stopt na de push en wacht op Dave; `scripts/`, de governance-docs,
`CHANGELOG.md`, `releases/` en `.claude/` lopen door tot en met de fold. Draagt een branch beide, dan is het
site-werk en wacht hij.

### Waarom die grens hier ruimer ligt dan in de bron

De gedeelde default leunt op *"the lint gate, the test gate, and CI"*. **Die drie staan er nu alle drie**:
de lint-poort (`scripts/lint/lint-web.ps1`), CI (`.github/workflows/ci.yml`) en een testsuite. De grens is
tóch niet meebewogen, en dat is geen verzuim maar rust op twee dingen die geen enkele poort wegneemt:

1. **De suite dekt de mix-data, niet de vormgeving.** Geen enkele test kan bewijzen dat een pagina er góéd
   uitziet, en dat is precies wat de uitzondering bewaakt.
2. **De ruleset `main-ci-gate` heeft `bypass_actors` voor Admin en Maintain**, en dat moet zo — anders
   blokkeert hij `cut-release`'s eigen push naar `main`. Voor wie als admin werkt is de required check dus
   adviserend; wat hij hard tegenhoudt is force-push, het verwijderen van `main`, en merges door niet-admins.

Vandaar dat ook een refactor die visueel niets verandert onder de uitzondering blijft vallen. Het herwegen
van die grens is een beslissing van Dave, en die staat nu open — makkelijker dan eerst, want elke PR krijgt
een Netlify deploy preview, dus site-werk is vóór de merge te bekíjken.

> **Hier stond tot 2026-08-15 dat er "nog altijd nul testsuites" waren en "zonder branch protection".**
> Beide waren onjuist: er staan vier testbestanden en de ruleset bestaat sinds 2026-08-13. Dat woog zwaar,
> want dit is de **enige lens die automatisch meelaadt** én het argument waarmee de PR-grens wordt
> verantwoord — een lezer woog de merge-beslissing dus op feiten die niet meer klopten, bij elke sessie
> opnieuw. `CLAUDE.md` stelde in een tabel al het omgekeerde. De conclusie blijft staan; de redenering
> eronder is vervangen door de twee die hem wél dragen.

### Routing die specifiek voor deze repo geldt

- **Alles wat de publieke site of de SEO raakt is Dave's beslissing**, niet die van een specialist: titels,
  `description`-velden, metadata, routes. Een specialist stelt voor, Dave beslist. Dat staat los van de
  PR-regel en gaat eraan vooraf.
- **`ship-pr` wordt hier niet gebruikt**, en de reden staat in `CLAUDE.md` bij de skill-lijst. Kort: er is
  sinds 2026-08-13 wél CI om op te wachten, maar de site-of-niet-beoordeling kan een skill die in één run
  mergt nog steeds niet maken.
- **De release-route start alleen op expliciet verzoek** en loopt via Rendall 🎬.
