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
        GitHubUser  = "davekokbwj"
        ClaudeEmail = "dave@bwjecommerce.com"
        Label       = "werk"
    }
    personal = @{
        GitHubUser  = "DaveKJohn"
        ClaudeEmail = "davekok.main@gmail.com"
        Label       = "prive"
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

$ghStatus = & gh auth status 2>&1 | Out-String
if ($ghStatus -notmatch [regex]::Escape($target.GitHubUser)) {
    Write-Host "Account '$($target.GitHubUser)' is nog niet ingelogd via gh CLI." -ForegroundColor Yellow
    Write-Host "Er wordt nu een login gestart - rond die af in de geopende browser (incl. eventuele 2FA)." -ForegroundColor Yellow

    & gh auth login --hostname github.com --git-protocol https --web
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Inloggen bij gh CLI is mislukt of afgebroken." -ForegroundColor Red
        exit 1
    }

    $ghStatus = & gh auth status 2>&1 | Out-String
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
& claude auth login --email $target.ClaudeEmail
Write-Host "Rond de Claude-login af in de geopende browser." -ForegroundColor Green

Write-Host ""
Write-Host "== Handmatige stap ==" -ForegroundColor Cyan
Write-Host "VS Code's eigen GitHub-login (account-icoon linksonder, Settings Sync/Copilot)" -ForegroundColor Yellow
Write-Host "kan niet gescript worden. Wissel die zelf: klik het account-icoon > Sign out > Sign in met '$($target.GitHubUser)'." -ForegroundColor Yellow