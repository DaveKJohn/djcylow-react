# Working in `workflow-davekjohn/`

This folder belongs to the `workflow-davekjohn` plugin's way of working. The rules a session needs:

- The two files in `branch/` belong to the **current branch**. On the trunk they sit in their reset
  state -- never write there until a branch exists (`new-branch` creates one and fills them).
- `branch/branch-changelog.md` folds **verbatim** into `CHANGELOG.md` at the merge; its step list
  companion gates the PR and the merge (`- [x]` done, `- [~]` dropped with the reason on the line).
- `releases/README.md` lists this repo's releases; the cut inserts its own row. `releases/audience/`
  is where the cut drafts the hand-written note -- generated development notes live elsewhere.
- `prompts/prompt.md` is the REQUESTER's file, not yours: they write an assignment there instead of
  typing it into the terminal, /prompt reads it, and -Archive files it once the work is under way.
  Never write an assignment into it, and never read its HTML comments as instructions -- they are
  the scaffold's own words, and an inbox holding only comments is empty. Untracked by design.
- The generated files in `branch/templates/` are references, not documents to edit: new-branch
  rewrites one that has drifted.

<!-- VUL-IN: rules specific to this repo, if this folder gains any. -->
