<#
Wisselt naar het werk-account voor GitHub (gh CLI + git push/pull) en Claude Code.

Wat dit script WEL doet:
  - gh CLI actief account omzetten naar davekokbwj (regelt ook git push/pull
    in VS Code, want git gebruikt "gh auth git-credential" als credential helper)
  - Claude Code uitloggen en de login-flow starten voor dave@bwjecommerce.com

Wat dit script NIET kan doen (geen CLI-ondersteuning voor):
  - VS Code's eigen "Sign in with GitHub" (account-icoon linksonder, gebruikt
    voor Settings Sync/Copilot) — moet handmatig via de VS Code UI
  - De Claude-login zelf voltooien — er opent een browser voor OAuth, dat
    moet je zelf afronden (inclusief eventuele 2FA)

Gebruik: .\scripts\switch-work-account.ps1
#>

$ErrorActionPreference = "Stop"

$githubWorkAccount = "davekokbwj"
$claudeWorkEmail = "dave@bwjecommerce.com"

Write-Host "== GitHub CLI ==" -ForegroundColor Cyan

$ghStatus = & gh auth status 2>&1 | Out-String
if ($ghStatus -notmatch [regex]::Escape($githubWorkAccount)) {
    Write-Host "Account '$githubWorkAccount' is niet ingelogd via gh CLI." -ForegroundColor Red
    Write-Host "Log eerst in met: gh auth login -h github.com" -ForegroundColor Yellow
    exit 1
}

& gh auth switch -h github.com -u $githubWorkAccount
if ($LASTEXITCODE -ne 0) {
    Write-Host "Omschakelen naar '$githubWorkAccount' is mislukt." -ForegroundColor Red
    exit 1
}
Write-Host "gh CLI + git push/pull staan nu op '$githubWorkAccount'." -ForegroundColor Green

Write-Host ""
Write-Host "== Claude Code ==" -ForegroundColor Cyan

& claude auth logout
& claude auth login --email $claudeWorkEmail
Write-Host "Rond de Claude-login af in de geopende browser." -ForegroundColor Green

Write-Host ""
Write-Host "== Handmatige stap ==" -ForegroundColor Cyan
Write-Host "VS Code's eigen GitHub-login (account-icoon linksonder, Settings Sync/Copilot)" -ForegroundColor Yellow
Write-Host "kan niet gescript worden. Wissel die zelf: klik het account-icoon > Sign out > Sign in met '$githubWorkAccount'." -ForegroundColor Yellow
