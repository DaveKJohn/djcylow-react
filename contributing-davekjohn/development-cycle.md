## Development cycle: `config/verantwoord-onbeantwoorde-seams-v1` · 20260827-141400

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

Issue #155 meldt drie onbeantwoorde release-notes-root-seams die niet in het verantwoordingsblok van
`scripts/repo-config.ps1` staan, en vraagt uit te zoeken of ze op een verouderd model wijzen.

#### Wat de check meet, tegenover wat het issue meldt

Nageteld per functie tegen het bestand: `check-script-contract.ps1` (plugin 4.20.0) meldt **veertien**
info-signalen, het blok verantwoordt er **vijf**, dus **negen** staan nergens -- niet drie. Het issue
keek naar de release-roots en vond er daar drie; het onderwerp "wat staat er niet verantwoord" is
groter. De reparatie volgt het gemeten getal, en de hertelling zelf gaat in het blok zodat de volgende
lezer weet dat een gemeld aantal geen maat is.

#### De onderzoeksvraag is ingehaald door #152

De twee roots waar #155 op wees staan sinds PR #158 (2026-08-27) exact op hun berekende default:
`contributing-davekjohn/releases/changelog/` en `.../github/`. Er valt dus niets te migreren -- alleen
vast te leggen waarom ze onbeantwoord blijven.

### CREATE

- [x] Nageteld welke van de veertien [INFO]-functies al in het blok staan (vijf) en welke niet (negen)
- [x] Kop van het blok bijgewerkt van "vijf" naar "veertien", met de hertelling en de reden waarom
      dit blok opnieuw uit de pas liep (aanwas via plugin-releases arriveert stil als [INFO])
- [x] De negen bijgeschreven: `Get-ChangelogPath`, `Get-ReleaseChangelogNotesRoot`,
      `Get-ReleaseGithubNotesRoot`, `Get-ReleaseInternalNotesRoot`, `Get-EntryGateExemptPrefixes` en
      de vier `Get-ReleasePage*`-knoppen, elk met de gemeten reden waarom de fallback hier het goede
      antwoord is
- [x] Het ene non-ASCII teken in dit bestand vervangen (regel 517), want de header van
      `scripts/repo-config.ps1` schrijft puur ASCII voor -- Windows PowerShell 5.1 leest een BOM-loos
      script als ANSI en verhaspelt een accent-literal

### TEST

- [x] `check-script-contract.ps1` opnieuw gedraaid: onveranderd 0 errors, 14 info-signalen
- [x] Alle veertien functienamen staan nu aan het regelbegin in het blok, per functie geverifieerd
- [x] `scripts/repo-config.ps1` dot-source't zonder fout; `Get-RepoName` en `Get-ReleaseAudienceTier`
      leveren hun waarde
- [x] Bestand is weer volledig ASCII (`file` meldt `ASCII text`); `git diff` toont 88 inserts en
      4 deletes, geen line-ending-ruis
- [x] Elke bewering in de nieuwe tekst tegen de boom gemeten in plaats van uit het contract-praatje
      overgeschreven: de twee release-bomen bestaan met hun `2.x/`-submap, er is geen `internal/`-boom,
      nul verwijzingen naar `build-release-notes-page` in deze repo, en `branch-info.ps1` kent geen
      `sync`-prefix

### DEPLOY: `config/verantwoord-onbeantwoorde-seams-v1`

Vult het verantwoordingsblok van `scripts/repo-config.ps1` aan van vijf naar veertien seams, zodat het
weer dekt wat `check-script-contract.ps1` daadwerkelijk meldt. Issue #155 wees op drie
release-notes-roots; narekenen per functie leverde er **negen** op die nergens verantwoord stonden --
het gemelde getal was de vangst van de zoekopdracht, niet de omvang van het onderwerp. De
onderzoeksvraag van het issue -- wijzen die roots op een model dat deze repo nog niet had bekeken? --
was inmiddels beantwoord en uitgevoerd door #152/PR #158: `releases/changelog/` en `releases/github/`
staan sinds die migratie exact op hun berekende default, dus ze blijven onbeantwoord omdat de boom al
klopt. De andere zeven krijgen hun eigen gemeten reden: geen lezer (`Get-ReleaseInternalNotesRoot`, de
vier `Get-ReleasePage*`-knoppen), een prefix die hier niet bestaat (`Get-EntryGateExemptPrefixes`), of
een seam die sinds `Assert-WorkflowIsolatedSeamPath` alleen nog zijn eigen default kan herhalen
(`Get-ChangelogPath`). De kop draagt daarnaast de hertelling zelf, plus de waarneming dat nieuwe seams
via een plugin-release stil binnenkomen omdat `[INFO]` niets blokkeert. Meegenomen: het ene non-ASCII
teken in het bestand, dat de eigen ASCII-conventie van de header schond. Closes #155.

**Score:** 2 -- voorkomt de concrete fout die dit blok twee keer eerder heeft opgeleverd: een sessie die
op een handgeschreven aantal afgaat, een stub bijzet die de berekende default woordelijk herhaalt, en
daarmee de mapnaam-drift introduceert die de seam juist moest voorkomen.

#### What makes this deploy extra special

N/A -- raakt uitsluitend commentaar in een configuratiescript; geen gedrag, geen gebouwde pagina, geen
enkel signaal richting management of opdrachtgever.

**Score:** N/A

#### Pull Request

Verantwoord de negen onbeantwoorde blueprint-seams in repo-config.ps1
