## config/1769-marketplace-hernoemen

> **How this file is read.** A step is `- [ ]` until it is resolved -- `- [x]` done, or
> `- [~]` dropped with the reason, which exists so nobody ticks a box for work they did not do.
> open-pr and ship-pr both refuse while one is still open, and there is no `-Force`.
>
> **FOUR `###` HEADINGS, AND NEVER A FIFTH** -- PLAN, CREATE, TEST, DEPLOY are the whole top
> level. A section needing its own heading goes in as a `####` UNDER whichever of the four owns
> it. No gate sees a heading, so this one is on you (Dave, August 26, 2026).
>
> **AND NOTHING BRANCH-SPECIFIC ABOVE `### PLAN`** -- everything between the title and that heading
> is this guidance, which is identical in every branch document. A status line, a note about
> THIS branch or an instruction to a session belongs under one of the four, normally as a `####`
> in PLAN. Same rule, same reason: no gate reads this region (Dave, August 26, 2026).
>
> **DEPLOY takes no steps of its own, and it is WRITTEN LAST** -- it is what the branch DID, once
> TEST says so. Written while steps above it are still open it states an INTENTION, and no gate
> holds it against what landed: the step gate splits this file at that heading and counts only
> above it. The PR title is the one exception -- new-branch -Title writes it at creation, because
> open-pr composes the PR title from it. It is the one part of this file that travels verbatim
> into `CHANGELOG.md` at the merge. In each tier, write the reason
> ABOVE the Score line -- anything below it is discarded.
>
> Relative links in that text resolve FROM THIS DIRECTORY -- `CHANGELOG.md` sits here too, so
> write each path exactly as it reads in this file.
>
> For tier 1 audiences: management and the employer/commissioner. That reader and nobody else -- what matters only
> inside this repo belongs under the first `**Score:**`. If the change reaches that reader
> not at all, N/A is a complete answer and the common one.
>
> The phase arc, the marks and the whole form: `DEVELOPMENT-portable.md`, which ships
> with this workflow.

### PLAN

Fase 2 van [#1769](https://github.com/DKJ-Solutions/claude-code-specialists/issues/1769) in de bron: de
marketplace hernoemt van `claude-code-specialists` naar `dkj-claude-plugins`. Voor een marketplace-naam
bestaat **geen redirect** -- anders dan voor een repo-slug -- dus elke `enabledPlugins`-sleutel hier
breekt op het moment dat de bron flipt. Deze branch zet de eindtoestand klaar en **merget bewust niet**:
dat gebeurt op de gecoordineerde flag day (fase 3), samen met de bron, de slug-rename en een
her-installatie per checkout.

#### Waarom dit meer is dan de naam vervangen

Deze repo loopt twee hernoemingen achter, dus alleen de marketplace-helft vervangen zou ids opleveren die
nooit hebben bestaan:

| stond | wordt | waarom |
|---|---|---|
| `team-alpha@claude-code-specialists` | `dkj-subagents-alpha@dkj-claude-plugins` | #1698, plus zijn voorganger |
| `contributing-davekjohn@claude-code-specialists` | `dkj-policy@dkj-claude-plugins` | #1437 |
| `plugins/teams/team-alpha/personas/` | `plugins/dkj-subagents/dkj-subagents-alpha/personas/` | de boom ging op 3 augustus 2026 een niveau omhoog |
| `DaveKJohn/claude-code-specialists` | `DKJ-Solutions/dkj-claude-plugins` | de org-transfer van 2 september, plus de slug-rename |

De eindtoestand is hetzelfde of je nu per hernoeming migreert of in een keer, en geen enkele lezer heeft
iets aan de tussenstand. Dus schrijft deze branch direct de eindtoestand.

#### Deze branch is gebouwd uit een tijdelijke kloon

Deze repo staat niet uitgecheckt op de machine waar de rest van fase 2 is gebouwd. Omdat hij publiek is,
is hij daar tijdelijk gekloond, is deze branch erin gemaakt en gepusht, en is de kloon daarna verwijderd.
Voor de bestanden maakt dat niets uit -- voor de **machinekant wel**: het install-record hangt per machine
aan het mappad van de echte checkout, en die is hier nooit gezien. Wat op de flag day op die machine moet
gebeuren (marketplace verwijderen en opnieuw toevoegen, oude ids deinstalleren, nieuwe installeren) kan
alleen daar, en staat niet in deze branch.

#### Wat bewust NIET verandert

- **Gedateerde registraties houden de naam waarmee ze zijn geschreven.** Het blok in `CLAUDE.md` over
  `workflow-davekjohn` (met de correctie van 2026-08-28 erin) beschrijft wat er op die dag is gemeten;
  dat hernoemen zou de meting onwaar maken. Idem alle `.../issues/NNN`-verwijzingen.
- `contributing-davekjohn/` blijft heten zoals het heet: de mapnaam is een seam in
  `scripts/repo-config.ps1`, dus de plugin-id-rename dwingt hem niet.
- `contributing-davekjohn/releases/**` en `CHANGELOG.md`: de historische carve-out.

### CREATE

- [x] `.claude/settings.json`: de twee plugin-ids, de marketplace-sleutel en de bron-repo
- [x] `.claude/specialists/SPECIALISTS.md` + 19 lenzen: het `@`-importpad en de plugin-naam in de kop
- [x] `CLAUDE.md`: de padtabel cache-vs-marketplace en de bronverwijzingen; het gedateerde blok
      ongemoeid gelaten
- [x] `contributing-davekjohn/CONTRIBUTING.md`: de twee portable-half-paden en de inbound-link
- [x] `scripts/repo-config.ps1` en `scripts/task/shared.ps1`: de bronverwijzing, de blueprint-herkomst
      en de cache-root; de drie gedateerde issue-citaten ongemoeid
- [x] `.github/workflows/ci.yml`: de bronnaam in de toelichting
- [x] Controle: wat er nog aan oude namen staat is uitsluitend gedateerd of een issue-URL
- [x] NIET MERGEN voor de flag day (fase 3) -- **voldaan: de flag day is 10-11 september 2026.** De
      bron-PR is gemerged, `v5.0.0` is gecut en getagd en de GitHub Release is gepubliceerd, dus
      `dkj-claude-plugins` is nu de naam die de marketplace draagt. Wat hierna nog moet en niet vanuit
      de bron kan: de her-installatie op de machine waar deze repo staat, want een install-record hangt
      aan het mappad. Tussen deze merge en die her-installatie laadt deze repo stil niets -- er is geen
      redirect op een marketplace-naam zoals er wel een op een repo-slug is.

### TEST

Er zijn in deze repo geen PowerShell-suites om te draaien. Wat wel is gecontroleerd: een repo-brede grep
na afloop, waarbij elke resterende treffer stuk voor stuk is nagelopen en in precies een van de twee
carve-outs valt. De persona-bestanden waarnaar de nieuwe paden wijzen bestaan onder dezelfde naam in de
marketplace-clone.

Wat hier **niet** te testen valt, en dat is inherent aan fase 2: de nieuwe marketplace bestaat pas op de
flag day, dus niets wat een plugin-pad oplost kan voor die dag slagen. In de twee BWJ-repo's is dat
gemeten -- negen suites vallen daar om precies deze reden, en slagen wel op `main`.

### DEPLOY: config/1769-marketplace-hernoemen

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

