## feat/179-dev-preview-product

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

This repo's row in DKJ-Solutions/dkj-claude-plugins#3464 (roll the plugin's hub out to every DKJ
repo): state the Next.js product and route the hub's ports, so the hub opens in VS Code's Simple
Browser and a later hub change arrives with a plugin update alone.

### CREATE

- [x] `Get-DevPreview` in `scripts/repo-config.ps1`: `next dev` on 127.0.0.1, ports 3020-3029 (the
      port map in #3464), `Requires = 'node_modules'`, `OpenInVsCode`; no `Name`, no `OwnHub`
- [x] `.vscode/settings.json`: route 4890-4899 (hub) and 3020-3029 (product) to `simpleBrowser.open`
- [x] `AGENTS.md`: holds the agent-rules block `next dev` writes when it detects an agent, so it no
      longer lands in `CLAUDE.md` (which stays imports-only); Next writes to `AGENTS.md` once it exists

### TEST

- [x] The dev-preview hook run by hand: `Hub: http://localhost:4898/ (opened in VS Code) -- product:
      http://localhost:3020/ (started)`
- [x] `http://localhost:3020/` answers 200, and the hub's home page links the product on 3020
- [x] `hasCurrentAgentRules` reads true with the block in `AGENTS.md`, and `CLAUDE.md` is unchanged

### DEPLOY: feat/179-dev-preview-product

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

