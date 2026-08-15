<#
Wisselt tussen het werk-account en het prive-account voor GitHub (gh CLI +
git push/pull) en Claude Code.

Gebruik:
  .\scripts\env\switch-account.ps1 work        -> wisselt naar werk (davekokbwj)
  .\scripts\env\switch-account.ps1 personal    -> wisselt naar prive (DaveKJohn)

Dit ene script kun je in zowel je werk-repo als je prive-repo zetten - de
inhoud is overal identiek, jij bepaalt met het argument welke kant op.

Wat dit script WEL doet:
  - gh CLI actief account omzetten naar het gekozen account
  - "gh auth setup-git" draaien, zodat git ook echt "gh auth git-credential"
    gebruikt als credential helper voor github.com (in plaats van bijvoorbeeld
    Windows' eigen Git Credential Manager, die los staat van gh CLI en dus
    niet automatisch meewisselt - dat gaf eerder "Repository not found"-fouten)
  - Als het gekozen account nog niet is ingelogd bij gh CLI (bijvoorbeeld
    omdat een vorige keer volledig is uitgelogd), automatisch de
    "gh auth login" browser-flow starten zodat je meteen kan inloggen
  - Het andere account volledig uitloggen bij gh CLI, zodat er nog maar 1
    GitHub-account op deze machine actief is
  - Claude Code uitloggen en de login-flow starten voor het bijbehorende
    e-mailadres

Wat dit script NIET doet:
  - De lokale git user.name/user.email van de map waarin je het draait
    aanpassen. Dit script is bedoeld als "opstapje": je draait het vanuit
    de repo waar je nu toevallig zit om je omgeving klaar te zetten, niet
    om de commit-identiteit van de huidige repo te wijzigen.

Wat dit script NIET kan doen (geen CLI-ondersteuning voor):
  - VS Code's eigen "Sign in with GitHub" (account-icoon linksonder, gebruikt
    voor Settings Sync/Copilot) - moet handmatig via de VS Code UI
  - De Claude-login zelf voltooien - er opent een browser voor OAuth, dat
    moet je zelf afronden (inclusief eventuele 2FA)

Let op: het uitloggen van het andere account bij gh CLI betekent dat je bij
het terugwisselen daarnaartoe opnieuw moet inloggen via de browser (incl.
2FA) - dit script start die login-stap automatisch, maar jij moet 'm zelf
afronden.
#>

param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("work", "personal")]
    [string]$Naar
)

$ErrorActionPreference = "Stop"

$accounts = @{
    work     = @{
        GitHubUser = "davekokbwj"
        Label      = "werk"
    }
    personal = @{
        GitHubUser = "DaveKJohn"
        Label      = "prive"
    }
}

<#
DE E-MAILADRESSEN STAAN NIET MEER IN DIT BESTAND.

Ze stonden hier voluit, in een gecommit script in een PUBLIEKE repo, dus via GitHub-codesearch te
vinden. Wrang detail: dat was dezelfde repo die op src-niveau juist moeite doet om info@djcylow.com
uit de HTML te houden (zie EmailDisplay).

Ze komen nu uit accounts.local.ps1 naast dit script - gitignored, dus lokaal en niet gedeeld. Zie
accounts.local.example.ps1 voor de vorm. Ontbreekt dat bestand, dan draait de Claude-login gewoon
ZONDER --email en kies je het account in de browser; het script blijft dus bruikbaar zonder setup.

Dit haalt het adres uit de huidige tree, NIET uit de git-history. Dat laatste vraagt een rewrite van
gepubliceerde commits en is een aparte beslissing van Dave.
#>
$claudeEmails = @{}
$lokaal = Join-Path $PSScriptRoot 'accounts.local.ps1'
if (Test-Path $lokaal) {
    # Dot-source: het bestand zet $ClaudeEmails in deze scope. De Test-Path op de variabele erna is
    # geen overdaad -- een leeg of half ingevuld bestand hoort hier stil te eindigen in "geen adres
    # bekend", niet in een fout, en onder een latere Set-StrictMode zou een kale verwijzing gooien.
    . $lokaal
    if ((Test-Path variable:ClaudeEmails) -and $ClaudeEmails -is [hashtable]) {
        $claudeEmails = $ClaudeEmails
    }
}

<#
.SYNOPSIS
    Haalt `gh auth status` op zonder dat het script erover struikelt.

