<#
.SYNOPSIS
    Gedeelde branch-conventies voor de workflow-scripts (repo-eigen prefix-tabel).
.DESCRIPTION
    Door specialists-init als VUL-IN-scaffold neergezet. Levert Get-BranchTypes, Get-BranchPrefix en
    Get-BranchInfo. De prefix-tabel bepaalt het GitHub-label van de PR en het changelog-entry-type en
    is PER REPO anders -- vul hieronder je eigen branch-taxonomie in (de tabel is bewust leeg).

    Geen Set-StrictMode hier: dot-sourcen zou de strict-mode van het aanroepende script veranderen.
    Puur ASCII (repo-conventie voor .ps1).
#>

# VUL-IN: de canonieke branch-typen in release-notes-volgorde, bv. @('Feat', 'Fix', 'Docs', 'Chore').
$script:BranchTypeOrder = @()

# VUL-IN: prefix -> GitHub-label (PR) + branch-type (changelog-entry). Voorbeeld:
#   feat  = @{ Label = 'enhancement';   Type = 'Feat' }
#   fix   = @{ Label = 'bug';           Type = 'Fix' }
#   docs  = @{ Label = 'documentation'; Type = 'Docs' }
#   chore = @{ Label = 'documentation'; Type = 'Chore' }
$script:BranchPrefixTable = @{
}

function Get-BranchTypes {
    return $script:BranchTypeOrder
}

function Get-BranchPrefix {
    param([Parameter(Mandatory = $true)][string]$Branch)
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
        SafeName = $Branch -replace '/', '-'
    }
}
