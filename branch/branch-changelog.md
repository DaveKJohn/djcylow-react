## `config/seam-adoptie` changelog

### Branch title

De workflow-seams uit de blueprint geadopteerd en twee stille fouten in de release-keten weg

### Branch ID

20260811-224646

### Branch type

config

### What does the change on this branch bring to main?

`scripts/repo-config.ps1` beantwoordt de vragen die de gedeelde workflow-scripts stellen. Van de 24
seam-functies in de blueprint van `workflow-davekjohn@4.4.0` waren er hier zeven beantwoord; nu
achttien, en van de zes die leeg blijven staat per stuk in het bestand waarom dat het betere antwoord
is.

Acht ervan zijn door de `adopt-config`-skill geplaatst: waarden die de gedeelde werkwijze uitspreken en
niets over deze repo beweren, in de tekst van de bron met de reden erbij. Drie zijn met de hand
beantwoord omdat alleen deze repo ze kan geven, en twee daarvan repareren een fout die nergens een
melding gaf.

**De release-notes stonden op de verkeerde indeling.** `Get-ReleaseNotesGrouping` was ongedeclareerd en
valt dan terug op `major`, terwijl `releases/development/` 23 mappen heeft van `2.0` tot en met `2.22` —
per minor. `cut-release.ps1` bouwt het pad uit die waarde (regel 676-681), dus de eerstvolgende
release-cut had naar `releases/development/2.x/` geschreven: een tweede boom naast de 23 mappen die er
al staan, met de nieuwe rij in `releases/README.md` wijzend naar een pad waar geen enkele bestaande
note woont. Niets had geklaagd, want `major` is een geldig antwoord — alleen niet dat van deze repo. De
waarde is van de boom afgelezen, niet gekozen.

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

Zes seams blijven bewust onbeantwoord, elk met de reden in het bestand: `Get-ReleasePluginTier` (de
enige met een berekende fallback, en die meet hier het juiste), `Get-PrMergeMethod` (alleen gelezen door
`ship-pr`, die deze repo niet gebruikt), `Get-ReleaseConsumerBumps` (zou de cut naar `releases/notes/`
laten wijzen, hardcoded in `cut-release.ps1` regel 736, terwijl deze repo `releases/highlights/`
gebruikt), `Get-ReleaseMajorMinMinors` (geen lezer zonder consumer-laag, en het model erachter botst met
de definitie van een major in `CLAUDE.md`) en de twee `Get-EntrySignificance*`-knoppen (de fallback is
hier al het antwoord: ranking aan, met de vijf ingebouwde banden).

### Significance

#### Tier 0

Twee fouten in de release-keten die geen melding gaven zijn weg, en beide zouden bij de eerstvolgende
handeling zijn toegeslagen in plaats van ooit: de release-cut had een tweede notes-boom begonnen, en de
fold had kunnen weigeren op een branch-type dat deze repo zelf produceert — waaronder het `Config` van
deze branch. Daarnaast is het bestand nu leesbaar als beslisdocument: van elke seam staat er of hij
beantwoord is en waarom, inclusief de zes die leeg blijven, zodat een volgende sessie ze niet opnieuw
hoeft uit te zoeken. Merkbaar zodra iemand een fold, een release of de contract-check aanraakt; het
verandert niet hoe er dagelijks gewerkt wordt.

**Score:** 3

#### Tier 1

Een collega die aan dit project meewerkt raakt de release-keten zelden, maar loopt bij een cut of een
fold tegen dezelfde scripts aan. Die geven nu de antwoorden van deze repo in plaats van die van de
bron-repo, en de contract-check is teruggelopen van acht naar zes informatieve signalen — de zes die
overblijven zijn de bewuste keuzes, niet de onbeantwoorde vragen. Klein, en vooral merkbaar als iemand
erop wijst.

**Score:** 2

#### Tier 2

Een bezoeker van djcylow.com merkt hier niets van. Er is geen applicatiecode, styling, content of
mix-data aangeraakt; de wijziging zit volledig in de PowerShell-configuratie die de workflow-scripts
inlezen.

**Score:** N/A

### Pull Request
