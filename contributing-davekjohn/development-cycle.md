## Development cycle: `config/migreer-release-roots-v1` · 20260827-100001

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

Onderzoek (Rebecca) wees uit dat bron-issue #914/#947 (gesloten 2026-08-26, uitgebracht in plugin
4.20.0) `Get-ReleaseChangelogNotesRoot` en `Get-ReleaseGithubNotesRoot` een berekende default binnen de
workflow-map gaf, maar dat niets in de plugin (`adopt-workflow-folder.ps1`, `cut-release.ps1`) deze repo
daarvan op de hoogte bracht. `releases/development/` (39 bestanden) en `releases/github/` (2 bestanden)
stonden nog op de repo-root. Gemeld als inbound
[#955](https://github.com/DaveKJohn/claude-code-specialists/issues/955); Dave koos migratie boven
vastpinnen.

### CREATE

- [x] `git mv releases/development contributing-davekjohn/releases/changelog`
- [x] `git mv releases/github contributing-davekjohn/releases/github`
- [x] `contributing-davekjohn/releases/README.md` bijgewerkt: de release-lijst-links naar `changelog/`,
      en de sectie die de oude split beschreef vervangen door de nieuwe stand + verwijzing naar #955
- [x] `scripts/repo-config.ps1` bijgewerkt: de comments bij `Get-ReleaseNoteRoot` en
      `Get-ReleaseNotesGrouping` die de hardcoded regelnummers noemden
- [x] `CLAUDE.md`, `contributing-davekjohn/CONTRIBUTING.md`, root-`README.md`,
      `.claude/specialists/SPECIALISTS.md` en de intro van `contributing-davekjohn/CHANGELOG.md`
      bijgewerkt naar de nieuwe paden
- [x] Twee dode links gerepareerd: `contributing-davekjohn/CONTRIBUTING.md` wees nog naar
      `../releases/github/`/`../releases/development/` op de repo-root; en het gepubliceerde
      `releases/changelog/2.x/2.24.0.md` verwees met `../../../.github/...` een niveau te ondiep nadat
      de map één laag dieper kwam te liggen -- alleen het pad aangepast, geen letter tekst

### TEST

- [x] `scripts/lint/check-links.ps1` -- 0 dode links/ankers (eerst 3 gevonden, alle drie gerepareerd)
- [x] `scripts/lint/lint-web.ps1` volledig -- tsc, ESLint, build (89 statische pagina's) en de link-check
      alle vier groen

### DEPLOY: `config/migreer-release-roots-v1`

**Score:** 1 -- voorkomt een fout die nog niet is opgetreden: zonder deze migratie was de eerstvolgende
`cut-release` stilzwijgend begonnen met twee nieuwe, lege bomen op
`contributing-davekjohn/releases/changelog/` en `.../github/`, losgezongen van de bestaande 39 + 2
bestanden op de oude repo-root-locatie -- geen foutmelding, gewoon een tweede boekhouding.

#### What makes this deploy extra special

**Score:** N/A -- repo-machinery (de release-route zelf, geen wijziging aan de site, de mixen of SEO),
bereikt Dave als maintainer en niet als opdrachtgever.

#### Pull Request

Migreer release-development en release-github naar contributing-davekjohn/releases/

