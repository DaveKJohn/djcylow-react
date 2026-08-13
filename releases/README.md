# Releases

**Hoe een release werkt.** Een release is **geen publicatiemoment maar een vastgelegd moment**: een
git-tag op een staat die al draait. Netlify bouwt en publiceert bij elke push naar `main`, en een
PR-merge schrijft daar rechtstreeks in — een wijziging staat dus al op de site zodra de PR gemerged is.
Het cutten van een release bundelt die wijzigingen onder één SemVer-nummer, legt ze vast in de
release-documenten en zet er een tag op.

Deze pagina draagt beide helften: het **proces** — het tier-model, wat een release moet verdienen, de
release-documenten en hoe er één gecut wordt — en, onder de repo-kop aan het eind, de **volledige lijst
releases** die daadwerkelijk gecut zijn. `CHANGELOG.md` houdt alleen wat live is maar nog geen
versienummer heeft, en wijst voor de rest hierheen.

> Dit stond hier tot 2026-07-26 als "één release = één deployment". Dat suggereerde dat een release de
> code naar buiten brengt, terwijl dat bij de merge al gebeurd was. Dev-werk, feature-branches en
> experimenten die nooit gemerged zijn staan hier dus niet in — die horen in de git history. Deze map
> bevat alleen wat bezoekers daadwerkelijk te zien hebben gekregen.

## Het tier-model

**Eén schaal, tweemaal gebruikt.** Een wijziging verklaart hoe ver hij reikt, en dat getal beslist twee
dingen: in welk document — en, waar dat document meer dan één lezer heeft, in welke sectie ervan — de
wijziging terechtkomt, en, samen met zijn significantie-score, waar binnen die sectie hij staat.

| tier | wie het merkt | waar het geschreven staat | wanneer |
|---|---|---|---|
| **2** | abonnees van een dienst | de sectie *voor consumenten* van `audience/<dir>/<X.Y.Z>.md` | minor/major |
| **1** | het management en de opdrachtgever | de twee organisatie-secties van datzelfde bestand | minor/major |
| **0** | alleen de eigen developers van deze repo | `development/<dir>/<X.Y.Z>.md` | elke release |

**Tier 1 en 2 zijn twee SOORTEN publiek, en een repo heeft er precies één van.** Het zijn geen twee
sporten van een ladder. Tier 1 is het management en wie het werk opdraagt of betaalt — het publiek van
een repo die iets *oplevert*. Tier 2 is de abonnee van een **dienst**, die beslist of hij meegaat met een
upgrade. Een repo antwoordt er één, één keer, in `Get-ReleaseAudienceTier`, vóór er een entry geschreven
is. `new-branch` scaffoldt dan tier 0 plus die ene tier, en `open-pr` vraagt naar die tier in plaats van
naar elke sport vanaf 1.

**De cumulatieve ladder is er niet meer.** Tot 2026-08-12 was een tier-2-entry een tier-1-sectie
*verschuldigd*, op de redenering dat wat een consument merkt ook iets is waar een collega over hoort. Dat
klopt voor een repo met twee echte publieken en levert niets dan duplicatie op voor de veel gewonere repo
met één. Het development-document draagt nog steeds alles, tier 0 incluis, omdat het het record is en
niet een samenvatting daarvan.

**Waar het getal vandaan komt: de auteur van de entry, op de branch.** `new-branch` schrijft de
`#### Tier N`-subsecties waar deze repo naar vraagt met hun scores leeg; wie de branch afmaakt vult ze in,
met een score of met `N/A` plus de reden dat hij daar niemand raakt. **De reikwijdte is de hoogste tier
die een getal draagt.** `open-pr` weigert een entry waarvan de beschrijving, de body of de reden van een
tier nog leeg is, en `fold-changelog` vouwt de entry **letterlijk** — de verklaring woont dus op precies
één plek, de entry zelf.

