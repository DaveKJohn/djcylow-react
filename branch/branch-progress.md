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
- [x] `check-script-contract.ps1`: 0 fouten, en de twee `NOT IN SCOPE`-meldingen zijn weg (8 → 6 info, gemeten tegen de blueprint van 4.4.0)
- [x] Plugin naar v4.5.0 (2026-08-12) en de blueprint opnieuw geteld: 24 → 26 vragen, want `Get-ReleaseNoteRoot` en `Get-ReleaseAudienceTier` zijn nieuw en er is niets verdwenen — de contract-check liep daardoor van 6 terug naar 8 info
- [x] `Get-ReleaseNoteRoot` = `'releases/highlights'` — afgelezen van de boom: 23 mappen naast de 23 van `releases/development/`, en de default `releases/notes` bestaat hier niet
- [x] `Get-ReleaseConsumerBumps` = `@('minor','major')` — de blokkade die hier stond is opgeheven door de seam die v4.5.0 bouwde op onze eigen inbound `#616`. Afgelezen, niet uit `CLAUDE.md` overgenomen: alle 23 highlights-bestanden eindigen op `.0`, tegen 14 patches in de 37 development-notes
- [x] De verantwoording van `Get-ReleaseMajorMinMinors` gecorrigeerd: "geen lezer zonder consumer-laag" was onjuist — de bump-poort hangt aan de impact-verklaring van de entries (`cut-release.ps1` regel 459-467), niet aan de consumer-laag, dus er was al een lezer
- [x] Dot-source-test en `check-script-contract.ps1` opnieuw: 0 fouten, 8 → 6 info, beide nieuwe seams `[OK]`, en `Test-Path releases/highlights/2.22` bevestigt dat root + grouping samen een bestaand pad opleveren
- [x] ASCII-conventie opnieuw gemeten en gerepareerd: de eerste versie van het nieuwe commentaar bracht 30 non-ASCII bytes binnen (nadruk-accenten als `wél`, `déze`, `géén`). Die zijn weggeschreven door te herformuleren, niet door de spelling plat te slaan — regel 33 van het bestand noemt de reden: Windows PowerShell 5.1 leest een BOM-loos script als ANSI en verhaspelt een accent-literal. Nu weer 0 in 29.174 bytes
- [x] `fix-mojibake.ps1`: 68 bestanden onderzocht in plaats van 3, niets te repareren
- [x] Lint-poort `scripts/lint/lint-web.ps1`: 0 fouten, build geslaagd, 89 statische pagina's
- [x] `config-adoption-proposal.md` verwijderd na het doorwerken — hij is een root-`*.md` en zou de release-cut blokkeren
- [ ] `git merge main` zodra `docs/entry-model-migratie` is geland, en daarna deze twee `branch/`-bestanden op deze entry houden — zonder die stap conflicteert de PR op de vaste entry-paden
- [~] De fold-weigering end-to-end reproduceren — vervallen: dat vraagt een gemergde PR, dus het is niet te testen zonder een deploy. De claim rust op de `[INFO]` van de contract-check en de blueprint-tekst, niet op een eigen run; dat staat zo ook in de entry
- [~] De taxonomie-noot in `CLAUDE.md` (`feat` als alias, `Chore` als fallback-type) — vervallen op deze branch: Dave's keuze is genomen, maar het raakt `CLAUDE.md` en dat bestand wordt op `docs/entry-model-migratie` over 218 regels herschreven. Krijgt een eigen branch ná die merge
- [x] De twee kern-bevindingen gemeld via de inbound-route, niet hier gerepareerd: `DaveKJohn/claude-code-specialists#615` (new-branch slaat de branch-bestanden over op een stacked branch en noemt daarbij de verkeerde branch) en `DaveKJohn/claude-code-specialists#616` (`releases/notes/` hardcoded, plus een letterlijk pad in de warning op regel 814 waar de seam wél elders wordt gebruikt). Beide geverifieerd tegen bron-`main` `569e656` (v4.5.0), dus tegen de bron en niet tegen een verouderde mirror
- [x] `Get-ReleaseAudienceTier` = `1` — Dave's beslissing op 2026-08-12, in zijn eigen woorden: bezoekers lezen geen release notes. De laatste seam die een keuze vroeg in plaats van een meting; de bron-2 is bewust níét overgenomen, want die zou beweren dat bezoekers van een DJ-website versie-documenten lezen
- [x] De gates nagemeten met het publiek op 1: `Get-EntryAskedTiers` geeft `0, 1`, `Get-EntryTierMax` blijft `2`, en `Get-EntryImpactFindings` meldt niets over deze entry ondanks haar `#### Tier 2`-sectie — de bestaande entries onder het cumulatieve model blijven dus leesbaar
- [x] Twee onjuiste tellingen in `repo-config.ps1` rechtgezet: de header zei "vier" bewust onbeantwoorde vragen, de blok-kop "drie", de contract-check meldde zes. Beide verwijzen nu naar de check in plaats van een getal te herhalen, en de twee seams die nergens verantwoord stonden (`Get-EntrySignificanceEnabled`, `Get-EntrySignificanceRubricLevels`) hebben hun reden gekregen
- [x] Contract-check en ASCII-conventie opnieuw: 0 fouten, 6 → 5 info, en 0 non-ASCII bytes in 33.635
- [~] `Get-EntrySignificanceRubricLevels` in eigen woorden zetten — bewust niet nu: met het publiek op tier 1 (management en opdrachtgever in plaats van ontwikkelaars) noemt de contract-tekst dit precies het geval voor een eigen verwoording, maar dat is een nieuwe keuze van Dave en geen gevolg van deze. De vraag staat als kanttekening in het bestand, zodat hij niet stil wordt beantwoord

