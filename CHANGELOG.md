# Changelog

De geschiedenis van de DJ Cylow-website: elke gemergde branch met zijn pull request, nieuwste
bovenaan. Er zijn geen secties meer — **elke `##`-kop hieronder is één wijziging**, en dat is wat de
gedeelde workflow-scripts lezen. Het mechanisme (het entry-bestand in `branch/`, folden, een release
knippen) staat in [`CLAUDE.md`](CLAUDE.md).

**`origin/main` is de live site.** Netlify bouwt en publiceert bij elke push naar `main`, en een
PR-merge schrijft daar rechtstreeks in. Alles hieronder staat dus al op `djcylow.com` — live, maar
nog zonder versienummer. Een release is een label op wat al draait.

**De uitgebrachte versies staan niet hier maar in
[`workflow-davekjohn/releases/README.md`](workflow-davekjohn/releases/README.md)**, met
datum, type en een samenvattende regel per versie. Dit bestand houdt alleen wat nog géén
versienummer heeft; een release-cut haalt die entries eruit en laat deze intro achter.

> Tot 2026-07-26 stond hier het omgekeerde, met een `← LIVE`-markering die zou aanwijzen welke versie
> draaide. Dat model was onjuist en de markering stond maandenlang fout — op v2.20.1, terwijl
> v2.20.2, v2.21.0 en vijf PR's al live waren. De markering is vervallen: de bovenste uitgebrachte
> versie draait per definitie al.

## `docs/release-v2240-audience-document` changelog

### Branch title

Het audience-document van v2.24.0 zegt wat de release oplevert en wat er openstond

### Branch ID

20260815-232356

### Branch type

docs

### What does the change on this branch bring to main?

`cut-release` zet bij een minor een concept van het audience-document neer met twee lege secties die
geen script kan vullen: wat de release de organisatie oplevert, en wat er bij deze release nog
openstond. Dit is dat concept, herschreven — v2.24.0 is de eerste release die in deze repo via
`cut-release` is gecut, en met 54 entries ook veruit de grootste.

`What it is worth` splitst de 54 wijzigingen in de drie dingen die ze werkelijk opleverden: bugs die
bezoekers troffen zonder zichtbaar te zijn (de luisterpagina die als lege shell in de statische HTML
stond, 84 canonicals naar een redirect, een taalsignaal dat de eigen content tegensprak, een mix die
404 gaf), de poortenlaag die er in een week bij kwam (0 → 213 tests, ESLint als echte poort, CI, de
paginatal-ondergrens), en de documentatie die stopte met de machinerie tegen te spreken. Elk van de
drie is in de eenheid geschreven waarin de organisatie hem leest — tijd, risico, afhankelijkheid van
een developer — en niet in het aantal wijzigingen.

`What was still open at this release` staat in de verleden tijd, want een gepubliceerd document
beweegt niet mee: het ene niet-gesloten auditpunt (#68, de 25 Full-mixen op de legacy-bucket, wachtend
op een upload van Dave) plus de twee beslissingen die bewust open zijn gelaten — de PR-grens voor
site-werk nu er deploy previews zijn, en de tweede ruleset zonder bypass uit #91.

Daarnaast is de gegenereerde `For whom`-regel gecorrigeerd. Die beloofde *"consumers of this product,
and colleagues in the organisation -- one section each"* terwijl er maar één sectie is: geen enkele
entry haalde tier 2, wat het script in zijn eigen uitvoer ook meldt. Een kop die een lezer aankondigt
die er niet is, is precies de tegenspraak die deze repo elders opruimt.

### Significance

#### Tier 0

Het document is de enige plek waar staat wat een week auditwerk heeft opgeleverd in plaats van welke
54 dingen er zijn veranderd; de development-note draagt het tweede, niemand het eerste. Voor de
volgende sessie is dit bovendien het eerste voorbeeld van een uitgeschreven audience-document na een
`cut-release`-cut, dus het zet de vorm neer die de volgende cut kan volgen.

**Score:** 3

#### Tier 1

Dit is het document dat voor de organisatie geschreven is — de enige van de drie release-documenten
die niet in per-PR-eenheden praat. Zonder deze twee secties gaat v2.24.0 naar buiten als een lijst van
54 links, en dan is de vraag "wat hebben we hieraan gehad" onbeantwoord in het document dat er
speciaal voor bestaat.