**Bewust niet afgeleid van de branch-prefix.** Die voorspelt de impact niet: de bron heeft gemeten dat de
meest ingrijpende wijziging voor een consument — het hernoemen van de marketplace, wat elke bestaande
install breekt — op een `chore/`-branch arriveerde.

### Wat een release moet verdienen

Drie regels, alle drie te controleren vóór er iets geschreven wordt:

| bump | vereist |
|---|---|
| **patch** | niets — een release die volledig uit tier-0-werk bestaat is waar een patch voor is |
| **minor** | minstens één entry van **tier 1 of hoger** |
| **major** | minstens **10 minors** in de huidige major-lijn, bovenop het algemene minimum |

**Waarom een tier-0-only release een patch is en geen weigering.** Zo'n release "heeft niemand om het aan
aan te kondigen" — en dat is precies waar een patch voor is. Het versienummer beweegt, de tag markeert het
moment, en het ene document dat geschreven wordt is het record.

**Waarom een minor tier 1 vereist en niet tier 2.** De regel staat bewust als *tier 1 of hoger* en niet als
"de publieks-tier": zo leest hij correct in een tier-1-repo én een tier-2-repo, zonder dat een van beide
hem hoeft te vertalen. Wat de ruimere regel eerlijk houdt is dat **de secties de tier volgen en niet de
bump** — een minor waarvan de hoogste entry tier 1 is, schrijft het document zonder zijn sectie *voor
consumenten*, dus niemand buiten krijgt een sectie over werk dat hij niet kan zien.

**Waarom een major minors telt en geen openstaand werk:** een major is een **recap** van de minors ervóór.
Een openstaande tier-2-entry is dus met opzet *niet* vereist; de accumulatie wel.

## De release-documenten

Welke mapindeling ze groepeert — `<X>.x` per major of `<X.Y>` per minor — wordt één keer beantwoord door
`Get-ReleaseNotesGrouping` in [`scripts/repo-config.ps1`](../scripts/repo-config.ps1), dus `<dir>`
hieronder staat voor welke van de twee deze repo gebruikt.

| document | voor wie | wanneer |
|---|---|---|
| `development/<dir>/<X.Y.Z>.md` | de developers — het volledige per-PR record | elke release |
| `audience/<dir>/<X.Y.Z>.md` | wie deze repo aan publiceert — één handgeschreven document met een genoemde sectie per lezer | minor/major |
| `github/<dir>/<X.Y.Z>.md` | wie de GitHub Releases-pagina opent | elke release |

**Elke root onder `releases/` noemt zijn LEZER**, en de indeling is er dus één van lezer en niet van vorm.
`development/` noemt de developers, `github/` noemt de pagina, `audience/` noemt wie de repo aan
publiceert — welke van de twee publieks-tiers dat ook is. De root staat in `Get-ReleaseNoteRoot`; de
gedeelde default is bewust nog `releases/notes`, zodat een repo die de knop nooit beantwoordde niet stil
naar een map wordt gestuurd die hij niet heeft.

**Een patch schrijft helemaal geen handgeschreven document** en wordt aangekondigd door de
Release-body alleen. De **secties** binnen het document volgen de tier; **of het document er is** volgt de
bump.

### Tier 0 — development

**Ruw en compleet.** Elke changelog-entry zoals hij geschreven was, niets herschreven — letterlijk de hele
changelog, bij elke release. Het is het per-PR record waar een developer op teruggaat, en precies daarom
wordt het nooit ingekort: een samenvatting ervan is waar het handgeschreven document voor is.

**Het is het enige document dat nog per tier groepeert**, en dat is een verschil met `CHANGELOG.md` in
plaats van een kopie ervan: `## Tier <n> — <publiek>` eerst, dan de entries van die tier als één platte
gerangschikte lijst in de orde die de fold liet staan. De changelog liet zijn tier-koppen vallen in
dezelfde wijziging die de entry zijn eigen reikwijdte liet verklaren; dit document houdt ze omdat het alle
drie de tiers tegelijk draagt.

