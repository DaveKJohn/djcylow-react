<#
.SYNOPSIS
    De poort van deze repo voor een Pull Request: TypeScript-typecheck plus de productie-build.

.DESCRIPTION
    Aangewezen via Get-LintScript in scripts\repo-config.ps1; de gedeelde open-pr-skill draait dit
    script voor de PR en blokkeert bij een niet-nul exitcode.

    WAAROM DE BUILD HIER STAAT
    --------------------------
    Het mergen van een Pull Request is in deze repo het live-moment: `gh pr merge` schrijft
    rechtstreeks in origin/main, en Netlify bouwt en publiceert bij elke push naar main. Deze poort
    is dus de laatste wacht voordat een wijziging op djcylow.com staat, en er is geen staging om het
    op te vangen. `tsc --noEmit` alleen is daarvoor niet genoeg: code kan typecheken en de build
    alsnog breken (een ontbrekend bestand, een fout in generateStaticParams, een import die alleen
    server-side mag). Kost ongeveer 6 seconden - verwaarloosbaar tegen een platliggende site.

    Wat hij checkt:
      1. `tsc --noEmit` over tsconfig.lint.json (de gewone tsconfig zonder de .next/types-includes,
         zodat de uitkomst niet afhangt van hoe vers de build-output is).
      2. `npm run build` - de static export die Netlify ook draait.

    Wat hij BEWUST nog niet checkt: ESLint. `npm run lint` meldt op dit moment 37 errors over 22
    bestanden in de bestaande codebase - grotendeels @typescript-eslint/ban-ts-comment,
    no-require-imports (in de Node-scripts, waar CommonJS legitiem is) en no-explicit-any. Die als
    poort aanzetten zou vandaag elke PR blokkeren op werk dat niets met die PR te maken heeft.
    Zodra die schoonmaak is gedaan hoort de ESLint-stap hier alsnog bij (zie het TODO-blok onder).

    Handmatig draaien:  powershell -NoProfile -File scripts\lint\lint-web.ps1
    Alleen de typecheck: powershell -NoProfile -File scripts\lint\lint-web.ps1 -SkipBuild

    -SkipBuild is er om tijdens het herstellen van typefouten niet elke keer 6 seconden te wachten.
    Sla hem niet over in de poort zelf: dan valt precies de wacht weg die dit script toevoegt.

    Bewust puur ASCII (repo-conventie voor .ps1).
#>

[CmdletBinding()]
param(
    # Alleen voor lokaal itereren; de PR-poort hoort de build wel te draaien.
    [switch]$SkipBuild
)

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

    # TODO (eigen branch): ESLint als derde poort-stap, zodra de 37 bestaande errors zijn
    # opgeruimd. Dan hier toevoegen:
    #   $eslintOutput = & npx --no-install eslint . 2>&1
    #   if ($LASTEXITCODE -ne 0) { ... exit 1 }

    Write-Host ""
    if ($SkipBuild) {
        Write-Host "-- Build (overgeslagen via -SkipBuild)" -ForegroundColor DarkYellow
        Write-Host "  [LET OP] de build is de laatste wacht voor een live deploy -- draai hem voor de PR." -ForegroundColor DarkYellow
    }
    else {
        Write-Host "-- Build (npm run build, static export)" -ForegroundColor Gray
        # Bewust GEEN 2>&1 hier: in PowerShell 5.1 wikkelt dat de stderr van een native commando in
        # ErrorRecords, wat de echte buildfout onder een muur van NativeCommandError-ruis begraaft.
        # Zonder redirect stroomt stderr rechtstreeks naar de console en houden we stdout over om
        # het paginatal uit te lezen. De uitkomst beoordelen we op $LASTEXITCODE, niet op $?.
        $buildOutput = & npm run build
        $buildExit = $LASTEXITCODE

        if ($buildExit -ne 0) {
            $buildOutput | ForEach-Object { Write-Host $_ }
            Write-Host ""
            Write-Host "Samenvatting: de build faalt -- de poort blokkeert." -ForegroundColor Red
            Write-Host "Mergen zou een kapotte site opleveren: elke merge naar main gaat direct live." -ForegroundColor Red
            exit 1
        }

        # Het aantal gegenereerde pagina's meemelden: een build die slaagt maar plots veel minder
        # pagina's oplevert is ook een signaal (bijvoorbeeld een generateStaticParams die stilvalt).
        # Defensief: geen match mag hier nooit de poort laten struikelen, dus geen property-toegang
        # op een mogelijk leeg resultaat (Set-StrictMode zou daarop een fout gooien).
        $pages = ''
        foreach ($line in $buildOutput) {
            $m = [regex]::Match([string]$line, 'Generating static pages.*?\((\d+)/(\d+)\)')
            if ($m.Success) { $pages = $m.Groups[2].Value }
        }
        if ($pages -ne '') {
            Write-Host "  [OK]    build geslaagd -- $pages statische pagina's" -ForegroundColor Green
        }
        else {
            Write-Host "  [OK]    build geslaagd" -ForegroundColor Green
        }
    }

    Write-Host ""
    Write-Host "Samenvatting: 0 fout(en). De poort staat open." -ForegroundColor Green
    exit 0
}
finally {
    Pop-Location
}
