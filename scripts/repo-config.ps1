<#
.SYNOPSIS
    Repo-eigen configuratie voor de gedeelde workflow-scripts (single source of truth voor repo-data).

.DESCRIPTION
    Dot-source dit bestand vanuit een script:

        . (Join-Path $PSScriptRoot '..\repo-config.ps1')   # vanuit scripts/<map>/
        . (Join-Path $PSScriptRoot 'repo-config.ps1')       # vanuit scripts/ zelf

    Dit is het kleine, lokale blokje repo-data dat de gedeelde, repo-agnostische workflow-scripts
    inlezen. Die scripts wonen als single source of truth in DaveKJohn/claude-code-specialists en
    reizen via de specialists-plugin naar deze consument; alles wat per repo verschilt woont hier.

    Drie lagen, in deze volgorde in het bestand:

      1. De repo-eigen kern: Get-RepoName, Get-RepoBlobUrl, Get-LintScript, Get-RosterPath en
         Get-RosterIgnoredIds.
      2. Wat op 2026-08-11 uit de config-blueprint van de bron is geadopteerd via de
         adopt-config-skill -- acht functies die de GEDEELDE werkwijze uitspreken en niets over deze
         repo beweren. Ze staan er in de tekst van de bron, comments incluis, en zijn nu van dit
         bestand: adopt-config overschrijft nooit iets dat er al staat.
      3. De antwoorden die alleen deze repo kan geven -- op 2026-08-12 zes: Get-ReleaseNotesGrouping,
         Get-ReleaseNoteRoot, Get-ReleaseConsumerBumps, Get-ReservedRootMd, Get-LiveStage en
         Get-ReleaseAudienceTier. Daaronder een blok dat verantwoordt welke blueprint-vragen bewust
         ONBEANTWOORD blijven omdat de fallback van het gedeelde script daar beter is dan een stub.
         Tel die niet uit dat blok en niet uit deze opsomming: check-script-contract.ps1 meldt de
         onbeantwoorde als [INFO] en dat is de enige stand die met de blueprint meebeweegt.

    Samen het contract dat scripts/sync/check-script-contract.ps1 afdwingt.

    Geen Set-StrictMode hier: dot-sourcen zou de strict-mode van het aanroepende script veranderen
    en daar losse code kunnen breken (zelfde reden als branch-info.ps1).

    Bewust puur ASCII (repo-conventie voor .ps1): Windows PowerShell 5.1 leest een BOM-loos script
    als ANSI en zou een accent-literal verhaspelen.
#>

# --- De branch-tabel bereikbaar maken voor de scripts die hem niet zelf laden (2026-08-11) ---------
#
# branch-info.ps1 levert Get-BranchTypes: de acht typen die de branch-tabel van deze repo produceert
# (Feature, Fix, Data, Content, Style, Config, Docs, Chore). Twee gedeelde scripts dot-sourcen dat
# bestand echter NIET -- fold-changelog-entry.ps1 en new-internal-note.ps1 -- en vallen dan terug op de
# canonieke vier van de bron: Feat, Fix, Docs, Chore.
#
# Dat is geen degradatie maar een WEIGERING. De fold leest de typen om te bepalen welke ##-koppen in
# CHANGELOG.md entries zijn; een type dat niet in de lijst staat leest hij als typeloos en dan weigert
# hij bij naam. Deze repo produceert Config, Data, Content, Style en Feature -- vijf van de acht staan
# niet in die canonieke vier, dus een fold van bijvoorbeeld een config/-branch liep op een weigering af
# die niets met de entry zelf te maken had. check-script-contract.ps1 meldt dit als [INFO], niet als
# fout, en wijst deze regel als de reparatie aan: repo-config.ps1 WORDT door beide scripts geladen, dus
# via deze dot-source is het antwoord alsnog bereikbaar.
#
# Idempotent: scripts die branch-info.ps1 al zelf laden (open-pr, new-branch) laden het nu twee keer,
# en dat herdefinieert alleen dezelfde functies en dezelfde twee tabellen met dezelfde waarden.
. (Join-Path $PSScriptRoot 'lib\branch-info.ps1')

# De GitHub-repo waar deze website woont (owner/naam). Enige plek waar dit staat.
$script:RepoName = 'DaveKJohn/djcylow-react'

function Get-RepoName {
    <# owner/naam van deze repo, bv. voor `gh ... --repo`. #>
    return $script:RepoName
}

function Get-RepoBlobUrl {
    <# Basis-URL voor blob-links naar main, bv. om root-relatieve links absoluut te maken. #>
    return "https://github.com/$($script:RepoName)/blob/main/"
}

# De lint-poort van deze repo, repo-root-relatief. De open-pr-skill draait dit voor de PR. Dit is het
# enige repo-specifieke deel van open-pr: elke consument heeft zijn eigen lint (de workshop
# check-plugin-integrity, life-hub lint-brain, deze repo de TypeScript-typecheck).
# lint-web.ps1 checkt sinds 2026-08-14 drie dingen: `tsc --noEmit`, `eslint .` en `npm run build`
# -- de afweging per stap staat in de header van dat script.
$script:LintScript = 'scripts\lint\lint-web.ps1'

function Get-LintScript {
    <# Repo-root-relatief pad naar de lint-poort die de open-pr-skill voor de PR draait. #>
    return $script:LintScript
}