Elke entry arriveert heel, met zijn `###`-kop die de **branch** noemt en daaronder dezelfde zes
`####`-secties die de scaffolder schrijft — één kopniveau dieper dan in `CHANGELOG.md`. Er zitten geen
branch-type-categorieën tussen: die groepering kwam van de branch-prefix, en die voorspelt de impact niet.

Zijn omvang is ook waarom het nooit de body van een GitHub Release is maar altijd een bijlage: de
`--notes-file` van `gh` kent een harde grens van **125.000 tekens**, en een volledig record kan daar langs.

### De publieks-tier — het handgeschreven document

**Eén document, met een genoemde sectie per lezer.** Het verving twee losse documenten — een interne noot
voor de organisatie en een consumenten-document — na de meting dat bij alle twaalf releases sinds de
interne tier bestond **beide werden geschreven, over dezelfde wijzigingen**: ~38% van de woorden kon in
een consumenten-sectie staan en *deed dat ook*, herschreven in een tweede register. Een **gemengd**
document is daarom geweigerd — dat had de andere 62% moeten laten vallen of de schrijfnorm moeten breken;
een **gesectioneerd** document houdt elk register heel en schrijft de gedeelde 38% één keer.

Drie secties, in deze orde:

| sectie | voor wie | hoe hij arriveert |
|---|---|---|
| *voor consumenten* | wie beslist of hij meegaat | **voorgevuld** — de tier-2-entries, nog in de woorden die hun auteurs voor een diff-reviewer schreven. Afwezig waar geen entry tier 2 haalde. |
| *wat het waard is* | de organisatie | **leeg** — dit is niet te genereren. Denk in tijd, risico en verminderde afhankelijkheid van een developer. |
| *wat er bij deze release nog open stond* | de organisatie | **leeg**, en met opzet in de verleden tijd: een gepubliceerd document beweegt niet mee met de werkelijkheid, dus een zin in de tegenwoordige tijd is binnen uren achterhaald in plaats van maanden. |

**Een minor zonder tier-2-entry krijgt het document zonder zijn sectie *voor consumenten*** — wat elke
minor is in een repo waarvan het publiek tier 1 is. De twee organisatie-secties horen bij elke bump die de
seam noemt: het versienummer beweegt voor iedereen, dus de vraag van de organisatie is altijd beantwoord.

**Het blijft een concept dat bewerkt moet worden.** Entry-bodies zijn geschreven voor wie de diff
reviewt, ook als de wijziging een consument bereikt — dus de *selectie* van de sectie is goed en de
*proza* moet nog herschreven worden van de kant van de lezer. Wat weg is, is het schrappen; niet het
schrijven.

**Het is gepubliceerde output, geen intern bestand.** Waar de bump er één schreef, gaat het document als
bijlage mee naar de GitHub Release. Dat heeft een gevolg dat het benoemen waard is: alles wat de sectie
*wat er nog open stond* als een **levende** bewering formuleert, verschaalt binnen uren na publicatie ter
plekke. Schrijf het als "open op het moment van deze release", niet als een uitspraak over nu.

### Waar het handgeschreven document landt

**Het gaat de normale route.** De release-documentatie is niet één van de met naam genoemde uitzonderingen
op "alles via een branch": ze reist via de release-branch, waarvan de scope in
[`CLAUDE.md`](../CLAUDE.md) staat. Het alternatief — de release-uitzondering oprekken tot ook het
geschreven document — is een uitzondering groter maken dan waarvoor hij verleend is, en dat is precies wat
een uitzondering onveilig maakt.

## Een release cutten

Een release is een **vastgelegd moment**: de staat wordt getagd als `vX.Y.Z`. Er wordt **alleen op
expliciet verzoek van de eigenaar** gecut.

