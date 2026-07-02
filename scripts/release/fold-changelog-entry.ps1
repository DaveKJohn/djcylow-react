<#
Vouwt een of meer changelog entry-bestanden (<branch-naam>.md in de repo-root) in de
[Unreleased] sectie van CHANGELOG.md, en verwijdert de entry-bestanden daarna.

Gebruik:
  .\scripts\release\fold-changelog-entry.ps1 -Branch feature/mix-bpm-filter
  .\scripts\release\fold-changelog-entry.ps1              # vouwt alle aanwezige entry-bestanden

Draai dit op main, direct na het mergen van een branch (nadat de gebruiker de merge heeft
goedgekeurd). Commit het resultaat (CHANGELOG.md + verwijderde entry-bestanden) daarna
rechtstreeks op main - dit is een van de toegestane directe main-commits.
#>

param(
    [string]$Branch
)

$ErrorActionPreference = "Stop"

$repoRoot = (git rev-parse --show-toplevel).Trim()
Set-Location $repoRoot

if ($Branch) {
    $entryFiles = @(($Branch -replace '/', '-') + ".md")
}
else {
    $reserved = @("CHANGELOG.md", "CLAUDE.md", "README.md")
    $entryFiles = Get-ChildItem -Path $repoRoot -Filter "*.md" -File |
        Where-Object { $reserved -notcontains $_.Name } |
        Select-Object -ExpandProperty Name
}

if ($entryFiles.Count -eq 0) {
    Write-Host "Geen entry-bestanden gevonden om te vouwen." -ForegroundColor Yellow
    exit 0
}

$changelogPath = Join-Path $repoRoot "CHANGELOG.md"
$headingPattern = '(?m)^## \[Unreleased\]\s*?$'

foreach ($file in $entryFiles) {
    $filePath = Join-Path $repoRoot $file
    if (-not (Test-Path $filePath)) {
        Write-Host "Entry-bestand '$file' niet gevonden - overgeslagen." -ForegroundColor Yellow
        continue
    }

    $entryContent = (Get-Content -Path $filePath -Raw -Encoding UTF8).TrimEnd()
    $changelogContent = Get-Content -Path $changelogPath -Raw -Encoding UTF8

    $usesCRLF = $changelogContent.Contains("`r`n")
    $nl = if ($usesCRLF) { "`r`n" } else { "`n" }
    $entryContent = ($entryContent -replace "`r`n", "`n") -replace "`n", $nl

    $headingMatch = [regex]::Match($changelogContent, $headingPattern)
    if (-not $headingMatch.Success) {
        Write-Host "Kon de '## [Unreleased]' heading niet vinden in CHANGELOG.md - stoppen." -ForegroundColor Red
        exit 1
    }
    $insertPos = $headingMatch.Index + $headingMatch.Length
    $newlineIdx = $changelogContent.IndexOf("`n", $insertPos)
    if ($newlineIdx -lt 0) {
        Write-Host "Kon geen regeleinde na de '## [Unreleased]' heading vinden - stoppen." -ForegroundColor Red
        exit 1
    }
    $insertPos = $newlineIdx + 1

    $entryBlock = "$nl$entryContent$nl$nl---$nl"
    $changelogContent = $changelogContent.Substring(0, $insertPos) + $entryBlock + $changelogContent.Substring($insertPos)

    Set-Content -Path $changelogPath -Value $changelogContent -Encoding UTF8 -NoNewline
    Remove-Item -Path $filePath -Force
    Write-Host "Gevouwen en verwijderd: $file" -ForegroundColor Green
}

Write-Host "CHANGELOG.md bijgewerkt." -ForegroundColor Green
