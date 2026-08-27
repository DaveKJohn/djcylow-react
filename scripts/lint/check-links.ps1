<#
.SYNOPSIS
    De vierde stap van de poort: elke relatieve link en elk anker in de markdown van deze repo
    tegen de tree houden.

.DESCRIPTION
    Aangeroepen vanuit scripts\lint\lint-web.ps1, na tsc, ESLint en de build. Ook los te draaien.

    WAAROM DEZE CHECK BESTAAT
    -------------------------
    De mapverhuizing naar workflow-davekjohn/ (PR #145, 2026-08-16) liet VIJFTIEN dode links achter:
    veertien in workflow-davekjohn/releases/README.md die naar development/2.x/*.md wezen terwijl die
    boom in de repo-root bleef staan, plus branch/README.md dat naar een CONTRIBUTING.md wees die op
    dat moment niet bestond. Ze stonden er een etmaal. De poort was groen, CI was groen, en niets
    meldde iets -- ze zijn gevonden omdat er toevallig een tweede verhuizing overheen ging.

    Dat is de faalklasse hier: de governance-documentatie is het enige deel van deze repo dat NIET
    door tsc, ESLint of de build wordt aangeraakt, terwijl het wel het deel is dat elke sessie
    meeleest. Een dode link daarin wijst een lezer naar een bestand dat er niet is, en niets
    corrigeert dat.

    De tweede reden is de huisregel: handwerk dat je voor de tweede keer doet wordt een script. De
    eerste keer was de audit van 2026-08-15, die alle cross-file anchors met de hand narekende.

    WAT HIJ CHECKT
    --------------
      1. Elke inline-link `](pad)` in elk door git gevolgd .md-bestand.
      2. Het anker erachter (`](pad#anker)`) als het doel markdown is, plus de losse `](#anker)`
         die naar een kop in het bestand zelf wijst.

    Externe links (http/https/mailto) worden NIET opgevraagd. Dat is bewust dezelfde afweging als
    bij scripts\check-audio.js: een poort die om een externe oorzaak rood staat wordt genegeerd, en
    dan bewaakt hij niets meer. Deze check doet geen enkel netwerkverzoek en kost daarom niets.

    DE TREE IS DE AUTORITEIT, NIET HET BESTANDSSYSTEEM
    --------------------------------------------------
    Het bestaan van een doel wordt getoetst tegen `git ls-files`, hoofdlettergevoelig, en niet tegen
    Test-Path. Twee redenen, en de tweede is de belangrijkste:

      - Een bestand dat niet in git zit, bestaat niet voor een lezer op GitHub. Test-Path zou zo'n
        link lokaal groen verklaren.
      - Test-Path is op Windows hoofdletterONgevoelig en op Linux niet. Deze repo draait zijn poort
        op allebei (lokaal 5.1, in CI pwsh op ubuntu) juist omdat Netlify op Linux bouwt. Een check
        die zich daar niets van aantrekt, zou precies de letterkast-fout doorlaten waarvoor de
        ubuntu-keuze in ci.yml is gemaakt. Een doel dat alleen op letterkast afwijkt wordt apart
        gemeld, want dat is een andere reparatie dan een verkeerd pad.

    CODE-SPANS MOETEN ERUIT VOOR JE OP LINKS MATCHT
    -----------------------------------------------
    workflow-davekjohn/branch/README.md legt uit waarom een pad in een changelog-entry een code-span
    hoort te zijn en geen link, en gebruikt daarvoor `[x](next.config.ts)` als ILLUSTRATIE -- binnen
    backticks. De eerste versie van deze checker las dat als een echte link en meldde hem als dood.
    Dat is de gevaarlijkste soort false positive die hier kan ontstaan: "repareren" wat gemeld wordt,
    maakt juist de tekst kapot die het verschil uitlegt.

    Daarom wordt er in deze volgorde gestript: fenced blocks (``` en ~~~), dan code-spans. De
    line-nummers blijven kloppen doordat gestripte regels leeg worden gemaakt in plaats van
    verwijderd.

    Het strippen van code-spans is bewust ruim: bij een ongebalanceerde backtick op een regel kan er
    meer wegvallen dan strikt nodig. Dat faalt de goede kant op -- het levert hooguit een gemiste
    dode link op, nooit een verzonnen melding. Andersom zou deze check onbetrouwbaar maken op precies
    het bestand dat de regel uitlegt.

    HET ANKER-ALGORITME VAN GITHUB
    ------------------------------
    Kop -> anker: link-syntax naar de tekst terugbrengen, opmaak (backticks, *, _) eruit, lowercase,
    alles wat geen letter/cijfer/spatie/koppelteken/underscore is weghalen, spaties naar
    koppeltekens. Een tweede identieke kop krijgt -1, een derde -2.

    Let op het gevolg voor de em-dash: die telt als leesteken en verdwijnt, maar de spaties eromheen
    niet. "Ontwikkelworkflow -- de route" levert dus een DUBBEL koppelteken op. Het echte anker
    #ontwikkelworkflow--de-route-staat-in-contributing-davekjohncontributingmd uit CLAUDE.md is de
    testcase daarvoor (tot 2026-08-27 workflow-davekjohncontributingmd, toen de map hernoemde).

    Handmatig draaien:  powershell -NoProfile -File scripts\lint\check-links.ps1
    Uitgebreider:       powershell -NoProfile -File scripts\lint\check-links.ps1 -Verbose

    Bewust puur ASCII (repo-conventie voor .ps1).
#>

[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Zelfde reden als in lint-web.ps1: onder pwsh 7 staat PSNativeCommandUseErrorActionPreference aan,
# en dan gooit een falende `git ls-files` een terminating error voordat de eigen melding hieronder
# aan bod komt. Het blokkeert dan alsnog, maar met een exception in plaats van de reden. PS 5.1 kent
# de variabele niet; daar is de Test-Path simpelweg $false. Nodig omdat dit script ook LOS draait --
# via lint-web.ps1 zou het de instelling van de aanroeper erven.
if (Test-Path variable:PSNativeCommandUseErrorActionPreference) {
    $PSNativeCommandUseErrorActionPreference = $false
}

# ---------------------------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------------------------

function Remove-CodeRegions {
    <#
        Maakt fenced blocks onzichtbaar, en met -SpansToo ook code-spans, zonder regels te
        verwijderen -- zo blijven de line-nummers in de meldingen naar de echte regel wijzen.

        DE TWEE AANROEPEN VERSCHILLEN, EN DAT IS HET HELE PUNT
        ------------------------------------------------------
        Links worden gezocht in de versie MET -SpansToo, want een link binnen backticks is een
        illustratie en geen link (zie de header).

        Koppen worden gelezen uit de versie ZONDER. GitHub rekent de tekst binnen backticks gewoon
        mee bij het bouwen van een anker: "Nooit direct op `main` -- via branch + PR" levert
        #nooit-direct-op-main--via-branch--pr op, mét het woord main erin. De eerste versie van deze
        checker streepte code-spans ook uit koppen weg en verklaarde daardoor zes ankers dood die
        aantoonbaar werken -- inclusief de twee die CLAUDE.md het vaakst naar zichzelf gebruikt.
        Dat is dezelfde false-positive-klasse als bij de code-spans, met hetzelfde gevaar: wie de
        melding gelooft, "repareert" een werkende link kapot.
    #>
    param([string[]]$Lines, [switch]$SpansToo)

    $out = New-Object 'System.Collections.Generic.List[string]'
    $fence = $null

    foreach ($raw in $Lines) {
        $line = [string]$raw

        # Fence openen of sluiten. Een sluitende fence moet minstens even lang zijn als de
        # openende en van hetzelfde teken; dat is wat geneste voorbeelden in deze repo's docs
        # (een ```-blok binnen een ````-blok) correct houdt.
        $m = [regex]::Match($line, '^\s{0,3}(`{3,}|~{3,})')
        if ($m.Success) {
            $marker = $m.Groups[1].Value
            if ($null -eq $fence) {
                $fence = $marker
                $out.Add('')
                continue
            }
            elseif ($marker[0] -eq $fence[0] -and $marker.Length -ge $fence.Length) {
                $fence = $null
                $out.Add('')
                continue
            }
        }

        if ($null -ne $fence) { $out.Add(''); continue }

        if ($SpansToo) {
            # Code-spans wegstrepen tot er niets meer verandert, zodat een geneste vorm als
            # `` `x` `` in zijn geheel verdwijnt en niet halverwege uit elkaar valt.
            $prev = $null
            while ($prev -ne $line) {
                $prev = $line
                $line = [regex]::Replace($line, '(`+)[^`]*?\1', ' ')
            }
        }

        $out.Add($line)
    }

    return $out.ToArray()
}

function ConvertTo-Anchor {
    <#
        Het anker-algoritme van GitHub. Zie de header voor de em-dash-valkuil.
    #>
    param([string]$Heading)

    $t = $Heading

    # Link-syntax terugbrengen tot zijn tekst: [tekst](url) -> tekst, en ![alt](url) -> alt.
    $t = [regex]::Replace($t, '!?\[([^\]]*)\]\([^)]*\)', '$1')
    # Opmaakmarkeringen dragen niet bij aan het anker.
    $t = $t -replace '[`*_~]', ''
    $t = $t.Trim().ToLowerInvariant()
    # Alles wat geen letter, cijfer, combining mark, spatie, koppelteken of underscore is, valt weg.
    # Bewust via Unicode-categorieen: zo blijft dit bestand ASCII terwijl accenten en de em-dash
    # correct worden behandeld.
    $t = [regex]::Replace($t, '[^\p{L}\p{Nd}\p{M} _-]', '')
    $t = $t -replace ' ', '-'

    return $t
}

function Get-HeadingAnchors {
    <#
        Alle ankers van een markdown-bestand, inclusief de -1/-2-suffixen die GitHub aan een
        herhaalde kop geeft.
    #>
    param([string[]]$StrippedLines)

    $anchors = New-Object 'System.Collections.Generic.HashSet[string]'
    $seen = @{}

    foreach ($line in $StrippedLines) {
        $m = [regex]::Match([string]$line, '^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$')
        if (-not $m.Success) { continue }

        $base = ConvertTo-Anchor -Heading $m.Groups[2].Value
        if ($base -eq '') { continue }

        if ($seen.ContainsKey($base)) {
            $n = [int]$seen[$base]
            $seen[$base] = $n + 1
            [void]$anchors.Add("$base-$n")
        }
        else {
            $seen[$base] = 1
            [void]$anchors.Add($base)
        }
    }

    return $anchors
}

function Expand-RelativePath {
    <#
        Een repo-relatief pad uit een link, genormaliseerd naar forward slashes en zonder ./ of ../.
        Geeft $null bij een pad dat boven de repo-root uit wijst.
    #>
    param([string]$FromFile, [string]$Target)

    # Puur op de string, zonder Split-Path en zonder backslashes: git levert overal forward slashes,
    # en op Linux (waar CI draait) is een backslash geen scheidingsteken maar een gewoon teken in een
    # bestandsnaam. Split-Path zou daar dus niets splitsen en elk relatief pad verkeerd oplossen.
    if ($Target.StartsWith('/')) {
        $parts = $Target.TrimStart('/') -split '/'
    }
    else {
        $dirParts = @()
        $slash = $FromFile.LastIndexOf('/')
        if ($slash -ge 0) { $dirParts = $FromFile.Substring(0, $slash) -split '/' }
        $parts = @($dirParts) + @($Target -split '/')
    }

    $stack = New-Object 'System.Collections.Generic.List[string]'
    foreach ($p in $parts) {
        if ($p -eq '' -or $p -eq '.') { continue }
        if ($p -eq '..') {
            if ($stack.Count -eq 0) { return $null }
            $stack.RemoveAt($stack.Count - 1)
            continue
        }
        $stack.Add($p)
    }

    return ($stack -join '/')
}

# ---------------------------------------------------------------------------------------------
# Inventaris: wat bestaat er, volgens git
# ---------------------------------------------------------------------------------------------

$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Push-Location $repoRoot
try {
    Write-Host "== check-links -- $repoRoot ==" -ForegroundColor Cyan
    Write-Host ""

    $tracked = @(& git ls-files)
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] 'git ls-files' faalde -- is dit wel een git-repo?" -ForegroundColor Red
        exit 1
    }

    # Hoofdlettergevoelig, ook op Windows: zie de header.
    $files = New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::Ordinal)
    $dirs = New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::Ordinal)
    $lowerToReal = @{}

    foreach ($f in $tracked) {
        $p = [string]$f
        if ($p -eq '') { continue }
        [void]$files.Add($p)
        if (-not $lowerToReal.ContainsKey($p.ToLowerInvariant())) {
            $lowerToReal[$p.ToLowerInvariant()] = $p
        }

        $segs = $p -split '/'
        for ($i = 1; $i -lt $segs.Count; $i++) {
            $d = ($segs[0..($i - 1)] -join '/')
            [void]$dirs.Add($d)
            if (-not $lowerToReal.ContainsKey($d.ToLowerInvariant())) {
                $lowerToReal[$d.ToLowerInvariant()] = $d
            }
        }
    }

    $mdFiles = @($tracked | Where-Object { $_ -match '\.md$' })

    # De ankers van elk markdown-bestand worden hooguit een keer berekend; een pagina als
    # workflow-davekjohn/releases/README.md wordt vanuit veel plekken aangelinkt.
    $anchorCache = @{}
    $strippedCache = @{}

    function Get-Stripped {
        # Voor het zoeken van links: fences en code-spans allebei weg.
        param([string]$RelPath)
        if ($strippedCache.ContainsKey($RelPath)) { return $strippedCache[$RelPath] }
        # Geen omzetting naar backslashes: Windows accepteert forward slashes prima, Linux accepteert
        # backslashes NIET. Een pad uit git is dus overal bruikbaar zoals het is.
        $lines = @(Get-Content -LiteralPath (Join-Path $repoRoot $RelPath) -Encoding UTF8)
        $strippedCache[$RelPath] = Remove-CodeRegions -Lines $lines -SpansToo
        return $strippedCache[$RelPath]
    }

    function Get-Anchors {
        # Voor het lezen van koppen: alleen fences weg -- code-spans tellen mee in het anker.
        param([string]$RelPath)
        if ($anchorCache.ContainsKey($RelPath)) { return $anchorCache[$RelPath] }
        $lines = @(Get-Content -LiteralPath (Join-Path $repoRoot $RelPath) -Encoding UTF8)
        $a = Get-HeadingAnchors -StrippedLines (Remove-CodeRegions -Lines $lines)
        $anchorCache[$RelPath] = $a
        return $a
    }

    # ---------------------------------------------------------------------------------------------
    # De check zelf
    # ---------------------------------------------------------------------------------------------

    $problems = New-Object 'System.Collections.Generic.List[object]'
    $linkCount = 0

    foreach ($md in $mdFiles) {
        $stripped = Get-Stripped -RelPath $md

        for ($i = 0; $i -lt $stripped.Count; $i++) {
            $line = [string]$stripped[$i]
            if ($line -notmatch '\]\(') { continue }

            foreach ($m in [regex]::Matches($line, '\]\(\s*(<[^>]*>|[^)\s]*)(?:\s+"[^"]*"|\s+''[^'']*'')?\s*\)')) {
                $target = $m.Groups[1].Value
                if ($target.StartsWith('<') -and $target.EndsWith('>')) {
                    $target = $target.Substring(1, $target.Length - 2)
                }
                if ($target -eq '') { continue }

                # Externe en niet-bestandsdoelen: bewust niet opgevraagd (zie de header).
                if ($target -match '^[a-zA-Z][a-zA-Z0-9+.-]*:') { continue }
                if ($target.StartsWith('//')) { continue }

                $linkCount++

                $path = $target
                $anchor = ''
                $hash = $target.IndexOf('#')
                if ($hash -ge 0) {
                    $path = $target.Substring(0, $hash)
                    $anchor = $target.Substring($hash + 1)
                }

                $path = [uri]::UnescapeDataString($path)
                $anchor = [uri]::UnescapeDataString($anchor)

                # Doelbestand bepalen: leeg pad betekent "deze pagina zelf".
                if ($path -eq '') {
                    $resolved = $md
                }
                else {
                    $resolved = Expand-RelativePath -FromFile $md -Target $path
                    if ($null -eq $resolved) {
                        $problems.Add([pscustomobject]@{
                            File = $md; Line = ($i + 1); Target = $target
                            Kind = 'pad'; Detail = 'wijst boven de repo-root uit'
                        })
                        continue
                    }

                    if (-not $files.Contains($resolved) -and -not $dirs.Contains($resolved)) {
                        $lower = $resolved.ToLowerInvariant()
                        if ($lowerToReal.ContainsKey($lower)) {
                            $problems.Add([pscustomobject]@{
                                File = $md; Line = ($i + 1); Target = $target
                                Kind = 'letterkast'; Detail = "bestaat als '$($lowerToReal[$lower])'"
                            })
                        }
                        else {
                            $problems.Add([pscustomobject]@{
                                File = $md; Line = ($i + 1); Target = $target
                                Kind = 'pad'; Detail = "'$resolved' staat niet in de tree"
                            })
                        }
                        continue
                    }
                }

                if ($anchor -eq '') { continue }
                # Een anker toetsen kan alleen bij markdown; #L12 op een .ts is geen kop.
                if ($resolved -notmatch '\.md$') { continue }
                if (-not $files.Contains($resolved)) { continue }

                $anchors = Get-Anchors -RelPath $resolved
                if (-not $anchors.Contains($anchor.ToLowerInvariant())) {
                    $where = if ($resolved -eq $md) { 'in dit bestand' } else { "in $resolved" }
                    $problems.Add([pscustomobject]@{
                        File = $md; Line = ($i + 1); Target = $target
                        Kind = 'anker'; Detail = "geen kop $where levert '#$anchor' op"
                    })
                }
            }
        }
    }

    # ---------------------------------------------------------------------------------------------
    # Rapport
    # ---------------------------------------------------------------------------------------------

    Write-Host "-- $($mdFiles.Count) markdown-bestand(en), $linkCount interne link(s) gecontroleerd" -ForegroundColor Gray

    if ($problems.Count -eq 0) {
        Write-Host "  [OK]    geen dode links of ankers" -ForegroundColor Green
        Write-Host ""
        Write-Host "Samenvatting: 0 fout(en). De link-check staat open." -ForegroundColor Green
        exit 0
    }

    Write-Host ""
    foreach ($group in ($problems | Group-Object File | Sort-Object Name)) {
        Write-Host "  $($group.Name)" -ForegroundColor Yellow
        foreach ($p in ($group.Group | Sort-Object Line)) {
            Write-Host ("    regel {0,-5} [{1}] {2}" -f $p.Line, $p.Kind, $p.Target) -ForegroundColor Red
            Write-Host ("                   {0}" -f $p.Detail) -ForegroundColor DarkGray
        }
    }

    Write-Host ""
    Write-Host "Samenvatting: $($problems.Count) dode link(s)/anker(s) -- de poort blokkeert." -ForegroundColor Red
    Write-Host "Een link die hier faalt, faalt ook voor een lezer op GitHub. Repareer het pad of het" -ForegroundColor Red
    Write-Host "anker; is de kop hernoemd, dan is de link de plek die meebeweegt, niet de kop." -ForegroundColor Red
    exit 1
}
finally {
    Pop-Location
}
