## `config/seam-adoptie` progress

### Steps

- [x] De 24 seams uit de blueprint geteld en afgetrokken van wat hier gedeclareerd stond: 17 onbeantwoord, precies zoals vorige sessie gemeten
- [x] `adopt-config` als dry run gedraaid uit de plugin-cache en uit de marketplace-clone — identieke uitkomst (8 copy, 7 decide, 7 al beantwoord, 2 zonder aanbod)
- [x] `adopt-config -Apply` gedraaid: 8 copy-functies in `scripts/repo-config.ps1`, proposal voor de 7 decide-records
- [x] De drie dubbele `$script:`-toewijzingen opgeruimd die `adopt-config` achterliet (`EntryBodyHeading`, `EntryBodyPlaceholder`, `EntryFallbackType` stonden er twee keer, met dezelfde waarde)
- [x] De header-docstring van `repo-config.ps1` bijgewerkt: hij noemde alleen de vijf oorspronkelijke functies
- [x] `Get-ReleaseNotesGrouping` = `'minor'` — afgelezen van de 23 mappen in `releases/development/` en nagetrokken t/m `cut-release.ps1` regel 676-681, het punt dat de vorige sessie expliciet openliet
- [x] `Get-ReservedRootMd` = de drie root-`*.md` die deze repo werkelijk heeft, in plaats van de negen van de bron
- [x] `Get-LiveStage` = `''` mét de reden: `origin/main` ís de live site, dus er is geen aparte stap ná de cut
- [x] De zes bewust onbeantwoorde seams verantwoord in het bestand, elk met de fallback en waarom die hier beter is dan een stub
- [x] `branch-info.ps1` gedot-sourced vanuit `repo-config.ps1` — reparatie die `check-script-contract.ps1` zelf aanwees voor `fold-changelog-entry` en `new-internal-note`
- [x] ASCII-conventie voor `.ps1` nagemeten: 0 non-ASCII bytes in 23.831 bytes
- [x] Dot-source-test: alle functies leveren hun waarde, `Get-BranchInfo config/seam-adoptie` geeft `Type=Config`
- [x] `check-script-contract.ps1`: 0 fouten, en de twee `NOT IN SCOPE`-meldingen zijn weg (8 → 6 info)
- [x] `fix-mojibake.ps1`: 68 bestanden onderzocht in plaats van 3, niets te repareren
- [x] Lint-poort `scripts/lint/lint-web.ps1`: 0 fouten, build geslaagd, 89 statische pagina's
- [x] `config-adoption-proposal.md` verwijderd na het doorwerken — hij is een root-`*.md` en zou de release-cut blokkeren
- [ ] `git merge main` zodra `docs/entry-model-migratie` is geland, en daarna deze twee `branch/`-bestanden op deze entry houden — zonder die stap conflicteert de PR op de vaste entry-paden
- [~] De fold-weigering end-to-end reproduceren — vervallen: dat vraagt een gemergde PR, dus het is niet te testen zonder een deploy. De claim rust op de `[INFO]` van de contract-check en de blueprint-tekst, niet op een eigen run; dat staat zo ook in de entry
- [~] De taxonomie-noot in `CLAUDE.md` (`feat` als alias, `Chore` als fallback-type) — vervallen op deze branch: Dave's keuze is genomen, maar het raakt `CLAUDE.md` en dat bestand wordt op `docs/entry-model-migratie` over 218 regels herschreven. Krijgt een eigen branch ná die merge
- [~] De twee kern-bevindingen repareren — vervallen: ze horen niet hier maar via de inbound-route naar `DaveKJohn/claude-code-specialists`. Ze staan in de afronding aan Dave genoemd

### Where I left off

Het scripts-werk is af en gemeten. De branch is afgetakt van `docs/entry-model-migratie` in plaats van
`main`, omdat `main` de map `branch/` nog niet heeft: aftakken van `main` zou dezelfde twee entry-paden
opnieuw aanmaken en bij de tweede merge een add/add-conflict geven.

Dat maakt één stap onvermijdelijk vóór de PR, en die staat hierboven nog open: zodra
`docs/entry-model-migratie` is gemerged en gevouwen, moet `main` in deze branch worden gemerged. Op dat
moment staan de twee `branch/`-bestanden op `main` in hun gereset staat en dragen ze hier deze entry,
dus git vraagt welke kant het wordt — dat is deze kant. Daarna is de branch PR-klaar.

Er is géén PR geopend en er is niets gepusht.
