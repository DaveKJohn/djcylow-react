# `prompts/` -- the prompt inbox

A terminal is a poor surface for a long assignment: no wrapping, no editing, no saving it
half-finished. So it gets written in an editor instead, into `prompt.md`, and a session picks it up
with `/prompt`. It is the mirror of `/lock` -- that one is Claude writing a note for the next Claude,
this one is the requester writing for the next session.

| path | what it is | committed |
|---|---|---|
| `prompt.md` | the inbox -- the requester writes here | **no** |
| `archive/` | assignments already handed over, by date | **no** |
| `templates/prompt_template.md` | the generated reference of the reset state | yes |
| `.gitignore` | keeps the first two out of git | yes |

The inbox is not committed by design: it is one person's working input on one machine, changing
between saves, and a tracked copy would dirty the tree continuously -- which is what a release cut
refuses to run on. The template is tracked BECAUSE the inbox is not, so a fresh clone still carries a
trace of the mechanism.

Everything inside HTML comments is scaffold and is stripped before the body is read, so an inbox
holding only comments counts as empty. The full procedure is the plugin's `prompt` skill.

<!-- VUL-IN: anything specific to this repo -- who writes here, and what a prompt is expected to say. -->