# De eigen testcommando's van deze repo, die de gedeelde test-poort NAAST de PowerShell-suites draait.
#
# WAAROM DEZE SEAM HIER NODIG IS. De gedeelde poort (Invoke-TestSuiteGate) globt
# scripts\tests\*.tests.ps1 en niets anders. Dat klopt in de bron, waar alle suites PowerShell zijn,
# maar deze repo is een Next.js-app: zijn suite is Vitest en staat in tests\. Zonder deze waarde
# meldde open-pr eerlijk "scripts\tests not found - test gate skipped" en draaide er dus NIETS --
# terwijl beide poorten zeggen "all test suites green". De seam bestaat sinds plugin 4.8.0
# (inbound #644) precies voor dit geval.
#
# WAT DIT BEWAAKT: de hele suite in tests\, niet alleen de mix-data. Die begon op 2026-08-13 met
# 36 tests in tests\mix-data.test.ts en is sindsdien gegroeid -- vraag het huidige aantal op met
# 'npx vitest run' in plaats van het hier bij te houden, want een getal in een comment loopt
# gegarandeerd uit de pas (dit stond tot 2026-08-15 nog op 36 terwijl het er 71 waren).
#
# De veldspec in src\data\mixes\README.md beschreef die regels al, maar niets hield ze tegen; een
# fout erin haalt de build (JSON is geldig, TypeScript is tevreden) en wordt daarna op djcylow.com
# zichtbaar.
#
# 'vitest run' EN NIET 'npm test', bewust: npm zet er zijn eigen laag omheen die op een non-zero
# exit een tweede foutblok print, en de poort leest de exit code. Het npm-script bestaat wel
# (`npm test`) voor handmatig gebruik; de poort neemt de kortste weg.
$script:TestCommands = @('npx vitest run')

function Get-TestCommands {
    <# Extra commandoregels die de gedeelde test-poort naast scripts\tests\*.tests.ps1 draait. #>
    return $script:TestCommands
}

# Het bestand dat het roster draagt (de specialisten-tabel/lijst). check-roster-sync.ps1 leest dit om
# te bepalen welke agent-ids "in het roster staan". Repo-root-relatief.
#
# Dit was 'CLAUDE.md' tot de herinstallatie op 2026-08-03. Sinds die generatie schrijft
# specialists-init het roster naar .claude/specialists/SPECIALISTS.md -- het enige bestand dat
# CLAUDE.md nog importeert -- en dat is ook waar het roster nu staat. Bleef deze waarde op CLAUDE.md
# staan, dan las de check een bestand met alleen de @-import erin en meldde hij 19 specialisten als
# rosterloos: een ROSTER-PENDING bij elke sessiestart, over werk dat wel gedaan was.
#
# Er is bewust GEEN Get-RosterFormat: de check is format-agnostisch (hij zoekt per
# '<groep>-<id>'-token in de tekst) en werkt dus of het roster nu een tabel of een lijst is.
$script:RosterPath = '.claude\specialists\SPECIALISTS.md'

function Get-RosterPath {
    <# Repo-root-relatief pad naar het bestand met het roster (specialisten-tabel/lijst). #>
    return $script:RosterPath
}

# Agent-ids ('<groep>-<id>') die WEL zijn ingeschakeld maar bewust geen rosterrij en geen lens hebben,
# zodat check-roster-sync.ps1 ze niet als drift meldt. Deze lijst is leeg, en dat is de bedoeling:
# een nieuwe specialist hoort niet hier te worden weggemoffeld maar in het roster te belanden.
$script:RosterIgnoredIds = @()

function Get-RosterIgnoredIds {
    <# Ids van ingeschakelde agents die bewust buiten roster/lenzen blijven (overgeslagen door de check). #>
    return $script:RosterIgnoredIds
}

# --- Adopted from the DaveKJohn/claude-code-specialists config blueprint ---------------------------------
#
# Each function below is the source's own text, comments included, for a value that states the
# shared way of working rather than a fact about this repo. Edit them freely -- they are this
# repo's files now, and adopt-config never overwrites a function that is already here.

# --- The stub wording new-branch.ps1 writes into an entry file (issue #410) ---------------
#
# The four strings below are the entire visible output of the shared new-branch.ps1: the title
# placeholder, the body heading, the fallback body, and the changelog type an unknown branch prefix
# falls back to. They used to be hardcoded in that script, which is fine for an English repo and wrong
# for any other -- the FILE it writes is repo-owned, so its wording is too.
#
# The concrete case (inbound #410, smartwatchbanden): a Dutch-language repo kept its own copy of
# new-branch.ps1 at the same relative path, purely to change these four strings. Two entry
# points then wrote two formats for the same branch -- the branch flow called the repo copy, the
# new-branch skill called the shared one -- which is exactly the duplication the skill exists to
# prevent. Dropping the copy fixed the duplication and cost them Dutch stubs; these functions give the
# wording back without the copy.
#
# All four are OPTIONAL in the script contract: a consumer that defines none of them gets the values
# below, which are also what the script hardcoded before. Same pattern as Get-ChangelogHeading (#178)
# and Get-LiveStage (#177). Four separate functions rather than one map-returning function, so the
# contract check can name the exact default per knob in its [INFO] line.
#
# TWO OF THEM ARE NOW GATE-ONLY (August 6, 2026). Since the branch/ split, new-branch.ps1 writes
# neither the body heading nor the old to-do placeholder -- branch-progress.md carries the step list, and
# the entry's placeholder asks what the change DOES. The body heading stays defined here because it is
# still a marker open-pr refuses, so a consumer who translated it keeps a gate that recognises their
# wording rather than only the English one. See $script:EntryScaffoldDefaults in entry-scaffold-lib.ps1.
$script:EntryTitlePlaceholder = 'TODO: title'
$script:EntryBodyHeading      = '**To do / where I left off:**'
$script:EntryBodyPlaceholder  = 'TODO: what this change does, for whoever reads CHANGELOG.md later.'
$script:EntryFallbackType     = 'Chore'

function Get-EntryTitlePlaceholder {
    <# Placeholder title for an entry created without an explicit -Title. #>
    return $script:EntryTitlePlaceholder
}

function Get-EntryBodyHeading {
    <# The bold line above the entry body. Must be a single line; it is written verbatim. #>
    return $script:EntryBodyHeading
}

