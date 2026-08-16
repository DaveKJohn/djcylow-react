# `workflow-davekjohn/` -- the workflow's own folder in this repo

Everything portable about the `workflow-davekjohn` workflow gathers here, so the workflow occupies
one folder in this repo's root instead of scattering through it. The conventions themselves travel
with the plugin as four portable pages -- `CONTRIBUTING-portable.md`, `BRANCH-portable.md`,
`RELEASES-portable.md` and `TICKETWORK-portable.md`, readable in your plugin install or in the
source repo -- and each page in this folder is this repo's own set of answers to them.

| here | what it holds |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | the working rules a Claude session needs in this folder |
| [`branch/`](branch/) | the branch dossier: the entry, the step list, the generated templates |
| [`prompts/`](prompts/) | the prompt inbox: an assignment written in an editor instead of the terminal |
| [`releases/`](releases/) | the release history and the published audience notes |

Scaffolded by the `adopt-workflow-folder` skill on August 16, 2026; strictly additive, so everything
here past the VUL-IN markers is this repo's own writing.

## Two ways this repo differs from the scaffold

**There is no `CONTRIBUTING.md` in this folder, deliberately.** The scaffold places one, on the
assumption that a repo's root page describes a plugin-free workflow and the folder page layers the
plugin's answers on top. This repo has no such split: its root
[`CONTRIBUTING.md`](../CONTRIBUTING.md) already *is* the local half of `CONTRIBUTING-portable.md`,
and it is what `CLAUDE.md` points at throughout. A second page here would have been the same subject
described twice -- the exact failure that retired the old `workflow/` directory. The root page also
stays where GitHub looks for it, which a page in this folder would not.

**Only `audience/` moved into `releases/` here.** The generated development notes and the GitHub
announcements stayed at the repo root, because `cut-release.ps1` hardcodes those two roots relative
to the repo root (lines 728 and 820) while only the audience root and the history file are seams.
The source states this model outright in `Get-RelativeLinkPath`: *"a consumer's history lives at
`workflow-davekjohn/releases/README.md` while the generated development notes stay at the repo
root."* So `releases/` at the root is not a leftover -- it is where the next cut will write.
