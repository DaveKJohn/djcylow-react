# Changelog

De geschiedenis van de DJ Cylow-website: elke gemergde branch met zijn pull request, nieuwste
bovenaan. Er zijn geen secties meer — **elke `##`-kop hieronder is één wijziging**, en dat is wat de
gedeelde workflow-scripts lezen. Het mechanisme (het entry-bestand in `branch/`, folden, een release
knippen) staat in [`CLAUDE.md`](CLAUDE.md).

**`origin/main` is de live site.** Netlify bouwt en publiceert bij elke push naar `main`, en een
PR-merge schrijft daar rechtstreeks in. Alles hieronder staat dus al op `djcylow.com` — live, maar
nog zonder versienummer. Een release is een label op wat al draait.

**De uitgebrachte versies staan niet hier maar in [`releases/README.md`](releases/README.md)**, met
datum, type en een samenvattende regel per versie. Dit bestand houdt alleen wat nog géén
versienummer heeft; een release-cut haalt die entries eruit en laat deze intro achter.

> Tot 2026-07-26 stond hier het omgekeerde, met een `← LIVE`-markering die zou aanwijzen welke versie
> draaide. Dat model was onjuist en de markering stond maandenlang fout — op v2.20.1, terwijl
> v2.20.2, v2.21.0 en vijf PR's al live waren. De markering is vervallen: de bovenste uitgebrachte
> versie draait per definitie al.

## `data/title-spotify-zonder-datum` changelog

### Branch title

Het datumstaartje uit alle `title_spotify`-waardes

### Branch ID

20260811-204514

### Branch type

data

### What does the change on this branch bring to main?

Alle 77 gevulde `title_spotify`-waardes eindigden op het id van de mix, voorafgegaan door nog een
kleur-emoji: `EDM 128BPM 🟠 Orange Light (f) 🟠 Vol. 7 🟠 20260101`. Die datum hoort in `id` en
`id_spotify`, niet in een titel die luisteraars op Spotify lezen. De emoji en het datumdeel zijn eraf
gehaald, zodat het formaat afsluit op het volumenummer: `EDM 128BPM 🟠 Orange Light (f) 🟠 Vol. 7`.

Het datumstaartje stond er omdat een doortellend volume over de hele collectie niet uniek hoefde te
zijn. Dat blijkt in de praktijk niet nodig: `volume_spotify` telt door per kleur + power + frequentie
+ bpm, en die hele reeks staat in de titel. Alle 77 waardes zijn ook zonder datum uniek — nagerekend
na de wijziging, en opnieuw nagerekend na de merge met `main`: 77 gevuld, 77 uniek, nul waardes die
nog op een datum eindigen.

Meegenomen in dezelfde beweging, zodat het staartje niet terugkomt bij de volgende mix:

- **`scripts/add-mix.js`** — `buildSpotifyTitle()` genereert de titel zonder datum; de `dateCompact`-
  parameter is vervallen en de toelichting in de header klopt weer.
- **`src/data/mixes/README.md`** — de veldspec, de twee voorbeeld-JSON's en de checklist volgen het
  nieuwe formaat. De regel "**Do not drop the `id` from the format**" is vervangen door de uitleg
  waarom het volumenummer de uniciteit nu alleen draagt, met de waarschuwing dat een dubbele
  `volume_spotify` binnen één reeks nu wél een dubbele titel oplevert.

De site leest `title_spotify` niet — het veld staat in de mix-JSON als administratie van de
Spotify-upload. Deze wijziging is dus niet zichtbaar op `djcylow.com`.

**Samenloop met de Cyan-correctie.** Deze branch stond geparkeerd naast
`data/cyan-emoji-is-ijsblokje`, die in dezelfde `title_spotify`-regels van `full-cyan.json` en
`light-cyan.json` de kleur-emoji 💠 verving door 🧊. Die branch is als eerste gemerged; de zeven
Cyan-waardes dragen hier dus beide wijzigingen — het ijsblokje én geen datum.

