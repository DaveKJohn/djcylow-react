## `docs/releases-drie-roots` changelog

### Branch title

De releases-map wordt gelijk aan de bron: drie reader-genoemde roots, indeling per major, en een pagina die te mirrorren is

### Branch ID

20260813-110240

### Branch type

docs

### What does the change on this branch bring to main?

`releases/` had twee mappen waar de bron er drie heeft, en de tweede droeg de verkeerde naam. Nu staan
er `development/`, `audience/` en `github/`, met een `releases/README.md` die per root zegt wie de lezer
is en wat er dus in hoort.

**Elke root onder `releases/` noemt zijn lezer, en `highlights/` deed dat niet.** Die naam zei hoe het
document geschreven was — met highlights — in plaats van voor wie het bedoeld was. De bron maakte
dezelfde fout met zijn eigen `releases/notes/` en repareerde die op 2026-08-12; deze repo liep er precies
één dag achter. `highlights/` → `audience/` is met `git mv` gedaan, en alle 23 bestanden zijn door git
als rename herkend: de historie per document blijft dus intact. De **inhoud** van die 23 documenten is
niet aangeraakt. Noemt een oudere note in zijn tekst nog `releases/highlights/`, dan is dat wat er stond
op de dag dat hij uitging — een gepubliceerd record beweegt niet mee, en dat is dezelfde afweging die de
bron bij zijn eigen rename maakte.

**`releases/github/` is nieuw, en die map moest er komen ook al declareert deze repo hem niet.** Het pad
staat **hardcoded** in de `cut-release.ps1` van de bron (regel 792) en niet in een seam, bewust: een
nieuwe root heeft geen bestaande plaatsing om te accommoderen, dus wie er ooit van afwijkt kost dat één
functie in plaats van een migratie. Voor deze repo betekent het dat er niets te configureren valt maar de
naam wel vaststaat.

**Twee echte storingen in de GitHub-Release-stap zijn onderweg opgevallen en meegerepareerd.** Beide
lagen klaar in de Release Workflow zoals die er stond:

1. **De body kon afgekapt worden.** Stap 12 gaf de volledige `development/`-note als `--notes-file` mee,
   en `gh` kapt een release-body af op **125.000 tekens**. Een volledig per-PR record kan daar langs. De
   body is nu de korte aankondiging uit `github/`, en het record is bijlage geworden — precies de reden
   waarom die root in de bron bestaat.
2. **De tweede bijlage-upload zou botsen.** Alle drie de documenten van een release heten `<versie>.md`,
   dus twee ervan rechtstreeks uit `releases/` uploaden geeft `HTTP 404` op de tweede. De `file#label`-
   syntax van `gh` lost dat niet op — die zet het label, niet de bestandsnaam. Stap 14 kopieert ze nu
   eerst naar `v<versie>-development-notes.md` en `v<versie>-release-note.md`. Dit werd nooit geraakt
   omdat er tot nu toe maar één bijlage was; met drie roots was het de eerste keer geweest.

**Wat het handgeschreven document hier wél en niet heeft, staat er nu bij.** `Get-ReleaseAudienceTier`
staat op **1**, dus er komt geen sectie *voor consumenten* in: dat is tier 2, en bezoekers van
djcylow.com lezen geen release notes. Wat overblijft zijn de twee organisatie-secties — wat het waard is,
en wat er bij die release nog open stond. Die tweede in de verleden tijd, want het document wordt als
bijlage gepubliceerd en een zin in de tegenwoordige tijd is binnen een dag achterhaald.

**De structuur is overgenomen, de generator niet — en dat staat er expliciet.** In de bron genereert
`cut-release.ps1` twee van de drie documenten en draft het de derde. Alle drie blijven hier handwerk van
Rendall 🎬, en `releases/README.md` zegt dat nu in plaats van automatisering te suggereren die er niet is.