Let op de volgorde van oorzaak en gevolg: de wijzigingen stonden al live vóór het proces begon, namelijk
vanaf hun eigen PR-merge. Een release cutten voegt een versienummer, drie documenten en een tag toe aan wat
al draait. Precies daarom is een cut ook laagrisico: er gaat geen ongeteste code mee naar buiten.

De drie documenten verdelen zich zo over de Release-pagina: **`github/` is de body**, en `development/`
en — bij een minor of major — `audience/` gaan als **bijlage** mee.

**Upload de bijlagen onder unieke bestandsnamen.** Elk document dat een release oplevert heet
`<X.Y.Z>.md`, dus twee ervan rechtstreeks uit `releases/` uploaden botst: de tweede upload komt terug met
`HTTP 404`. De `file#label`-syntax van `gh` lost dat niet op — die zet het label, niet de naam. Kopieer ze
eerst naar `vX.Y.Z-development-notes.md` en `vX.Y.Z-release-note.md` en upload de kopieën.

Guardrails vóór er één bestand geschreven wordt: een schone `main`, geen ongefolde entry-bestanden, de
bump verdiend door de openstaande tiers, de lint-poort groen, en een tag die nog niet bestaat. Alle vijf
vóóraf, met opzet: falen nadat het notes-bestand bestaat laat een release half gecut achter.

---

**Alles boven deze streep reist mee naar elke repo die deze release-workflow draait. Alles eronder niet.**
Wat volgt is het eigen antwoord van deze repo op de keuzes die de pagina openlaat — de seam-waarden, de
besluiten erachter, en de release-lijst zelf.

## djcylow-react (VERVANG BIJ HET MIRRORREN)

### Hoe je deze pagina mirrort

> **Aan een agent die deze workflow naar een andere repo mirrort:** alles boven de horizontale streep is
> portable en kan overgenomen worden. Deze sectie niet — hier wonen de lokale besluiten van één repo en
> zijn eigen release-record, en niets daarvan is waar voor jouw repo. Houd dus de **vorm** en vervang de
> **inhoud**: noem de kop naar je eigen repo, verklaar je eigen seam-waarden, en begin de release-lijst
> leeg in plaats van deze versies, datums en PR-verwijzingen mee te nemen. Twee dingen die je niet doet:
> vouw hier niets van omhoog in de portable helft, en verwijder de sectie niet — een gemirrorde pagina
> zonder deze sectie heeft nergens om zijn eigen historie te laten landen, en de volgende release schrijft
> een rij in een document dat nooit verklaarde waar rijen heen gaan.

### De seam-waarden die hier gelden

**Elk release-document groepeert per major (`2.x`).** Dat is sinds 2026-08-13 zo, op Dave's verzoek om
`releases/` precies gelijk te maken aan de bron. Tot die dag stond het per **minor** (`2.22/`), afgelezen
van een boom met 23 mappen — een geldig antwoord, want de portable helft hierboven laat `<dir>` juist voor
beide staan. De 60 bestaande documenten (37 in `development/`, 23 in `audience/`) zijn met `git mv`
verplaatst en **niet herschreven**.

**`Get-ReleaseAudienceTier` staat op 1** — het management en de opdrachtgever. Er komt hier dus géén sectie
*voor consumenten* in het handgeschreven document: dat is tier 2, en bezoekers van djcylow.com lezen geen
release notes. Wat overblijft zijn de twee organisatie-secties.

**`Get-ReleaseHistoryPath` staat op zijn default, `releases/README.md`** — deze pagina, want de lijst woont
hier. Dat maakt de lijst onderaan de **enige** boekhouding van uitgebrachte versies. Tot 2026-08-11 zette
een cut hier ook een `## Releases`-blok in `CHANGELOG.md`: dezelfde informatie maar armer, met een
`← LIVE`-markering die op 2026-07-26 al was afgeschaft en die maandenlang fout stond — op v2.20.1, terwijl
v2.20.2, v2.21.0 en vijf PR's al live waren. Dat verviel; geen dubbele boekhouding meer.