### Where I left off

Het scripts-werk is af en gemeten. De branch is afgetakt van `docs/entry-model-migratie` in plaats van
`main`, omdat `main` de map `branch/` nog niet heeft: aftakken van `main` zou dezelfde twee entry-paden
opnieuw aanmaken en bij de tweede merge een add/add-conflict geven.

Dat maakt één stap onvermijdelijk vóór de PR, en die staat hierboven nog open: zodra
`docs/entry-model-migratie` is gemerged en gevouwen, moet `main` in deze branch worden gemerged. Op dat
moment staan de twee `branch/`-bestanden op `main` in hun gereset staat en dragen ze hier deze entry,
dus git vraagt welke kant het wordt — dat is deze kant. Daarna is de branch PR-klaar.

Op 2026-08-12 is er een tweede ronde bijgekomen, ná de plugin-update naar v4.5.0: de twee release-map-
seams. Die stonden hier bewust leeg met een reden die door die update verviel, dus ze horen op déze
branch en niet op een nieuwe — het is dezelfde beslissing, nu met het antwoord dat er eerst niet was.

Later diezelfde dag een derde ronde, om dezelfde reden: `Get-ReleaseAudienceTier` stond hier leeg met
als reden "wacht op een beslissing van Dave", en die beslissing is er nu — **tier 1**. Ook dit is
dezelfde beslissing als de andere zes handmatige, nu met het antwoord dat er eerst niet was, dus geen
eigen branch. Daarmee is elke seam die deze repo kan beantwoorden beantwoord: de vijf die overblijven
zijn keuzes vóór de fallback, niet openstaande vragen.

Twee dingen die hier bewust niet zijn gebeurd en die na de merges hun eigen branch krijgen: het
tier-blok in `CLAUDE.md` (dat vraagt nog drie tiers en noemt tier 2 "een bezoeker van djcylow.com",
allebei achterhaald door de keuze hierboven) en de vraag of de rubriek-banden eigen woorden nodig hebben
nu het publiek management is. Beide raken `CLAUDE.md`, dat op `docs/entry-model-migratie` over 218
regels wordt herschreven — daar wachten ze op, samen met de taxonomie-noot.

Er is géén PR geopend. De branch is wél gepusht.
