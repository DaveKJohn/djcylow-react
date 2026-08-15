<#
.SYNOPSIS
  Draait een gedeeld workflow-script uit de geinstalleerde plugin, op de juiste versie.

.DESCRIPTION
  De workflow-scripts van de specialists-plugin wonen in de plugin-cache onder een map per
  uitgebrachte versie. Een skill uit de plugin zelf krijgt dat pad aangereikt via
  ${CLAUDE_PLUGIN_ROOT}; een repo-eigen skill niet, en die zou het pad dus moeten hardcoderen --
  inclusief het versienummer, dat bij elke plugin-update verschuift.

  Dit script lost dat pad op het moment van draaien op, zodat de repo-eigen skills in
  .claude/skills/ een plugin-update overleven zonder aanpassing.

  Waarom die skills bestaan: acht van de tien plugin-skills dragen
  `disable-model-invocation: true` -- de guardrail van de bron tegen autonoom pushen, mergen en
  releasen. Deze repo wil die stappen wel door een specialist kunnen laten uitvoeren en heeft
  daarvoor eigen slash-skills die hierlangs lopen. De keuze en de afweging staan in
  CLAUDE.md; dit script is alleen het mechanisme.

  Belangrijk: dit dupliceert geen enkel gedeeld script. Het lost een pad op en draait het
  origineel uit de cache -- de kopie die ook een plugin-skill zou draaien.

.PARAMETER Script
  Pad van het gedeelde script, relatief aan de scripts-map van de plugin.
  Bijvoorbeeld: release/open-pr.ps1

.PARAMETER Plugin
  Naam van de plugin in de cache. Standaard workflow-davekjohn.

.PARAMETER Rest
  Alle overige argumenten worden ongewijzigd doorgegeven aan het gedeelde script.

.EXAMPLE
  powershell -NoProfile -File scripts/task/shared.ps1 -Script release/open-pr.ps1 -NoResolves

  Gebruik geen `--` om de argumenten te scheiden: PowerShell leest dat bij -File zelf als een
  parameternaam en stopt met "the parameter name '' is ambiguous". Het is ook niet nodig --
  alles wat niet -Script of -Plugin heet, valt vanzelf in -Rest.
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory)][string]$Script,
    [string]$Plugin = 'workflow-davekjohn',
    [Parameter(ValueFromRemainingArguments)][string[]]$Rest
)

$ErrorActionPreference = 'Stop'

$cacheRoot = Join-Path $HOME ".claude/plugins/cache/claude-code-specialists/$Plugin"

if (-not (Test-Path $cacheRoot)) {
    Write-Error "Plugin-cache niet gevonden: $cacheRoot`nStaat de plugin '$Plugin' geinstalleerd? Zie CLAUDE.md, sectie Scripts."
    exit 1
}

# Sorteren als [version] en niet als tekst: anders wint '3.9.0' van '3.10.0'.
$versies = Get-ChildItem -Path $cacheRoot -Directory |
    ForEach-Object {
        $parsed = $null
        if ([version]::TryParse($_.Name, [ref]$parsed)) {
            [pscustomobject]@{ Versie = $parsed; Pad = $_.FullName }
        }
    } |
    Sort-Object Versie -Descending

if (-not $versies) {
    Write-Error "Geen enkele versiemap gevonden in $cacheRoot."
    exit 1
}

$nieuwste = $versies[0]
$doel = Join-Path $nieuwste.Pad "scripts/$Script"

if (-not (Test-Path $doel)) {
    Write-Error "Gedeeld script niet gevonden: $doel`nDe plugin staat op $($nieuwste.Versie). Klopt het pad '$Script'?"
    exit 1
}

Write-Host "-- gedeeld script via $Plugin $($nieuwste.Versie)" -ForegroundColor DarkGray
Write-Host "   $doel" -ForegroundColor DarkGray
Write-Host ""

# Doorgeven met @Rest, zodat vlaggen als -Resolves 47 ongewijzigd aankomen.
# Eerst op 0 zetten: een .ps1 die via & wordt aangeroepen en zelf geen `exit` doet, laat de
# LASTEXITCODE van de vorige aanroep staan. Zonder dit meldde een geslaagde run exit 255.
$global:LASTEXITCODE = 0

if ($Rest) {
    & $doel @Rest
} else {
    & $doel
}

$code = if ($null -eq $LASTEXITCODE) { 0 } else { $LASTEXITCODE }
exit $code
