<#
.SYNOPSIS
    Repo-eigen configuratie voor de gedeelde workflow-scripts (open-pr / fold-changelog).
.DESCRIPTION
    Door specialists-init als VUL-IN-scaffold neergezet. De gedeelde skills lezen dit kleine blokje
    repo-data uit de repo-root; de scripts zelf zijn repo-agnostisch. Vul de resterende VUL-IN-waarden
    hieronder in en verwijder hun VUL-IN-markeringen. RepoName wordt door de bootstrap automatisch
    uit de git-remote (origin) afgeleid als die een github.com-adres heeft; anders blijft hij VUL-IN.

    Geen Set-StrictMode hier: dot-sourcen zou de strict-mode van het aanroepende script veranderen.
    Puur ASCII (repo-conventie voor .ps1): Windows PowerShell 5.1 leest een BOM-loos script als ANSI.
#>

# Door specialists-init afgeleid uit de git-remote (origin) van deze repo. Klopt dit niet, pas hem dan aan.
$script:RepoName = 'DaveKJohn/djcylow-react'

function Get-RepoName {
    return $script:RepoName
}

function Get-RepoBlobUrl {
    return "https://github.com/$($script:RepoName)/blob/main/"
}

# VUL-IN: repo-root-relatief pad naar de lint-poort die open-pr voor de PR draait,
# bv. 'scripts\lint\check-plugin-integrity.ps1' of 'scripts\maintenance\lint-brain.ps1'.
$script:LintScript = 'VUL-IN'

function Get-LintScript {
    return $script:LintScript
}
