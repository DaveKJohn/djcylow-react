# Releases

**How a release works.** A release is not a deploy but a **recorded moment**: a git tag that marks the
state of the marketplace, with all plugin versions in lockstep. This page carries both halves: the
**process** — the tier model, what a release must earn, the release documents, and how one is cut — and,
under the repo heading at the end, the **full list of releases** actually cut. The release block in
[`CHANGELOG.md`](../../CHANGELOG.md) points here for everything but the current version.

[`scripts/release/cut-release.ps1`](https://github.com/DaveKJohn/claude-code-specialists/blob/main/scripts/release/cut-release.ps1)
itself publishes nothing to GitHub Releases — that is a separate, manual closing step. Releases are cut
**only on the repo owner's explicit request**; see [Cutting a release](#cutting-a-release) below for the
full mechanics. Each release bumps every plugin's `version` in lockstep, and that number in
`.claude-plugin/plugin.json` is what tells a consumer which release they are on.

## The tier model

**One scale, used twice.** A change declares how far it reaches, and that number decides two things: which
document — and, where the document has more than one reader, which section of it — the change appears in,
and, together with its significance score, where within that section it sits.

| tier | who notices | where it is written | when |
|---|---|---|---|
| **2** | subscribers of the service | the *For consumers* section of `audience/<dir>/<X.Y.Z>.md` | minor/major |
| **1** | management and the employer/commissioner | the organisation's two sections of that same file | minor/major |
| **0** | only this repo's own developers | `development/<dir>/<X.Y.Z>.md` | every release |

**Tiers 1 and 2 are two KINDS of audience, and this repo has exactly one of them** (Dave, August 12, 2026;
inbound [#620](https://github.com/DaveKJohn/claude-code-specialists/issues/620)). They are not two rungs of a
ladder. Tier 1 is management and whoever commissions or pays for the work — the audience of a repo that
*delivers* something, or that sells a **product** whose buyers never read a release note. Tier 2 is the
subscriber of a **service**, who decides whether to upgrade. A repo answers one of them, once, in
`Get-ReleaseAudienceTier`, before any entry is written; **this repo answers 2**, being a service rather than
a product. `new-branch.ps1` then scaffolds tier 0 plus that tier alone, and `open-pr.ps1` and
`cut-release.ps1` ask for that tier rather than every rung from 1 up.

**A repo that has stated nothing is asked about all three**, exactly as before the knob existed — an
unstated seam means unchanged, never "switch the audience tier off". The loud channel is the script
contract, where this is a `decide` record that `adopt-config` puts to the repo rather than answering for it.

**The tier a repo no longer asks about is still read.** `Get-EntryTierMax` stays 2 and every validator keeps
using it: the maximum says which tier numbers are valid to *parse* — 97 entries in this repo's record were
written under the cumulative ladder — while the audience says which are *asked*. An extra answered tier is
accepted, never refused, so no finished dossier became unopenable on the day the knob landed.

**`CHANGELOG.md` has no sections to file into** (Dave, August 5, 2026). It is an intro followed by one `##`
per change, ranked furthest-reach-first and, within a tier, highest-significance-first — so what the three
`## Tier N - Pull Requests` sections used to say visually is now the ordering, and each entry states its own
reach in the `### Significance` section it carries, one `#### Tier N` sub-section per reach it claims. The
**fold** is the only moment that order can be decided, because the cut empties the list: whatever order it
leaves is what the release documents inherit, with nothing re-estimated days later.

**The cumulative ladder is gone, and the measurement is why.** Until August 12, 2026 a tier-2 entry *owed* a
tier-1 section, on the reasoning that something a consumer notices is something a colleague should hear
about too. That reasoning holds for a repo with two genuine audiences and produces nothing but duplication
for the far more common repo with one. Measured over the 97 scored entries in this repo's record: **81 top
out at tier 2 and only 8 at tier 1**, so 81 of the 89 tier-1 sections existed only because a scored tier-2
section sat above them — the same reach argued twice, in a second register, for a reader who here is the
same person. The reporting consumer measured the mirror image on its own side: 37 open entries, 15 at tier
1, zero ever at tier 2. The development note still carries everything, tier 0 included, because it is the
record rather than a summary of one.

**Counting per entry, not in aggregate, is what produced that answer.** In aggregate tier 1 looks like a
working axis here — 89 of 95 scored entries carry one — and that number argues *against* this change. It is
an artefact of the ladder that required them.

**Where the number comes from: the author of the entry, on the branch.** `new-branch.ps1` writes the
`#### Tier N` sub-sections this repo asks about with their scores left empty; whoever finishes the branch
answers each one, with a score or with `N/A` and the reason it reaches nobody there. **The reach is the highest tier carrying a
number**, so an `N/A` costs a sentence and keeps the reasoning behind a negative claim in the record.
`open-pr.ps1` refuses an entry whose description, body or any tier's reason is still blank, and
`fold-changelog-entry.ps1` folds the entry **verbatim** — so the declaration lives in exactly one place, the
entry itself, and no second definition of the format sits inside the fold.

**The older `Tier: N` line is still read and is deliberately not stripped.** Every entry written before
August 6, 2026 — here and in every consumer's tree — carries it instead of the sub-sections, and a parser
that only knew the new shape would read all of them as tier 0: silent, correct-looking, and wrong in the
direction that empties a release. Recognise both, write one.

**Deliberately not derived from the branch prefix**, which this repo has measured does not predict impact:
held against the 19 entries pending at v3.2.0, the single most consequential change for a consumer —
renaming the marketplace, which breaks every existing install — arrived on a `chore/` branch.

### What a release must earn

`cut-release.ps1` refuses a bump the pending entries have not earned. Three rules, all checked before
anything is written:

| bump | requires |
|---|---|
| **patch** | nothing — a release made entirely of tier-0 work is what a patch is for |
| **minor** | at least one entry of **tier 1 or higher** |
| **major** | at least **10 minors** cut in the current major line, on top of the general minimum |

**Why a tier-0-only release is a patch rather than a refusal** (Dave, August 7, 2026). It used to be refused
outright, on the grounds that such a release "has nobody to announce it to" — and the answer is that
announcing nothing is exactly what a patch is for. The version number still moves, the tag still marks the
moment, and the one document that gets written is the record.

**Why a minor needs tier 1 rather than tier 2.** It demanded a tier-2 entry until August 7, 2026, so work a
colleague on this project got something out of earned only a patch — while the version here speaks to all
stakeholders, not to consumers alone. The rule is written as **tier 1 or higher** rather than as "the
audience tier" on purpose: it then reads correctly in a tier-1 repo and a tier-2 repo alike, without either
having to translate it. What keeps the looser rule honest is that **the sections follow the tier and not the
bump**: a minor whose highest pending entry is tier 1 writes the note without its *For consumers* section,
so nobody outside is handed a section about work they cannot see.

**Why a major counts minors rather than pending work:** a major is a **recap** of the minors before it,
which is what both of this repo's majors actually were (`v2.0.0` consolidated v1.0–v1.18, `v3.0.0`
consolidated v2.2.0–v2.16.0). So a pending tier-2 entry is deliberately *not* required; the accumulation is.
The count is read off the current version's minor component — within major 3 the minors are 3.1 … 3.10, so
the component *is* the count.

`-SkipTierGate` overrules all three. It is deliberately separate from `-SkipLint`, because it overrules a
judgement about **content** rather than skipping a tool — folding them into one flag would let someone
skipping a slow lint run also, silently, cut a minor with nothing in it for a consumer.

**The gate switches itself off where no pending entry declared its impact at all**, and that is what makes it
safe to share: a repo that never adopted the model is untouched rather than refused at every cut.

**The signal is a count of declarations, not a count of sections**, and the difference is not academic. The
test used to be "does this repo declare more than one changelog section", which had a real basis while the
tier headings existed and became a landmine the moment they went: a flat changelog gives an unadopted repo
and an adopting one exactly one group each, so the old line would have read **every** repo as not adopting
and switched the gate off in silence — in the same change that made the tier the model's primary fact.
Nothing would have errored. Counting declarations keeps "declared tier 0" distinct from "declared nothing",
which is the whole difference between a release with nobody to announce itself to and a repo that never
chose the model.

## The release documents

Which directory scheme groups them — `<X>.x` per major or `<X.Y>` per minor — is answered once by
`Get-ReleaseNotesGrouping` in [`scripts/repo-config.ps1`](../../scripts/repo-config.ps1), so `<dir>` below
stands for whichever this repo uses.

| document | for whom | when | generated by |
|---|---|---|---|
| `development/<dir>/<X.Y.Z>.md` | developers — the full per-PR record, auto-complete | every release | `cut-release.ps1` |
| `audience/<dir>/<X.Y.Z>.md` | whoever this repo publishes to — one hand-written note with a named section per reader | minor/major, where a pending entry earns one | drafted by `cut-release.ps1`, written by hand |
| `github/<dir>/<X.Y.Z>.md` | whoever opens the GitHub Releases page | every release | `cut-release.ps1` |

**Every root under `releases/` names its READER, and `audience/` was the last one that did not** (Dave,
August 12, 2026). It was `notes/`, which names the form rather than the reader — the same mistake
`highlights/` made, and one this repo had already fixed in that sibling two days earlier without noticing it
in this one. `development/` names the developers, `github/` names the page, `audience/` names whoever the
repo publishes to, whichever of the two audience tiers that is. The root is stated in `Get-ReleaseNoteRoot`;
**the shared default is deliberately still `releases/notes`**, so a consumer who never answered the knob is
not silently pointed at a directory they do not have.

**`consumer/` and `internal/` are gone, and the twelve pairs in them are now twelve documents in
`audience/`** (Dave, August 12, 2026). They had been written up as *frozen archives* of the two-document
era — a freeze nobody had actually decided, recorded in three places and attributed to no one, while the
`notes/` → `audience/` rename standing beside it in the same entry was Dave's. Asked directly, he chose the
merge: `releases/` holds three reader-named roots and nothing else.

**The identical filenames are why this was a merge rather than a rename.** `3.x/3.2.0.md` existed in both
trees, so 24 documents became 12 and no `git mv` could do it. Each pair kept both registers intact — the
consumer body under *For consumers*, the organisational prose under *What it is worth* and *What was still
open at this release* — and dropped exactly one thing: the internal note's `## What is different now`, which
the 62/38 measurement above identifies as the duplicated half. The prose of a published record was otherwise
left as written, so a merged document may still name `releases/highlights/` or describe itself as one of
three tiers; that is what it said on the day it went out.

**A patch writes no hand-written note at all**, and is announced by the generated GitHub Release body alone
(see [Cutting a release](#cutting-a-release)). The **sections** inside the note follow the tier; **whether
the note exists at all** follows the bump.

### Tier 0 - development

**Raw and complete, and the only document nobody writes.** Every changelog entry as it was written, nothing
rewritten — literally the whole changelog, generated in full by `cut-release.ps1` at every release. It is
the per-PR record a developer goes back to, which is why it is never edited down: a summary of it is what
the hand-written note is for.

**It is the one document that still groups by tier**, and that is a difference from `CHANGELOG.md` rather
than a copy of it: `## Tier <n> - <audience>` first, then that tier's entries as a flat ranked list in the
order the fold left them. The changelog dropped its tier headings in the same change that made the entry
declare its own reach; this document keeps them because it carries all three tiers at once and is the only
place a reader needs them separated.

Each entry arrives whole, exactly as it was folded — its `###` heading naming the **branch**, and beneath it
the same six `####` sections the scaffolder writes: `Branch title`, `Branch ID`, `Branch type`, `What does
the change on this branch bring to main?`, `Significance` and `Pull Request`, one heading level deeper than
in `CHANGELOG.md`. Nothing is rewritten and nothing is cut, which is what "the record" means. There are no
branch-type categories in between — the grouping came from the branch prefix, which this repo measured does
not predict impact. Tier 0 is in it, unlike in the hand-written note below.

Its size is also why it is never the body of a GitHub Release but always an attachment: `gh`'s
release-notes body has a hard **125,000-character** limit, which a full notes file can exceed.

### The audience tier - the hand-written note

**One document since August 10, 2026, with a named section per reader** (Dave). It replaced two separate
documents — an internal note for the organisation and a consumer document — and at all twelve releases
since the internal tier existed, **both were written, about the same changes**. Measured before merging
them: one release's internal note (962 words) held against test 2 of the writing norm in the
[cut-release skill](https://github.com/DaveKJohn/claude-code-specialists/blob/main/plugins/workflows/workflow-davekjohn/skills/cut-release/SKILL.md)
(*does this describe our effort or their outcome*) gave:

| | words | |
|---|---|---|
| could appear in a consumer-facing section | ~365 (38%) | and **did**, rewritten in a second register in the other document — that is the duplication |
| could not | ~597 (62%) | including *what it is worth* (316 words), which is not an outlier but the entire reason the organisational sections exist |

So a **blended** document was refused, since it would have had to drop the 62% or break the writing norm; a
**sectioned** one keeps each register intact and writes the shared 38% once. The heading *"what is different
now"* is gone rather than moved — it **was** the duplicated half, and the *For consumers* section is what
replaced it.

`cut-release.ps1` drafts a note under `Get-ReleaseNoteRoot` — `releases/audience/<dir>/<X.Y.Z>.md` here —
for every bump `Get-ReleaseConsumerBumps` names. Three sections, in this order:

| section | for whom | how it arrives |
|---|---|---|
| *For consumers* | whoever decides whether to update | **pre-filled** — the tier-2 entries, still in the words their authors wrote for a diff reviewer. Absent where no entry reached tier 2. |
| *What it is worth* | the organisation | **empty** — it cannot be generated. Think in time, risk and reduced dependence on a developer. |
| *What was still open at this release* | the organisation | **empty**, and past tense on purpose: a published document does not move with reality, so a present-tense line goes stale in hours rather than months. |

**A minor with no tier-2 entry gets the note with no *For consumers* section** — which is every minor in a
repo whose audience is tier 1, and an occasional one here. The organisational two sections belong to every
bump the seam names — the version moves for everyone, so the organisation's question is always answered —
while a section about work no consumer can see would be worse than none, because it looks written.

**Still a draft to be edited, and the reason never depended on the selection.** Entry bodies are written for
whoever reviews the diff, even when the change reaches a consumer — so the *For consumers* section's
*selection* is right and its *prose* still needs rewriting from the reader's end. What is gone is the
deleting, not the writing.

**It is published output, not an internal file.** Where the bump wrote one, the note is uploaded as an
attachment to the GitHub Release (the release body itself is generated separately — see
[Cutting a release](#cutting-a-release)), which has a consequence worth stating: anything the *What was
still open* section phrases as a *live* claim goes stale in place within hours of publishing. Write it as
"open at the time of this release", not as a statement about now.

> **The "remove before publishing" marker was retired on August 5, 2026**, together with its two seam knobs
> (`Get-ReleaseHighlightsStakeholderTypes`, `Get-ReleaseHighlightsWording`). It existed because the generator
> had to guess from branch prefixes which entries a consumer cares about, so it wrote out both halves and
> left the release manager to cut one — explicitly a *proposal*, since the prefix
> [measurably does not predict impact here](#measured-instances-behind-the-portable-rules). The tier asks the
> entry's author instead, at the moment they know. Do not reintroduce a category-based split beside it: that
> is the guess this replaced.

**`new-internal-note.ps1` is still shipped and still works**, for a repo running the two-document flow — a
separate organisational note alongside a separate consumer document. Nothing in this repo's chain calls it
any more; it is documented here rather than dropped, because a consumer receives a plugin update rather than
choosing one, and deleting a working entry point is a breaking change.

### Where the hand-written note lands

**It goes through a branch + PR.** `cut-release.ps1` commits and tags in one motion, so by the time you edit
the note draft, the release commit is already tagged. It is not one of the two named direct-on-`main`
exceptions, so it travels the normal reviewed route. The alternative — widening the release exception to
cover the written note as well — was offered and declined: an exception is only safe while it stays the size
it was granted at.

## Cutting a release

A release is a **captured moment**: all plugins get the same version number (**lockstep, repo-wide**) and
the state is tagged as `vX.Y.Z`. `cut-release.ps1` produces only a git tag, the full notes here in
`development/`, and a reference to them in [`CHANGELOG.md`](../../CHANGELOG.md). A release is cut **only on the
owner's explicit request** and deliberately does **not** go through a branch + PR: like the fold commit, the
release commit is a permitted direct-on-`main` action (the second exception to "everything via branch + PR"
— see [`CONTRIBUTING.md`](../CONTRIBUTING.md)).

In one motion, on a clean `main`:
[`scripts/release/cut-release.ps1`](https://github.com/DaveKJohn/claude-code-specialists/blob/main/scripts/release/cut-release.ps1)`(-Version <X.Y.Z> | -Bump <major|minor|patch>) [-Title "…"]`

1. bumps all `plugin.json` versions in lockstep to `X.Y.Z`;
2. generates the full release notes in `development/<dir>/<X.Y.Z>.md` (from the folded entries, grouped by
   tier and, within a tier, a flat list in the ranked order the fold left), adds a row to the release list at
   the end of this page, and **empties `CHANGELOG.md` down to its intro** — that intro passes through
   verbatim, so whatever the repo says about itself up there survives every cut. A cut writes no release
   block: the section that used to hold one had grown to 434 of the changelog's 1,062 lines across 72 blocks
   each saying no more than "see the notes", while this page already listed all 72 with a date, a type and a
   title. What replaced it is the intro's own one-line pointer to this page;
3. **(retired, August 8, 2026)** step 3 used to append, per plugin, the entries that touched it to a
   **per-plugin `CHANGELOG.md`** and regenerate that plugin's **`RELEASE.md`** card. Both were built to
   give a consumer a history inside the plugin cache — and measured against how a consumer actually
   receives this repo, they were a second copy of something already in reach: the marketplace source is
   a git clone of the WHOLE repository, so `CHANGELOG.md` and this entire `releases/` tree sit at
   `~/.claude/plugins/marketplaces/<marketplace>/`. Ten files, 11,684 lines, free to disagree with the
   original — which is exactly what lint checks 9 and 17 existed to police. One repository, one product,
   one changelog. The `Plugins:` line survives: the release notes still read it;
4. commits that directly on `main` (`release: vX.Y.Z`) and sets an annotated tag `vX.Y.Z`;
5. pushes `main` + the tag (unless `-NoPush` for inspection first).

**Closing step, after the script and after the hand-written note has merged, where the bump wrote one:
publish a GitHub Release.** Not run by `cut-release.ps1` and not automated; the release manager walks
through the
[`cut-release` skill](https://github.com/DaveKJohn/claude-code-specialists/blob/main/plugins/workflows/workflow-davekjohn/skills/cut-release/SKILL.md)'s
checklist: `gh release create` with the **generated body** (`--notes-file` pointing at the
`releases/github/<dir>/<X.Y.Z>.md` the cut already wrote — nothing to edit), then `gh release upload` with
the full development notes **and the hand-written note, where the bump generated one**. Never inline the
development notes — see [Tier 0 - development](#tier-0---development) for the character limit that makes
that fail.

**Upload the attachments under unique filenames.** Every document a release produces shares the basename
`<X.Y.Z>.md`, so uploading two of them straight from `releases/` collides — the second upload returns
`HTTP 404`. `gh`'s `file#label` syntax does not solve it (it sets the label, not the name). Copy them to
`vX.Y.Z-development-notes.md` and `vX.Y.Z-notes-for-users.md` and upload the copies.

**It comes last on the checklist, and the reason has outlived one rewrite already.** The body used to be a
hand-written document merged via its own branch + PR, so publishing straight after the tag would have had no
body to publish. The body is generated by the cut itself now, so that particular impossibility is gone — but
publishing early would still publish a page whose attachments are missing the hand-written note and whose
pointer line names a document nobody can download yet.

**And it needs no separate approval** (Dave, August 5, 2026). Cutting the release is the act that is asked
for; publishing its Release is the last step of that same procedure, so stopping to ask there is a rubber
stamp. Once a cut has been requested, the whole run goes through in one motion — generate, ship the
hand-written note, publish. **The boundary that remains is the live stage**, where a repo has one: that is
Block 2 of the checklist, a different act with a different audience, and this approval covers Block 1. A
repo wanting a different boundary states that in its own lens rather than softening this paragraph.

Guardrails: a clean `main`, no unfolded entry files, **[the bump earned by the pending
tiers](#what-a-release-must-earn)** (`-SkipTierGate` overrules), lint gate green, tag doesn't exist yet. All
of them run **before the first file is written**, deliberately: failing after the notes file exists would
leave a release half-cut on `main`.

**The lint gate is *your* repo's, read from `Get-LintScript` — the same seam `open-pr` uses.** This route
needs its own gate precisely because it does not travel via a PR, so nothing else on it ever meets that
copy. Until August 5, 2026 the cut resolved the gate by a fixed path to the script the *source* repo
happens to carry, which meant every consumer release ran with no gate at all and said so in a warning
(inbound [#464](https://github.com/DaveKJohn/claude-code-specialists/issues/464)). **A gate the seam names
but the tree does not have is a hard stop**, not a warning: skipping it is `-SkipLint`, and that choice
belongs in the command rather than in output that scrolls past.

The pure logic (version bump, CHANGELOG transformation, notes construction, and the bump rules in
`Test-ReleaseBumpEarned`) lives in
[`scripts/lib/release-lib.ps1`](https://github.com/DaveKJohn/claude-code-specialists/blob/main/scripts/lib/release-lib.ps1)
and is covered by
[`scripts/tests/release-lib.tests.ps1`](https://github.com/DaveKJohn/claude-code-specialists/blob/main/scripts/tests/release-lib.tests.ps1).
The tier line's own format — writing it, validating it, and the section map it selects — lives in
[`scripts/lib/entry-scaffold-lib.ps1`](https://github.com/DaveKJohn/claude-code-specialists/blob/main/scripts/lib/entry-scaffold-lib.ps1),
shared with the three scripts that must not disagree about it.

---

**Everything above this line travels to any repo that runs this release workflow. Everything below it does
not.** What follows is this repo's own answer to the choices the page leaves open — the seam values, the
decisions behind them, the measured instances, and the release list itself.

## djcylow-react

### How this page mirrors the source

> **Everything above the horizontal rule is copied verbatim from
> [the source's `releases/README.md`](https://github.com/DaveKJohn/claude-code-specialists/blob/main/releases/README.md)**,
> and is kept that way on purpose (Dave, August 13, 2026). The two pages describe one shared model, and the
> only way they stay comparable at a glance is if the shared half is the *same words*. This page carried a
> full **Dutch translation** of that material — a step further from the source than a paraphrase, because a
> translation cannot even be diffed against it. The translation is gone.

**This directory is in English; the rest of the repo is Dutch** (Dave, August 13, 2026). That is a deliberate
exception to the language rule in [`CLAUDE.md`](../../CLAUDE.md#taal), and it is the price of the mirror: the
portable half is only portable while it is the source's own text. Everything else stays Dutch — the
governance docs, `CONTRIBUTING.md`, the changelog entries and the commit messages. So do the release
documents already written; see [the release list](#the-release-list) for why those are history rather than
backlog.

**Do not edit above the rule.** A correction there goes to the source as an
[`inbound` issue](https://github.com/DaveKJohn/claude-code-specialists/issues) and comes back with a plugin
release, which is what keeps every consumer's copy in step. Fixing it here instead re-creates exactly the
drift this mirror was made to end — and this repo has already paid for that lesson once, in a local
`cut-release.ps1` copy that had to be deleted because every upstream improvement needed porting by hand.

**Two mechanical edits were made on the way, and only two.** Both are about *paths*, never about words.

**The first: links out of this tree were made absolute.** Links to files that live in the **source repo or
the plugin install** — `cut-release.ps1`, `release-lib.ps1`, `release-lib.tests.ps1`,
`entry-scaffold-lib.ps1`, the `cut-release` skill — became absolute GitHub URLs, because relative paths
to them are dead in this tree. The visible link text is unchanged. Note the reason this repo has for it,
which is **not** the one a repo with a docs linter has: the gate here is
[`scripts/lint/lint-web.ps1`](../../scripts/lint/lint-web.ps1) — `tsc --noEmit`, `eslint .` plus
`npm run build` — and it reads no markdown at all. A dead link in this file therefore fails nothing and
would simply have stayed wrong.

**The second: every link into this repo gained a `../`** (August 16, 2026). The source keeps this page at
`releases/README.md`, one level below its root, so `../CHANGELOG.md` resolves there. Plugin **v4.12.0**
moved a consumer's copy to `workflow-davekjohn/releases/README.md`, one level deeper — and at that moment
all ten of those links pointed one directory short. They are `../../` here, and that is not drift: keeping
them identical to the source would have meant keeping them **broken**, which is the opposite of what the
mirror is for. The shared text means *this repo's `CHANGELOG.md`* by `../CHANGELOG.md`; `../../CHANGELOG.md`
is what that sentence means from where the page now sits.

> **This is worth an `inbound` issue, and it is a defect in the source rather than in this copy.** The
> source prescribes the move for consumers — `Get-RelativeLinkPath` in `release-lib.ps1` exists purely to
> build the history-table row across exactly this extra level — but the page's own hand-written links were
> not given the same treatment. Every consumer who follows the prescribed layout inherits ten dead links,
> and none of them will notice: a consumer's gate reads no markdown either. The fix belongs upstream, so
> the next release hands every consumer working links instead of each of them repairing the same ten.

**The three roots are no longer siblings here, and the text above still reads as if they are.** Above the
rule, `development/<dir>/`, `audience/<dir>/` and `github/<dir>/` are written as three directories beside
this page — true in the source, where all four sit in one `releases/`. Since August 16, 2026 only
`audience/` sits beside this page; `development/` and `github/` are at
[`releases/`](../../releases/) in the repo root:

| root | where | why |
|---|---|---|
| `workflow-davekjohn/releases/README.md` | here | `Get-ReleaseHistoryPath` points at it |
| `workflow-davekjohn/releases/audience/` | here | `Get-ReleaseNoteRoot` points at it |
| `releases/development/` | repo root | hardcoded in `cut-release.ps1` (line 728) |
| `releases/github/` | repo root | hardcoded in `cut-release.ps1` (line 820) |

**This split is the source's own model, not a compromise.** `Get-RelativeLinkPath` says it outright: *"a
consumer's history lives at `workflow-davekjohn/releases/README.md` while the generated development notes
stay at the repo root."* Only two of the four roots are seams, so only those two could move; the other two
would have been re-created at the root by the next cut, leaving two trees where there had been one. Both
were in fact moved and then moved back during the v4.12.0 upgrade, once lines 728 and 820 were read rather
than assumed. **The text above the rule is left alone** — it describes the source's layout correctly, and
this note is the repo-specific answer that belongs on this side of the rule.

**One sentence above the rule is wrong about a file of ours, and it is worth naming precisely because the
link is live.** The intro says *"the release block in `CHANGELOG.md` points here for everything but the
current version"*. There is no release block here: a cut used to write a `## Releases` section into that
file and it was abolished on August 11, 2026, so this page is the **only** set of books — including for the
current version, which is the top row of [the release list](#the-release-list). What is true is the
direction: `CHANGELOG.md` does point here, in one line of its intro. Everything else the shared text says
about that file holds exactly — no sections to file into, one `##` per change, emptied down to its intro by
the cut.

**Read "this repo" above the rule as the source repo.** The portable half carries the source's own
measurements as the evidence for its rules — 97 scored entries, `v3.2.0`'s pending entries, a 962-word
internal note, the `chore/` branch that broke every install — and those were counted there, not here. The
same goes for everything it says about **plugins**: the lockstep version bump, `.claude-plugin/plugin.json`,
the retired per-plugin changelogs. This repo is a website and publishes no plugins, so none of that runs
here — see the seam values below for what happens instead.

> **The three paragraphs above are a bridge, and they are meant to be dismantled.** They exist only because
> the portable half is not yet as portable as it claims at its own dividing line. That is already reported
> upstream as [inbound #643](https://github.com/DaveKJohn/claude-code-specialists/issues/643), filed from
> `life-hub`, which asks for the plugin lockstep to be stated conditionally against `Get-ReleasePluginTier`,
> for the links to be absolutised at the source, and for "this repo" above the rule to be defined once. Two
> of the three paragraphs are covered by exactly that, and they need no second report from here — a duplicate
> would compete with the fix rather than add to it.
>
> **The `CHANGELOG.md` sentence is a fourth point that #643 does not cover**, and it is the sharpest of the
> four: the others describe the source's own repo, but that one makes a claim about a file the *consumer*
> owns, behind a relative link that resolves. So it reads as being about you while being true only there. It
> is filed as evidence inside
> [inbound #646](https://github.com/DaveKJohn/claude-code-specialists/issues/646) rather than as its own
> issue, because it argues that issue's point: a sentence like that stays invisible while the text is copied
> by hand and becomes obvious the moment the text has to stand on its own.
>
> **#646 is the one that would remove this whole section**, and it is the deeper of the two. It asks the
> source for a **`RELEASES-portable.md`** in the plugin, next to `CONTRIBUTING-portable.md` and
> `TICKETWORK-portable.md`, so the shared half travels with the plugin instead of being hand-copied into
> every consumer — the way `CONTRIBUTING.md` already works here. The verbatim mirror above is the best
> available answer *today*, not the intended end state: it is correct now and manual forever. Note what a
> split cannot do, though, and why this page keeps existing either way: the release list lives here and
> `release-lib.ps1` writes rows into it, so a consumer's `releases/README.md` is never merely a link.

### Seam values in force here

All of them in [`scripts/repo-config.ps1`](../../scripts/repo-config.ps1):

| seam | value here | what it means |
|---|---|---|
| `Get-ReleaseAudienceTier` | `1` | Dave is the commissioner, not a subscriber — see [What tier 1 means here](#what-tier-1-means-here) |
| `Get-ReleaseNoteRoot` | `releases/audience` | the shared default is `releases/notes`, so this repo has to answer it, and did |
| `Get-ReleaseConsumerBumps` | `('minor','major')` | which bumps get a hand-written document at all |
| `Get-ReleaseNotesGrouping` | `major` | one directory per major line: `<X>.x` |
| `Get-ReleaseHistoryPath` | `releases/README.md` | this page — which is why the release list lives at the end of it |
| `Get-LintScript` | `scripts\lint\lint-web.ps1` | `tsc --noEmit` + `npm run build`, the gate the release route runs here |
| `Get-LiveStage` | *(empty)* | **not because there is no live site** — see below |
| `Get-ReleaseNoteWording` | `@{}` | empty means English, which is now the deliberate answer rather than an oversight |
| `Get-InternalNoteWording` | `@{}` | same, and a dead knob besides — see below |

**Five blueprint questions are deliberately left unanswered**, each because the shared script's documented
fallback is the better answer: `Get-EntrySignificanceEnabled`, `Get-EntrySignificanceRubricLevels`,
`Get-ReleasePluginTier`, `Get-PrMergeMethod` and `Get-ReleaseMajorMinMinors`. The reasoning per seam is
written out in `repo-config.ps1` itself and is not repeated here. **Do not count that list by hand:**
`check-script-contract.ps1` reports every undeclared optional function as `[INFO]`, and that number is the
only reliable one — a hand-written tally has been wrong here before, twice in the same file.

**`Get-ReleasePluginTier` is undeclared, and that is an answer rather than a gap.** It is the one seam with
a *computed* fallback: the script checks whether `.claude-plugin/marketplace.json` exists, and it does not,
so "no plugin layer" already falls out of a real measurement. A stub would overwrite that measurement with a
value that checks nothing. The consequence for the route: **step 1 of [Cutting a release](#cutting-a-release)
— the lockstep `plugin.json` bump — does not run here**, and the current version is read from the newest
`vX.Y.Z` tag instead. Nothing in this repo states a version except its tags.

**`Get-LiveStage` is empty, and the reason is the opposite of the obvious one.** This repo has a very real
live target: Netlify builds and publishes on every push to `main`, and `gh pr merge` writes there
server-side, so **a merge is a deploy**. The seam is empty because the deploy has already happened long
before a release is cut — by the time the tag goes on, every change in it has been on `djcylow.com` since
its own PR merged. There is no go-live step *after* the cut, which is exactly what the seam asks about. A
cut here adds a version number, three documents and a tag to what is already running.

**`Get-InternalNoteWording` is a dead knob**, recorded by name because a dead knob is reported by no check.
It is read only by `new-internal-note.ps1` — the **retired two-document flow**, where an internal note and a
consumer document were written separately. This repo runs the one-document model the portable half
describes, so nothing invokes it. `cut-release.ps1` reads `Get-ReleaseNoteWording` first and only falls back
to this map, and both are `@{}` here, so it currently makes no difference either way.

**Both wording seams being empty means the generated documents are English** — `# Release notes`,
`**Date:**`, `## Tier 0 - developers` — while the 37 existing development documents are Dutch. Until today
that was a defect, and a branch was queued to fix it by filling the seams in Dutch. **The language decision
above inverts that plan:** this directory is English, so empty seams are now the correct answer and that
branch would move the page away from the source. What survives of the point is narrower and still real: the
`SectionOpen` key is not cosmetic, because `session-status.ps1` looks up the open-work section through it
and a Dutch heading would be invisible to `/continue`. With English headings that lookup works by default.

### What tier 1 means here

**Dave is the commissioner, and there is no subscriber** (Dave, August 13, 2026). This repo *delivers* a
website; it does not run a service anybody subscribes to. Visitors to `djcylow.com` are not an audience in
the tier-2 sense — they never decide whether to come along with an upgrade, they simply get the new site on
their next visit, and they do not read release notes. The tier question is about the **kind** of
relationship, not the number of readers.

Two tiers are asked about, not three:

| tier | who it is | how often it is `N/A` |
|---|---|---|
| `0` | whoever maintains this repo | **never** — every change reaches them at least a little |
| `1` | Dave as the **commissioner** of the site | only where the change genuinely does not touch what he is owed |

**Tier 2 is not asked** — there is no upgrade decision for anyone to make.

*Which changes reach tier 1.* Anything Dave gets **as the owner of the site**: a new mix, a new page, the
styling, the copy, the mix metadata, anything touching SEO or the public routes. Repo machinery — scripts,
gates, the governance docs, the release route itself — reaches him **as a maintainer** and stays at tier 0.
That distinction is the whole content of the question, so it is worth making deliberately rather than by
habit.

*Why it matters beyond one document.* **The bump follows the highest tier pending.** A release carrying a
tier-1 entry earns a **minor**; a release of nothing but repo machinery is a **patch**. The audience tier is
therefore not a labelling exercise — it sets the release cadence. It also decides the shape of the
hand-written document: with the audience at tier 1 **every** minor here is written without its *for
consumers* section, and what remains are the two organisational sections.

> **The definition is moving at the source, so this section points rather than restates.**
> [Inbound #640](https://github.com/DaveKJohn/claude-code-specialists/issues/640) records that the
> pre-August-12 tier definition still stands in every string the shared scripts actually show a human — the
> `new-branch` tier table, the entry templates, `open-pr`'s refusal message — while the current definition
> lives only in source comments. That table calls tier 1 *"a colleague working on this project gets
> something out of it"*, which is not what it means any more. **This repo's own answer holds under both
> readings** — the commissioner is tier 1 either way, so nothing written here has to be revised. Worth
> knowing while reading a scaffolded entry, not a reason to re-derive the model locally.

### Local decisions

**The shared `cut-release` script writes these documents; the audience one is then rewritten by hand.**
Rendall 🎬 owns that rewrite. The steps are in [`CLAUDE.md`](../../CLAUDE.md) under **Release Workflow**.

> **Settled on August 13, 2026 (evening), and this page carried the wrong claim twice over.** It first said
> the `cut-release` skill is *"expressly a checklist that executes nothing"*; a dry run refuted that, and the
> corrected note then said the route would be pulled onto the script in a branch called
> `docs/release-route-naar-script`, "together with the release-branch exception it makes redundant".
>
> **That has happened, and it went further than the note predicted.** Reading the script rather than
> dry-running it showed it also runs `git push origin main` and `git push origin vX.Y.Z` — the dry run hid
> that behind `-NoPush` — and that it stages with `git add -A`. On Dave's word the repo moved to the script
> instead of the other way round: the **release-branch is abolished**, exception 2 in the safety rules is now
> the release commit itself (as in the source), and the fifteen manual steps are reduced to what the script
> does not do. `v2.23.0` was the last release cut by hand.

**This repo answers audience tier 1, not 2 — and the mirrored half above says otherwise.** Under *The tier
model* the text reads *"**this repo answers 2**, being a service rather than a product"*. That sentence is
copied verbatim from the source, where "this repo" **is** the source: a marketplace whose subscribers decide
whether to upgrade. Here `Get-ReleaseAudienceTier` returns **1**, because djcylow.com is a delivered product
whose listeners never read a release note — the commissioner is the reader. Verify it in
[`scripts/repo-config.ps1`](../../scripts/repo-config.ps1), not on this page.

> **This is the cost of a verbatim mirror, written down rather than patched.** The rule for everything above
> the horizontal rule is that it stays the source's own text, so a correction goes to the source as an
> `inbound` issue instead of being fixed here — that rule is what keeps the two diffable. But a mirrored
> sentence containing the words *"this repo"* stops being true the moment it is mirrored, and no diff can
> catch that: both copies are byte-identical and one of them is wrong. Established August 13, 2026 (evening),
> when Dave settled the release route as *"exactly as the source does it, only with a Tier 1 audience"*.
> A candidate `inbound`: have the source phrase its own answer as *"the source repo answers 2"*, so the
> sentence survives being copied.

**`3.0.0` is reserved for a full redesign.** The React version of the site started at `2.0.0` — a framework
migration from the previous stack — and `MAJOR` stays at `2` for now. That is Dave's decision, not an
outcome of the ten-minor rule, and it is why this line has reached `2.23` without a major.

> **The ten-minor default has a trap waiting one major further on**, worth writing down while it is
> harmless. `Get-ReleaseMajorMinMinors` is undeclared and therefore `10`, and the gate counts minors *within
> the current major*. At `2.23` that clears easily. Right after a `v3.0.0` the counter is zero, and the
> default would then hold a `v4.0.0` back for ten minors — which contradicts this repo's own model, where a
> major is a redesign or a framework migration rather than a recap of ten minors. Not a problem now, and not
> a problem at the next major; a problem at the one after that.

**Anything touching the public site or SEO is Dave's decision**, and that carries into what a release may
contain: titles, `description` fields, metadata and routes. A specialist proposes, Dave decides.

**The document model of the 23 existing `audience/` documents is still the old one:** one register, readable
Dutch without jargon, no sections per reader. Measured on August 13, 2026, all 23 use type-based headings
(`Features` / `Fixes` / `Docs aanpassingen`), the two youngest use reader-facing ones, and **none** has an
open-work section — the form `CLAUDE.md` step 6 prescribes. The directory structure has matched the source
since August 13, 2026; the document model has not, and that revision is deliberately left open as this
repo's own work (Dave, August 13, 2026). Published documents are not rewritten, so it only affects the next
one.

**`github/` is still empty, and that is correct.** The directory is new as of August 13, 2026 and the first
announcement belongs to the next release; older releases get none retroactively, because an announcement for
a moment that has already passed is not something to invent. Until then an existing Release keeps the body
it had. This root deliberately has no seam — it is hardcoded in `cut-release.ps1`, because a new root has no
existing placement to accommodate.

> **The directories were named `<X.Y>/` until August 13, 2026** — `development/2.22/2.22.0.md` rather than
> `development/2.x/2.22.0.md` — read off a tree with 23 of them, which was a valid answer since the portable
> half deliberately leaves `<dir>` open to both. All 60 documents (37 in `development/`, 23 in `audience/`)
> moved with `git mv` when Dave asked for `releases/` to be made exactly like the source, and **not one
> letter of their text was changed**. The same day, `releases/highlights/` became `releases/audience/`: the
> old name said how the document was written rather than who it was for, which is the very mistake the
> source had repaired in its own `notes/` a day earlier. Where an older note's own text still says
> `releases/highlights/`, that is what it said on the day it went out.

### What this page keeps in addition

The two sections below are not in the source and are a deliberate addition of this repo. They sit under the
rule rather than above it, because they do not travel with the workflow.

#### Git tags & rollback

A git tag is a **fixed, named reference to one specific commit**. The difference from a branch is what makes
it usable as a release anchor:

- A **branch** (like `main`) **moves along**: every new commit pushes `main` forward.
- A **tag** (like `v2.3.0`) **stands still**: it points at the same commit forever, whatever happens after.
  So `v2.3.0` remains exactly the state that went live back then, even though `main` is dozens of commits
  further on.

```
commits:   A --- B --- C --- D --- E   ← main (moves along, to the right)
                 ↑           ↑
              v2.1.0      v2.3.0        (stay where they are)
```

For releases we always use **annotated** tags (an object with author, date and message) rather than
*lightweight* ones (a name only) — you want to know when and why a version was set:

```sh
git tag -a v2.3.0 <commit> -m "v2.3.0 - UX MODUS (donker/licht mode)"
```

> When pushing, an annotated tag shows up twice in the remote list, e.g. `v2.3.0` and `v2.3.0^{}`. That is
> not a duplicate: the first is the tag object (carrying the message), the second (`^{}`) is the commit that
> tag ultimately points at.

```sh
git tag -n1                # list all tags with their message
git show v2.3.0            # inspect the tag + that commit's changes
git checkout v2.3.0        # put the working tree exactly on that release (rollback / inspection)
git checkout main          # back to the present
```

`git checkout v2.3.0` leaves you in "detached HEAD" — looking at the past without sitting on a branch. Fine
for inspecting, or for starting a hotfix branch from that point; go back afterwards with `git checkout main`.

**Note:** an ordinary `git push` does **not** carry tags. Push a release tag separately with
`git push origin v2.3.0` (one tag) or `git push origin --tags` (all not yet pushed).

#### What gets which version number

We follow [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`. The portable rules above say what
a bump must *earn*; this table says which kind of work in this repo *is* which bump.

| part | example | when to raise it |
|---|---|---|
| **MAJOR** | `2.x` → `3.0.0` | Sweeping rebuild or redesign (an entirely new layout, or a framework migration) |
| **MINOR** | `2.0` → `2.1.0` | New feature, backwards-compatible (a new page, a new component, a new mix, content updates) |
| **PATCH** | `2.1.0` → `2.1.1` | Bugfix, docs, workflow, hotfix or a small styling correction |

**This table and the portable bump gate can disagree, and the gate wins.** The table calls docs work a
patch, which is right about the *kind* of work; the gate asks a different question — whether any pending
entry reaches tier 1 — and a docs branch that reaches the commissioner earns a minor by that measure.
Reconciling the two wordings is queued with the release-route branch above.

### Measured instances behind the portable rules

- **The `← LIVE` marker was wrong here for months** — it sat on v2.20.1 while v2.20.2, v2.21.0 and five
  merged PRs were already live. That is the instance behind "one set of books, and it is this page": a cut
  used to write a `## Releases` block into `CHANGELOG.md` as well, carrying the same information but poorer,
  and the duplicate is what let it rot unnoticed.
- **`Get-ReleaseNoteRoot` exists because this repo asked for it.** Up to and including the source's `v4.4.0`,
  `releases/notes/` was hardcoded in `cut-release.ps1`, which made the audience layer here unreachable.
  Reported through the inbound route
  ([#616](https://github.com/DaveKJohn/claude-code-specialists/issues/616)) and repaired at the source.
- **A hardcoded path can go wrong silently, measured here at plugin 4.5.0.** The row in this page and the
  audience note's directory came out of a hardcoded `notes/`, while `Get-ReleaseNoteRoot` says
  `releases/audience`. Had a minor been cut on that version, it would have written a **dead row** into this
  page plus a stray `releases/notes/2.x/`, and nothing would have failed. Both are repaired in 4.7.0 — which
  is the instance behind writing the route against the *active* version rather than the one an audit once ran
  on.
- **The attachment-filename collision is predicted here and measured at the source** — there at `v3.3.0`,
  where the second upload returned `HTTP 422` on `…&name=3.3.0.md`. This repo has not yet cut a release with
  two attachments, so that rule stands on somebody else's measurement.
- **A translated mirror cannot be checked, and this page is the instance.** The portable half was Dutch
  until today, so no diff could tell a deliberate local change from an upstream correction that had never
  arrived — and three of its claims had gone stale unnoticed, including one that a dry run had already
  refuted. That is the argument for verbatim, and it was paid for here rather than borrowed.

### The release list

**Every release ever cut, newest first, grouped by major version.** This is the **full record**:
[`CHANGELOG.md`](../../CHANGELOG.md) keeps only what is live but has no version number yet, and points here
for the rest. **Which version the site currently runs is the top row below.**

**The version cell points at the most readable document that release has** — the hand-written document where
the bump wrote one, the development record on a patch.

New releases are added to the current major's table, the top one. That is why **opening a new major's
section is a deliberate act, taken before the release is cut**: the inserter puts the row after the first
release table it finds, so without a section for the new major a `v3.0.0` row would be filed under `2.x`
without anything failing.

Three things about the structure below are load-bearing rather than stylistic, and all three are why this
list sits at the **end** of the page:

- **The inserter takes the first release table in the whole document**, so any table introduced above these
  would silently start receiving the rows. That is the one thing to check when adding a section anywhere on
  this page — the ones already above are safe because none of them carries the release table's column
  header.
- **The guardrail reads the last `<n>.x` heading above that table**, so those headings must stay
  recognisable. The heading **level** may change — `###` and `####` are both accepted, because how deeply
  the list is nested is a layout choice the repo owns — but the `<n>.x` text is not decoration.
- **The table header is described in prose and quoted nowhere else on this page**, because the inserter
  matches that exact line and a document explaining the pattern should not be one edit away from triggering
  it. It is English for the same reason the six section headings of an entry are: a machine-read key, not
  prose.

#### 2.x

| Version | Date | Type | Title |
|---|---|---|---|
| [2.24.0](audience/2.x/2.24.0.md) | 2026-08-15 | Minor | The audit backlog cleared: live site fixes, gates that really block, and docs that match the machinery |
| [2.23.0](audience/2.x/2.23.0.md) | 2026-08-13 | Minor | De werkwijze gelijk aan de bron, een poort die altijd draait, en schone Spotify-titels |
| [2.22.0](audience/2.x/2.22.0.md) | 2026-07-26 | Minor | Spotify-velden, datums hersteld, en de documentatie gelijk aan de praktijk |
| [2.21.0](audience/2.x/2.21.0.md) | 2026-07-25 | Minor | Alle mixtitels naar één uniek formaat, plus workflow- en toolingherstel |
| [2.20.2](../../releases/development/2.x/2.20.2.md) | 2026-07-25 | Patch | Mix-titels met hoofdletter, genrefilter-fix en workflow-aanscherpingen |
| [2.20.1](../../releases/development/2.x/2.20.1.md) | 2026-07-02 | Patch | Workflow-herstructurering: PR's, per-branch changelog, releases/development+highlights |
| [2.20.0](audience/2.x/2.20.0.md) | 2026-07-02 | Minor | Luister-genrefilters uitgebreid, URL-sync en changelog opgeschoond |
| [2.19.2](../../releases/development/2.x/2.19.2.md) | 2026-06-28 | Patch | Orange Full (m) subgenre gecorrigeerd |
| [2.19.1](../../releases/development/2.x/2.19.1.md) | 2026-06-28 | Patch | robots.txt en sitemap.xml static export fix |
| [2.19.0](audience/2.x/2.19.0.md) | 2026-06-28 | Minor | NL/EN descriptions, image rename, mix-detailpagina verbeteringen |
| [2.18.0](audience/2.x/2.18.0.md) | 2026-06-27 | Minor | SEO/GEO verbeteringen, top_artists & subgenre backfill |
| [2.17.0](audience/2.x/2.17.0.md) | 2026-06-27 | Minor | GA4 + GTM analytics — view_mix dataLayer event |
| [2.16.4](../../releases/development/2.x/2.16.4.md) | 2026-06-27 | Patch | Entry-formaat en branch-naamgeving vastgelegd |
| [2.16.3](../../releases/development/2.x/2.16.3.md) | 2026-06-27 | Patch | Changelog workflow en mapstructuur verfijnd |
| [2.16.2](../../releases/development/2.x/2.16.2.md) | 2026-06-27 | Patch | Changelog & release-notes workflow verfijnd |
| [2.16.1](../../releases/development/2.x/2.16.1.md) | 2026-06-27 | Patch | Changelog workflow + versienummering |
| [2.16.0](audience/2.x/2.16.0.md) | 2026-06-25 | Minor | Mix tags toegevoegd |
| [2.15.0](audience/2.x/2.15.0.md) | 2026-06-25 | Minor | Mix detail verbeteringen + domein en taal gecorrigeerd |
| [2.14.4](../../releases/development/2.x/2.14.4.md) | 2026-06-25 | Patch | add-mix script: automatische afbeelding controle en conversie |
| [2.14.3](../../releases/development/2.x/2.14.3.md) | 2026-06-25 | Patch | add-mix script: AI beschrijving + tracklist plakken |
| [2.14.2](../../releases/development/2.x/2.14.2.md) | 2026-06-25 | Patch | Script: nieuwe mix toevoegen |
| [2.14.1](../../releases/development/2.x/2.14.1.md) | 2026-06-25 | Patch | Alle afbeeldingen geconverteerd naar WebP |
| [2.14.0](audience/2.x/2.14.0.md) | 2026-06-25 | Minor | Mix beschrijvingen alle kleuren + Red image update |
| [2.13.0](audience/2.x/2.13.0.md) | 2026-06-18 | Minor | Code structuur & JSON tracklist verbeterd |
| [2.12.0](audience/2.x/2.12.0.md) | 2026-06-16 | Minor | Nieuwe mix: Red Light EDM (Vol. 6) |
| [2.11.1](../../releases/development/2.x/2.11.1.md) | 2026-05-10 | Patch | BackButton navigatie via Link |
| [2.11.0](audience/2.x/2.11.0.md) | 2026-05-08 | Minor | Nieuwe mix: Orange Drum & Bass (Vol. 9) + responsive |
| [2.10.0](audience/2.x/2.10.0.md) | 2026-05-05 | Minor | UX kleuren uitgebreid + layout responsive |
| [2.9.0](audience/2.x/2.9.0.md) | 2026-05-01 | Minor | UX MODUS — donker/licht mode |
| [2.8.0](audience/2.x/2.8.0.md) | 2026-04-20 | Minor | Reviews verborgen + responsive breakpoints |
| [2.7.0](audience/2.x/2.7.0.md) | 2026-04-13 | Minor | Referenties component + Mobile Content 2.0 |
| [2.6.0](audience/2.x/2.6.0.md) | 2026-04-11 | Minor | Filter 2.0 + Luister pagina 2.0 |
| [2.5.0](audience/2.x/2.5.0.md) | 2026-04-10 | Minor | Nieuwe mix + mix detail refactor |
| [2.4.0](audience/2.x/2.4.0.md) | 2026-03-20 | Minor | Nieuwe mix: Yellow EDM (Full) |
| [2.3.0](audience/2.x/2.3.0.md) | 2026-03-19 | Minor | BasiskleurenCarousel + Promo sectie + Navigatie |
| [2.2.0](audience/2.x/2.2.0.md) | 2026-03-13 | Minor | Hero Banner |
| [2.1.0](audience/2.x/2.1.0.md) | 2026-03-11 | Minor | AudioPlayer + Light Yellow mixes |
| [2.0.1](../../releases/development/2.x/2.0.1.md) | 2026-03-08 | Patch | Succes message contactformulier |
| [2.0.0](audience/2.x/2.0.0.md) | 2026-03-07 | Major | Eerste livegang op Netlify |

> **The titles are Dutch, and stay that way.** They are the titles those releases were cut under; this list
> is a record, not a translation. Only the frame around them is English, like the rest of this directory.