**Score:** 4

### Pull Request

[PR #143](https://github.com/DaveKJohn/djcylow-react/pull/143) · merged 2026-08-15

---

## `docs/wat-de-eerste-release-run-mat` changelog

### Branch title

de testpoort en de release-route dragen wat de eerste cut-run heeft gemeten

### Branch ID

20260816-092424

### Branch type

docs

### What does the change on this branch bring to main?

`CLAUDE.md` beschreef de testpoort als **acht suites, 143 tests**. Opnieuw gemeten op 2026-08-16 met
Vitest 4.1.10: **zestien suites, 213 tests**, in 19 seconden. Het getal was juist toen het werd
opgeschreven en bleef staan terwijl de auditbacklog (PR's #98 t/m #142) de suite verdubbelde — de acht
suites die in de opsomming ontbraken zijn precies de acht die uit die backlog kwamen. Het stond op twee
plekken: in de bullet die de testpoort beschrijft, en in de tabel met de vier pijlers waarop de
PR-default rust. Beide dragen nu het gemeten aantal, en de opsomming is compleet en gegroepeerd naar wat
elke suite bewaakt.

De **Release Workflow is op 2026-08-15 voor het eerst gelópen in plaats van gelezen** — v2.24.0, 54
entries — en de route bleek te kloppen. Wat het document niet kon vertellen was wat het kóst en hoe het
eruitziet terwijl het draait. Drie waarnemingen uit die run staan er nu bij, nagemeten uit de
git-timestamps en `gh release view v2.24.0` in plaats van uit de herinnering van één avond: de cut zelf
duurde 3m 04s, het handwerk erna 32m 36s, samen 35m 40s van cut tot gepubliceerd — dus het script is
niet de kostenpost maar stap 4 en 5 zijn dat. Verder dat de push naar `main` de melding
`Required status check "poort" is expected` geeft, wat de ruleset-bypass is en geen fout, maar er op het
beslissende moment uitziet als een blokkade. En dat `-NoPush` bij een grote cut het enige moment is
waarop een mens het samengestelde resultaat ziet vóór het publiek is.

Ten slotte de tweede timing-pass op `releases/audience/2.x/2.24.0.md`, die de checklist expliciet
voorschrijft: het totaal bestaat pas ná de publicatie, dus dat document droeg alleen de 3 minuten van de
cut en beweerde bovendien dat het schrijven ervan niet in het getal zat. Het draagt nu de hele run van
36 minuten, met de vaststelling dat vijf zesde daarvan schrijven en controleren was in plaats van
machinerie.

### Significance

#### Tier 0

`CLAUDE.md` laadt bij élke sessie mee, en het onjuiste getal stond in de sectie die beschrijft hoe
streng de poort is. Een lezer onderschatte structureel wat er bewaakt wordt en kon een testgat vermoeden
dat al gedicht was. De release-lessen zijn bovendien eenmalig te borgen: over een week is de run een
herinnering en staat er weer een beschrijving die uit de code is gelezen in plaats van gemeten.

**Score:** 3

#### Tier 1

Het audience-document van v2.24.0 is een gepubliceerd stuk voor de opdrachtgever en droeg een
kostenplaatje dat vier vijfde van de werkelijke tijd wegliet. Dat is precies de klasse bewering waarop
een lezer een verwachting baseert: een release die "3 minuten" kost leest als iets wat je tussendoor
doet.

**Score:** 2

### Pull Request

[PR #144](https://github.com/DaveKJohn/djcylow-react/pull/144) · merged 2026-08-16

---

## `docs/pushen-vrij-en-een-merge-uitzondering` changelog

### Branch title

Pushen naar origin mag altijd, en alleen frontend-werk wacht nog op Dave

### Branch ID

20260816-144520

### Branch type

docs

### What does the change on this branch bring to main?

Twee regels zijn op Dave's woord vereenvoudigd, allebei in de richting van minder wachten.

**Pushen naar `origin` is vrij, ook naar `origin/main`.** De regel luidde *"dit initiatief ligt altijd bij
Dave — vraag hier nooit naar, ook niet impliciet"* en kwam uit een correctie van 2 juli 2026, met als reden
dat een release live gaat op productie. Die reden was uitgehold: sinds de PR-stap op 2026-08-13 *doorlopen
tenzij* werd, bereikt al het overige `origin/main` allang via de merge — en `gh pr merge` schrijft daar
server-side rechtstreeks in. Wat er ná die uitholling nog onder viel was precies één handeling, de
**fold-commit**, en dat is de minst riskante van alles wat hier naar `origin/main` schrijft: `CHANGELOG.md`
plus twee bestanden in `workflow-davekjohn/branch/`, die geen enkele gebouwde pagina veranderen. Netlify
meldde bij PR #145 letterlijk *"Pages changed — skipping"*. De zwaarste stap liep dus automatisch en de
lichtste bleef wachten. Dat brengt de repo ook terug bij de bron, waar de gedeelde `fold-changelog`-skill
`-Push` als de normale route noemt.

**Een PR wacht nog om precies één reden: er valt iets aan de frontend te bekíjken.** Er stonden er twee;
de tweede — *onomkeerbaar of naar buiten gericht* — is geschrapt. Wat daarmee **niet** verdwijnt zijn de
beschermde bestanden zelf: `next.config.ts`, `netlify.toml` en verwijderingen uit `public/images/` staan
onverkort op de lijst *Nooit zonder expliciete toestemming van Dave*. Het verschil is wannéér dat woord
valt — bij het uitdelen van het werk, niet nóg eens bij de merge-knop, waar het een stempel was op een
besluit dat al genomen was. Een release en een tag hoorden sowieso niet in die opsomming: een release cut
loopt hier niet via een branch of een PR, dus er viel niets te mergen.

De grens zelf is dus blijven staan waar hij stond. Alles in `src/`, `public/` en `src/data/mixes/` wacht
nog steeds, ook een refactor die visueel niets verandert, want geen poort kan bewijzen dat een pagina er
góéd uitziet. Wat verdween is de rúimte eromheen.

Meebewogen in de machinerie: de vier `git push origin main|HEAD`-regels zijn van de `ask`-lijst in
`.claude/settings.json` gehaald — een `ask` op een vrije handeling is geen bescherming maar een prompt die
je leert wegklikken. De **deny**-lijst blijft onaangeroerd: force-push in alle drie zijn vormen,
`reset --hard`, `rebase` en `gh repo delete`. Vrij pushen is niet vrij herschrijven. De `ask` op het cutten
van een release en op repo-settings blijft ook staan.

Bijgewerkt: `CLAUDE.md` (de grondwet, de skill-tabel en de settings-noot), `CONTRIBUTING.md` (stap 4, 5 en
7), Chris' lens — de enige die elke sessie automatisch meelaadt — de drie repo-eigen skills en het
PR-template. De fold draait voortaan met `-Push` in plaats van `-Commit`.

Eén gevolg dat pas bij het narekenen opviel: `CONTRIBUTING.md` waarschuwde dat een vooruitlopende `main`
meereist in een nieuwe branch, *"wat hier de normale stand is, want de fold-commit blijft bewust lokaal"*.
Die oorzaak is nu weg, dus `main` hoort na elke ronde gelijk te staan. De waarschuwing blijft staan omdat
het mechanisme niet weg is — maar hij beschrijft nu een uitzondering in plaats van de regel, en daarmee is
een `ahead`-regel een signaal geworden in plaats van behang.

### Significance

#### Tier 0

Dit verandert hoe elke keten in deze repo eindigt: openen → mergen → folden → **pushen**, zonder tussenstop.
Een specialist die de oude regel volgt laat een fold-commit liggen en meldt hem als openstaand punt, wat
precies de vertraging is die deze wijziging opheft. Het raakt bovendien de enige lens die automatisch
meelaadt, dus de kans dat de oude reflex blijft hangen was reëel.

**Score:** 4

#### Tier 1

Voor het management verandert er niets zichtbaars aan de site. Wat het waard is: werk dat `djcylow.com`
niet raakt komt sneller op `main` terecht, terwijl de ene poort die er echt toe doet — een mens die naar de
frontend kijkt — onaangeroerd blijft.

**Score:** 1

### Pull Request

[PR #146](https://github.com/DaveKJohn/djcylow-react/pull/146) · merged 2026-08-16

---

## `config/plugin-v4-12-workflow-folder` changelog

### Branch title

De plugin staat op v4.12.0 en de repo verhuist mee naar workflow-davekjohn/

### Branch ID

20260816-140943

### Branch type

config

### What does the change on this branch bring to main?

De specialists-plugin staat op **v4.12.0** in plaats van 4.8.0 — `team-alpha` en `workflow-davekjohn`
allebei, op project-scope. Vier minors ineens, en de repo is eromheen gebogen zodat de gedeelde scripts
weer vinden waar ze naar zoeken.

**De verhuizing naar `workflow-davekjohn/` was geen keuze maar een voorwaarde.** 4.12.0 verplaatst het
branch-dossier naar `workflow-davekjohn/branch/` en `Get-BranchFilePaths` draagt de aantekening *"No
dual-read of the old root 'branch/' location, deliberately"*. Er is dus geen fallback: zonder de
verhuizing vinden `new-branch`, `open-pr` en `fold-changelog` de entry niet meer. Dat was hier al urgent
en niet hypothetisch — `scripts/task/shared.ps1` kiest de hóógste versie in de cache, dus de repo-eigen
skills draaiden sinds vanochtend al 4.12.0-scripts tegen de oude indeling.

Wat er nu in die map woont: `branch/` (de entry, de stappenlijst, de templates en zijn `README.md`),
`releases/README.md`, `releases/audience/` met de 25 handgeschreven documenten, de nieuwe prompt-inbox
voor `/prompt`, en de twee scaffold-docs. `scripts/repo-config.ps1` wijst `Get-ReleaseNoteRoot` en
`Get-ReleaseHistoryPath` erheen, en `Get-MojibakePaths` dekt de map recursief.

**`releases/development/` en `releases/github/` bleven bewust in de repo-root**, en dat is het model van
de bron in plaats van halfheid. De lijn loopt langs één vraag — heeft de root een seam? — en die twee
staan hardcoded in `cut-release.ps1` op regel 728 en 820. `Get-RelativeLinkPath` in `release-lib.ps1`
schrijft het model voluit: *"a consumer's history lives at `workflow-davekjohn/releases/README.md` while
the generated development notes stay at the repo root."* Ze zijn tijdens deze wijziging eerst wél
meegegaan en daarna teruggezet, toen die twee regels werden nagerekend in plaats van aangenomen: een cut
zou ernaast een tweede boom hebben aangemaakt.

`CLAUDE.md`, `CONTRIBUTING.md`, `README.md`, het PR-template en de release-pagina wijzen naar de nieuwe
paden. De waarschuwing in `CLAUDE.md` die zei *"verhuis `branch/` niet zolang de cache hem op `branch/`
leest"* is vervuld en omgezet naar wat er gebeurd is; de vier bestanden die dat lijstje noemde zijn
alle vier in deze beweging meegegaan.

Twee dingen die de scaffold voorstelde zijn **niet** overgenomen. De `workflow-davekjohn/CONTRIBUTING.md`
is verwijderd: de root-pagina ís hier al de lokale helft van `CONTRIBUTING-portable.md`, en een tweede
pagina over hetzelfde onderwerp is precies wat de oude `workflow/`-map de das omdeed — bovendien zoekt
GitHub hem in de root. En de `.gitkeep` in `audience/` is weg, want die map draagt 25 documenten.

**Eén bevinding gaat als `inbound` naar de bron.** De release-pagina die een consumer spiegelt draagt tien
handgeschreven relatieve links (`../CHANGELOG.md` en zusters). De bron houdt die pagina één niveau onder
zijn root; 4.12.0 schrijft een consumer twee niveaus voor. Alle tien wijzen daardoor één map te kort bij
iedereen die de voorgeschreven indeling volgt — en niemand merkt het, want een consumer-poort leest geen
markdown. Hier zijn ze op `../../` gezet en dat is als tweede mechanische spiegel-afwijking vastgelegd;
de reparatie hoort upstream, zodat niet elke consumer dezelfde tien losse links herstelt.

Poort groen (0 fouten, 89 pagina's), 16 suites en 213 tests groen, en `check-script-contract` tegen
4.12.0 op **0 errors**.

### Significance

#### Tier 0

De hele branch-workflow werkte niet meer zonder deze verhuizing, en dat was geen dreiging voor later maar
een toestand die al was ingetreden: `shared.ps1` pakt de hoogste cacheversie, dus `/open-pr`,
`/fold-changelog` en `/park` zochten de entry al op een pad dat niet bestond. Een ontwikkelaar merkt dit
bij de eerstvolgende branch, en de foutmelding wijst niet naar de oorzaak — dat is precies het geval waar
deze repo in augustus al eens een verkeerde diagnose op bouwde.

**Score:** 5

#### Tier 1

Voor het management verandert er niets zichtbaars: de site is niet aangeraakt en de build levert dezelfde
89 pagina's. Wat het waard is, is dat de release- en changelog-machinerie blijft werken — zonder dit zou
de eerstvolgende release-cut vastlopen op een entry die hij niet kan vinden.

**Score:** 1

### Pull Request

[PR #145](https://github.com/DaveKJohn/djcylow-react/pull/145) · merged 2026-08-16

---

## `docs/contributing-twee-lagen` changelog

### Branch title

CONTRIBUTING.md splitst in twee lagen, net als de bron

### Branch ID

20260816-151558

### Branch type

docs

### What does the change on this branch bring to main?

`CONTRIBUTING.md` stond volledig in de repo-root: 29 KB die tegelijk het pad was waar GitHub een
willekeurige bezoeker heen stuurt én de lokale helft van de plugin-cyclus. Die twee onderwerpen zijn
nu uit elkaar getrokken, zoals de bron het op 14 augustus deed (`627f030`).

- **De root-pagina is de standaardwerkwijze** en past op één scherm: nooit direct op `main`, CI
  (`poort`) groen vóór de merge, één wijziging per branch, plus de waarschuwing dat een merge hier
  een deploy is. Die pagina blijft kloppen op de dag dat de plugin er niet is.
- **`workflow-davekjohn/CONTRIBUTING.md` is de pluginlaag** — de bestaande pagina, ongewijzigd
  verhuisd met `git mv` — en die **wint waar de twee elkaar tegenspreken**.

De reden die de afwijking tot nu toe droeg was *"GitHub zoekt hem in de root"*. Dat argument was juist
en pleitte bij nader inzien juist vóór de splitsing: de bron houdt óók een root-pagina, alleen een
dunne die klopt zonder plugin. Deze repo was de enige van de drie zonder de splitsing — life-hub heeft
de pluginlaag wel maar mist juist de root-pagina.

**Bijvangst: zestien dode links, vijftien daarvan van gisteren.** De mapverhuizing naar
`workflow-davekjohn/` (PR #145) heeft verwijzingen achtergelaten die nergens meer op uitkwamen, en
niets meldde dat:

| waar | wat er stuk was |
|---|---|
| `workflow-davekjohn/releases/README.md` | 14 links naar `development/2.x/*.md`, terwijl die boom in de repo-root staat |
| `workflow-davekjohn/branch/README.md` | verwees naar `../CONTRIBUTING.md` — een bestand dat sinds gisteren niet bestond, en dat door deze branch vanzelf weer heel is |
| `CHANGELOG.md` | de intro wees naar `releases/README.md` in plaats van naar de verhuisde pagina |
| `README.md` | de projectboom noemde nog een root-`branch/` die niet meer bestaat |

Er staat nu een link- en anker-checker achter, gedraaid over alle 106 markdown-bestanden in de repo:
geen dood pad, geen dood anker. Die 14 `development/`-links zijn precies de splitsing die
`Get-RelativeLinkPath` in de plugin beschrijft — de bestaande rijen waren er alleen niet in meegegaan.

### Significance

#### Tier 0

Een bijdrager die de repo binnenkomt leest niet langer 29 KB plugin-mechaniek op het pad waar GitHub
hem heen stuurt, en de zestien dode links die de vorige verhuizing achterliet zijn weg. Het meeste
gewicht zit in die tweede helft: dode links in de governance-documentatie kosten pas iets op het
moment dat iemand ze volgt, en dan is het vertrouwen in de rest van de pagina ook weg.

**Score:** 3

#### Tier 1

N/A — dit raakt niets aan `djcylow.com`. De build levert dezelfde pagina's; het is documentatie over
hoe er in deze repo gewerkt wordt.

**Score:** N/A

### Pull Request

[PR #147](https://github.com/DaveKJohn/djcylow-react/pull/147) · merged 2026-08-16

---

