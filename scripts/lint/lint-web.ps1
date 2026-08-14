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
      2. `eslint .` - sinds 2026-08-14, zie hieronder.
      3. `npm run build` - de static export die Netlify ook draait.

    ESLINT STOND HIER LANG BUITEN, EN WAAROM DAT VERANDERDE
    -------------------------------------------------------
    Er stonden 37 pre-existing errors in de codebase. Die als poort aanzetten zou elke PR blokkeren
    op werk dat er niets mee te maken had, dus stond ESLint erbuiten met de instructie "vergelijk
    het AANTAL, niet de exitcode". Dat maakte deze poort de enige die een mens met het blote oog
    moest aflezen -- een afspraak die precies zo lang standhoudt als iemand hem onthoudt, en die
    nergens werd gecontroleerd.

    Op 2026-08-14 is die achterstand naar 0 gebracht en is de stap hier toegevoegd. De telling is
    daarmee vervangen door een check.

    Errors blokkeren; WARNINGS NIET -- maar hun aantal wordt wel gemeld, en dat staat sinds
    2026-08-14 op 0. Zie ze dus niet als ruis: de laatste ronde warnings bevatte een ongebruikte
    import van EmailDisplay in ContactForm, terwijl het e-mailadres daar drie regels verderop voluit
    in de tekst stond. Die component bestaat juist om dat adres uit de statische HTML te houden. In
    een lijst van acht bekende meldingen valt niet op welke er een te veel is; bij 0 is elke nieuwe
    melding per definitie van jou.

    De achterstand ging van 37 naar 0 in drie stappen:
      - 10x no-require-imports in scripts/ en netlify/functions/ - CommonJS in Node-land, dus geen
        fout maar een ontbrekende override in eslint.config.mjs.
      - 14x ban-ts-comment, allemaal een overbodige @ts-ignore boven een stylesheet-import. Gemeten
        in plaats van aangenomen: tsc accepteert die imports gewoon, want next-env.d.ts levert de
        declaratie al. Er is dus GEEN eigen .d.ts nodig - de regels konden simpelweg weg.
      - 13x echte code: 4x react-hooks/set-state-in-effect, 5x no-explicit-any, 4x
        no-unescaped-entities.

    Handmatig draaien:   powershell -NoProfile -File scripts\lint\lint-web.ps1
    Zonder de build:     powershell -NoProfile -File scripts\lint\lint-web.ps1 -SkipBuild

    -SkipBuild is er om tijdens het herstellen van typefouten niet elke keer 6 seconden te wachten;
    tsc en ESLint draaien dan gewoon door. Sla hem niet over in de poort zelf: dan valt precies de
    wacht weg die dit script toevoegt.

    Bewust puur ASCII (repo-conventie voor .ps1).
#>

[CmdletBinding()]
param(
    # Alleen voor lokaal itereren; de PR-poort hoort de build wel te draaien.
    [switch]$SkipBuild
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Dit script draait op twee plekken: lokaal onder Windows PowerShell 5.1, en sinds 2026-08-13 in
# .github/workflows/ci.yml onder pwsh 7 op Linux. PowerShell 7 kan een native commando met een
# exitcode <> 0 als terminating error gooien zodra PSNativeCommandUseErrorActionPreference aanstaat,
# en dat botst met de opzet hier: tsc en de build worden bewust op $LASTEXITCODE beoordeeld, zodat dit
# script zijn eigen samenvatting kan printen in plaats van een ruwe exception te laten ontsnappen. De
# poort blokkeert in beide gevallen, maar alleen zo staat er ook bruikbaar waarom. PS 5.1 kent de
# variabele niet; daar is de Test-Path simpelweg $false.
if (Test-Path variable:PSNativeCommandUseErrorActionPreference) {
    $PSNativeCommandUseErrorActionPreference = $false
}

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

    Write-Host ""
    Write-Host "-- ESLint (npm run lint)" -ForegroundColor Gray
    # Bewust GEEN 2>&1, om dezelfde reden als bij de build hieronder: in PowerShell 5.1 wikkelt dat
    # de stderr van een native commando in ErrorRecords en begraaft het de echte melding onder
    # NativeCommandError-ruis. We beoordelen op $LASTEXITCODE, niet op $?.
    $eslintOutput = & npx --no-install eslint .
    $eslintExit = $LASTEXITCODE

    if ($eslintExit -ne 0) {
        $eslintOutput | ForEach-Object { Write-Host $_ }
        Write-Host ""
        Write-Host "Samenvatting: ESLint-fouten gevonden -- de poort blokkeert." -ForegroundColor Red
        exit 1
    }

    # Warnings blokkeren niet, maar ze verdwijnen ook niet in stilte: het aantal hoort zichtbaar te
    # zijn, anders groeit het ongemerkt terug naar de achterstand die deze poort net heeft opgeruimd.
    # Defensief, net als het paginatal: geen match mag de poort nooit laten struikelen.
    $warnCount = ''
    foreach ($line in $eslintOutput) {
        $m = [regex]::Match([string]$line, '(\d+)\s+warnings?\)')
        if ($m.Success) { $warnCount = $m.Groups[1].Value }
    }
    if ($warnCount -ne '' -and $warnCount -ne '0') {
        Write-Host "  [OK]    geen ESLint-errors ($warnCount warning(s), die blokkeren niet)" -ForegroundColor Green
    }
    else {
        Write-Host "  [OK]    geen ESLint-errors" -ForegroundColor Green
    }

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
