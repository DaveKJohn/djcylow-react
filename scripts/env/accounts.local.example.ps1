<#
Voorbeeld voor scripts\env\accounts.local.ps1 -- de e-mailadressen die switch-account.ps1 gebruikt
voor `claude auth login --email`.

WAAROM DIT BESTAND BESTAAT
--------------------------
De adressen stonden voluit in switch-account.ps1, een gecommit script in een publieke repo, dus via
GitHub-codesearch te vinden. Ze horen niet in de tree; deze constructie houdt ze lokaal.

GEBRUIK
-------
    copy scripts\env\accounts.local.example.ps1 scripts\env\accounts.local.ps1

Vul daarna je eigen adressen in. `accounts.local.ps1` staat in .gitignore en wordt dus nooit
gecommit -- controleer dat met `git check-ignore -v scripts\env\accounts.local.ps1` als je twijfelt.

Zonder dit bestand werkt switch-account.ps1 gewoon: de Claude-login start dan zonder --email en je
kiest het account in de browser.
#>

$ClaudeEmails = @{
    work     = 'jij@jouwwerk.nl'
    personal = 'jij@voorbeeld.com'
}