.DESCRIPTION
    `gh auth status` schrijft naar stderr en geeft exit 1 zodra er GEEN account is ingelogd -- en dat
    is precies de situatie waarvoor het herstelpad hieronder bestaat ("nog niet ingelogd -> start de
    browser-flow"). Met $ErrorActionPreference = "Stop" maakt `2>&1` van die stderr een ErrorRecord
    die PowerShell als terminating error gooit, dus het script stierf op regel 76 in het enige geval
    dat regel 77-93 zegt op te vangen. Gereproduceerd onder PS 5.1:

        $ErrorActionPreference='Stop'; & cmd /c 'echo oops 1>&2 & exit 1' 2>&1   ->  RemoteException

    Wie wel is ingelogd merkte niets (exit 0, 0 bytes stderr) -- daarom is dit nooit opgevallen.

    Beoordeeld wordt op de TEKST en niet op de exitcode: bij "geen account" is de melding zelf het
    antwoord dat de aanroeper nodig heeft. Dezelfde aanpak die scripts\lint\lint-web.ps1 al kiest;
    die kennis stond daar gedocumenteerd en was hierheen niet gereisd.
#>
function Get-GhAuthStatus {
    $vorige = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        return (& gh auth status 2>&1 | Out-String)
    }
    catch {
        # Vangnet voor het geval gh helemaal niet te starten is; dan is de melding zelf de status.
        return ($_ | Out-String)
    }
    finally {
        $ErrorActionPreference = $vorige
    }
}

$target = $accounts[$Naar]
if ($Naar -eq "work") {
    $otherKey = "personal"
}
else {
    $otherKey = "work"
}
$other = $accounts[$otherKey]

Write-Host "== GitHub CLI ==" -ForegroundColor Cyan

$ghStatus = Get-GhAuthStatus
if ($ghStatus -notmatch [regex]::Escape($target.GitHubUser)) {
    Write-Host "Account '$($target.GitHubUser)' is nog niet ingelogd via gh CLI." -ForegroundColor Yellow
    Write-Host "Er wordt nu een login gestart - rond die af in de geopende browser (incl. eventuele 2FA)." -ForegroundColor Yellow

    & gh auth login --hostname github.com --git-protocol https --web
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Inloggen bij gh CLI is mislukt of afgebroken." -ForegroundColor Red
        exit 1
    }

    $ghStatus = Get-GhAuthStatus
    if ($ghStatus -notmatch [regex]::Escape($target.GitHubUser)) {
        Write-Host "Na het inloggen staat '$($target.GitHubUser)' nog steeds niet in 'gh auth status'." -ForegroundColor Red
        Write-Host "Controleer of je in de browser met het juiste account bent ingelogd en probeer het script opnieuw." -ForegroundColor Red
        exit 1
    }
}

& gh auth switch -h github.com -u $target.GitHubUser
if ($LASTEXITCODE -ne 0) {
    Write-Host "Omschakelen naar '$($target.GitHubUser)' is mislukt." -ForegroundColor Red
    exit 1
}

& gh auth setup-git
if ($LASTEXITCODE -ne 0) {
    Write-Host "'gh auth setup-git' is mislukt - git gebruikt mogelijk niet gh CLI als credential helper." -ForegroundColor Yellow
    Write-Host "Controleer handmatig: git config --get credential.helper (moet gh-gerelateerd zijn, niet 'manager')." -ForegroundColor Yellow
}

Write-Host "gh CLI + git push/pull staan nu op '$($target.GitHubUser)' ($($target.Label))." -ForegroundColor Green

if ($ghStatus -match [regex]::Escape($other.GitHubUser)) {
    & gh auth logout -h github.com -u $other.GitHubUser
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Uitloggen van '$($other.GitHubUser)' is mislukt - controleer dit handmatig met 'gh auth status'." -ForegroundColor Yellow
    }
    else {
        Write-Host "Account '$($other.GitHubUser)' ($($other.Label)) is volledig uitgelogd bij gh CLI." -ForegroundColor Green
    }
}
else {
    Write-Host "Account '$($other.GitHubUser)' ($($other.Label)) stond niet ingelogd bij gh CLI." -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "== Claude Code ==" -ForegroundColor Cyan

& claude auth logout

$claudeEmail = $claudeEmails[$Naar]
if ($claudeEmail) {
    & claude auth login --email $claudeEmail
    Write-Host "Rond de Claude-login af in de geopende browser ($claudeEmail)." -ForegroundColor Green
}
else {
    # Zonder --email opent dezelfde flow, alleen kies je het account zelf. Het script blijft dus
    # volledig bruikbaar zonder accounts.local.ps1 -- dat bestand scheelt een keuze, meer niet.
    & claude auth login
    Write-Host "Rond de Claude-login af in de geopende browser." -ForegroundColor Green
    Write-Host "Kies daar zelf het '$($target.Label)'-account: er is geen accounts.local.ps1 gevonden." -ForegroundColor Yellow
    Write-Host "Wil je dat het script het adres invult, kopieer dan scripts\env\accounts.local.example.ps1" -ForegroundColor DarkGray
    Write-Host "naar scripts\env\accounts.local.ps1 en vul je adressen in (dat bestand is gitignored)." -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "== Handmatige stap ==" -ForegroundColor Cyan
Write-Host "VS Code's eigen GitHub-login (account-icoon linksonder, Settings Sync/Copilot)" -ForegroundColor Yellow
Write-Host "kan niet gescript worden. Wissel die zelf: klik het account-icoon > Sign out > Sign in met '$($target.GitHubUser)'." -ForegroundColor Yellow