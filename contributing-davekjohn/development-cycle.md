## Development cycle: `docs/fix-changelog-intro-refs-v1` · 20260827-102710

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
> Relative links in that text resolve FROM THE REPO ROOT, not from this directory:
> write `scripts/x.ps1`, never `../../scripts/x.ps1`.
>
> For tier 1 audiences: management and the employer/commissioner. That reader and nobody else -- what matters only
> inside this repo belongs under the first `**Score:**`. If the change reaches that reader
> not at all, N/A is a complete answer and the common one.
>
> The phase arc, the marks and the whole form: `DEVELOPMENT-portable.md`, which ships
> with this workflow.

### PLAN

### CREATE

- [x] Herstel de twee stale verwijzingen in de vaste intro van `contributing-davekjohn/CHANGELOG.md`
      (boven `## [Unreleased]`, dus buiten elke gefolde entry): `branch/` -> `development-cycle.md`,
      en de linktekst `workflow-davekjohn/releases/README.md` -> `contributing-davekjohn/releases/README.md`
      (de href zelf was al correct)

### TEST

- [x] Visueel geverifieerd tegen `contributing-davekjohn/development-cycle.md` (bestaat) en
      `contributing-davekjohn/releases/README.md` (bestaat); geen gate leest deze intro-tekst (issue #154)

### DEPLOY: `docs/fix-changelog-intro-refs-v1`

Herstelt twee stale verwijzingen in de vaste intro van `contributing-davekjohn/CHANGELOG.md`, blijven
staan sinds de development-cycle.md-migratie (#152, PR #153): "het entry-bestand in `branch/`" wordt
"het entry-bestand `development-cycle.md`", en de linktekst "`workflow-davekjohn/releases/README.md`"
wordt "`contributing-davekjohn/releases/README.md`" (de href zelf, `releases/README.md` relatief, was
al correct). Puur leesbaarheid/nauwkeurigheid, geen gate leest deze tekst. Closes #154.

**Score:** 1 -- cosmetisch, voorkomt dat een lezer van de intro zelf een verkeerd pad of een niet meer
bestaande map aanneemt.

#### What makes this deploy extra special

N/A -- raakt alleen een intro-alinea in de contributiedocumentatie, niet de site.

**Score:** N/A

#### Pull Request

Herstel stale verwijzingen naar branch/ en workflow-davekjohn/ in CHANGELOG-intro