**`Get-ReleaseNoteRoot` is `releases/audience`.** De map heette `releases/highlights/` tot 2026-08-13. Die
naam zei hoe het document geschreven was, niet voor wie — precies de fout die de bron een dag eerder bij
zijn eigen `notes/` repareerde. De 23 documenten zijn verplaatst en niet herschreven: noemt de tekst van
een oudere note nog `releases/highlights/`, dan is dat wat er stond op de dag dat hij uitging.

**`Get-ReleaseConsumerBumps` is minor en major**, en dat is nagemeten in plaats van overgenomen:
`audience/` heeft 23 bestanden die alle 23 op `.0` eindigen, terwijl `development/` er 37 heeft waarvan 14
een patch. 23 releases achter elkaar zonder uitzondering.

**`Get-ReleasePluginTier` is niet gedeclareerd**, en dat is een antwoord: de default is "bestaat
`.claude-plugin/marketplace.json`", hier `false`. Deze repo publiceert geen plugins, dus er is geen
lockstep-bump en de cut leidt de huidige versie af van de nieuwste `vX.Y.Z`-tag.

**`Get-ReleaseMajorMinMinors` is niet gedeclareerd** en staat dus op 10. Deze lijn loopt tot `2.22`, dus
die grens is hier ruim gehaald — wat een `3.0.0` tegenhoudt is geen regel maar een besluit, hieronder.

### Lokale besluiten

**De drie documenten zijn hier handwerk.** Rendall 🎬 schrijft ze; de stappen staan in
[`CLAUDE.md`](../CLAUDE.md) onder **Release Workflow**, en de gedeelde `cut-release`-skill is
uitdrukkelijk een checklist die niets uitvoert. Wat deze repo van de bron overneemt is de **indeling**,
niet de generator.

> **Eén nuance daarbij, gemeten op 2026-08-13.** Hier stond dat `cut-release.ps1` "niet bruikbaar is in
> deze repo" omdat het `marketplace.json` leest en elke `plugin.json` in lockstep bumpt. Dat is te sterk:
> het script in de plugin is byte-identiek aan dat van de bron, maar gate't precies die
> marketplace-afhankelijkheid achter `Get-ReleasePluginTier` en valt terug op de nieuwste tag. In principe
> is het dus wél draaibaar hier. Of het schoon doorloopt is **niet gemeten** — er is nog geen release mee
> gecut. Wat onveranderd waar blijft: de skill voert niets uit, en de Release Workflow is handwerk.

**`3.0.0` is gereserveerd voor een volledig redesign.** De React-versie van de site startte op `2.0.0`
(framework-migratie van de vorige stack) en `MAJOR` blijft voorlopig op `2` — een besluit van Dave, niet
een uitkomst van de 10-minor-regel.

**Alles wat de publieke site of de SEO raakt is Dave's beslissing**, en dat werkt door in wat een release
mag bevatten: titels, `description`-velden, metadata en routes. Een specialist stelt voor, Dave beslist.

**Het documentmodel van de 23 bestaande `audience/`-documenten is nog het oude:** één register, leesbaar
Nederlands zonder jargon, geen secties per lezer. De mapstructuur loopt sinds 2026-08-13 volledig gelijk
met de bron; het documentmodel niet, en die herziening staat bewust open als eigen werk (Dave,
2026-08-13). Gepubliceerde documenten worden daarbij niet herschreven — het raakt alleen het volgende.

**`github/` is nog leeg, en dat is juist.** De map is nieuw sinds 2026-08-13 en de eerste aankondiging hoort
bij de eerstvolgende release; oude releases krijgen er met terugwerkende kracht géén, want een aankondiging
voor een moment dat al voorbij is verzinnen we niet. Tot die tijd blijft de body van een bestaande Release
wat hij was. Deze root heeft bewust geen seam: hij staat hardcoded in `cut-release.ps1`, omdat een nieuwe
root geen bestaande plaatsing hoeft te accommoderen.

### Wat deze pagina extra houdt

