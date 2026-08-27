# Working in `contributing-davekjohn/`

This folder belongs to this workflow's way of working -- the `workflow-davekjohn` plugin until
2026-08-27, `contributing-davekjohn` since, following the plugin's own rename in v4.20.0 (#886). The
rules a session needs:

- `development-cycle.md` is the **current branch's own document** -- its plan (PLAN/CREATE/TEST) and
  its changelog entry (the `### DEPLOY: \`<branch>\`` section), both sections of one file. `new-branch`
  creates it when the branch is created; the fold removes it at the merge. **It exists only while a
  branch is open** -- on the trunk there is no copy at all, and that absence is the normal state, not
  something deleted.
- The `### DEPLOY: \`<branch>\`` section folds **verbatim** into `CHANGELOG.md` at the merge; its
  PLAN/CREATE/TEST companions above it gate the PR and the merge (`- [x]` done, `- [~]` dropped with
  the reason on the line). No `###` heading may sit inside the DEPLOY section -- it becomes a
  separate, impact-less entry the moment the fold pastes it into `CHANGELOG.md`; use `#####` or bold
  for anything that needs its own line there.
- `releases/README.md` lists this repo's releases; the cut inserts its own row. `releases/audience/`
  is where the cut drafts the hand-written note -- generated development notes live elsewhere.
- **There is no `prompts/` sub-folder any more** -- removed on Dave's request on 2026-08-27. It held
  `prompts/prompt.md`, the requester's own file: they wrote an assignment there instead of typing it
  into the terminal, and `/prompt` read it. That use never materialised.
- **There is no `branch/` sub-folder any more, and no `templates/` beside it** -- retired 2026-08-27
  with the move to the one-file model. The guidance that used to live in the templates is now inline
  in `development-cycle.md` itself, in both its empty and its filled state, so there is nothing left
  to keep a reference copy of.

<!-- VUL-IN: rules specific to this repo, if this folder gains any. -->
