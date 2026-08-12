## `config/seam-adoptie` changelog

### Branch title

De workflow-seams uit de blueprint geadopteerd en twee stille fouten in de release-keten weg

### Branch ID

20260811-224646

### Branch type

config

### What does the change on this branch bring to main?

`scripts/repo-config.ps1` beantwoordt de vragen die de gedeelde workflow-scripts stellen. Van de 26
seam-functies in de blueprint van `workflow-davekjohn@4.5.0` waren er hier zeven beantwoord; nu
eenentwintig, en van de vijf die leeg blijven staat per stuk in het bestand waarom dat het betere
antwoord is.

Acht ervan zijn door de `adopt-config`-skill geplaatst: waarden die de gedeelde werkwijze uitspreken en
niets over deze repo beweren, in de tekst van de bron met de reden erbij. Zes zijn met de hand
beantwoord omdat alleen deze repo ze kan geven, en drie daarvan repareren een fout die nergens een
melding gaf.

De blueprint groeide onderweg mee: `workflow-davekjohn@4.4.0` stelde 24 vragen, 4.5.0 stelt er 26.
`Get-ReleaseNoteRoot` en `Get-ReleaseAudienceTier` zijn erbij gekomen en er is niets verdwenen, dus de
contract-check liep door de plugin-update zelf van zes informatieve signalen terug naar acht. De drie
seams hieronder brengen hem op vijf.

**De release-notes stonden op de verkeerde indeling.** `Get-ReleaseNotesGrouping` was ongedeclareerd en
valt dan terug op `major`, terwijl `releases/development/` 23 mappen heeft van `2.0` tot en met `2.22` —
per minor. `cut-release.ps1` bouwt het pad uit die waarde (regel 676-681), dus de eerstvolgende
release-cut had naar `releases/development/2.x/` geschreven: een tweede boom naast de 23 mappen die er
al staan, met de nieuwe rij in `releases/README.md` wijzend naar een pad waar geen enkele bestaande
note woont. Niets had geklaagd, want `major` is een geldig antwoord — alleen niet dat van deze repo. De
waarde is van de boom afgelezen, niet gekozen.

**Het handgeschreven release-document viel buiten de release, en dat is nu opgelost door de repo die het
meldde.** `Get-ReleaseConsumerBumps` stond hier bewust op leeg: aanzetten liet `cut-release.ps1` naar
`releases/notes/` schrijven, een pad dat tot en met v4.4.0 hardcoded was, terwijl deze repo
`releases/highlights/` gebruikt. De knop was dus onaanzetbaar en de highlights bleven handwerk. Dat is
als kern-bevinding gemeld via de inbound-route — `DaveKJohn/claude-code-specialists#616` — en v4.5.0
heeft er de seam `Get-ReleaseNoteRoot` voor gebouwd. Die staat nu op `releases/highlights` en de knop
erboven op `@('minor','major')`, allebei van de boom afgelezen: `releases/highlights/` heeft 23
bestanden en alle 23 eindigen op `.0`, terwijl `releases/development/` er 37 heeft waarvan 14 een patch.
Elke minor kreeg een document, geen enkele patch, 23 releases achter elkaar. Hiermee schrijft een cut het
document voor het eerst zelf, op de plek waar de bestaande 23 al staan.

**Wie deze repo met een release-document toespreekt, staat nu vast: het management en de
opdrachtgever, niet de bezoeker.** `Get-ReleaseAudienceTier` is de enige seam van de blueprint die geen
meting maar een beslissing verlangde, en Dave heeft die op 2026-08-12 genomen: **tier 1**, omdat
bezoekers geen release notes lezen. Wie djcylow.com bezoekt luistert een mix of boekt; die persoon
opent nooit een versie-document. De bron-repo antwoordt hier 2 omdat zij zelf de dienst is waarop
iemand zich abonneert — die 2 overnemen zou beweren dat de bezoekers van een DJ-website release notes
lezen, en dat is onwaar zonder dat enig script het kan weerleggen: beide waarden zijn geldig en geen
van beide geeft ooit een fout.

Gevolg: `new-branch` scaffoldt vanaf nu `#### Tier 0` en `#### Tier 1`, en `open-pr` en `cut-release`
vragen exact die twee compleet te zijn. `Get-EntryTierMax` blijft 2, en die scheiding is de hele
veiligheid van de knop: hij zegt welke tier-nummers geldig zijn om te *lezen*, dus de entries die onder
het cumulatieve model een `#### Tier 2`-sectie kregen — waaronder deze — blijven leesbaar. Nagemeten in
plaats van aangenomen: met de knop op 1 levert `Get-EntryAskedTiers` `0, 1`, blijft `Get-EntryTierMax`
op 2, en meldt de impact-gate over deze entry mét haar Tier 2-sectie niets.

De tekst in `CLAUDE.md` loopt hier nog op achter en is bewust niet op deze branch gerepareerd: het
tier-blok daar vraagt drie tiers, noemt tier 2 "een bezoeker van djcylow.com" en beschrijft de ladder
als cumulatief. Dat bestand wordt op `docs/entry-model-migratie` over ruim tweehonderd regels
herschreven, dus de correctie hoort in een eigen branch ná die merge — dezelfde afweging als bij de
taxonomie-noot.

**De fold viel terug op vier branch-typen terwijl deze repo er acht produceert.** `Get-BranchTypes`
stond hier al goed in `scripts/lib/branch-info.ps1`, maar `fold-changelog-entry.ps1` en
`new-internal-note.ps1` dot-sourcen dat bestand nooit en vielen dus terug op de canonieke vier van de
bron: `Feat`, `Fix`, `Docs`, `Chore`. Vijf van de acht typen hier — `Feature`, `Data`, `Content`,
`Style`, `Config` — staan daar niet in, en een type dat de fold niet kent leest hij als typeloos,
waarna hij bij naam weigert. `check-script-contract.ps1` meldde dit als `[INFO]` en wees de reparatie
zelf aan: `repo-config.ps1` wordt door beide scripts wél geladen, dus één dot-source daar maakt het
antwoord alsnog bereikbaar. De twee `NOT IN SCOPE`-meldingen zijn daarmee weg.

