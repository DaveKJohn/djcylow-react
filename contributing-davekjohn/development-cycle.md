## Development cycle: `config/verwijder-prompts-map-v1` · 20260827-093349

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

- [x] Bevestigd dat `prompts/prompt.md` leeg was (alleen de scaffold-comment, geen echte opdracht) en
  dat het bestand toch al untracked was — er ging niets verloren.

### CREATE

- [x] `git rm` op de drie getrackte bestanden (`prompts/README.md`, `prompts/.gitignore`,
  `prompts/templates/prompt_template.md`) en handmatig verwijderd op schijf (`prompt.md`, untracked).
  De lege mappen zijn met de laatste `git rm` vanzelf verdwenen.
- [x] De vier documentatieplekken die naar `prompts/` verwezen bijgewerkt: root `CLAUDE.md`
  (tabelrij + toelichtende noot), `contributing-davekjohn/CLAUDE.md`, `contributing-davekjohn/README.md`
  — elk met een korte historische noot in plaats van de regel stilzwijgend te laten verdwijnen.

### TEST

- [x] `scripts\lint\lint-web.ps1`: **0 fouten** — 89 statische pagina's, link-checker groen (101
  markdown-bestanden, twee minder dan voor deze branch — precies de twee verwijderde
  `prompts/`-documenten).

### DEPLOY: `config/verwijder-prompts-map-v1`

De prompt-inbox (`contributing-davekjohn/prompts/`) is op Dave's verzoek verwijderd. Ze bestond sinds
2026-08-16 (scaffold van `adopt-workflow-folder`, plugin v4.12.0) en bood een manier om een opdracht in
een editor te schrijven in plaats van in de terminal, opgepikt via `/prompt`. Dat gebruik is nooit
ingeburgerd geraakt; het enige bestand erin (`prompt.md`) droeg nog altijd alleen de scaffold-tekst.

**Score:** 2
<!-- Klein: het is opruimen van een ongebruikte map, niemand werkte er al mee. Niet 1, want het
     scheelt wel drie getrackte bestanden en vier documentatieplekken die anders waren blijven
     verwijzen naar iets dat niet meer bestaat. -->

#### What makes this deploy extra special

N/A — puur interne opruiming, raakt `djcylow.com` niet.

**Score:** N/A

#### Pull Request

Verwijder de prompt-inbox (contributing-davekjohn/prompts/)