Twee stukken hieronder staan niet in de bron en zijn een bewuste toevoeging van deze repo. Ze staan hier
onder de streep en niet erboven, want ze reizen niet met de workflow mee.

#### Git tags & rollback

Een git-tag is een **vaste, vernoemde verwijzing naar één specifieke commit**. Het verschil met een branch
is wat het bruikbaar maakt als release-anker:

- Een **branch** (zoals `main`) **beweegt mee**: elke nieuwe commit schuift `main` vooruit.
- Een **tag** (zoals `v2.3.0`) **staat stil**: hij wijst voor altijd naar dezelfde commit, wat er daarna ook
  gebeurt. `v2.3.0` blijft dus exact de staat die destijds live ging, ook al is `main` intussen tientallen
  commits verder.

```
commits:   A --- B --- C --- D --- E   ← main (beweegt mee naar rechts)
                 ↑           ↑
              v2.1.0      v2.3.0        (blijven staan waar ze staan)
```

Voor releases gebruiken we altijd **annotated** tags (een object met auteur, datum en bericht) en geen
*lightweight* (alleen een naam) — je wilt weten wanneer en waarom een versie is gezet:

```sh
git tag -a v2.3.0 <commit> -m "v2.3.0 - UX MODUS (donker/licht mode)"
```

> Bij het pushen zie je een annotated tag tweemaal in de remote-lijst, bv. `v2.3.0` en `v2.3.0^{}`. Dat is
> geen dubbeling: de eerste is het tag-object (met het bericht), de tweede (`^{}`) is de commit waar die
> tag uiteindelijk naar verwijst.

```sh
git tag -n1                # lijst alle tags mét hun bericht
git show v2.3.0            # bekijk de tag + de wijzigingen van die commit
git checkout v2.3.0        # zet de werkmap exact op die release (rollback / inspectie)
git checkout main          # weer terug naar het heden
```

`git checkout v2.3.0` zet je in "detached HEAD" — je kijkt naar het verleden zonder op een branch te
zitten. Prima om te inspecteren of een hotfix-branch vanaf dat punt te starten; ga daarna terug met
`git checkout main`.

**Let op:** een gewone `git push` neemt tags **niet** mee. Push een release-tag apart met
`git push origin v2.3.0` (één tag) of `git push origin --tags` (alle nog niet-gepushte).

#### Wat welk versienummer krijgt

