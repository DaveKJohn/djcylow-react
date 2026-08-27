<#
.SYNOPSIS
    Gedeelde branch-conventies voor de workflow-scripts (repo-eigen prefix-tabel).

.DESCRIPTION
    Dot-source dit bestand vanuit een script:

        . (Join-Path $PSScriptRoot '..\lib\branch-info.ps1')

    Levert Get-BranchTypes, Get-BranchPrefix, Get-BranchInfo en Test-BranchName. De prefix-tabel
    bepaalt zowel het GitHub-label van de PR als het branch-type van de changelog-entry, en is PER
    REPO anders.

    De canonieke bron van de taxonomie is de tabel in contributing-davekjohn/CONTRIBUTING.md, onder "De
    prefixen: zeven die je kiest, negen die de lib kent"; deze tabel spiegelt die. (Tot 2026-08-13
    stond die tabel in CLAUDE.md, onder "Ontwikkelworkflow" stap 2; tot 2026-08-16 stond de pagina
    zelf in de repo-root; tot 2026-08-27 heette de map workflow-davekjohn/.) Leid hem niet af uit de
    git-historie - die mist prefixen die wel
    bestaan (zo ontbrak style/ erin). De labels volgen de standaard GitHub-labels: enhancement / bug /
    documentation. Wijzigt de taxonomie? Dan op beide plekken - en nergens anders: alle scripts
    lezen deze ene tabel.

    Geen Set-StrictMode hier: dot-sourcen zou de strict-mode van het aanroepende script veranderen
    en daar losse code kunnen breken (zelfde reden als repo-config.ps1).

    Bewust puur ASCII (repo-conventie voor .ps1): Windows PowerShell 5.1 leest een BOM-loos script
    als ANSI en zou een accent-literal verhaspelen.
#>

# De canonieke branch-typen in release-notes-volgorde: eerst wat de bezoeker van djcylow.com merkt
# (nieuwe functionaliteit, fixes, nieuwe mixen/teksten), daarna het interne werk.
$script:BranchTypeOrder = @('Feature', 'Fix', 'Data', 'Content', 'Style', 'Config', 'Docs', 'Chore')

# prefix -> GitHub-label (PR) + branch-type (changelog-entry).
# Let op: een release loopt NIET via een branch/PR, dus er is bewust geen 'release'-prefix.
$script:BranchPrefixTable = @{
    feature = @{ Label = 'enhancement';   Type = 'Feature' }
    feat    = @{ Label = 'enhancement';   Type = 'Feature' }
    fix     = @{ Label = 'bug';           Type = 'Fix' }
    data    = @{ Label = 'enhancement';   Type = 'Data' }
    content = @{ Label = 'enhancement';   Type = 'Content' }
    style   = @{ Label = 'enhancement';   Type = 'Style' }
    config  = @{ Label = 'documentation'; Type = 'Config' }
    docs    = @{ Label = 'documentation'; Type = 'Docs' }
    chore   = @{ Label = 'documentation'; Type = 'Chore' }
}

function Get-BranchTypes {
    <# De canonieke branch-typen in release-notes-volgorde (SSOT voor de release-scripts). #>
    return $script:BranchTypeOrder
}

function Get-BranchPrefix {
    param([Parameter(Mandatory = $true)][string]$Branch)
    # 'fix/naam' -> 'fix'; zonder slash geldt het stuk voor het eerste koppelteken
    if ($Branch -match '/') { return ($Branch -split '/')[0] }
    return ($Branch -split '-')[0]
}

function Get-BranchInfo {
    param([Parameter(Mandatory = $true)][string]$Branch)
    $prefix = Get-BranchPrefix -Branch $Branch
    $known  = $script:BranchPrefixTable.ContainsKey($prefix)
    [pscustomobject]@{
        Branch   = $Branch
        Prefix   = $prefix
        IsKnown  = $known
        Label    = $(if ($known) { $script:BranchPrefixTable[$prefix].Label } else { $null })
        Type     = $(if ($known) { $script:BranchPrefixTable[$prefix].Type } else { $null })
        # Dezelfde naam wordt gebruikt voor het changelog-entry-bestand <SafeName>.md in de repo-root.
        SafeName = $Branch -replace '/', '-'
    }
}

function Test-BranchName {
    <#
        Additieve SSOT-helper (naast Get-BranchInfo) voor scripts die een branch-naam moeten
        VALIDEREN voordat ze hem gebruiken (bv. new-branch.ps1), in plaats van de hard-reject-regels
        inline te herhalen. Raakt Get-BranchInfo/Get-BranchTypes/de prefix-tabel niet aan.

        Harde afwijzingen (IsValid = $false, Reason ingevuld):
          - lege naam / alleen witruimte
          - naam gelijk aan 'main'
          - naam bevat de deelstring 'final' (hoofdletterongevoelig, dus ook 'finalize' --
            bewust breed)

        Een onbekende prefix is GEEN harde afwijzing (IsValid blijft $true); de aanroeper leest
        IsKnown en bepaalt zelf of er een zachte waarschuwing nodig is, consistent met
        new-changelog-entry/open-pr die bij een onbekende prefix ook terugvallen
        (Chore/'question') in plaats van te blokkeren.
    #>
    param([Parameter(Mandatory = $true)][AllowEmptyString()][string]$Branch)

    if ([string]::IsNullOrWhiteSpace($Branch)) {
        return [pscustomobject]@{ IsValid = $false; Reason = "Branch name must not be empty."; IsKnown = $false }
    }
    if ($Branch -eq 'main') {
        return [pscustomobject]@{ IsValid = $false; Reason = "Branch name must not be 'main'."; IsKnown = $false }
    }
    if ($Branch -match 'final') {
        return [pscustomobject]@{ IsValid = $false; Reason = "Branch name must not contain the token 'final'."; IsKnown = $false }
    }

    $info = Get-BranchInfo -Branch $Branch
    [pscustomobject]@{ IsValid = $true; Reason = $null; IsKnown = $info.IsKnown }
}