> **Eén bewering hierover is bij de tweede ronde teruggenomen, want ze was te sterk.** Deze entry en de
> README stelden eerst dat `cut-release.ps1` "niet bruikbaar is in deze repo", omdat het
> `.claude-plugin/marketplace.json` leest en elke `plugin.json` in lockstep bumpt. Nagemeten: het script
> in de plugin is **byte-identiek** aan dat van de bron (`diff -q` op beide plus `release-lib.ps1`), maar
> gate't precies die marketplace-afhankelijkheid achter `Get-ReleasePluginTier` — hier `false`, want de
> default is "bestaat `marketplace.json`" — en valt dan terug op de nieuwste `vX.Y.Z`-tag. In principe is
> het dus wél draaibaar. Of het schoon doorloopt is **niet gemeten**, en dat staat er nu ook zo. Wat
> onveranderd waar blijft: de skill voert niets uit, en de Release Workflow is handwerk. Dit is precies de
> reden dat de drie storingen hieronder gevonden konden worden — een script dat "niet bruikbaar" is, krijgt
> zijn invoerpaden niet nagelopen.

**De submap is per major geworden, wat de tweede helft van "gelijk aan de bron" is.** De drie roots stonden
er al; de indeling erbinnen niet. `Get-ReleaseNotesGrouping` stond op `'minor'` — afgelezen van een boom met
23 mappen, `2.0` tot en met `2.22` — en dat was géén fout: de bron-README laat `<dir>` uitdrukkelijk voor
"whichever this repo uses" staan, en de seam bestaat juist om dit verschil toe te laten. Op Dave's verzoek om
`releases/` **precies** gelijk te maken is de waarde nu `'major'` en zijn alle **60** documenten met `git mv`
naar `2.x/` verhuisd: 37 in `development/`, 23 in `audience/`. Geen enkele naam botste — 37 en 23 unieke
basenames — en geen letter van hun inhoud is aangeraakt. De seam-toelichting in `repo-config.ps1` zegt nu dat
dit de enige waarde in dat bestand is die van *afgelezen* naar *gekozen* is gegaan, en wat er meebeweegt als
iemand hem terugdraait.

**Een derde stille storing, en deze zat in de boekhouding zelf.** De overzichtstabel had Nederlandse
kolomkoppen. De gedeelde `release-lib.ps1` matcht die regel **letterlijk in het Engels** en er is bewust geen
seam voor — de bron verantwoordt dat in `cut-release.ps1` zelf. Gevolg: de rij-inserter vond zijn invoegpunt
niet, en `Get-OverviewTargetMajor` gaf `$null`, waarmee de guardrail die controleert of een rij in de juiste
major belandt **stil uit stond**. Precies het patroon dat de bron elders beschrijft als erger dan geen
guardrail, want het document leest alsof het beschermd is. De koppen zijn nu Engels en er staat een
`#### 2.x`-kop boven de tabel, want die guardrail leest de laatste `<n>.x`-kop erboven. Dezelfde categorie als
de zes sectiekopjes van een entry — een machine-gelezen sleutel, geen proza — en `CLAUDE.md` stap 9 zegt dat
er nu bij, zodat niemand ze "verbetert".

> **Deze reparatie is gemeten, niet beredeneerd.** Beide versies van de pagina zijn door de gedeelde
> `release-lib.ps1` gehaald: de oude gaf `Get-OverviewTargetMajor` → `$null` en `Get-OverviewSectionHeading`
> → `$null`; de nieuwe geeft `'2'` en `'#### 2.x'`. Dat is het verschil tussen een guardrail die stil uit
> staat en één die werkt, en het is nu een reproduceerbare meting in plaats van een verwachting.