function Get-EntryBodyPlaceholder {
    <# Fallback body when no -Intent was given -- a directional prompt, not an empty placeholder. #>
    return $script:EntryBodyPlaceholder
}

function Get-EntryFallbackType {
    <# The changelog type an unknown branch prefix falls back to. Must be one of the types this repo's
       own branch table produces, since cut-release groups entries by it. #>
    return $script:EntryFallbackType
}

# --- Which files the mojibake tool examines by default (issue #413) -------------------------------
#
# scripts/maintenance/fix-mojibake.ps1 used to carry this list itself, and the list is workshop-shaped:
# it walks plugins/** for the manuals, agent defs and personas, and releases/** for the archived notes.
# In a consumer neither directory exists, so the tool's own Test-Path filter quietly reduced the set to
# whatever root docs happened to be there -- a gate that examines almost nothing while reporting
# "clean". Which files a repo has is a property of the repo, so the list belongs here.
#
# Takes the repo root as a parameter rather than resolving one of its own: the caller has already done
# that (dual-context, CLAUDE_PROJECT_DIR or the git root), and a second resolution here is a second
# answer to a one-answer question. The Get-ChildItem work sits INSIDE the function on purpose -- this
# file is dot-sourced by every workflow script, and none of the others should pay for a directory walk
# they never use.
#
# OPTIONAL in the contract: a consumer without this function gets the tool's own repo-agnostic
# fallback -- every *.md in the repo root, which covers the changelog, the root docs and the unfolded
# entry files in any repo. That fallback is deliberately broader than what this workshop's list used to
# be, because an entry file is exactly the kind of freshly written, non-ASCII-carrying file the damage
# shows up in first.
function Get-MojibakePaths {
    <# Absolute paths of the files fix-mojibake.ps1 examines when called without -Path. #>
    param([Parameter(Mandatory = $true)][string]$RepoRoot)

    # Every markdown file in the repo root: the root docs. CHANGELOG.md moved into contributing-davekjohn/
    # on 2026-08-27 and is picked up by the -Recurse block below instead -- not named here separately,
    # so this comment does not go stale a second time if it moves again.
    $paths = @(Get-ChildItem -LiteralPath $RepoRoot -Filter '*.md' -File |
        Select-Object -ExpandProperty FullName)

    # contributing-davekjohn/ -- the workflow's own root folder, which holds the branch's own document
    # (development-cycle.md, only while a branch is open -- under branch/ until August 23, 2026, and
    # under this folder's own root since then; the folder itself was workflow-davekjohn/ until it was
    # renamed here on 2026-08-27, following the plugin's own rename in v4.20.0/#886). The branch document
    # is the single highest-value file in this set: its DEPLOY section is pasted verbatim into
    # CHANGELOG.md and from there into the release notes, so a mis-decode caught anywhere later has
    # already been copied twice.
    # -Recurse covers the folder's scaffolded docs and the audience notes that moved in here on
    # August 16, 2026. The development notes did NOT move -- the block below still covers those.
    $workflowDir = Join-Path $RepoRoot 'contributing-davekjohn'
    if (Test-Path -LiteralPath $workflowDir) {
        $paths += @(Get-ChildItem -LiteralPath $workflowDir -Recurse -Filter '*.md' -File |
            Select-Object -ExpandProperty FullName)
    }

    # Every markdown file under plugins/: the manuals, agent defs, personas and skill pages -- all prose,
    # all equally able to carry a mis-decode. It used to name the per-plugin CHANGELOG.md and RELEASE.md
    # first; those were retired on August 8, 2026 and the rest of the set is unchanged.
    #
    # -Filter, NOT -Include, and that is a bug fix rather than a preference. PowerShell SILENTLY IGNORES
    # -Include when the path is given as -LiteralPath, so the previous form --
    # `Get-ChildItem -LiteralPath $pluginRoot -Recurse -File -Include 'CHANGELOG.md','RELEASE.md'` --
    # returned EVERY file under plugins/, .ps1 and .json included, while the comment above it named two
    # file names. Nothing broke, because the extra files were clean and the tool leaves anything that is
    # not mojibake alone; what was wrong is that the code and its own description disagreed, and the
    # description is what the lint gate quotes to the reader as its coverage. Worth keeping now that the
    # two named files are gone: the WIDE set is what this function has actually returned all along.
    $pluginRoot = Join-Path $RepoRoot 'plugins'
    if (Test-Path -LiteralPath $pluginRoot) {
        $paths += @(Get-ChildItem -LiteralPath $pluginRoot -Recurse -File -Filter '*.md' |
            Select-Object -ExpandProperty FullName)
    }

    # THE ARCHIVED RELEASE NOTES, added August 2, 2026 after they turned out to hold the largest single
    # concentration of damage in the repo (474 sequences in 3.1.0.md alone, more than the root
    # changelog). They sit outside the language rule because they are history, but the two questions are
    # not the same: not translating an old note preserves what it said, while leaving mojibake in it
    # preserves a mis-decode nobody wrote.
    #
    # THIS BLOCK STILL EARNS ITS PLACE AFTER THE AUGUST 16, 2026 MOVE, and that is worth stating because
    # it looks redundant next to the -Recurse above. Only audience/ went into workflow-davekjohn/;
    # development/ (39 files) and github/ stayed at the repo root because cut-release.ps1 hardcodes those
    # two roots there -- see the comment on Get-ReleaseNoteRoot below. Drop this block and those 39
    # documents leave coverage while the tool keeps reporting "clean", which is the exact failure that
    # made this function necessary.
    $releasesRoot = Join-Path $RepoRoot 'releases'
    if (Test-Path -LiteralPath $releasesRoot) {
        $paths += @(Get-ChildItem -LiteralPath $releasesRoot -Recurse -File -Filter '*.md' |
            Select-Object -ExpandProperty FullName)
    }

    return @($paths | Sort-Object -Unique)
}

