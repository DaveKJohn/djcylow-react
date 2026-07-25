<#
.SYNOPSIS
    Repo-eigen configuratie voor de gedeelde workflow-scripts (single source of truth voor repo-data).

.DESCRIPTION
    Dot-source dit bestand vanuit een script:

        . (Join-Path $PSScriptRoot '..\repo-config.ps1')   # vanuit scripts/<map>/
        . (Join-Path $PSScriptRoot 'repo-config.ps1')       # vanuit scripts/ zelf

    Dit is het kleine, lokale blokje repo-data dat de gedeelde, repo-agnostische workflow-scripts
    inlezen. Die scripts wonen als single source of truth in de workshop-repo en reizen via de
    specialists-plugin naar deze consument; alles wat per repo verschilt woont hier.

    Levert Get-RepoName, Get-RepoBlobUrl, Get-LintScript, Get-RosterPath en Get-RosterIgnoredIds --
    samen het volledige contract dat scripts/sync/check-script-contract.ps1 afdwingt.

    Geen Set-StrictMode hier: dot-sourcen zou de strict-mode van het aanroepende script veranderen
    en daar losse code kunnen breken (zelfde reden als branch-info.ps1).

    Bewust puur ASCII (repo-conventie voor .ps1): Windows PowerShell 5.1 leest een BOM-loos script
    als ANSI en zou een accent-literal verhaspelen.
#>

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
# lint-web.ps1 checkt nu alleen `tsc --noEmit`; ESLint komt erbij zodra de bestaande 37 errors zijn
# opgeruimd -- de afweging staat in de header van dat script.
$script:LintScript = 'scripts\lint\lint-web.ps1'

function Get-LintScript {
    <# Repo-root-relatief pad naar de lint-poort die de open-pr-skill voor de PR draait. #>
    return $script:LintScript
}

# Het bestand dat het roster draagt (de specialisten-tabel/lijst). check-roster-sync.ps1 leest dit om
# te bepalen welke agent-ids "in het roster staan". Repo-root-relatief; in deze repo hoort dat in
# CLAUDE.md, net als in de andere consumenten. Er is bewust GEEN Get-RosterFormat: de check is
# format-agnostisch (hij zoekt per '<groep>-<id>'-token in de tekst) en werkt dus of het roster nu
# een tabel of een lijst is.
$script:RosterPath = 'CLAUDE.md'

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
