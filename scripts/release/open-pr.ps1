<#
.SYNOPSIS
    Push de huidige branch en open een Pull Request naar main (workflow-CLAUDE.md stap 4).

.DESCRIPTION
    Pusht de huidige feature-branch naar origin en maakt een PR naar main via de GitHub CLI.
    Vangrail: weigert als je op main staat. Gebruikt .github/pull_request_template.md als
    startpunt voor de PR-body tenzij je zelf -Body meegeeft (LET OP: gh pr create --fill vult de
    body met de volledige commit-geschiedenis sinds main, niet met de template -- gebruik dat dus
    niet als je de checklist-template wil). Deze repo heeft zowel een origin- als een
    upstream-remote naar dezelfde GitHub-URL, wat gh pr create's automatische branch-detectie in
    de war stuurt -- daarom altijd expliciet --repo meegeven.

.PARAMETER Title
    PR-titel, bv. "feature: mix bpm filter" of "fix: audio player volume".

.PARAMETER Body
    (Optioneel) PR-omschrijving. Standaard: de inhoud van .github/pull_request_template.md, zodat
    je de checklist nog op github.com kan invullen/afvinken.

.EXAMPLE
    ./scripts/release/open-pr.ps1 -Title "feature: mix bpm filter"
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$Title,
    [string]$Body = ''
)
$ErrorActionPreference = 'Stop'

$repo = 'DaveKJohn/djcylow-react'

$branch = (git rev-parse --abbrev-ref HEAD).Trim()
if ($branch -eq 'main') { Write-Error "Je staat op main; een PR maak je vanaf een feature-branch."; exit 1 }

git push -u origin $branch
if ($LASTEXITCODE -ne 0) { Write-Error "git push mislukte."; exit 1 }

if (-not $Body) {
    $repoRoot = (git rev-parse --show-toplevel).Trim()
    $templatePath = Join-Path $repoRoot ".github\pull_request_template.md"
    if (Test-Path $templatePath) {
        $Body = Get-Content -Path $templatePath -Raw -Encoding UTF8
    }
}

gh pr create --base main --head $branch --title $Title --body $Body --repo $repo
if ($LASTEXITCODE -ne 0) { Write-Error "PR aanmaken mislukte (is gh ingelogd?)."; exit 1 }
Write-Host "PR aangemaakt voor '$branch'." -ForegroundColor Green