# --- Where this repo keeps its release history (Dave, August 4, 2026) -----------------------------
#
# THE MEASUREMENT BEHIND THIS PATH BECOMING LOAD-BEARING. CHANGELOG.md used to carry an accumulating
# release section that had grown to 434 of the file's 1,062 lines -- 41% -- across 72 blocks that each
# said no more than "see the notes". Every one of those 72 versions was ALSO in releases/README.md, with a
# date, a type and a descriptive title: verified in both directions, zero missing either way. So the
# section was not a long list but a poorer copy of a better one, and the changelog's own subject -- what
# changed since the last release -- was sitting under it.
#
# Get-ReleaseHistoryMode retired on August 5, 2026, and this is the other half of that same measurement
# playing out. It chose between 'all' (a block per release) and 'latest' (only the newest, behind a
# pointer); the flat changelog keeps NEITHER, because a cut now empties the document down to its intro.
# There is no mode left to select, and the file below is not "where the pointer points" any more but the
# only list of releases there is.
#
# THE PRECONDITION IS THEREFORE ABSOLUTE RATHER THAN A CAUTION: this file must really list every release,
# because from now on nothing else does. It did before this change too -- that is what made removing the
# blocks safe rather than lossy.
#
# The path answers ONE question and three things read it: the guardrail that checks which major a new row
# would land in, the inserter that writes that row, and new-internal-note.ps1, which repoints that row's
# Version cell at the internal note once the note exists. One edit here moves all three.
#
# IT MOVED OFF THE DEFAULT ON 2026-08-16, when the whole releases/ tree went into workflow-davekjohn/
# with the plugin's v4.12.0 upgrade. The shared default deliberately STAYS at the old root location --
# "an unstated seam has to keep meaning what it meant yesterday", says the blueprint -- so a repo that
# moves the tree has to say so here, or the guardrail, the inserter and new-internal-note.ps1 all keep
# writing to a path that no longer exists. This is a 'decide' seam for exactly that reason.
#
# THE FOLDER ITSELF RENAMED ON 2026-08-27, workflow-davekjohn/ -> contributing-davekjohn/, following the
# plugin's own rename in v4.20.0 (#886). Same reasoning as the paragraph above: an unstated value would
# still say yesterday's name. The 37 existing rows in releases/README.md were not rewritten -- git mv
# carried the file itself, and its rows already read relative to wherever the file lives.
#
# The file itself is unchanged by the move: still one page, still the mirror of the source's own. It
# lived in its own HISTORY.md for one day (August 4, 2026), on the reasoning that one page should
# describe the process and another the outcome. That reasoning was superseded the same day: the pages had
# since been reorganised portable-half first with everything repo-specific in one named slot, and once
# that split exists, process-versus-outcome stops earning a file boundary -- the outcome IS repo-specific
# content, so it is simply the last section of the slot. Merging them also removed four cross-references
# the two pages needed to introduce each other, and left a consumer with one file to mirror instead of two.
$script:ReleaseHistoryPath = 'contributing-davekjohn/releases/README.md'

function Get-ReleaseHistoryPath {
    <# Repo-root-relative path to the file that lists every release this repo has cut. #>
    return $script:ReleaseHistoryPath
}

# THE NAME THE CUT ACTUALLY LOOKS FOR FIRST (inbound #605). cut-release.ps1 reads
# Get-ReleaseNoteWording and only falls back to Get-InternalNoteWording above -- so until this existed,
# this repo was being served by the retired name and had no way to notice. Nothing was broken, which is
# precisely why it went two releases undeclared: the fallback works, so no run ever complains.
#
# A SEPARATE MAP RATHER THAN AN ALIAS, because the two documents do not share a key set. This one is the
# ONE hand-written release note (a named section per reader): Title, AudienceLabel, Audience,
# SectionConsumers, HintConsumers, SectionValue, HintValue, SectionOpen, HintOpen. The four keys above
# that are missing here -- SkeletonNote, SectionChanged, NoEntries, Unknown -- belong to
# new-internal-note.ps1, which is still shipped and which nothing here calls.
#
# EMPTY HERE, for the same reason as its neighbour: an English repo is already served by the English
# defaults in the script. Merged over them, so overriding one leaves the rest alone.
$script:ReleaseNoteWording = @{}

function Get-ReleaseNoteWording {
    <# Overrides for the release note's headings, audience line and fill-in hints. Empty = English. #>
    return $script:ReleaseNoteWording
}

# --- The internal tier's own text (the third tier, August 3, 2026) --------------------------------
#
# releases/internal/<X>.x/<X.Y.Z>.md, written by new-internal-note.ps1 for colleagues, employers and
# management -- at EVERY release including a patch, which is exactly what separates it from the consumer
# document: that one is what a CONSUMER notices, this one is what the ORGANISATION gets out of it. A
# release with nothing for a consumer (correctly a patch, so no consumer document) can still be the one
# where a team stopped needing a developer for a routine change.
#
# NO ON/OFF KNOB, deliberately, unlike the consumer tier. That tier is generated BY cut-release, so it
# needs to be told whether to run; this one is a script you invoke when you want a note. The switch is
# running it or not. cut-release only decides whether to PRINT the suggestion, and it does that by
# checking whether the script exists in the repo -- a fact rather than a preference, the same reasoning
# as Get-ReleasePluginTier's computed fallback.
#
# EMPTY HERE, for the third time in this file and for the same reason: an English repo is already served
# by the English defaults in the script. The knob exists for a consumer whose colleagues read another
# language, where an unset heading is the wrong word rather than a missing one -- the #410 class. Keys:
# Title, AudienceLabel, Audience, SkeletonNote, SectionChanged, SectionValue, HintValue, SectionOpen,
# HintOpen, NoEntries, Unknown. Merged over the defaults, so overriding one leaves the rest alone.
$script:InternalNoteWording = @{}

