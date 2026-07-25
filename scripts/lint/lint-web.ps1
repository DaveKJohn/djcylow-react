<#
.SYNOPSIS
    De lint-poort van deze repo: TypeScript-typecheck over de broncode.

.DESCRIPTION
    Aangewezen via Get-LintScript in scripts\repo-config.ps1; de gedeelde open-pr-skill draait dit
    script voor de PR en blokkeert bij een niet-nul exitcode.

    Wat hij checkt: `tsc --noEmit` over tsconfig.lint.json (de gewone tsconfig zonder de
    .next/types-includes, zodat de uitkomst niet afhangt van hoe vers de build-output is).

    Wat hij BEWUST nog niet checkt: ESLint. `npm run lint` meldt op dit moment 37 errors over 22
    bestanden in de bestaande codebase - grotendeels @typescript-eslint/ban-ts-comment,
    no-require-imports (in de Node-scripts, waar CommonJS legitiem is) en no-explicit-any. Die als
    poort aanzetten zou vandaag elke PR blokkeren op werk dat niets met die PR te maken heeft.
    Zodra die schoonmaak is gedaan hoort de ESLint-stap hier alsnog bij (zie het TODO-blok onder).

    Handmatig draaien:  powershell -NoProfile -File scripts\lint\lint-web.ps1

    Bewust puur ASCII (repo-conventie voor .ps1).
#>

[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Push-Location $repoRoot
try {
    Write-Host "== lint-web -- $repoRoot ==" -ForegroundColor Cyan
    Write-Host ""

    # Zonder afhankelijkheden faalt tsc met een cryptische melding; dat willen we niet als
    # eerste ervaring van de open-pr-poort.
    if (-not (Test-Path (Join-Path $repoRoot 'node_modules'))) {
        Write-Host "[ERROR] node_modules ontbreekt -- draai eerst 'npm ci' (of 'npm install')." -ForegroundColor Red
        exit 1
    }

    Write-Host "-- TypeScript (tsc --noEmit, tsconfig.lint.json)" -ForegroundColor Gray
    $tscOutput = & npx --no-install tsc --noEmit --project tsconfig.lint.json 2>&1
    $tscExit = $LASTEXITCODE

    if ($tscExit -ne 0) {
        $tscOutput | ForEach-Object { Write-Host $_ }
        Write-Host ""
        Write-Host "Samenvatting: TypeScript-fouten gevonden -- de poort blokkeert." -ForegroundColor Red
        exit 1
    }

    Write-Host "  [OK]    geen TypeScript-fouten" -ForegroundColor Green

    # TODO (eigen branch): ESLint als tweede poort-stap, zodra de 37 bestaande errors zijn
    # opgeruimd. Dan hier toevoegen:
    #   $eslintOutput = & npx --no-install eslint . 2>&1
    #   if ($LASTEXITCODE -ne 0) { ... exit 1 }

    Write-Host ""
    Write-Host "Samenvatting: 0 fout(en). De poort staat open." -ForegroundColor Green
    exit 0
}
finally {
    Pop-Location
}
