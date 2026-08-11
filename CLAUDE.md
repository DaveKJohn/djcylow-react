# CLAUDE.md — DJ Cylow Website

Dit bestand is de operating guide voor deze repo, die wordt bestuurd door de **Claude Specialists** —
een team gespecialiseerde Claudes onder één Chief of Staff. Het is opgebouwd zoals elke
specialist-manual: **de draagbare werkwijze staat hieronder** (het systeem en de grondwet, geldig in
elke repo die met de Claude Specialists werkt), en **alles wat specifiek is voor déze repo staat
onderaan** onder [`## Eigen aan deze repo (djcylow-react)`](#eigen-aan-deze-repo-djcylow-react) — het
concrete team, de projectstructuur, de taal en de manier waarop de grondwet hier is ingevuld.

Er is bewust **één CLAUDE-bestand**, gelijk aan `life-hub` en `davekjohns-workshop`. De oude
`workflow/`-map met een tweede werkwijze-document bestaat niet meer: twee documenten liepen
onvermijdelijk uit elkaar.

---

## De Claude Specialists — wie doet wat

We werken niet met één generieke Claude, maar met de **Claude Specialists**: een groep
gespecialiseerde Claudes. Elke taak, vraag of opdracht wordt kritisch bekeken en aan het juiste
adres bezorgd. Eén huisregel bovenop alles: **elke opdracht begint en eindigt bij Chris.** Hij is de
Chief of Staff — hij neemt de opdracht aan, classificeert die, wijst hem toe aan de juiste
specialist (of een keten van meerdere), licht toe wie het oppakt en waarom, bewaakt de workflow, en
sluit af met wat er is gebeurd en wat de volgende stap is.

De Claude Specialists **staan niet boven de safety-rules hieronder — ze werken eronder.** Chris
routeert; elke specialist voert uit volgens de gedeelde safety-rules en zijn eigen vakregels. De
branch-discipline en de release-discipline blijven onverkort gelden voor iedereen.

**Wie het team is, staat niet hier.** Het roster, de routing, de laadstrategie en het luie-specialist-
principe wonen in [`.claude/specialists/SPECIALISTS.md`](.claude/specialists/SPECIALISTS.md) — het ene
bestand dat `CLAUDE.md` onderaan importeert. Dat is bewust: alles wat specialist-vormig is staat in één
map, zodat de-adoptie neerkomt op "verwijder één map en één regel". Dit bestand houdt de **werkwijze**;
dat bestand houdt het **team**.

---

## Safety rules

**Grondwet — lees dit eerst.** Deze regels gelden breed gedeeld en staan boven elk gemak. De
djcylow-specifieke invulling (concrete paden, scripts en de lint-poort) staat in
[`### Safety-invulling van djcylow-react`](#safety-invulling-van-djcylow-react).

### Nooit zonder expliciete toestemming van Dave

- Een Pull Request **openen** — nooit uit jezelf. Werk de branch af, push hem, meld dat hij klaar
  is, en wacht. Zegt Dave "open de PR", dan geldt dat als goedkeuring voor de hele beweging:
  openen → mergen → de changelog-entry folden. **Vraag er ook niet naar** ("zal ik de PR openen?") —
  rapporteer de stand en stop daar.
- **Mergen** van een Pull Request — valt onder diezelfde goedkeuring; los daarvan nooit. **Let op: een
  merge is een deploy** (zie hieronder), dus dit is de handeling die de site verandert.
- **Pushen naar `origin/main`** — dit initiatief ligt altijd bij Dave. **Vraag hier nooit naar, ook
  niet impliciet** ("zeg het maar als je wil pushen") — rapporteer feitelijk de git-status en stop
  daar. In de praktijk gaat het alleen nog om de fold-commit; al het overige bereikt `origin/main`
  via de PR-merge.
- Een **release cutten** — start alleen op expliciet verzoek ("commit en push live", "maak een nieuwe
  release en push live" of gelijkwaardig).
- `git push --force` (welke branch dan ook), `git reset --hard`, `git rebase` op een gedeelde branch.
- **Bestanden verwijderen uit `public/images/`** — afbeeldingen worden via pad gerefereerd in de
  mix-JSON, dus een verwijdering breekt stil een pagina.
- **`next.config.ts` aanpassen** (static-export-config — een fout hier breekt de Netlify-build) en
  **`netlify.toml` aanpassen**.

### Nooit direct op `main` — via branch + PR

Alle wijzigingen gaan via een branch + Pull Request.

> **Een PR mergen is een deploy.** `gh pr merge` schrijft server-side rechtstreeks in `origin/main`,
> en Netlify bouwt en publiceert bij elke push naar `main`. Er is **geen staging**. Op het moment dat
> een PR gemerged wordt staat de wijziging dus binnen enkele minuten op `djcylow.com` — er komt geen
> aparte publicatiestap meer aan te pas.
>
> Zégt Dave "open de PR", dan is dat daarmee ook het akkoord om het live te zetten. Behandel het zo:
> draai de poort (`scripts/lint/lint-web.ps1`, inclusief de build) en wees zeker van je zaak vóór de
> merge, niet erna.
>
> Dit stond hier tot 2026-07-26 andersom beschreven — "een merge naar `main` zet niets live", met de
> live-push als aparte stap in de Release Workflow. Dat was onjuist en gaf een vals gevoel van
> veiligheid op precies het verkeerde moment. `CHANGELOG.md` verzamelt daarom wat **live is maar nog
> geen versienummer heeft**; sinds 2026-08-11 zonder sectiekop — elke `##`-kop erin is één wijziging.
> Een release is een label op wat al draait.

Er zijn twee bewuste uitzonderingen op "nooit direct committen":

1. De **fold-commit** (na een merge, stap 7) is de enige echte **directe commit op `main`** (geen
   branch): scope beperkt tot `CHANGELOG.md` + de twee vaste bestanden in `branch/`.
2. De **release-branch** (`docs/release-v<versie>`) is wél een branch, met scope beperkt tot
   `CHANGELOG.md`, `releases/development/<X.Y>/<X.Y.Z>.md`, `releases/highlights/<X.Y>/<X.Y.Z>.md`
   (alleen Minor/Major) en `releases/README.md` — maar wordt bewust gemerged via een kale
   `git merge --no-ff`, niet via een Pull Request. Dit wacht wél altijd op expliciete goedkeuring
   van Dave.

Dit zijn de **enige** twee. Ook een "onschuldige" opruim- of chore-commit gaat via een branch + PR.

---

## Algemene werkwijze

- **Geleerde lessen worden geborgd in de docs, niet alleen in het geheugen.** Leert een specialist
  een belangrijke les of ontdekt hij iets dat voor de volgende keer onthouden moet worden, dan wordt
  dat direct vastgelegd in dit bestand of de relevante manual — een geheugen-notitie alleen is te
  vrijblijvend. In deze repo is dat Tessa's werk.
- Wees binnen een branch proactief met het aanmaken van nieuwe mappen/bestanden zodra een nieuw
  onderwerp opduikt. Vraag niet eerst om toestemming voor de bestandsstructuur zelf; wél voor de
  inhoud als iets gevoelig of onzeker is.
- Bij twijfel over prioriteit: vraag naar deadlines/urgentie in plaats van te gokken.
- **Approval-vragen zijn zeldzaam, niet de norm.** Onderbreek Dave alleen bij écht uitzonderlijke
  acties: onomkeerbaar, naar buiten gericht, of met reëel risico. Al het routinewerk — git, bash,
  config, branches, commits, tooling/scripts, en het doorzetten van een oplevering naar de volgende
  schakel in een al vastgelegde keten — wordt gewoon uitgevoerd en gemeld, niet eerst gevraagd. Bij
  twijfel kiest een specialist een verstandige default, voert die uit, en meldt het pas. De
  PR-regel hierboven is de bewuste, met naam genoemde uitzondering hierop.

### Ontwikkelworkflow — stap voor stap

#### 1. Check de branch — voor je ook maar één bestand aanraakt

**Voor je code schrijft, een bestand aanmaakt, of iets wijzigt:** run `git status` en `git branch`.
Dit is niet-onderhandelbaar — zelfs een script of configbestand wordt niet geschreven vóór deze
stap.

- **Op `main`** → maak eerst de juiste branch aan, dan pas wijzigingen.
- **Op een feature branch** → ga door op die branch.

#### 2. Classificeer de wijziging en noem de branch

| Type werk | Branch naam |
|---|---|
| Nieuwe feature of pagina | `feature/[korte-omschrijving]` |
| Bugfix | `fix/[korte-omschrijving]` |
| Mix data (JSON) | `data/[kleur-of-omschrijving]` |
| Tekst/content updates | `content/[korte-omschrijving]` |
| Styling/CSS | `style/[korte-omschrijving]` |
| Docs/README | `docs/[korte-omschrijving]` |
| Config-wijzigingen, scripts, workflow-tooling | `config/[korte-omschrijving]` |

**Voorbeelden:** `data/light-red-descriptions`, `feature/mix-bpm-filter`, `fix/audio-player-volume`

**Nooit "final" in een branchnaam.** Als een tweede poging nodig is, gebruik dan `-v2`, `-v3` etc.

De canonieke bron van deze taxonomie is de tabel hierboven — `scripts/lib/branch-info.ps1` spiegelt
hem. Leid hem **niet** af uit de git-historie; die mist prefixen die wel bestaan.

#### 3. Ontwikkel op de branch, houd de twee branch-bestanden bij

Maak wijzigingen op de branch en commit met een duidelijke boodschap. De gedeelde
**`new-branch`**-skill zet de branch én zijn twee bestanden in `branch/` in één stap neer — een
branch is nooit entry-loos:

- `branch/branch-changelog.md` — wát de wijziging doet; niets eromheen, zodat het in één keer in
  `CHANGELOG.md` past
- `branch/branch-progress.md` — de stappenlijst en waar je gebleven bent

**Vaste namen, niet één per branch** — git houdt ze al per branch uit elkaar, en de repo-root loopt
niet meer vol. Op `main` staan ze in een lege reset-staat. Ernaast staan referentiekopieën met de
veldtoelichting in `branch/templates/`; die zijn gegenereerd — bewerk je er één, dan zet de volgende
run hem terug.

`branch/branch-changelog.md` heeft **zes vaste secties**:

```text
## `<branch>` changelog

### Branch title      <- de titel; óók de PR-titel
### Branch ID         <- tijdstempel, gezet bij aanmaken
### Branch type       <- de branch-prefix (kleine letter, bv. `docs`)
### What does the change on this branch bring to main?
### Significance
### Pull Request      <- vult de fold in, na de merge
```

Drie ervan staan er al bij het aanmaken. `Branch title` schrijf je **zonder** `feat:`/`docs:`-prefix
— die zet `open-pr` er zelf voor (stap 4).

**De datum staat niet meer in de kop.** Tot 2026-08-11 stond de datum in de entry-titel en was dat de
geboortedatum van de branch in plaats van de landingsdatum. De fold schrijft hem nu uit de
merge-timestamp van de PR, als slotregel `[PR #NN](url) · merged YYYY-MM-DD` onderaan de entry —
en dus onder `### Pull Request`, de laatste sectie.

**De kop van de entry noemt de branch, niet de wijziging.** De fold laat hem staan zoals hij is
geschreven; in `CHANGELOG.md` staat er straks dus ``## `docs/mijn-branch` changelog``. De leesbare
naam van de wijziging woont in `### Branch title`, en dát is de zin die je overneemt als je er ergens
anders naar verwijst — een release-note bijvoorbeeld (Release Workflow, stap 5).

**`CHANGELOG.md` blijft met rust op de branch — nooit direct bewerken.** Elke branch bewerkte
vroeger hetzelfde blok, wat bij lang-openstaande branches tot merge-conflicten leidde. De vaste
branch-bestanden lossen dat op: er is niets om over te conflicteren.

**Nooit mergen zonder een gevuld `branch/branch-changelog.md`.** Dit geldt ook voor kleine of puur
documentatiewijzigingen.

##### Significance — het verplichte tier-model

Onder `### Significance` staan drie sub-secties, `#### Tier 0`, `#### Tier 1` en `#### Tier 2`, elk
met een `**Score:**`-regel. **Alle drie worden beantwoord:**

- **Tier 0** — alleen de eigen ontwikkelaars van deze repo merken het
- **Tier 1** — een collega die aan dit project werkt heeft er iets aan
- **Tier 2** — een bezoeker van djcylow.com merkt het

De score is 1 t/m 5 tegen deze schaal, of `N/A` met één regel waarom het die groep niet bereikt:

| Score | Betekenis |
|---|---|
| `5` | de lezer moet iets dóén — breaking change, verplichte migratie, of een lang bestaande blokkade die weg is |
| `4` | verandert wezenlijk hoe ze werken; ze merken het binnen een dag zonder dat iemand het zegt |
| `3` | een duidelijke verbetering, merkbaar zodra ze dat deel aanraken |
| `2` | klein; merkbaar als iemand erop wijst |
| `1` | cosmetisch, of het voorkomt een storing die nog niet is opgetreden — noem dan die storing, want dat is het enige waar een latere lezer iets aan heeft |

Harde regels:

- **Tier 0 mag nooit `N/A`** — elke wijziging raakt de mensen die deze repo onderhouden.
- **De reden staat bóven de `**Score:**`-regel.** Alles eronder wordt weggegooid door de parser.
- **De ladder is cumulatief**: `N/A` op tier 1 onder een gescoorde tier 2 wordt bij naam geweigerd.
- **De score wordt bewust leeg gescaffold** — een gegokt cijfer is erger dan geen cijfer.
- **Leid het tier niet af uit de branch-prefix.** Een `docs/`-branch kan tier 2 zijn en een
  `feature/`-branch tier 0.

De tier bepaalt in welk release-document de entry belandt en, samen met de score, wáár in
`CHANGELOG.md` hij landt — de fold plaatst gerangschikt, niet simpelweg bovenaan.

##### De stappenlijst is een poort, geen versiering

`branch/branch-progress.md` moet leeg zijn van openstaande punten voordat er een PR mag komen. Elk
punt wordt `- [x]` gedaan óf `- [~]` laten vervallen, met de reden op de regel. Dat derde teken
bestaat zodat niemand een vakje hoeft af te vinken voor werk dat niet is gedaan. **Er is geen
`-Force`** op deze poort.

#### 4. Push de branch — de PR pas op verzoek

Zodra de branch klaar is (commits + een gevuld `branch/branch-changelog.md` en een leeg
`branch/branch-progress.md`): push hem en meld dat hij klaar staat. **Open de PR niet uit jezelf.**

Zegt Dave "open de PR", gebruik dan de gedeelde **`open-pr`**-skill. Die draait vier poorten vóór er
iets gepusht wordt:

1. **resolves-gate** — noemt de branch een openstaand issue, dan moet `-Resolves` of `-NoResolves`
   mee, zodat een gerepareerd issue niet open blijft na de merge
2. **scaffold-gate** — de entry mag geen scaffold-tekst meer dragen, en geen lege secties. Deze heeft
   wél een `-Force`
3. **impact-gate** — draait op dezelfde lezing: een onmogelijk tier of een onmogelijke score wordt
   geweigerd, een **ontbrekende** score wordt alleen gemeld (die weigering valt bij de release-cut)
4. **step-list-gate** — geen enkel `- [ ]` mag nog openstaan in `branch/branch-progress.md`. Geen
   `-Force`

Daarna pas de repo's eigen lint-poort uit `Get-LintScript` (`scripts/lint/lint-web.ps1`) en alle
testsuites. Faalt er iets, dan wordt er niets gepusht en komt er geen PR.

Is alles groen, dan opent de skill de PR met `.github/pull_request_template.md` als body — loop de
checklist na en vink af wat van toepassing is. **De titel komt uit de entry**: geef `open-pr` géén
titel mee — hij stelt hem zelf samen als `<branch-type>: <Branch title uit
branch/branch-changelog.md>` (`feature:`, `fix:`, `data:`, `content:`, `style:`, `docs:`, `config:`).
Zo staat de zin één keer geschreven en kunnen de PR, `CHANGELOG.md` en de release-documenten niet uit
elkaar lopen. Een meegegeven `-Title` wordt nog geaccepteerd maar genegeerd, met een waarschuwing die
de titel noemt die de entry wél geeft.

**Gebruik nooit `gh pr create --fill`** in deze repo: `--fill` vult de body met de volledige
commit-geschiedenis sinds `main` (ontdekt bij PR #1/#2 — tientallen irrelevante historische commits
in plaats van de template). Gebruik `--body`/`--body-file` met de template-inhoud.

Draai je het handmatig, geef dan altijd **`--repo DaveKJohn/djcylow-react`** mee: deze repo heeft
zowel een `origin`- als een `upstream`-remote die naar dezelfde GitHub-URL wijzen, wat de
automatische branch-detectie van `gh` in de war stuurt ("you must first push the current branch to a
remote").

#### 5. Vertel Dave wat er is gedaan — stop daar

Rapporteer wat er veranderd is en deel de PR-link. Vraag niet naar mergen, releasen of pushen naar
`main`.

#### 6. Na goedkeuring: merge de Pull Request

Wissel eerst naar `main` — `gh pr merge` kan de huidige branch niet lokaal verwijderen als je er nog
op staat, dus `--delete-branch` ruimt dan alleen de remote op en laat een lokale rest achter:

```bash
git checkout main
gh pr merge [branch] --merge --delete-branch --subject "merge: [branch] (#<PR-nummer>)"
git pull --ff-only
```

`--merge` maakt een merge-commit (geen squash/rebase — behoudt de losse commits). `--subject` geeft
de merge-commit de `merge:`-prefix, consistent met de rest van de geschiedenis; zonder deze override
gebruikt GitHub het generieke "Merge pull request #N from ...". Controleer daarna of de lokale branch
écht weg is en ruim 'm zo nodig alsnog op: `git branch -d [branch]`.

#### 7. Na de merge: vouw de changelog entry

Vouw `branch/branch-changelog.md` in `CHANGELOG.md` via de gedeelde **`fold-changelog`**-skill. Die
plaatst de entry gerangschikt op tier en score — niet simpelweg bovenaan — sluit hem af met de regel
`[PR #NN](url) · merged YYYY-MM-DD`, en laat de kop verder ongemoeid. Dit gebeurt zonder aparte
toestemming — het hoort bij het afronden van de zojuist goedgekeurde merge, net als de
branch-opruiming in stap 6.

`branch/branch-changelog.md` en `branch/branch-progress.md` worden daarbij niet verwijderd maar
**gereset** naar hun lege staat — het zijn vaste paden die de volgende branch nodig heeft. Een oud
entry-bestand in de repo-root (uit het model van vóór 2026-08-11) wordt, als het wordt aangetroffen,
wel nog verwijderd.

Draai de skill met `-Commit`: die commit dan zelf, met bericht `fold: [branch] changelog (#NN)`, en
de scope wordt door git afgedwongen tot precies `CHANGELOG.md` plus de twee `branch/`-bestanden.

> Tot 2026-08-11 stond hier `chore: fold changelog entry [branch]` als handmatig `git add`/`git
> commit`-blok. **`fold:` is sindsdien de erkende prefix voor deze ene commit** — de reden: `merge:`
> en `fold:` zijn één beweging in twee commits en horen als paar te lezen; `chore:` zei alleen
> "huishouding". Changelog-bookkeeping blijft daarnaast wél `chore:` voor ander boekhoudwerk — dit is
> een met naam genoemde uitzondering, geen algemene regel-wijziging.

**Pushen van deze fold-commit naar `origin` gebeurt niet automatisch** — dat blijft, net als elke
push naar `origin/main`, initiatief van Dave. De skill kent een `-Push`-vlag; die gebruiken we hier
niet.

---

## Eigen aan deze repo (djcylow-react)

> *Alles hierboven is de draagbare werkwijze van een repo die door de Claude Specialists wordt
> bestuurd. Dit deel is de djcylow-lens: kopieer je dit systeem naar een andere repo, dan is dít het
> stuk dat je vervangt.*

Dit is de **live website van DJ Cylow** (`djcylow.com`), een Next.js-app met static export die via
Netlify wordt gedeployed. Er is **geen staging-omgeving**: een kapotte build betekent dat de live
site plat ligt.

Extra gatekeeper die volgt uit dat live-karakter: **alles wat de publieke site of de SEO raakt**
(titels, `description`-velden, metadata, routes) **is een beslissing van Dave, niet van een
specialist.**

### Taal

De website is **Engels** (`lang="en"`, domein `djcylow.com`). De repo-documentatie, commit-berichten
en de communicatie met Dave zijn **Nederlands**. De `description`-velden in de mix-data zijn
tweetalig: `description_nl` en `description_en`.

**Uitzondering: de zes sectiekopjes van een changelog-entry** (`Branch title`, `Branch ID`,
`Branch type`, `What does the change on this branch bring to main?`, `Significance`,
`Pull Request`) **en de `Tier`/`Score`-sleutels blijven Engels.** Het zijn machine-gelezen sleutels
waar `new-branch`, `open-pr`, `fold-changelog` en de release-cut het over eens moeten zijn — vertaal
je ze, dan kan de eigen fold de eigen entry niet meer lezen. `scripts/repo-config.ps1` definieert
bewust géén `Get-EntrySectionHeadingOverrides`, en dát is de beslissing die dit vastlegt.

### Het team: roster & routing

**Het roster staat in [`.claude/specialists/SPECIALISTS.md`](.claude/specialists/SPECIALISTS.md)** —
wie de negentien specialisten zijn, wat elk van hen in déze repo doet, en naar welke lens onder
`.claude/specialists/lenses/` Chris hen doorverwijst. Dat is de plek die de plugin verwacht en het
enige bestand dat `CLAUDE.md` importeert.

Loopt dat roster uit de pas met de plugin, dan zet de gedeelde `sync-roster`-skill de ontbrekende
lenzen neer. `check-script-contract.ps1` bewaakt daarnaast dat `scripts/repo-config.ps1` en
`scripts/lib/branch-info.ps1` het contract van de gedeelde scripts blijven leveren.

### Structuur en conventies

#### Key commands

```bash
npm run dev      # dev server → http://localhost:3000
npm run build    # static export → .next/
npm run lint     # ESLint + TypeScript check
```

#### Hulpscripts

| Commando | Script | Wat het doet |
|---|---|---|
| `npm run mix:add` | `scripts/add-mix.js` | Voeg interactief een nieuwe mix toe aan het juiste JSON bestand |
| `npm run images:webp` | `scripts/convert-to-webp.js` | Converteer alle `.jpg` in `public/images/` naar `.webp` en verwijder de originelen |
| `npm run images:webp:dry` | `scripts/convert-to-webp.js --dry-run` | Preview: laat zien welke bestanden geconverteerd zouden worden |

**Workflow nieuwe mix toevoegen:**

1. `npm run mix:add` — vul alle gegevens in, het script genereert de afgeleide velden automatisch
2. Afbeeldingen neerzetten in `public/images/{power}/{color}/`
3. `npm run images:webp` — als je `.jpg`-afbeeldingen hebt aangeleverd
4. Controleer het JSON-bestand in de editor
5. Commit + push via de ontwikkelworkflow hierboven

#### Critical constraints

- **Static export**: `output: 'export'` in `next.config.ts` — geen server-side rendering, geen
  Next.js API-routes. Het contactformulier loopt via Netlify Functions.
- **Images unoptimized**: `images: { unoptimized: true }` — vereist voor static export. Niet
  verwijderen.
- **Tweetaligheid (EN/NL) staat nog niet live.** `main` heeft geen `messages/`-map en geen
  `[locale]`-route; de site levert de strings nu inline. De volledige next-intl-implementatie staat
  op de geparkeerde branch `feature/i18n-setup` (17 commits: routing naar `src/app/[locale]/`,
  string-extractie, hreflang/og:locale, LanguageSwitcher). Schrijf geen code die aanneemt dat
  `useTranslations()` of `messages/en.json` bestaat. Zodra die branch landt, wordt dit: alle
  user-facing strings horen in `messages/en.json` en `messages/nl.json`, nooit hardcoded.
- **Geen inline CSS**: gebruik geen `style={{}}` in JSX. Alle CSS hoort in SCSS onder `src/styles/`.
  Uitzondering: echt dynamische runtime-waarden (`backgroundImage: url(${src})`,
  progressbar-percentages).
- **Tailwind v4 + SCSS**: beide worden naast elkaar gebruikt. SCSS in `src/styles/`, Tailwind als
  utility-classes in de componenten.

#### Waar content leeft

| Wat | Waar |
|---|---|
| UI-strings (buttons, labels, errors) | Inline in de componenten — `messages/*.json` bestaat alleen op de geparkeerde `feature/i18n-setup` |
| Mix-metadata & tracklists | `src/data/mixes/[power]-[color].json` |
| Home-pagina tekst | `src/content/home.ts` |
| Diensten-tekst | `src/content/diensten.ts` |
| Music Mood Colours tekst | `src/content/musicmoodcolours.ts` |
| Referenties | `src/content/referenties.ts` |
| Breakpoints | `src/constants/design.ts` |
| Live, maar nog zonder versienummer | `CHANGELOG.md` (elke `##`-kop is één wijziging) |

#### Audio storage

Actieve Cloudflare R2-bucket: `https://pub-4fa4c2c1f9a644c4878cba29a7926443.r2.dev/`

#### Mix JSON-regels (`src/data/mixes/`)

De volledige schema-spec staat in [`src/data/mixes/README.md`](src/data/mixes/README.md). Snelle
regels:

- `color`: met hoofdletter (`"Red"`, niet `"red"`)
- `date`: ISO-formaat `"YYYY-MM-DD"` (niet leeg)
- `description_nl` / `description_en`: uniek per mix, 120–160 tekens, geen dashes (`-` of `—`), geen
  artiestnamen (die horen in `top_artists`)
- `tracklist`-tijden: `"HH:MM:SS"` met voorloopnullen
- `tracks` moet gelijk blijven aan `tracklist.length`
- Nieuwe mixen bovenaan de array

Bij het schrijven van JSON-databestanden:

- Controleer dat het resultaat geldige JSON is (parseable, geen trailing comma's)
- Houd de array gesorteerd **nieuwste eerst** (hoogste `id`-datum bovenaan)
- Wijzig nooit entries met `"ignore": true` (preview-entries)
- Overschrijf nooit een niet-lege `description` tenzij daar om gevraagd wordt

Voor het committen: run `npm run lint` en controleer dat afbeeldingspaden uit de JSON daadwerkelijk
bestaan in `public/images/`.

### Release Workflow

Alleen op expliciet verzoek ("commit en push live", "maak een nieuwe release en push live").

1. **Check de status**: `git status && git branch`
2. **Maak een branch**: `git checkout -b docs/release-v<versie>`
3. **Run de poort én de build**:
   - `powershell -NoProfile -File scripts\lint\lint-web.ps1` — de poort (typecheck + build), moet
     groen zijn. De build zit er sinds 2026-07-26 in, dus dit dekt de bouwbaarheid al
   - `npm run lint` — ESLint meldt op dit moment 37 **pre-existing** errors; die zijn acceptabel
     zolang je geen `.ts`/`.tsx` hebt aangeraakt. Wat niet acceptabel is: een fout erbij. Vergelijk
     dus het aantal, niet alleen de exitcode
4. **Bepaal het versienummer** (tabel hieronder, en `releases/README.md`)
5. **Maak de development-release note**: `releases/development/<major.minor>/<versie>.md` — gebruik
   de gefolde wijzigingen in `CHANGELOG.md`; elke `##`-kop is er één. **Neem die kop niet letterlijk
   over**: hij noemt de branch (``## `docs/mijn-branch` changelog``), niet de wijziging. De titel van
   de release-note-entry bouw je uit `### Branch title` en `### Branch type`; de slotregel
   `[PR #NN](...) · merged YYYY-MM-DD` neem je wél ongewijzigd mee
6. **Maak de highlights-versie** (alleen Minor/Major):
   `releases/highlights/<major.minor>/<versie>.md` — dezelfde wijzigingen in leesbaar Nederlands
   zonder jargon en zonder ontwikkel-metadata (geen PR-nummers, merge-datums of branch-types),
   bedoeld voor stakeholders in plaats van developers
7. **Update `CHANGELOG.md`**: haal de gefolde entries eruit (ze staan nu in de release-note), zodat
   alleen de intro-alinea overblijft. **Er komt géén versieblok voor terug.**
   > Tot 2026-08-11 zette deze stap hier ook een `## Releases`-blok in `CHANGELOG.md` — dezelfde
   > informatie als `releases/README.md`, maar armer, met een `← LIVE`-markering die op 2026-07-26 al
   > was afgeschaft en die bovendien maandenlang fout stond (op v2.20.1, terwijl v2.20.2, v2.21.0 en
   > vijf PR's al live waren). Dat verviel: `releases/README.md` (stap 8) is sindsdien de enige plek
   > waar uitgebrachte versies worden bijgehouden — geen dubbele boekhouding meer
8. **Voeg de versie toe** aan de overzichtstabel in `releases/README.md` (bovenaan) — de enige
   boekhouding van uitgebrachte versies
9. **Stage en commit** op de release-branch
10. **Merge naar `main`** (na bevestiging) — bewust een kale merge, geen PR:
    ```bash
    git checkout main
    git merge [branch] --no-ff -m "merge: [branch] — v<versie>"
    ```
11. **Tag en push**:
    ```bash
    git tag -a v<versie> -m "v<versie> - <korte titel>"
    git push origin main
    git push origin v<versie>
    ```
    Deze push zet **niets nieuws live** — de code stond er al via de PR-merges. Hij brengt de
    release-documentatie en de tag naar `origin`, en triggert daarmee wel een nieuwe Netlify-build
    van dezelfde code. Was er sinds de laatste merge niets aan de app gewijzigd, dan is het resultaat
    identiek aan wat er al draaide
12. **GitHub Release aanmaken** (de development-versie is altijd de body):
    ```bash
    gh release create v<versie> --title "v<versie> - <korte titel>" \
      --notes-file releases/development/<major.minor>/<versie>.md --verify-tag
    ```
13. **Highlights als bijlage uploaden** (alleen Minor/Major):
    `gh release upload v<versie> releases/highlights/<major.minor>/<versie>.md`
14. **Verwijder de release-branch**: `git branch -d [branch]` en
    `git push origin --delete [branch]`

Let op de volgorde van oorzaak en gevolg: de wijzigingen stonden al live vóór dit hele proces begon,
namelijk vanaf hun PR-merge. Een release cutten voegt een versienummer, een release-note en een tag
toe aan wat al draait. Precies daarom is een release-cut ook laagrisico: er gaat geen ongeteste code
mee naar buiten.

#### Versienummer bepalen

| Type wijziging | Versie |
|---|---|
| Bugfix, hotfix, kleine correctie | PATCH |
| Docs, workflow, `CLAUDE.md`, changelog-wijzigingen | PATCH |
| Kleine stijl-/CSS-correctie | PATCH |
| Nieuwe beschrijvingen, content-updates | MINOR |
| Nieuwe mix, nieuwe pagina, nieuw component | MINOR |
| Grote stijl-/CSS-herziening (een hele sectie herontworpen) | MINOR |
| Volledig redesign of framework-migratie | MAJOR |

### Scripts

De workflow-stappen draaien via de **gedeelde skills van de specialists-plugin**, die één bron hebben
in [`DaveKJohn/claude-code-specialists`](https://github.com/DaveKJohn/claude-code-specialists). Wat per
repo verschilt woont in `scripts/repo-config.ps1` en `scripts/lib/branch-info.ps1`.

- **`new-branch`** — maakt de branch én **twee** bestanden in `branch/` (`branch-changelog.md`,
  `branch-progress.md`) plus de referentiekopieën in `branch/templates/`, in één stap (stap 1–3). Het
  achterliggende werk zit in `scripts/task/new-branch.ps1` en `scripts/lib/entry-scaffold-lib.ps1` —
  er bestaat geen los `scripts/release/new-changelog-entry.ps1` (meer).
- **`open-pr`** — draait de vier entry-poorten (resolves/scaffold/impact/step-list), de lint-poort en
  de testsuites, en opent daarna de PR (stap 4). Alleen op verzoek van Dave.
- **`fold-changelog`** — vouwt `branch/branch-changelog.md` gerangschikt op tier/score in
  `CHANGELOG.md`, verrijkt met de PR-link en de merge-datum, en reset de twee `branch/`-bestanden
  (stap 7).
- **`cut-release`** — loopt de sluitende stappen van een release na: de tag, de push, de GitHub
  Release en het opruimen van de branch. Het print commandoblokken in vaste volgorde; het draait niets
  zelf. Alleen op expliciet verzoek van Dave, zoals de hele Release Workflow.
- **`park`** — commit het openstaande werk op de huidige branch en pusht die met `git push -u` naar
  `origin`, zodat je hem elders precies zo oppakt. Opent géén PR en zet niets live.
- **`ship-pr`** — opent de PR, wacht op CI, mergt en vouwt de changelog in één run. **Gebruiken we in
  deze repo bewust niet**: hij zou in één beweging mergen, en een merge is hier een deploy die apart
  op Dave's woord wacht (zie de safety-rules hierboven). Deze regel staat hier zodat een latere
  sessie die de skill in de plugin ziet staan kan lezen waarom er hier niet aan begonnen wordt.
- **`sync-roster`** — zet ontbrekende repo-lenzen neer als het roster achterloopt op de plugin.
- **`specialists-init`** / **`specialists-teardown`** — adoptie en de-adoptie van het systeem in deze
  repo. Zie `QUICKSTART.md` en `UNINSTALL.md` in de bron-repo.

Repo-eigen scripts:

- **`scripts/lint/lint-web.ps1`** — de lint-poort die `open-pr` draait: `tsc --noEmit` over
  `tsconfig.lint.json`. ESLint zit er bewust nog niet in; de reden staat in de header van het script.
- **`check-script-contract.ps1`** — bewaakt dat `repo-config.ps1` en `branch-info.ps1` de functies
  leveren die de gedeelde scripts verwachten. Woont in de plugin (`scripts/sync/` daar), niet in deze
  repo, en draait bij het starten van een sessie via de `script-contract-sessioncheck`-hook.
- `scripts/add-mix.js` (`npm run mix:add`) en `scripts/convert-to-webp.js` (`npm run images:webp`).

De Release Workflow hierboven kent geen repo-eigen script; de sluitende stappen lopen sinds de
herinstallatie op 2026-08-03 via de gedeelde **`cut-release`**-skill. Het bepalen van het versienummer,
de release-notes en de changelog-verhuizing blijven handwerk van Rendall 🎬.

### Safety-invulling van djcylow-react

De grondwet hierboven, hier concreet ingevuld:

- **`origin/main` ís de live site.** Netlify bouwt en publiceert bij elke push naar `main`, en
  `gh pr merge` schrijft daar server-side rechtstreeks in. Een PR mergen is dus deployen; er is
  **geen staging** en geen aparte publicatiestap. Een release cutten voegt daar een versienummer en
  een tag aan toe, maar zet niets nieuws live — dat was al gebeurd bij de merges.
- **De poort vóór elke PR is de laatste wacht vóór een live deploy.** `open-pr` draait
  `scripts/lint/lint-web.ps1` (via `Get-LintScript`): `tsc --noEmit` én `npm run build`, beide moeten
  groen zijn. De build zit er sinds 2026-07-26 in, precies omdat een typecheck een kapotte build niet
  vangt en er niets tussen de merge en de site zit. ESLint blijft bewust buiten de poort omdat er 37
  pre-existing errors staan; die vergelijk je op aantal. `-SkipBuild` bestaat om lokaal te itereren
  en hoort niet in de poort zelf.
- **`public/images/` is beschermd.** Afbeeldingen worden via pad gerefereerd in de mix-JSON;
  verwijderen breekt stil een pagina en gebeurt nooit zonder Dave's woord.
- **`next.config.ts` en `netlify.toml` zijn beschermd.** Een fout daar breekt de Netlify-build en
  dus de live site.
- **Alles wat de publieke site of de SEO raakt is Dave's beslissing** — titels,
  `description`-velden, metadata en routes. Een specialist stelt voor, Dave beslist.
- **Twee uitzonderingen op "nooit direct op `main`"**: de fold-commit en de release-branch, zoals
  hierboven beschreven. Dit zijn de enige twee.
- **Kernverbeteringen gaan via de inbound-route.** Ontdek je een verbetering aan de *gedeelde* kern
  van het specialisten-systeem (agent-defs, manuals, persona's, skills uit de plugin), dan wordt die
  niet hier gebouwd: die gaat als issue met label `inbound` naar
  [`DaveKJohn/claude-code-specialists`](https://github.com/DaveKJohn/claude-code-specialists). Check
  daarbij eerst welke kant achterloopt — soms zit de fout niet in de bron maar in deze repo.

### Het hóé (draagbaar) vs. het wát (repo-eigen)

Kortom: het **hóé** (er is een team specialisten onder een Chief of Staff, alles via branch + PR,
geleerde lessen in de docs, de grondwet boven elk gemak) is draagbaar en staat bovenin. Het **wát**
(dit roster, de Next.js-structuur, de mix-data-conventies, de Release Workflow, het feit dat een
merge hier direct deployt, de scripts en de poort) is van deze repo en staat in dit slot.

De orchestrator (Chris) wordt altijd meegeladen; hij verwijst on-demand door naar de specialisten in
[`.claude/specialists/lenses/`](.claude/specialists/lenses/). Die ene import hieronder laadt het
roster, Chris' draagbare body uit de plugin en zijn repo-lens.

@.claude/specialists/SPECIALISTS.md