function Get-InternalNoteWording {
    <# Overrides for the internal note's headings, audience line and fill-in hints. Empty = English. #>
    return $script:InternalNoteWording
}

# --- Antwoorden die alleen deze repo kan geven (2026-08-11) ----------------------------------------
#
# De blueprint van de bron markeert deze als 'decide': hun waarde zegt iets over DEZE repo, dus
# adopt-config plaatst ze niet zelf maar zet ze in een voorstel. Hieronder de vijf waar deze repo
# werkelijk afwijkt of waar de reden vastgelegd hoort; de drie andere blijven bewust ongedeclareerd
# en dat staat onderaan verantwoord.
#
# Het waren er drie tegen vier tot 2026-08-12: Get-ReleaseNoteRoot en Get-ReleaseConsumerBumps zijn
# samen overgestoken toen v4.5.0 de eerste van die twee toevoegde. Ze horen als paar gelezen te worden
# -- de knop was hier onaanzetbaar zolang het pad eronder niet te richten was.

# Hoe de release-notes zijn ingedeeld: 'major' -> releases/development/<X>.x/<X.Y.Z>.md.
#
# GELIJKGETROKKEN MET DE BRON OP 2026-08-13 (Dave), en dit is de enige seam in dit bestand die van een
# afgelezen waarde naar een GEKOZEN waarde is gegaan. Tot die dag stond hier 'minor', afgelezen van de
# boom: releases/development/ had 23 mappen, 2.0 tot en met 2.22. Dat was een geldig antwoord -- de
# bron-README noemt <X>.x en <X.Y> naast elkaar en laat <dir> voor "whichever this repo uses" staan --
# maar Dave heeft gevraagd releases/ precies gelijk te maken aan de bron, en dan is per MAJOR wat er
# staat. De 60 bestaande documenten (37 development, 23 audience) zijn met git mv verplaatst naar
# 2.x/ en NIET herschreven; alle 37 rijen in releases/README.md wijzen naar het nieuwe pad.
#
# WAT DEZE WAARDE AANDRIJFT, zodat een latere lezer weet wat er meebeweegt als hij hem terugdraait:
# cut-release.ps1 bouwt het notes-pad, het pad van het handgeschreven document en het github/-pad alle
# drie uit deze ene waarde. Een terugdraai zonder de boom mee te verhuizen levert een tweede boom naast
# de eerste, met de rij in releases/README.md wijzend naar een pad waar geen enkele note woont -- en
# niets zou klagen, want beide waarden zijn geldig. Verhuis de boom of laat de waarde staan.
$script:ReleaseNotesGrouping = 'major'

function Get-ReleaseNotesGrouping {
    <# Hoe de gegenereerde release-notes zijn ingedeeld: 'major' of 'minor'. Hier 'major'. #>
    return $script:ReleaseNotesGrouping
}

# Waar het handgeschreven release-document woont: releases/audience/<X>.x/<X.Y.Z>.md. De submap komt
# van Get-ReleaseNotesGrouping hierboven, dus dit is uitsluitend de root, zonder afsluitende slash.
#
# AFGELEZEN VAN DE BOOM -- en dat geldt nog voor de ROOT, niet meer voor de submap: releases/audience/
# staat naast releases/development/ met in beide een 2.x/ en daarin dezelfde nieuwste 2.22.0.md. De
# blueprint-default is releases/notes: die naam leidt hier tot een verkeerde map.
#
# DE MAP HEETTE releases/highlights/ TOT 2026-08-13, en de rename is de reden dat deze regel nu de
# naam van de bron draagt. Elke root onder releases/ hoort zijn LEZER te noemen, niet de vorm van het
# document -- "highlights" zegt hoe het geschreven is, "audience" zegt voor wie. De bron maakte
# dezelfde fout met releases/notes/ en repareerde die op 2026-08-12; deze repo liep er nog een dag
# achter. De 23 bestaande documenten zijn met git mv verplaatst en NIET herschreven: waar hun tekst
# nog releases/highlights/ noemt, is dat wat er stond op de dag dat ze uitgingen. Diezelfde 23 zijn
# later op die dag NOG EEN keer verplaatst, van 2.0 .. 2.22 naar 2.x, toen de grouping hierboven naar
# de waarde van de bron ging -- opnieuw met git mv en opnieuw zonder een letter aan hun tekst.
#
# DEZE SEAM BESTAAT SINDS v4.5.0, EN DAT IS DE HELE REDEN DAT DE KNOP HIERONDER AAN KAN. Tot en met
# 4.4.0 stond releases/notes/ hardcoded in cut-release.ps1, waardoor de consumer-laag hier
# onaanzetbaar was: aanzetten liet de cut schrijven naar een map die deze repo niet heeft, en de map
# die hier bestaat buiten de release vallen. Dat is als kern-bevinding gemeld via de inbound-route
# (DaveKJohn/claude-code-specialists#616) en in de bron gerepareerd. Dit is de eerste seam in dit
# bestand die er staat omdat deze repo er zelf om heeft gevraagd.
#
# releases/development/ heeft bewust GEEN tegenhanger-knop: niemand kon een repo aanwijzen die juist
# op dat pad afwijkt. Deze repo wijkt er ook niet af, dus er is niets te declareren. releases/github/
# heeft er ook geen, en dat is een ANDERE reden: die root staat hardcoded in cut-release.ps1 (regel
# 792) omdat een nieuwe root geen bestaande plaatsing hoeft te accommoderen. Deze repo hoeft daar dus
# niets te declareren, maar de map moet wel bestaan -- de eerstvolgende cut schrijft erin.
#
# VERHUISD OP 2026-08-16 van releases/audience naar workflow-davekjohn/releases/audience, met de
# v4.12.0-upgrade van de plugin. De 25 bestaande documenten zijn met git mv meegegaan, zonder een letter
# aan hun tekst te veranderen -- het zijn gepubliceerde documenten en dus historie.
#
# DE MAP ZELF HERNOEMD OP 2026-08-27: workflow-davekjohn/ -> contributing-davekjohn/, in het voetspoor
# van de plugin's eigen hernoeming in v4.20.0 (#886). Weer met git mv, weer zonder de 25 documenten aan
# te raken.
#
# ALLEEN AUDIENCE VERHUIST, EN DAT IS GEEN HALF WERK MAAR HET BEDOELDE MODEL. De twee roots hierboven
# zonder seam staan HARDCODED RELATIEF AAN DE REPO-ROOT in cut-release.ps1 -- releases/development/ op
# regel 728, releases/github/ op regel 820 -- dus die kunnen niet mee: een cut zou ernaast een nieuwe
# root-map aanmaken en je had twee boekhoudingen in plaats van een verhuizing. De bron zegt het met
# zoveel woorden in Get-RelativeLinkPath (release-lib.ps1, regel 1011): "a consumer's history lives at
# workflow-davekjohn/releases/README.md while the generated development notes stay at the repo root."
# Die functie bestaat puur om de relatieve link tussen die twee plekken te leggen.
#
# Bij deze verhuizing zijn development/ en github/ eerst wel meegegaan en daarna teruggezet, toen het
# narekenen van regel 728 en 820 dit aan het licht bracht. De boom die je nu ziet is de gemeten uitkomst,
# niet de eerste aanname.
$script:ReleaseNoteRoot = 'contributing-davekjohn/releases/audience'