Verder bereikt de mojibake-poort nu de bestanden waar hij voor bedoeld is: met
`Get-MojibakePaths` onderzoekt hij 68 bestanden in plaats van de drie `*.md` in de repo-root, inclusief
`branch/` — waar de entry staat die letterlijk in `CHANGELOG.md` wordt geplakt en van daar in een
release-note. `Get-ReservedRootMd` noemt de drie root-documenten die deze repo werkelijk heeft in plaats
van de negen van de bron, zodat een `*.md` die hier ooit onbedoeld in de root opduikt de release wél
tegenhoudt. En `Get-LiveStage` blijft leeg met de reden erbij, want dat betekent hier het omgekeerde van
wat het lijkt: `origin/main` ís de live site, en juist daarom is er geen aparte go-live-stap ná de cut.

Vijf seams blijven bewust onbeantwoord, elk met de reden in het bestand: `Get-ReleasePluginTier` (de
enige met een berekende fallback, en die meet hier het juiste), `Get-PrMergeMethod` (alleen gelezen door
`ship-pr`, die deze repo niet gebruikt), `Get-ReleaseMajorMinMinors` (de default van 10 laat een major
hier ruim door, want de poort leest de minor-component van v2.22.0) en de twee
`Get-EntrySignificance*`-knoppen (de fallback is hier al het antwoord: ranking aan, met de vijf
ingebouwde banden). Bij die laatste twee staat nu wel een kanttekening in het bestand: de contract-tekst
noemt als reden voor een eigen verwoording juist een repo wiens lezers geen ontwikkelaars zijn, en met
het publiek op tier 1 — het management en de opdrachtgever — is dat een vraag die opnieuw gesteld hoort
te worden. Gesteld, niet stil beantwoord: het is een keuze en geen meting.

Twee handgeschreven tellingen in dit bestand klopten niet en zijn rechtgezet. De header noemde "vier"
bewust onbeantwoorde vragen, de blok-kop eronder "drie", en `check-script-contract.ps1` meldde er zes —
twee ervan stonden nergens verantwoord. Beide plaatsen verwijzen nu naar de check als de enige stand die
met de blueprint meebeweegt, in plaats van een getal te herhalen dat bij de volgende plugin-update weer
achterloopt.

Bij `Get-ReleaseMajorMinMinors` stond tot nu toe een verkeerde reden, en die is vervangen in plaats van
stilletjes weggehaald omdat hij plausibel klonk: "geen lezer zonder consumer-laag". De bump-poort hangt
niet aan de consumer-laag maar aan de impact-verklaring van de wachtende entries (`cut-release.ps1`
regel 459-467) — hij schakelt zichzelf uit waar géén enkele entry zijn impact verklaart, want dan heeft
de repo het tier-model niet geadopteerd. Deze repo heeft dat model wél, dus er was al een lezer, ook
vóór de knop hierboven aanging. Twee onafhankelijke mechanismen die op elkaar leken.

### Significance

#### Tier 0

Twee fouten in de release-keten die geen melding gaven zijn weg, en beide zouden bij de eerstvolgende
handeling zijn toegeslagen in plaats van ooit: de release-cut had een tweede notes-boom begonnen, en de
fold had kunnen weigeren op een branch-type dat deze repo zelf produceert — waaronder het `Config` van
deze branch. Daar komt de release-map bij: het handgeschreven document viel buiten de cut zolang zijn
pad niet te richten was, en die knop kan nu aan. Daarnaast is het bestand leesbaar als beslisdocument:
van elke seam staat er of hij beantwoord is en waarom, inclusief de vijf die leeg blijven, zodat een
volgende sessie ze niet opnieuw hoeft uit te zoeken — en één verantwoording die verkeerd was is
vervangen in plaats van weggehaald, zodat de volgende lezer niet dezelfde plausibele conclusie trekt.
Twee tellingen die niet klopten zijn vervangen door een verwijzing naar de contract-check, want een
handgeschreven getal loopt bij de volgende plugin-update weer achter. Merkbaar zodra iemand een fold,
een release of de contract-check aanraakt; het verandert niet hoe er dagelijks gewerkt wordt.

**Score:** 3

#### Tier 1

Een collega die aan dit project meewerkt raakt de release-keten zelden, maar loopt bij een cut of een
fold tegen dezelfde scripts aan. Die geven nu de antwoorden van deze repo in plaats van die van de
bron-repo, en de contract-check staat op vijf informatieve signalen — de vijf die overblijven zijn de
bewuste keuzes, niet de onbeantwoorde vragen. Wie een minor of major cut hoeft het stakeholder-document
bovendien niet meer met de hand aan te maken: de cut zet het klaar in de map waar de vorige 23 al staan.
En dit is vanaf nu de tier waar een entry hier naar gevraagd wordt: het publiek staat op 1, dus deze
lezer is degene voor wie het release-document geschreven wordt. Merkbaar zodra iemand een release of een
nieuwe branch aanraakt, maar niet eerder.

**Score:** 3

#### Tier 2

Een bezoeker van djcylow.com merkt hier niets van. Er is geen applicatiecode, styling, content of
mix-data aangeraakt; de wijziging zit volledig in de PowerShell-configuratie die de workflow-scripts
inlezen.

**Score:** N/A

### Pull Request