### Significance

#### Tier 0

De regel die `title_spotify` beschrijft staat vanaf nu op één plek en klopt: het formaat sluit af op
het volumenummer, `scripts/add-mix.js` genereert het zo, en `src/data/mixes/README.md` schrijft het zo
voor. Tot nu toe genereerde het script een vorm die de spec verbood mee te veranderen ("do not drop
the `id`"), zodat elke nieuwe mix het staartje opnieuw meekreeg. De uniciteit die het datumdeel zou
garanderen is nagerekend in plaats van aangenomen: 77 waardes, 77 uniek.

**Score:** 3

#### Tier 1

De 77 playlistnamen die naar Spotify gaan lezen als titels in plaats van als administratie — geen
datumcode meer achter het volumenummer bij wat een luisteraar ziet. Aan `djcylow.com` verandert niets:
het veld wordt door geen enkele pagina gerenderd.

**Score:** 2

### Pull Request

[PR #28](https://github.com/DaveKJohn/djcylow-react/pull/28) · merged 2026-08-13

---

## `data/cyan-emoji-is-ijsblokje` changelog

### Branch title

Cyan draagt in `title_spotify` het ijsblokje, niet de ruit

### Branch ID

20260811-214033

### Branch type

data

### What does the change on this branch bring to main?

Alle zeven Cyan-mixen schreven hun `title_spotify` met **💠** (U+1F4A0, *diamond with a dot*) als
kleur-emoji, terwijl Dave's eigen Spotify-playlists en de MMC-kleurcodering **🧊** (U+1F9CA, *ice*)
gebruiken. De zes andere kleuren in de bron komen wél overeen met hun playlists — Cyan was de enige
afwijking, en hij stond in élke Cyan-entry.

Dat veld bestaat om letterlijk overgenomen te worden: `title_spotify` is de exacte playlistnaam die bij
een mix hoort. Een afwijkende emoji is daar geen cosmetisch detail maar een verkeerde naam, en hij zou
zich hebben voortgeplant naar Spotify zodra die overname wordt uitgevoerd.

- **`full-cyan.json`** — 1 entry (`20240129`), 3 emoji's.
- **`light-cyan.json`** — 6 entries (`20251108`, `20250619`, `20250515`, `20250307`, `20241213`,
  `20220606`), 18 emoji's.

Samen 21 vervangingen over 7 waarden; elke titel draagt de emoji drie keer (na de kleur, na de
frequentie, en vóór het mix-ID). De diff raakt **uitsluitend** `title_spotify`-regels: `title`,
`description_nl`/`description_en` en de overige velden dragen deze emoji niet en zijn niet aangeraakt.
De preview-stub in `light-cyan.json` heeft een leeg `title_spotify` en blijft dus zoals hij was.

**Hoe dit aan het licht kwam.** In `life-hub` is de leeslaag gebouwd die deze namen naar Spotify
overneemt (branch `app/playlistnamen-uit-de-bron`). Die hub kent de canonieke kleur-emoji's en
**weigert** een naam te schrijven waarvan de kleur-emoji niet bij de kleur van de mix hoort, in plaats
van hem stil te corrigeren — anders zou een fout in de bron onzichtbaar blijven en zouden de twee
bronnen permanent uiteenlopen. Dave heeft vastgesteld dat de bron hier fout zat en dat de correctie
daarom hier hoort, niet in de hub. Zolang deze branch niet gemergd is, blokkeert de hub die zes
Cyan-playlists met de reden erbij; na de merge lopen ze mee zonder dat er in `life-hub` iets verandert.

**Geen zichtbaar gevolg voor de website.** De site gebruikt `title` voor wat bezoekers zien; dit veld is
uitsluitend voor de Spotify-kant en wordt door de pagina's niet gerenderd.

### Significance

#### Tier 0

Wie de mix-data leest heeft vanaf nu één regel die klopt in plaats van zes uitzonderingen: de
kleur-emoji in `title_spotify` hoort bij de kleur van de mix, voor alle veertien bestanden. Dat is
precies de aanname waarop de leeslaag in `life-hub` is gebouwd, en die aanname was tot nu toe onwaar
voor Cyan. Het was bovendien een **stille** fout — niets faalde, de waarde was alleen verkeerd, en hij
werd pas zichtbaar doordat een tweede systeem hem weigerde in plaats van hem te repareren.

**Score:** 2

#### Tier 1

Zes Cyan-playlists staan in `life-hub` geblokkeerd zolang de bron de verkeerde emoji draagt. Na deze
merge lopen ze mee zonder dat er aan die kant iets hoeft te gebeuren. Aan de website verandert niets:
`title_spotify` wordt door geen enkele pagina gerenderd, dus dit is een correctie aan de Spotify-kant
van de data en niet aan wat een bezoeker ziet.

**Score:** 2

### Pull Request

[PR #27](https://github.com/DaveKJohn/djcylow-react/pull/27) · merged 2026-08-13

---

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

[PR #26](https://github.com/DaveKJohn/djcylow-react/pull/26) · merged 2026-08-13

---

## #25 · Van `specialists` naar `team-alpha` + `workflow-davekjohn` · Config · 2026-08-12

De specialists-plugin heette in de bron niet meer zoals deze repo hem aanriep. `claude plugin list`
meldde `specialists@claude-code-specialists` als **failed to load — Plugin specialists not found in
marketplace**: de bron is sinds v4.0.0 gesplitst in *teams* (wie de specialisten zijn) en *workflows*
(hoe werk door een repo beweegt), en `specialists` bestaat als id niet meer. Deze repo stond nog op
v3.2.0, geïnstalleerd op 2026-08-03; de marketplace-clone liep zestien commits achter.

Wat er is gebeurd:

- **De marketplace bijgewerkt** naar `afed1b1`, gelijk met `origin/main` van de bron — **v4.5.0**
  plus 42 commits.
- **`.claude/settings.json`** — `specialists@claude-code-specialists` eruit,
  `team-alpha@claude-code-specialists` (de kernploeg) en `workflow-davekjohn@claude-code-specialists`
  (het branch-, changelog- en release-model) erin, beide op v4.5.0 met `--scope project`.
  `workflow-davekjohn` is geen nieuwe keuze maar dezelfde: `CLAUDE.md` beschrijft dat model al woord
  voor woord, inclusief de vijf skills die het meebrengt.
- **De `@`-import van Chris' body herstelt** in `.claude/specialists/SPECIALISTS.md`. Die wees naar
  `plugins/specialists/personas/01-01-persona.md` — een pad dat met de splitsing verdween. Nu:
  `plugins/teams/team-alpha/personas/01-01-persona.md`. Dit is de stille breuk van de twee: Claude
  Code laat een `@`-import die het niet kan vinden zonder één woord vallen, dus het roster rendert
  normaal terwijl de orchestrator zonder zijn ritueel en zijn routeringsregels draait.
- **Hetzelfde pad in vier lenzen** (`01-01`, `03-02`, `05-05`, `05-06`) meegecorrigeerd. Dat zijn
  prozaverwijzingen in de kop, geen imports, dus die faalden niet — ze wezen alleen de weg naar een
  map die er niet meer is.

Wat hierna nog moet, en waarom het hier niet kon:

- **Een sessie-herstart**, gevolgd door `specialists-init` (additief; overschrijft niets). Een
  herstart kan een specialist niet zelf uitvoeren.
- **`CLAUDE.md` volgt in een eigen beweging.** `workflow-davekjohn@4.x` verplaatst het changelog
  entry-bestand van de repo-root (`<branch-naam>.md`) naar `branch/branch-changelog.md` plus
  `branch/branch-progress.md`, en `scripts/release/new-changelog-entry.ps1` is vervangen door
  `scripts/task/new-branch.ps1`. Dat raakt stap 3 en stap 7 van de ontwikkelworkflow — een
  inhoudelijke wijziging van de werkwijze, niet iets om ongemerkt mee te nemen in een config-commit.
  Deze branch houdt zich daarom nog aan het root-model.

Als [inbound #612](https://github.com/DaveKJohn/claude-code-specialists/issues/612) naar de bron
gestuurd: de migratiehandleiding daar noemde één oud pad voor de `@`-import, en dat is niet het pad dat
`specialists@3.2.0` shipte. Wie zijn eigen regel in die tabel niet terugvindt, concludeert redelijkerwijs
dat de reparatie niet voor hem geldt — precies bij de stap die stil faalt. **Dat issue is op 2026-08-12
gesloten en de reparatie zit in v4.5.0**: `INSTALL.md` noemt nu beide oude padvormen, geeft een vormtest
voor wie geen van beide terugvindt, en zegt met zoveel woorden dat een niet-gevonden regel geen bewijs is
dat de reparatie niet van jou is. Dit is dus de eerste keer dat de inbound-route rond is — de
verbetering is in de bron gebouwd en komt via de plugin-update hier terug.

[PR #25](https://github.com/DaveKJohn/djcylow-react/pull/25)

## #24 · Specialists-plugin opnieuw geadopteerd op de hernoemde bron · Config · 2026-08-03

De repo hing aan drie generaties van de specialists-familie tegelijk: `.claude/settings.json` zette
`specialists@davekjohns-workshop` aan, de `@`-imports in `CLAUDE.md` laadden uit de
*davekjohns-workshop*-clone, en wat er feitelijk meeliep kwam uit een **machine-brede user-scope
install** van `specialists@claude-specialists`. Voor deze repo bestond geen eigen install record, dus
de plugin-skills laadden hier helemaal niet — `new-branch`, `open-pr` en `fold-changelog` waren in de
sessie onvindbaar terwijl `CLAUDE.md` ze als de normale route beschrijft.

Afgebroken volgens `UNINSTALL.md` en opnieuw geadopteerd volgens `QUICKSTART.md`, op de huidige bron
[`DaveKJohn/claude-code-specialists`](https://github.com/DaveKJohn/claude-code-specialists) — dezelfde
repo als `claude-specialists`, sinds de rename. Nu één project-scoped install: **v3.2.0**, payload
aanwezig.

De seam verhuist daarmee van `.claude/plugins/claude-specialists/specialists/*-extension.md` naar
`.claude/specialists/lenses/`, en `CLAUDE.md` importeert nog precies één bestand:
`.claude/specialists/SPECIALISTS.md`. Daar woont sindsdien het roster, de routing en de laadstrategie;
`CLAUDE.md` houdt de werkwijze. Dat is de eigenschap waar de nieuwe layout om is gebouwd — de-adoptie
is "verwijder één map en één regel".

Verder meegenomen:

- **`Get-RosterPath` wees nog naar `CLAUDE.md`.** Dat leverde bij elke sessiestart een
  `ROSTER-PENDING` over negentien specialisten die wél in het roster stonden, omdat de check een
  bestand las met alleen de `@`-import erin. Nu `.claude/specialists/SPECIALISTS.md`; `check-roster-sync`
  meldt alle negentien als roster + lens in orde.
- **Twee nieuwe gedeelde skills gedocumenteerd:** `cut-release` (de sluitende stappen van een release
  als afdwingbare checklist) en `park` (branch committen en pushen zonder PR). De regel dat er "nog geen
  `cut-release.ps1`" was, is daarmee achterhaald en vervangen.
- Een dode permission-entry naar de verdwenen `davekjohns-workshop`-cache uit
  `.claude/settings.local.json` gehaald.

De `davekjohns-workshop`-marketplace blijft geregistreerd: die bedient `life-hub` via een eigen
project-record. De registratie `claude-specialists` blijft ook staan — die houdt de project-records van
`smartwatchbanden` geldig. Beide raken deze repo niet meer.

[PR #24](https://github.com/DaveKJohn/djcylow-react/pull/24)

---

