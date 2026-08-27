# `contributing-davekjohn/` -- the workflow's own folder in this repo

Everything portable about this workflow gathers here, so it occupies one folder in this repo's root
instead of scattering through it. The conventions themselves travel with the plugin as portable pages
-- `CONTRIBUTING-portable.md`, `DEVELOPMENT-portable.md`, `RELEASES-portable.md` and
`TICKETWORK-portable.md`, readable in your plugin install or in the source repo -- and each page in
this folder is this repo's own set of answers to them.

| here | what it holds |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | the working rules a Claude session needs in this folder |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | this repo's answers to the contribution cycle -- the layer that wins over the root page |
| `development-cycle.md` | the branch's own document -- the plan and the changelog entry, both sections of one file; exists only while a branch is open, so it is absent here on the trunk |
| [`releases/`](releases/) | the release history and the published audience notes |

Scaffolded by the `adopt-workflow-folder` skill on August 16, 2026; strictly additive, so everything
here past the VUL-IN markers is this repo's own writing.

## Two ways this repo differs from the scaffold

**Only `audience/` moved into `releases/` here.** The generated development notes and the GitHub
announcements stayed at the repo root, because `cut-release.ps1` hardcodes those two roots relative
to the repo root (lines 728 and 820) while only the audience root and the history file are seams.
The source states this model outright in `Get-RelativeLinkPath`: *"a consumer's history lives at
`contributing-davekjohn/releases/README.md` while the generated development notes stay at the repo
root."* So `releases/` at the root is not a leftover -- it is where the next cut will write.

**This repo keeps its own two-layer `CONTRIBUTING.md` split rather than the scaffold's one-page
model.** `adopt-workflow-folder.ps1` (v4.20.0) now scaffolds a single `CONTRIBUTING.md` here that
sits on top of both the repo's root `CONTRIBUTING.md` and its root `CLAUDE.md` -- but the script is
strictly additive and never overwrote what was already here. This repo split its cycle documentation
into a thin root page (the standard way of working, readable without the plugin) and this folder's
own page (the plugin layer, which wins on conflict) on 2026-08-16, deliberately, on Dave's word. That
decision stands; see [`../CONTRIBUTING.md`](../CONTRIBUTING.md) for the reasoning and
[`CONTRIBUTING.md`](CONTRIBUTING.md) for this layer's own note about it.

## The folder's own rename

**This folder was `workflow-davekjohn/` until 2026-08-27.** The plugin itself renamed its package
from `workflow-davekjohn` to `contributing-davekjohn` in v4.20.0 (#886), and `Get-BranchFilePaths` in
the shared scripts hardcodes `development-cycle.md`'s location under the new name -- not a seam, so
a consumer meets the rename through a plugin update rather than by choosing to. This repo's own copy
of that folder followed suit the same day, via `git mv`, carrying every file's history with it.

## `prompts/` existed here, briefly

The scaffold's prompt inbox (`prompts/prompt.md`) landed on 2026-08-16 and was removed on Dave's
request the same day as the folder rename, 2026-08-27: writing an assignment into an editor file for
`/prompt` to pick up never replaced typing it into the terminal. Nothing else in this folder depended
on it.