function Get-ReleaseNoteRoot {
    <# Root-relatieve map van het handgeschreven release-document. Hier workflow-davekjohn/releases/audience. #>
    return $script:ReleaseNoteRoot
}

# Welke bumps dat handgeschreven document krijgen. @() zou de hele laag uitzetten.
#
# AFGELEZEN VAN DE BOOM, niet overgenomen uit CLAUDE.md -- die zegt hetzelfde (Release Workflow stap 6
# en 14: het handgeschreven document alleen bij Minor/Major), maar de boom levert het bewijs:
# releases/audience/ heeft 23 bestanden en alle 23 eindigen op .0, terwijl releases/development/ er 37
# heeft waarvan 14 een patch. Elke minor kreeg dus een document en geen enkele patch, 23 releases
# achter elkaar zonder uitzondering.
#
# LET OP -- WAT DE CUT HIER STRAKS SCHRIJFT IS NIET HET DOCUMENT DAT DE 23 BESTAANDE BESTANDEN ZIJN.
# Sinds 2026-08-10 kent de bron nog maar een enkel handgeschreven document, met een sectie per lezer, na
# de meting dat de twee losse documenten bij alle twaalf voorgaande releases over dezelfde wijzigingen
# gingen -- 38% overlap in twee registers. De 23 bestanden hier zijn nog van het oude model: leesbaar
# Nederlands zonder jargon, een enkel register, geen secties per lezer.
#
# WAT DAT HIER CONCREET BETEKENT, want Get-ReleaseAudienceTier staat op 1: de cut draft geen sectie
# "voor consumenten" -- die hoort bij tier 2, en bezoekers van djcylow.com lezen geen release notes. Wat
# de cut hier draft zijn de twee organisatie-secties: wat het waard is, en wat er bij deze release nog
# open stond. De mapstructuur is met deze branch volledig gelijkgetrokken met de bron -- de drie roots
# eerst en daarna de submap per major; het DOCUMENTMODEL van de 23 bestaande bestanden is dat niet, en
# die herziening staat nog open als eigen werk (Dave, 2026-08-13: bewust buiten deze branch gehouden).
$script:ReleaseConsumerBumps = @('minor', 'major')

function Get-ReleaseConsumerBumps {
    <# Bump-typen die het handgeschreven release-document krijgen. Hier minor en major. #>
    return $script:ReleaseConsumerBumps
}

# De vaste root-*.md van deze repo. cut-release behandelt ELKE andere root-*.md als een entry die
# iemand vergeten is te folden, en weigert de cut zolang er een staat (cut-release.ps1 regel 301/344).
#
# Precies vier, en dat is de hele root -- nagemeten, niet overgenomen. De blueprint-default noemt er
# negen: LICENSE, SECURITY, QUICKSTART, ADOPTION en UNINSTALL erbij, en die bestaan hier niet. Zo'n
# regel voor een bestand dat er niet is blokkeert niets, maar hij beschrijft een root die deze repo
# niet heeft en dempt het enige signaal dat de lijst waard is: duikt hier ooit een QUICKSTART.md op,
# dan heeft iemand die per ongeluk neergezet en hoort de cut dat te zeggen in plaats van hem door te
# laten.
#
# CONTRIBUTING.md STOND OP DIE LIJST VAN AFWEZIGEN EN IS ER OP 2026-08-13 BIJGEKOMEN, wat precies de
# situatie is waarvoor de waarschuwing hieronder bestaat: zonder deze regel leest de cut het nieuwe
# root-document als een entry die iemand vergeten is te folden, en weigert hij bij naam over een
# wijziging die nergens meer bestaat.
#
# Let op bij het toevoegen van een nieuw vast root-document: hier bijschrijven, en nergens anders.
# Komt er een tijdelijk werkbestand in de root (adopt-config schrijft bijvoorbeeld
# config-adoption-proposal.md), dan hoort dat niet in deze lijst maar weg voordat er een release komt.
#
# CHANGELOG.md STAAT ER SINDS 2026-08-27 NIET MEER OP: die dag verhuisde het bestand naar
# contributing-davekjohn/CHANGELOG.md (issue #885/#914 in de bron -- een consumer-repo isoleert zijn
# changelog voortaan in de workflow-map, en Assert-WorkflowIsolatedSeamPath weigert elk antwoord dat
# daarbuiten wijst; de map heette op dat moment nog workflow-davekjohn/ en is diezelfde dag later ook
# zelf hernoemd naar contributing-davekjohn/, zie Get-ReleaseHistoryPath). Deze lijst dekt alleen
# root-*.md, dus een vermelding zou hier toch nooit meer iets matchen -- weggehaald in plaats van als
# dode entry laten staan.
$script:ReservedRootMd = @('CLAUDE.md', 'CONTRIBUTING.md', 'README.md')

