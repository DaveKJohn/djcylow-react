## fix/186-source-branch-prefixes

> **How this file is read.** A step is `- [ ]` until it is resolved -- `- [x]` done, or
> `- [~]` dropped with the reason, which exists so nobody ticks a box for work they did not do.
> open-pr and ship-pr both refuse while one is still open, and there is no `-Force`.
>
> **FOUR `###` HEADINGS, AND NEVER A FIFTH** -- PLAN, CREATE, TEST, DEPLOY are the whole top
> level. A section needing its own heading goes in as a `####` UNDER whichever of the four owns
> it. No gate in YOUR repo reads a heading, so this half is on you -- only the repo that authors
> this workflow refuses a fifth (Dave, August 26, 2026).
>
> **AND NOTHING BRANCH-SPECIFIC ABOVE THE FIRST OF THOSE FOUR HEADINGS** -- everything between the
> title and it is this guidance, which is identical in every branch document. A status line, a note about
> THIS branch or an instruction to a session belongs under one of the four, normally as a `####`
> in PLAN. THIS half open-pr refuses, in every repo, before the push -- it reads the shape, so a
> guidance block in your own language passes and your own paragraph here does not (Dave,
> August 26, 2026; refused since #1650).
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
> For tier 1 audiences: management and the employer/commissioner -- this repo is a means of selling or delivering something else. That reader and nobody else -- what matters only
> inside this repo belongs under the first `**Score:**`. If the change reaches that reader
> not at all, N/A is a complete answer and the common one. **One hop and no further:** where that
> reader is itself a business, ITS own customers sit one hop past this repo and are never the reader
> here -- they take nothing this repo ships. Name the party that runs the upgrade, and score
> against them.
>
> The phase arc, the marks and the whole form: `DEVELOPMENT-portable.md`, which ships
> with this workflow.

### PLAN

- [x] Adopt the source's branch-prefix table (DKJ-Solutions/dkj-marketplace#3886, merged as PR #3892): feat/ -> `feature`, fix/ -> `bug`, docs/ -> no label, chore/ refused. Supersedes #185 (the enhancement -> feature label move).

#### Entry retype mapping

None needed. The pending entries under `## [Unreleased]` are all in the DEPLOY format, which declares no type: the only trace of the old table is the branch name in each heading (`config/...` x8, `data/...` x2, `docs/...` x4, `feat/...` x2). Those branch names are history and stay as written; nothing groups a DEPLOY entry by type, so no entry is stranded under a retired type. Had they carried one, the mapping would have been Config/Data/Content/Style/Feature -> Feat, Docs -> Docs.

### CREATE

- [x] `scripts/lib/branch-info.ps1`: the prefix table, `$script:BranchTypeOrder`, `Get-BranchTypes`, `Get-BranchPrefix`, `Get-BranchInfo` and `Test-BranchName` replaced byte-for-byte with the source's; the header now says it follows the source table (#3886) and is English.
- [x] `scripts/repo-config.ps1`: the comment above the branch-info dot-source no longer describes the eight-type table as current.
- [x] Docs and rules naming the old prefixes or `enhancement`: none outside branch-info.ps1 (grepped `.claude/`, `.github/`, `CLAUDE.md`, `AGENTS.md`, `scripts/`, `tests/`).
- [x] Label `feature` already exists on the tracker; `enhancement` kept.

### TEST

- [x] The lib parses and loads, alone and via `repo-config.ps1`: `Get-BranchTypes` = Feat, Fix, Docs, Chore; `fix/x` -> bug/Fix; `docs/x` -> no label/Docs; `chore/x` refused; `config/x` unknown. Pure ASCII.
- [~] No repo test suite covers branch-info.ps1 (the tests under `tests/` are the site's vitest suite), so there is nothing of this repo's own to run beyond the lint gate open-pr runs.

### DEPLOY: fix/186-source-branch-prefixes

This repo's branches now use the same prefixes as every DKJ repo: `feat/` (label `feature`), `fix/` (`bug`) and `docs/` (no label), with `chore/` refused, because the branch table is now the source's (DKJ-Solutions/dkj-marketplace#3886). The old prefixes `feature/`, `data/`, `content/`, `style/` and `config/`, and the `enhancement`/`documentation` labels they set, are gone; a data or config change is now a `feat/` branch.

**Score:** 2

#### What makes this deploy extra special

N/A -- workflow tooling only; the website does not change.

**Score:** N/A

#### Pull Request

Use the source's branch prefixes