**De pagina volgt nu het mirror-model van de bron.** Die pagina is bewust gebouwd als een portable helft, dan
een horizontale streep, dan één repo-slot met een expliciete instructie erin: houd de **vorm**, vervang de
**inhoud**, vouw niets omhoog, en verwijder de sectie niet. `releases/README.md` had daar een volledig eigen
structuur staan, waardoor bij elke bron-update niet te zien was wat overgenomen kon worden en wat van deze
repo is — precies wat die streep voorkomt. De vorm is nu overgenomen met de vijf subsecties onder de
repo-kop. De **taal** is Nederlands gebleven en de inhoud waar voor deze repo: de portable helft van de bron
gaat over marketplace-lockstep en `plugin.json`-bumps, wat hier feitelijk onwaar is, en `CLAUDE.md` legt vast
dat repo-documentatie Nederlands is met alleen machine-gelezen sleutels als uitzondering. Letterlijk
kopiëren zou onjuiste documentatie in de verkeerde taal hebben opgeleverd; dat is een slechtere uitkomst dan
een structuurverschil. Niets uit de oude pagina is verdwenen — de tag/rollback-uitleg en de SemVer-tabel
staan nu onder de streep, want ze reizen niet met de workflow mee.

**De Versie-cel wijst nu naar het leesbaarste document per release**, zoals de bron dat doet: `audience/` bij
de 23 minors en de major, `development/` bij de 14 patches. Ze wezen alle 37 naar `development/`. Dit is geen
cosmetiek maar consistentie met wat de machine straks zelf schrijft — zonder deze stap zou rij 38 afwijken van
de 37 erboven.

**De verwijzingen zijn meegelopen, want een rename die dat overslaat maakt dode links.** De
release-branch-scope in de safety-rules van `CLAUDE.md`, stap 6 en de nieuwe stap 7 in de Release
Workflow (met hernummering van 7–14 naar 8–15), de seam-tabel in `CONTRIBUTING.md` — met een rij erbij
voor `github/` — en in de root-`README.md` zowel de mappenboom als de Version-History-alinea. De
toelichting bij `Get-ReleaseNoteRoot` verantwoordt de rename, en die bij `Get-ReleaseConsumerBumps`
verwijst nu naar het juiste stapnummer.

**Wat bewust niet in deze branch zit** — en dat is bij de tweede ronde expliciet aan Dave gevraagd en door
hem bevestigd (2026-08-13). De 23 `audience/`-documenten volgen nog het oude model: één register leesbaar
Nederlands, zonder secties per lezer. De bron ging op 2026-08-10 over op één document met een sectie per
lezer, na de meting dat de twee losse documenten bij alle twaalf voorgaande releases over dezelfde
wijzigingen gingen — 38% overlap in twee registers. Dat is een herziening van gepubliceerde **inhoud**, niet
van de mapstructuur, en staat als open werk verantwoord in `releases/README.md` en in `repo-config.ps1`. De
mapstructuur is nu volledig gelijk aan de bron; het documentmodel niet, en dat verschil is nu een gedragen
keuze in plaats van een achterstand. `releases/github/` is om dezelfde reden niet met terugwerkende kracht
gevuld: een aankondiging voor een moment dat al voorbij is zou verzonnen zijn.

### Significance

#### Tier 0

Wie hier een release cut vindt de drie documenten vanaf nu in de mappen die de hele familie repo's
gebruikt — tot en met de submap per major — met per map een antwoord op "voor wie is dit". Daar komen **drie**
storingen bij die klaarlagen en nooit geraakt waren: een release-body die stil afgekapt kon worden op 125.000
tekens, een tweede bijlage-upload die met `HTTP 404` zou falen zodra er meer dan één bijlage was, en een
overzichtstabel met Nederlandse kolomkoppen waar de gedeelde inserter Engelse verwacht — waardoor die zijn
invoegpunt niet vond en de new-major-guardrail stil uit stond. Alle drie zijn stille storingen: niets zou
hebben gefaald, de uitkomst zou alleen fout zijn geweest. Daarbovenop leest `releases/README.md` nu als een
pagina die te mirrorren is, met een streep tussen wat portable is en wat van deze repo.

**Score:** 3

#### Tier 1

De opdrachtgever leest zijn eigen release-document in een map die naar hém genoemd is in plaats van naar
de vorm van de tekst, en `releases/README.md` zegt nu welke twee secties daarin voor hem bedoeld zijn.
Aan de site, de mixen of het werk zelf verandert niets.

**Score:** 2

### Pull Request