function Get-ReservedRootMd {
    <# Root-*.md die vaste documenten zijn in plaats van niet-gevouwen changelog-entries. #>
    return $script:ReservedRootMd
}

# Of deze repo een APARTE go-live-stap heeft NA het cutten van een release. Leeg -- en dat betekent
# hier het omgekeerde van wat het lijkt.
#
# origin/main IS de live site: Netlify bouwt en publiceert bij elke push naar main, dus een PR mergen
# is hier deployen. Juist daarom is er geen aparte stap na de cut: de code stond al live vanaf zijn
# eigen PR-merge, en een release voegt daar alleen een versienummer, een release-note en een tag aan
# toe. Block 2 van de cut-release-skill (de live-push) hoort hier dus niet te verschijnen -- een
# omschrijving invullen zou de skill een tweede deploy laten printen die niets nieuws naar buiten
# brengt en die suggereert dat de cut het moment van live gaan is.
$script:LiveStage = ''

function Get-LiveStage {
    <# Korte omschrijving van een aparte go-live-stap na de cut. Leeg = geen; zie de toelichting. #>
    return $script:LiveStage
}

# WIE deze repo met een release-document toespreekt. Dave's keuze, 2026-08-12, in antwoord op de enige
# blueprint-vraag die geen meting maar een beslissing verlangde.
#
# De bron kent twee SOORTEN publiek in plaats van twee sporten van een ladder: 1 is het management en
# de opdrachtgever, 2 is de abonnee van een dienst. Een repo heeft er precies een. Deze repo antwoordt
# 1, en de reden staat in Dave's eigen woorden: bezoekers lezen geen release notes. Wie djcylow.com
# bezoekt luistert een mix of boekt een boeking; die persoon opent nooit een versie-document. De site
# IS het product, en de mensen die er iets aan hebben dat versie 2.22.0 uitkwam zijn Dave en wie met
# hem aan dit project werkt.
#
# NIET DE 2 VAN DE BRON OVERGENOMEN, en dat is het hele punt van deze knop. De bron-repo is zelf de
# dienst waarop iemand zich abonneert, dus daar is 2 juist. Hier zou 2 beweren dat de bezoekers van een
# DJ-website release notes lezen -- onwaar, en door geen enkel script te weerleggen: beide waarden zijn
# geldig en geen van beide geeft ooit een fout. Een gekopieerde waarde is bovendien niet te
# onderscheiden van een afgewogen waarde zodra hij er staat, en verbergt dus of de vraag ooit is
# gesteld.
#
# WAT DIT WEL DOET: new-branch scaffoldt vanaf nu '#### Tier 0' en '#### Tier 1' in een nieuwe entry,
# en open-pr en cut-release vragen exact die twee compleet te zijn. Tier 0 staat buiten deze vraag --
# elke repo vraagt daar onvoorwaardelijk naar.
#
# WAT DIT NIET DOET: Get-EntryTierMax blijft 2, en die zegt welke tier-NUMMERS geldig zijn om te LEZEN.
# Die scheiding is de hele veiligheid van de knop. De entries op de openstaande branches dragen een
# '#### Tier 2'-sectie met N/A, en die moeten leesbaar blijven -- ze zijn onder het cumulatieve model
# geschreven. Een tier-1-repo die zijn eigen historie niet meer kan lezen is de stille variant van een
# leeggelopen release.
#
# LET OP bij het weghalen van deze functie: afwezig betekent hier NIET 'geen publiek' maar 'vraag naar
# elke tier die het model heeft' -- de stand van voor de knop. Wie hem verwijdert om de zaak te
# vereenvoudigen zet de vraag dus niet uit maar ruimer, en het gedeelde script meldt dat niet.
#
# DE DOCUMENTATIE LIEP HIER OP ACHTER EN IS OP 2026-08-13 BIJGETROKKEN. Het tier-blok noemde drie te
# beantwoorden tiers met 'Tier 2 -- een bezoeker van djcylow.com merkt het' en beschreef de ladder als
# cumulatief; beide waren met dit antwoord achterhaald. Die correctie is meegenomen op het moment dat
# het blok toch verhuisde: het staat nu in workflow-davekjohn/CONTRIBUTING.md ('Significance -- het verplichte
# tier-model') en vraagt tier 0 en tier 1, met de vervallen ladder erbij verantwoord. Een blok met een
# bekende fout verhuizen zou de fout hebben meegenomen naar een nieuw adres.
$script:ReleaseAudienceTier = 1

function Get-ReleaseAudienceTier {
    <# De ene publieks-tier waar een entry in deze repo naar gevraagd wordt, naast tier 0. Hier 1. #>
    return $script:ReleaseAudienceTier
}