We volgen [Semantic Versioning](https://semver.org/lang/nl/): `MAJOR.MINOR.PATCH`. De portable regels
hierboven zeggen wat een bump moet *verdienen*; deze tabel zegt welk soort werk in deze repo welke bump
*is*.

| Onderdeel | Voorbeeld | Wanneer ophogen |
|-----------|-----------|-----------------|
| **MAJOR** | `2.x` → `3.0.0` | Ingrijpende verbouwing of redesign (volledig nieuwe layout of framework-migratie) |
| **MINOR** | `2.0` → `2.1.0` | Nieuwe feature, backwards-compatible (nieuwe pagina, nieuw component, nieuwe mix, content-updates) |
| **PATCH** | `2.1.0` → `2.1.1` | Bugfix, docs, workflow, hotfix of kleine stijlcorrectie |

### Gemeten instanties achter de portable regels

- **De botsing van bijlage-bestandsnamen is hier voorspeld en in de bron gemeten** — daar bij `v3.3.0`, waar
  de tweede upload `HTTP 404` teruggaf op `…&name=3.3.0.md`. Deze repo heeft nog geen release met twee
  bijlagen gecut, dus de regel staat hier op andermans meting.
- **De `← LIVE`-markering stond hier maandenlang fout** — op v2.20.1, terwijl v2.20.2, v2.21.0 en vijf PR's
  al live waren. Dat is de instantie achter "één boekhouding, en dat is deze pagina".
- **`Get-ReleaseNoteRoot` bestaat omdat deze repo erom vroeg.** Tot en met v4.4.0 van de bron stond
  `releases/notes/` hardcoded in `cut-release.ps1`, waardoor de publieks-laag hier onaanzetbaar was. Gemeld
  via de inbound-route ([#616](https://github.com/DaveKJohn/claude-code-specialists/issues/616)) en in de
  bron gerepareerd.

### De release-lijst

**Elke release die ooit gecut is, nieuwste eerst, gegroepeerd per major.** Dit is het volledige record:
`CHANGELOG.md` houdt alleen wat nog geen versienummer heeft en wijst voor de rest hierheen.

Nieuwe releases gaan in de tabel van de huidige major, de bovenste. Daarom is **het openen van een nieuwe
major-sectie een bewuste handeling, vóór de release gecut wordt**: de inserter zet de rij achter de eerste
release-tabel die hij vindt, dus zonder sectie voor de nieuwe major zou een `v3.0.0`-rij onder `2.x`
belanden zonder dat er iets faalt.

Drie dingen aan de structuur hieronder zijn dragend en geen stijl, en alle drie zijn de reden dat deze lijst
aan het **eind** van de pagina staat:

- **De inserter neemt de eerste release-tabel in het hele document**, dus elke tabel die hierboven wordt
  ingevoegd zou stil de rijen gaan ontvangen. Dat is het ene ding om te controleren bij het toevoegen van
  een sectie waar dan ook op deze pagina.
- **De guardrail leest de laatste `<n>.x`-kop boven die tabel**, dus die koppen moeten herkenbaar blijven.
  Het kop**niveau** mag veranderen — `###` en `####` worden beide geaccepteerd, want hoe diep de lijst
  genest is, is een layout-keuze van de repo — maar de tekst `<n>.x` is geen decoratie.
- **De tabelkop wordt in proza beschreven en nergens op deze pagina geciteerd**, want de inserter matcht die
  regel letterlijk en een document dat een patroon uitlegt hoort niet één edit verwijderd te zijn van het
  triggeren ervan. Hij is Engels, net als de zes sectiekopjes van een entry, en om dezelfde reden: het is een
  machine-gelezen sleutel, geen proza.

De Versie-cel wijst naar het leesbaarste document dat een release heeft — het handgeschreven document waar
de bump er één schreef, het development-record op een patch.

#### 2.x

| Version | Date | Type | Title |
|---|---|---|---|
| [2.22.0](audience/2.x/2.22.0.md) | 2026-07-26 | Minor | Spotify-velden, datums hersteld, en de documentatie gelijk aan de praktijk |
| [2.21.0](audience/2.x/2.21.0.md) | 2026-07-25 | Minor | Alle mixtitels naar één uniek formaat, plus workflow- en toolingherstel |
| [2.20.2](development/2.x/2.20.2.md) | 2026-07-25 | Patch | Mix-titels met hoofdletter, genrefilter-fix en workflow-aanscherpingen |
| [2.20.1](development/2.x/2.20.1.md) | 2026-07-02 | Patch | Workflow-herstructurering: PR's, per-branch changelog, releases/development+highlights |
| [2.20.0](audience/2.x/2.20.0.md) | 2026-07-02 | Minor | Luister-genrefilters uitgebreid, URL-sync en changelog opgeschoond |
| [2.19.2](development/2.x/2.19.2.md) | 2026-06-28 | Patch | Orange Full (m) subgenre gecorrigeerd |
| [2.19.1](development/2.x/2.19.1.md) | 2026-06-28 | Patch | robots.txt en sitemap.xml static export fix |
| [2.19.0](audience/2.x/2.19.0.md) | 2026-06-28 | Minor | NL/EN descriptions, image rename, mix-detailpagina verbeteringen |
| [2.18.0](audience/2.x/2.18.0.md) | 2026-06-27 | Minor | SEO/GEO verbeteringen, top_artists & subgenre backfill |
| [2.17.0](audience/2.x/2.17.0.md) | 2026-06-27 | Minor | GA4 + GTM analytics — view_mix dataLayer event |
| [2.16.4](development/2.x/2.16.4.md) | 2026-06-27 | Patch | Entry-formaat en branch-naamgeving vastgelegd |
| [2.16.3](development/2.x/2.16.3.md) | 2026-06-27 | Patch | Changelog workflow en mapstructuur verfijnd |
| [2.16.2](development/2.x/2.16.2.md) | 2026-06-27 | Patch | Changelog & release-notes workflow verfijnd |
| [2.16.1](development/2.x/2.16.1.md) | 2026-06-27 | Patch | Changelog workflow + versienummering |
| [2.16.0](audience/2.x/2.16.0.md) | 2026-06-25 | Minor | Mix tags toegevoegd |
| [2.15.0](audience/2.x/2.15.0.md) | 2026-06-25 | Minor | Mix detail verbeteringen + domein en taal gecorrigeerd |
| [2.14.4](development/2.x/2.14.4.md) | 2026-06-25 | Patch | add-mix script: automatische afbeelding controle en conversie |
| [2.14.3](development/2.x/2.14.3.md) | 2026-06-25 | Patch | add-mix script: AI beschrijving + tracklist plakken |
| [2.14.2](development/2.x/2.14.2.md) | 2026-06-25 | Patch | Script: nieuwe mix toevoegen |
| [2.14.1](development/2.x/2.14.1.md) | 2026-06-25 | Patch | Alle afbeeldingen geconverteerd naar WebP |
| [2.14.0](audience/2.x/2.14.0.md) | 2026-06-25 | Minor | Mix beschrijvingen alle kleuren + Red image update |
| [2.13.0](audience/2.x/2.13.0.md) | 2026-06-18 | Minor | Code structuur & JSON tracklist verbeterd |
| [2.12.0](audience/2.x/2.12.0.md) | 2026-06-16 | Minor | Nieuwe mix: Red Light EDM (Vol. 6) |
| [2.11.1](development/2.x/2.11.1.md) | 2026-05-10 | Patch | BackButton navigatie via Link |
| [2.11.0](audience/2.x/2.11.0.md) | 2026-05-08 | Minor | Nieuwe mix: Orange Drum & Bass (Vol. 9) + responsive |
| [2.10.0](audience/2.x/2.10.0.md) | 2026-05-05 | Minor | UX kleuren uitgebreid + layout responsive |
| [2.9.0](audience/2.x/2.9.0.md) | 2026-05-01 | Minor | UX MODUS — donker/licht mode |
| [2.8.0](audience/2.x/2.8.0.md) | 2026-04-20 | Minor | Reviews verborgen + responsive breakpoints |
| [2.7.0](audience/2.x/2.7.0.md) | 2026-04-13 | Minor | Referenties component + Mobile Content 2.0 |
| [2.6.0](audience/2.x/2.6.0.md) | 2026-04-11 | Minor | Filter 2.0 + Luister pagina 2.0 |
| [2.5.0](audience/2.x/2.5.0.md) | 2026-04-10 | Minor | Nieuwe mix + mix detail refactor |
| [2.4.0](audience/2.x/2.4.0.md) | 2026-03-20 | Minor | Nieuwe mix: Yellow EDM (Full) |
| [2.3.0](audience/2.x/2.3.0.md) | 2026-03-19 | Minor | BasiskleurenCarousel + Promo sectie + Navigatie |
| [2.2.0](audience/2.x/2.2.0.md) | 2026-03-13 | Minor | Hero Banner |
| [2.1.0](audience/2.x/2.1.0.md) | 2026-03-11 | Minor | AudioPlayer + Light Yellow mixes |
| [2.0.1](development/2.x/2.0.1.md) | 2026-03-08 | Patch | Succes message contactformulier |
| [2.0.0](audience/2.x/2.0.0.md) | 2026-03-07 | Major | Eerste livegang op Netlify |
