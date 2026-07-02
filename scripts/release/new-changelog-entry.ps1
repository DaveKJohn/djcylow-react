<#
Maakt het changelog entry-bestand voor de huidige branch aan in de repo-root:
<branch-naam-met-koppeltekens>.md, met branch-naam, datum en branch-type al ingevuld.

Gebruik:
  .\scripts\release\new-changelog-entry.ps1 -Title "Korte titel van de wijziging"

Branch-type wordt afgeleid uit het branch-prefix (feature/fix/data/content/style/docs/config).
Onbekend prefix -> valt terug op "Config" met een waarschuwing, zelf aanpassen in het bestand.
#>

param(
    [string]$Title = "TODO: titel"
)

$ErrorActionPreference = "Stop"

$branch = (git rev-parse --abbrev-ref HEAD).Trim()
if ($branch -eq "main") {
    Write-Host "Je zit op main - maak eerst een branch aan." -ForegroundColor Red
    exit 1
}

$typeMap = @{
    "feature" = "Feature"
    "fix"     = "Fix"
    "data"    = "Data"
    "content" = "Content"
    "style"   = "Style"
    "docs"    = "Docs"
    "config"  = "Config"
}

$prefix = ($branch -split '/')[0]
$branchType = $typeMap[$prefix]
if (-not $branchType) {
    $branchType = "Config"
    Write-Host "Onbekend branch-prefix '$prefix' - 'Branch type' op 'Config' gezet, pas dit handmatig aan indien nodig." -ForegroundColor Yellow
}

$fileName = ($branch -replace '/', '-') + ".md"
$repoRoot = (git rev-parse --show-toplevel).Trim()
$filePath = Join-Path $repoRoot $fileName

if (Test-Path $filePath) {
    Write-Host "Entry-bestand '$fileName' bestaat al - niets gedaan." -ForegroundColor Yellow
    exit 0
}

$today = Get-Date -Format "yyyy-MM-dd"

$template = @"
### $Title
**Branch naam** $branch
**Datum merge op main** $today
**Branch type** $branchType

TODO: korte beschrijving van wat er veranderd is op deze branch.
"@

Set-Content -Path $filePath -Value $template -Encoding UTF8
Write-Host "Aangemaakt: $fileName" -ForegroundColor Green