# --- De vijf blueprint-vragen die bewust ONBEANTWOORD blijven --------------------------------------
#
# Een stub is hier erger dan een lege plek: zonder functie gebruikt het gedeelde script zijn
# gedocumenteerde fallback, en die is in alle vijf de gevallen het goede antwoord. Genoteerd zodat de
# volgende sessie dit niet opnieuw hoeft uit te zoeken en niemand ze "voor de volledigheid" bijzet.
#
# HET GETAL IS GEMETEN, NIET GETELD UIT DIT BLOK: check-script-contract.ps1 meldt elke niet-gedeclareerde
# optionele functie als [INFO], en dat aantal is de enige betrouwbare stand. Tot 2026-08-12 stond hier
# "drie" terwijl de header van dit bestand "vier" zei en de check er zes meldde -- twee handgeschreven
# tellingen die geen van beide klopten, want twee van de zes stonden nergens verantwoord. Loopt dit weer
# uit de pas, geloof de check.
#
# Get-EntrySignificanceEnabled -- of entries hun impact verklaren. De fallback is 'on' en dat is hier
#   juist: deze repo heeft het model geadopteerd en zijn entries dragen een tier-tabel. Een stub met
#   $true zou letterlijk hetzelfde zeggen als de fallback.
#
# Get-EntrySignificanceRubricLevels -- de tekst achter de scores 1 tot 5. De ingebouwde vijf banden
#   volstaan, en workflow-davekjohn/CONTRIBUTING.md heeft ze in eigen woorden in de tabel bij stap 3, inhoudelijk
#   gelijk (tot 2026-08-13 stond die tabel in CLAUDE.md).
#   OPNIEUW TE WEGEN nu het publiek op 1 staat: de contract-tekst noemt als reden voor een eigen
#   verwoording juist een repo wiens lezers geen ontwikkelaars zijn, en tier 1 is hier het management en
#   de opdrachtgever. Dat is een keuze en geen meting, dus hij wordt gesteld en niet stil gemaakt.
#
# Get-ReleasePluginTier -- de enige met een BEREKENDE fallback: het script kijkt zelf of
#   .claude-plugin/marketplace.json bestaat. Die map is hier niet, dus 'geen plugin-laag' rolt er al
#   uit. Een stub zou een correcte meting overschrijven met een waarde die niets nakijkt.
#
# Get-PrMergeMethod -- alleen gelezen door ship-pr.ps1, en die skill gebruikt deze repo bewust niet.
#   Geen lezer, dus geen waarde. De merge-vorm zelf staat in workflow-davekjohn/CONTRIBUTING.md, cyclus stap 6.
#
#   DE REDEN IS OP 2026-08-13 VERVANGEN, en dat is het opschrijven waard omdat de oude reden nu
#   ONJUIST is. Hier stond: "hij zou in een beweging mergen, en een merge is hier een deploy die apart
#   op Dave's woord wacht". Die tweede helft geldt niet meer -- de PR-regel is die dag gelijkgetrokken
#   met de bron en luidt nu "doorlopen tenzij", waarbij alleen werk in src/, public/ en
#   src/data/mixes/ nog wacht. Wie deze regel als bewijs voor de oude regel leest, leest een
#   achterstand.
#
#   De twee redenen die toen overbleven waren: (1) er is geen CI in deze repo, dus de status-check waar
#   ship-pr op wacht bestaat hier niet; en (2) de nieuwe regel vraagt een beoordeling per branch (raakt
#   dit de site of niet) die een skill die openen, mergen en folden in een run doet niet kan maken.
#
#   REDEN 1 IS DIEZELFDE DAG OOK VERVALLEN, precies zoals de regel hierboven voorspelde: sinds
#   2026-08-13 draait .github/workflows/ci.yml op elke PR. Er is dus wel een status-check. Wat overblijft
#   is reden 2, en die verdwijnt niet vanzelf -- het is een menselijke beoordeling, geen poort. Let op:
#   die check is voor een admin adviserend, maar om een ANDERE reden dan hier tot 2026-08-15 stond.
#   Branch protection bestaat wel degelijk (ruleset main-ci-gate, sinds 2026-08-13); het punt is dat
#   die bypass_actors heeft voor Admin en Maintain -- en dat MOET, anders blokkeert hij cut-release's
#   eigen push naar main.
#
# Get-ReleaseMajorMinMinors -- hoeveel minors een major-lijn moet hebben gehad voordat er een major
#   gecut mag worden. De default is 10 en die volstaat hier: de poort leest de minor-component van de
#   huidige versie, en die is 23 (v2.23.0), dus een major komt er ruim langs zonder eigen waarde.
#
#   DE REDEN DIE HIER TOT 2026-08-12 STOND WAS ONJUIST, en dat is het opschrijven waard omdat hij
#   plausibel klonk: "de bump-poort die dit leest staat uit zolang er geen consumer-laag is verklaard,
#   dus er is geen lezer". Die poort hangt niet aan de consumer-laag maar aan de impact-verklaring van
#   de wachtende entries -- cut-release.ps1 regel 459-467: hij schakelt zichzelf uit waar geen enkele
#   entry zijn impact heeft verklaard, want dan heeft de repo het model niet geadopteerd. Deze repo
#   heeft dat model al (Get-EntrySignificanceEnabled valt terug op 'on' en de entries dragen sinds de
#   entry-model-migratie een tier-tabel), dus er is wel degelijk een lezer, en dat was al zo voordat de
#   knop hierboven aanging. Twee onafhankelijke mechanismen die op elkaar leken.
#
#   WAT ER OP TE LETTEN VALT, voor wie hier ooit toch een waarde zet: de teller kijkt naar de minors
#   binnen de HUIDIGE major. Vlak na een v3.0.0 staat die op nul, en dan houdt de default een v4.0.0
#   tien minors lang tegen. Dat is iets om te weten, geen botsing: deze repo volgt sinds 2026-08-13
#   het model van de bron, waarin een major juist WEL een recap van de minors ervoor is
#   (CLAUDE.md, "Versienummer bepalen"). Het is nu geen probleem en bij de eerstvolgende major ook
#   niet; het wordt er een bij de major die daarop volgt.
#
#   Hier stond tot 2026-08-15 het tegendeel -- "waar een major een volledig redesign of een
#   framework-migratie is ... en niet een recap van tien minors zoals in de bron" -- met een
#   bronvermelding naar CLAUDE.md die de lezer dus naar de omgekeerde regel stuurde. De tabel die dat
#   comment aanhaalde is op 2026-08-13 vervangen; het comment bleef staan.
