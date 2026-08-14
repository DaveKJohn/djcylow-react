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

## `fix/emaillek-en-dode-imports` changelog

### Branch title

Het e-mailadres lekte langs zijn eigen bescherming

### Branch ID

20260814-214410

### Branch type

fix

### What does the change on this branch bring to main?

**Het e-mailadres stond op zes pagina's gewoon in de statische HTML, terwijl de component die dat
hoort te voorkomen er ongebruikt boven hing.** `ContactForm.tsx` importeerde `EmailDisplay` maar
gebruikte het niet, en zette `info@djcylow.com` drie regels verderop voluit in de zin *"Stuur een
e-mail naar ..."*. Die component bestaat juist om het adres pas in de browser samen te stellen, zodat
scrapers die alleen de HTML lezen het niet vinden. De bescherming was begonnen en nooit afgemaakt.

Dat is nu wel afgemaakt, en het resultaat is gemeten: **6 → 0** gebouwde HTML-bestanden met het adres
erin. De zin blijft staan met een lege `<span>` die de browser vult. De footer deed dit al goed; het
lek zat in het contactformulier, dat op de home, `diensten` en de drie dienstenpagina's staat.

De aanleiding was een ESLint-**warning** over een ongebruikte import — de laagste categorie melding
die er is. De achterliggende fout was een beveiligingsmaatregel die niets deed.

**Verder alle resterende warnings weg; de teller staat nu op 0 errors en 0 warnings.**

- `Navigation.tsx` — `useState`/`useEffect` geïmporteerd maar nergens gebruikt
- `send-email.js` — `catch (e)` zonder `e` te lezen, nu `catch {}` met de reden erbij
- `page.tsx` — de imports van `Referenties` en `GoogleReviews`, die in de JSX **uitgeschakeld**
  staan. De uitgecommentarieerde regels blijven staan: díe dragen de bedoeling, een ongebruikte
  import doet dat niet. Of die twee secties terugkomen is een contentvraag en blijft open
- `Hero.tsx` — de twee `no-img-element`-warnings zijn onderdrukt mét de afweging erbij, niet
  stilgezet. `next/image` levert hier weinig: deze repo draait op `images: { unoptimized: true }`
  (vereist voor de static export), dus er is geen resizing en geen formaatconversie — precies waar de
  regel om vraagt. Wat het wél toevoegt is lazy loading, en dat wil je voor een hero niet

**Bijvangst, gemeten en vastgelegd in de code:** achter die warning zit wél een echt probleem. Beide
hero-afbeeldingen staan in de DOM en worden met `display: none` geschakeld, terwijl een browser een
`<img src>` met `display:none` in de regel gewoon ophaalt. Een mobiele bezoeker downloadt daardoor
`hero_desktop.webp` (**105 KB**) bovenop de `hero_mobile.webp` (**56 KB**) die hij ziet — bijna
tweemaal de nuttige lading, juist op de verbinding waar dat het meest telt. De oplossing is
`<picture>` met een `<source media=...>`, maar die vraagt ook een samenvoeging in `hero.scss` en dus
een blik op het resultaat. Dat staat als aparte klus genoteerd in `Hero.tsx` zelf.

**En de alt-teksten van de hero zijn vervangen.** Er stond `alt="heroDesktop"` en `alt="heroMobile"`
— dat beschrijft het bestand, niet de foto, en wordt door een screenreader als betekenisloze ruis
voorgelezen. Het is een foto van DJ Cylow met koptelefoon achter zijn Pioneer-controller, en dat staat
er nu.

### Significance

#### Tier 0

Een ongebruikte import bleek een beveiligingsmaatregel te zijn die niets deed. Dat is precies waarom
de warning-teller op 0 hoort te staan in plaats van "acht, en die kennen we": in een lijst van acht
bekende meldingen valt niet op welke er één te veel is. De teller staat nu op 0/0, dus de volgende
melding is per definitie nieuw.

**Score:** 4

#### Tier 1

Het e-mailadres van de opdrachtgever stond geïndexeerd en scrape-baar op zes pagina's, terwijl de site
de indruk wekte dat het beschermd was. Dat is nu dicht. Merkbaar wordt het pas op termijn — in wat er
níet binnenkomt — en aan de pagina zelf verandert niets zichtbaars.

**Score:** 3

### Pull Request

[PR #39](https://github.com/DaveKJohn/djcylow-react/pull/39) · merged 2026-08-14

---

## `docs/release-route-volgt-de-bron` changelog

### Branch title

De release-route draait via cut-release, zoals de bron

### Branch ID

20260813-231530

### Branch type

docs

### What does the change on this branch bring to main?

Drie beslissingen van Dave zijn hiermee in de documentatie geland, en samen halen ze de release-route
van deze repo gelijk met de bron. De doorslaggevende: **`cut-release` moet hier draaien.** De repo is
daarom om het script heen gebogen in plaats van andersom.

**De release-branch is afgeschaft.** Uitzondering 2 op "nooit direct op `main`" was een
`docs/release-v<versie>`-branch met een scope-lijstje, gemerged via een kale `git merge --no-ff`. Dat
botste met het script: `cut-release.ps1` doet géén `git checkout main` maar commit op de branch waar je
op staat, dus vanaf een release-branch landde de commit daar terwijl de push naar `main` ging. De bron
heeft die branch niet en noemt dat expliciet *"deliberately no branch/PR — just like the fold"*.
Uitzondering 2 is nu de **release-commit** zelf, met de reden erbij die Dave in de bron gaf: *"aan het
product zelf verandert verder niks"* — een release herpubliceert wat al gemerged is, dus er is geen diff
om te beoordelen. En omdat het script met `git add -A` stageert, kan die uitzondering geen
bestandslijstje dragen zoals de fold; in plaats daarvan is de voorwaarde hard: **schone tree vóór de
cut**.

**De vijftien handmatige stappen zijn wat het script niet doet.** Een tabel bij de kop wijst aan wie wat
doet, en de route eronder is teruggebracht tot zeven punten: op `main` staan met een schone tree, niets
ongefold laten wachten, het script draaien, het audience-concept herschrijven, de aankondiging schrijven,
de GitHub Release maken en de bijlagen uploaden. Wat het script al deed staat eronder als noten, met hun
valkuilen — waaronder dat de development-note de **branchnaam** als kop houdt.

**De versienummertabel is vervangen door de tier-regel.** De tabel hing de bump aan de sóórt wijziging
(docs op patch, nieuwe mix op minor); de poort hangt hem aan de **tier** van de wachtende entries. Die
twee gaven op hetzelfde werk verschillende antwoorden, aantoonbaar bij v2.23.0: als minor gecut omdat
drie entries tier 1 droegen, terwijl de tabel dat docs- en datawerk op patch zette. Nu geldt: alleen
tier 0 is een patch, tier 1 of hoger een minor, en een major vraagt tien minors in de huidige
major-lijn. Deze repo blijft op **audience-tier 1**, dus een minor schrijft de note zonder
*For consumers*-sectie.

**En de stand van de vier pijlers is bijgewerkt in plaats van geschat.** Lint, CI, testsuite en branch
protection staan nu alle vier. Toch blijft site-werk op Dave's woord wachten, en de twee redenen daarvoor
staan er nu expliciet: geen poort kan bewijzen dat een pagina er góéd uitziet, en de ruleset heeft
`bypass_actors` voor Admin en Maintain — wat **moet**, anders blokkeert hij `cut-release`'s eigen push.
Voor een admin is de required check dus adviserend.

Meegenomen: `releases/README.md` zei nog dat de drie documenten hier met de hand worden geschreven en
kondigde deze branch aan als toekomstig werk; dat is bijgewerkt. En daar is één tegenspraak bij
opgeschreven die geen diff kan vinden: de gespiegelde helft van die pagina zegt *"this repo answers 2"*,
verbatim uit de bron waar "this repo" de bron zélf is, terwijl deze repo op tier 1 staat. Een
gespiegelde zin met de woorden "this repo" erin houdt niet op te bestaan bij het kopiëren — hij wordt
onwaar, en beide kopieën blijven byte-identiek.

### Significance

#### Tier 0

De release-route is niet langer een handmatige beschrijving naast een script dat iets anders doet. Wie
een release cut, leest nu wat er werkelijk gebeurt: waar hij moet staan, wat het script overneemt, en
waarom er geen branch meer is. De versieregel is bovendien van proza dat niets tegenhoudt veranderd in
dezelfde regel die de poort al afdwong.

**Score:** 4

#### Tier 1

De versienummers van deze repo gaan vanaf nu meebewegen met wie een wijziging merkt in plaats van met
hoe de wijziging heet, en dat is precies wat een versienummer aan een opdrachtgever hoort te vertellen.
Daarnaast staat nu zwart op wit waarom site-werk op Dave blijft wachten ook nu alle vier de poorten er
staan.

**Score:** 3

### Pull Request

[PR #34](https://github.com/DaveKJohn/djcylow-react/pull/34) · merged 2026-08-13

---

## `config/testsuite-mixdata-en-node-pin` changelog

### Branch title

Testsuite op de mix-data, Node gepind en de CI-poort onontkoombaar

### Branch ID

20260813-225720

### Branch type

config

### What does the change on this branch bring to main?

Deze repo had **nul testsuites** en pinde zijn Node-versie nergens vast. Dat waren twee van de drie
pijlers waar de gedeelde PR-default op leunt. Beide staan er nu.

**36 tests over de mix-data, en ze zijn gemeten in plaats van overgeschreven.** `src/data/mixes/README.md`
beschrijft tientallen veldregels, maar niets hield ze tegen: een fout erin haalt de build (JSON is
geldig, TypeScript tevreden) en wordt daarna op `djcylow.com` zichtbaar. De spec heeft echter een sectie
*"Known Inconsistencies in Legacy Data"*, dus die regels hard afdwingen levert een suite die op dag één
rood staat — en een suite die altijd rood staat bewaakt niets. Daarom is de data eerst gemeten:

- **23 regels haalt de data nu al volledig** en staan als harde assertie: `tracks` gelijk aan
  `tracklist.length`, unieke `id`/`title`/`id_spotify`/`title_spotify`/`description_nl`, `color` met
  hoofdletter en passend bij de bestandsnaam, ISO-`date` die met `jaar`/`maand`/`dag` en `id`
  overeenkomt, `genre` als familie van `subgenre`, 176 bpm voor Drum & Bass, titels onder 60 tekens,
  oplopende tracklist-tijden, en het bestaan van elk `image_wide_*`-bestand.
- **7 regels haalt de data niet** en staan als **ratchet**: het gemeten aantal is het plafond. Een
  nieuwe overtreding faalt, en een opgelóste overtreding faalt óók — met de melding dat het plafond
  omlaag moet. Zo blijft de achterstand zichtbaar in plaats van stil weer op te lopen. Die werking is
  in beide richtingen bewezen voordat de suite werd vastgelegd.

**En dat meten legde meteen een zichtbaar defect op de live site bloot.** 25 live mixen verwijzen naar
een `image_square` die niet bestaat, en dat veld wordt gerenderd door `BasiskleurenCarousel`,
`Erlenmeyers` en `VsKleurenCarousel` — dus de Music Mood Colours-pagina laadt daar 404's. Het is geen
extensie-mismatch: de `square/`-mappen bestaan grotendeels niet (`public/images/full/blue/` heeft alleen
`wide/`). Repareren vraagt echte afbeeldingen en is Dave's beslissing, dus de suite legt het exact vast
in plaats van het op te lossen. Tweede vondst van dezelfde soort: 25 live mixen staan op de legacy
R2-bucket, terwijl de veldspec beweert dat dat alleen `full-blue.json` betreft.

**De Node-versie staat vast in `.nvmrc`.** CI had `'22'` hardgecodeerd terwijl Netlify zijn eigen default
draaide, en niets meldde het als die twee uit elkaar liepen. Netlify **leest** `.nvmrc`, dus dit is nu de
enige plek waar de versie wordt verklaard; `ci.yml` haalt hem daar op via `node-version-file`.

**De poorten draaien de suite ook echt.** `Get-TestCommands` in `scripts/repo-config.ps1` geeft
`npx vitest run` terug — de seam die plugin 4.8.0 hiervoor toevoegde. Zonder die waarde meldde `open-pr`
eerlijk *"scripts\tests not found — test gate skipped"* en draaide er niets, terwijl de poort zegt "all
test suites green". In CI staat de suite als gewone `npm test`-stap: de gedeelde gate woont in
`native-capture-lib.ps1` van de bron, en dat bestand heeft een consumer niet in zijn repo.

### Significance

#### Tier 0

De derde pijler onder de PR-default bestaat nu. Waar de poort alleen bewees dat de code **bouwt**,
bewaakt de suite of het **gedrag** gelijk bleef — op precies de data waar de regels tot nu toe alleen in
proza stonden. En de eerste run leverde al twee defecten op die niemand kon zien.

**Score:** 4

#### Tier 1

De Node-versie van de live build kan niet meer stil divergeren van CI, en er ligt nu een exacte lijst van
25 mixen met een gebroken afbeelding op de Music Mood Colours-pagina — een zichtbaar defect dat
maandenlang onopgemerkt bleef omdat geen enkele poort ernaar keek.

**Score:** 3

### Pull Request

[PR #33](https://github.com/DaveKJohn/djcylow-react/pull/33) · merged 2026-08-13

---

## `docs/release-route-naar-script` changelog

### Branch title

Release Workflow gelijk aan wat cut-release werkelijk doet

### Branch ID

20260813-224225

### Branch type

docs

### What does the change on this branch bring to main?

`CLAUDE.md` beschreef de release-route zoals die ooit bedoeld was, niet zoals de gedeelde
`cut-release`-skill hem werkelijk uitvoert. Vijf plekken zijn rechtgezet, allemaal in dat ene bestand.

**De gevaarlijkste eerst: `cut-release` draait wél iets.** Er stond *"Het print commandoblokken in
vaste volgorde; het draait niets zelf."* Het script doet `git add -A`, `git commit`, `git tag -a` en
**twee pushes, waaronder `git push origin main`**. Alleen `gh release create` wordt geprint. Wie de
oude regel las, dacht dat proberen gratis was, terwijl het script precies de handeling doet die de
safety-rules aan Dave voorbehouden. Het blok heet in de bron `# --- Commit + tag directly on main ---`.

**Daaruit volgen twee botsingen met de grondwet, en die staan nu bij de safety-rules zelf.** Het script
doet geen `git checkout main` maar commit op de branch waar je op staat, terwijl stap 2 van de Release
Workflow je opdraagt eerst een release-branch te maken. En `git add -A` kent geen scope, terwijl beide
toegestane directe commits op `main` juist *"scope beperkt tot"* een lijstje bestanden zijn. Er staat nu
expliciet dat dit een derde weg zou zijn die niet is toegestaan zolang Dave hem niet heeft gewogen —
ook niet "even met `-NoPush`", want dat houdt alleen de push tegen en niet de ongescopete commit.

**De vijftien stappen zeggen nu wie wat doet.** Een tabel bij de kop wijst per stap aan wat het script
overneemt (3, 4, 5, 8, 9, 10, 12 en een concept voor 6) en wat handwerk blijft (7, 13, 14, 15). Dat is
gemeten aan het script, niet geschat: v2.23.0 is met de hand gelopen en dat blijft voorlopig zo.

**De taaltegenspraak is beslecht op Engels** (Dave, 2026-08-13). Stap 6 droeg op het audience-document
in het Nederlands te schrijven; de taalsectie zei dat `Get-ReleaseNoteWording` bewust leeg staat omdat
leeg Engels betekent. Beide stonden in hetzelfde bestand. Het meetbare gevolg: `session-status.ps1`
leest de "nog open"-sectie via `SectionOpen`, valt terug op het Engelse
`What was still open at this release`, en meldde bij `/continue` dat de note van v2.23.0 die sectie
niet had — terwijl hij er gevuld en wel in stond. Stap 6 is meebewogen en noemt nu de Engelse koppen
letterlijk; de seam blijft leeg. `v2.23.0` is de laatste Nederlandse note en wordt niet herschreven.

**En de versienummertabel spreekt de bump-poort tegen.** De tabel kijkt naar de soort wijziging en zet
docs- en workflow-werk op patch; de poort kijkt naar de tier van de wachtende entries en maakt tier 1
een minor. v2.23.0 is als minor gecut met precies zulk werk erin. Dat is nu opgeschreven met de
constatering dat in de praktijk de poort wint — die weigert, de tabel is proza. Welke van de twee
leidend wordt, is als beslissing bij Dave neergelegd en er is niets geschrapt.

Meegenomen: de vier skills die de plugin levert maar `CLAUDE.md` niet noemde — `adopt-config`,
`fix-mojibake`, `lock` en `continue` — staan nu in de skill-lijst.

### Significance

#### Tier 0

Een specialist die de oude regel las, kon `cut-release` draaien in de overtuiging dat het niets deed,
en daarmee ongevraagd naar `origin/main` pushen met een ongescopete commit. Dat gat is dicht, en de
route zegt nu per stap wie hem loopt in plaats van een handmatige volgorde te suggereren die het script
al grotendeels overlapt.

**Score:** 4

#### Tier 1

Drie beslissingen die alleen Dave kan nemen staan nu expliciet opgeschreven in plaats van verstopt te
zitten in een tegenspraak: de twee botsingen van `cut-release` met de grondwet, en welke van de
versienummertabel of de bump-poort leidend is. De taalkeuze die hij vanavond maakte is meteen
doorgevoerd, waardoor `/continue` voortaan kan rapporteren wat een release openliet.

**Score:** 3

### Pull Request

[PR #32](https://github.com/DaveKJohn/djcylow-react/pull/32) · merged 2026-08-13

---

## `config/pr-route-gelijk-aan-de-regel` changelog

### Branch title

PR-template gelijk aan de PR-regel

### Branch ID

20260813-212126

### Branch type

config

### What does the change on this branch bring to main?

`.github/pull_request_template.md` sprak op vijf punten de repo tegen die het beschrijft. Alle vijf zijn
rechtgezet in dat ene bestand; `scripts/repo-config.ps1` blijft ongemoeid.

**De placeholder wordt nu herkend.** De eerste regel was `<!-- Korte beschrijving van de wijziging en
waarom -->`, vier woorden en een punt naast een regel die `open-pr` verbatim herkent. Een near-miss is de
ene fout die op succes lijkt: het script laat de regel staan, vult geen beschrijving in en meldt niets.
Dat trof PR #26, #29 en #30 — elke keer met de hand rechtgezet via `gh pr edit`. De regel is nu de
canonieke placeholder die `Get-PrTemplateCanonicalPlaceholder` aanwijst, zodat de beschrijving uit
`branch/branch-changelog.md` er vanzelf in komt. Engels, want het is een machine-gelezen sleutel die
`open-pr` meteen vervangt — dezelfde categorie als de zes sectiekopjes van een entry.

**Het goedkeuringsvinkje draagt de tweedeling in plaats van die tegen te spreken.** `- [ ] Merge
goedgekeurd door: @DaveKJohn` vroeg op élke PR om een goedkeuring die de PR-regel sinds 2026-08-13 alleen
nog voor site-werk verlangt. Daarvoor staan nu twee keuzes: raakt de PR `src/`, `public/` of
`src/data/mixes/`, dan wacht hij op Dave; raakt hij dat niet, dan loopt hij door tot en met de fold. De
opener maakt daarmee per PR zichtbaar onder welke helft van de regel de branch valt, wat geen poort kan
vaststellen.

**Twee dode verwijzingen zijn weg.** Het template vroeg om bijgewerkte strings in `messages/en.json` +
`messages/nl.json` — een map die niet bestaat en niet meer komt, nu `feature/i18n-setup` is gesloten. En
het changelog-vakje wees naar `<branch-naam>.md` in de repo-root, het entry-model van vóór de migratie van
2026-08-11; de twee bestanden wonen in `branch/`.

**En de prefix-lijst is weer compleet.** `scripts/lib/branch-info.ps1` kent negen prefixen, het template
noemde er zeven: `chore/` ontbrak, en `docs`/`config` stonden in een andere volgorde dan de tabel. Wie een
opruimbranch opende, vond zijn type niet in de lijst die de repo zelf hanteert.

Onderweg gemeten en het opschrijven waard: het oude goedkeuringsvinkje werd **nooit** afgevinkt.
`open-pr.ps1` vinkt op de default `^- \[ \] (Aangevraagd door Dave|Requested by Dave)`, en
`Merge goedgekeurd door:` matchte daar niet op. Het stond dus op elke PR leeg — een vakje dat altijd
hetzelfde zegt, draagt geen informatie. Het changelog-vakje wordt wél afgevinkt, op de prefix
`- [ ] Changelog entry-bestand aangemaakt`; die formulering is daarom bewust behouden en alleen het pad
erachter is gecorrigeerd.

### Significance

#### Tier 0

De beschrijving van elke volgende PR komt er vanzelf in te staan, in plaats van drie keer op vier met de
hand te worden nagelopen. Het template stopt bovendien met het tegenspreken van de grondwet die het
samenvat, en dat was in het klein dezelfde constructie die PR #29 in het groot opruimde.

**Score:** 4

#### Tier 1

Dave wordt niet langer op elke PR om een goedkeuring gevraagd die de regel alleen nog voor site-werk
verlangt, en ziet in plaats daarvan per PR staan of deze op hem wacht of doorloopt.

**Score:** 3

### Pull Request

[PR #31](https://github.com/DaveKJohn/djcylow-react/pull/31) · merged 2026-08-13

---

## `config/eslint-in-de-poort` changelog

### Branch title

ESLint wordt een echte poort in plaats van een handmatige telling

### Branch ID

20260814-212924

### Branch type

config

### What does the change on this branch bring to main?

`scripts/lint/lint-web.ps1` draait ESLint als tweede van drie stappen, tussen `tsc --noEmit` en
`npm run build`. Errors blokkeren de poort; warnings niet, maar hun aantal wordt wel gemeld.

Hiermee eindigt een constructie die deze repo lang heeft gedragen: ESLint stond buiten de poort omdat
er 37 pre-existing errors waren, met in `CLAUDE.md` de instructie om *"het **aantal** te vergelijken,
niet de exitcode"*. Dat maakte dit de enige poort die een mens met het blote oog moest aflezen, en
niets controleerde of dat ook gebeurde. Vandaag zijn die 37 in drie branches naar 0 gebracht (#35,
#36, #37), en daarmee verviel de reden. De telling is nu een check.

**Dat hij ook echt blokkeert is getoetst, niet aangenomen.** Er is tijdelijk een bestand met één
`any` neergezet; de poort gaf exit 1 met de fout erbij, waarna het bestand weer weg is. Een poort die
alleen groen is waargenomen bewijst niet dat hij rood kán worden — en dat is nu net de eigenschap
waarvoor hij bestaat.

**In CI hoefde niets aangesloten te worden**, en dat is de opbrengst van een eerdere keuze.
[`ci.yml`](.github/workflows/ci.yml) roept `lint-web.ps1` aan in plaats van de checks over te
schrijven, dus ESLint draait server-side gewoon mee. Alleen de **naam** van de stap moest mee, want
die somt de checks op. Was de workflow een kopie geweest, dan had deze branch twee plekken moeten
raken en zou de tweede vroeg of laat achterlopen.

De warnings blijven staan: 8 stuks, waarvan 2× `next/no-img-element` in `Hero`. Die laatste vragen
een afweging over `next/image` bij `unoptimized: true`, en dat is een ontwerpbeslissing van Dave — een
poort hoort daar geen positie in te kiezen. Ze worden geteld en gemeld, zodat het aantal niet
ongemerkt terugloopt naar een nieuwe achterstand.

### Significance

#### Tier 0

Sluit de laatste poort die op een menselijke afspraak leunde in plaats van op een check, en maakt
daarmee de reeks van vandaag af: van 37 errors met een leesinstructie naar 0 errors met een gate die
aantoonbaar weigert. Voor wie hierna een `.ts` of `.tsx` aanraakt is het verschil concreet — een
nieuwe lint-error komt niet meer ongemerkt langs de PR, niet lokaal en niet in CI.

**Score:** 4

#### Tier 1

N/A — dit raakt uitsluitend het gereedschap. Er verandert geen regel aan de site en de build levert
dezelfde 89 pagina's.

**Score:** N/A

### Pull Request

[PR #38](https://github.com/DaveKJohn/djcylow-react/pull/38) · merged 2026-08-14

---

## `fix/react-hooks-en-types` changelog

### Branch title

De laatste dertien lint-errors: hooks, types en JSX-entities

### Branch ID

20260814-205946

### Branch type

fix

### What does the change on this branch bring to main?

De laatste dertien ESLint-errors zijn opgelost. Daarmee staat de teller op **0**, van de 37 waarmee
2026-08-14 begon, en vervalt de instructie uit `CLAUDE.md` om deze poort *"op aantal en niet op
exitcode"* te vergelijken — de enige poort in deze repo die een mens met het blote oog moest aflezen.

**Vier hook-fouten, drie verschillende oorzaken.** De regel `react-hooks/set-state-in-effect` is geen
stijlvoorkeur: elk van deze vier bouwde iets in state na dat er al was, en betaalde dat met een extra
renderronde.

- **`AudioPlayer`** — het effect dat een andere speler pauzeert zette daarna zélf `isPlaying` op
  false, terwijl het `<audio>`-element al een `pause`-event vuurt dat door de `onPause`-handler wordt
  opgevangen. Twee bronnen voor dezelfde waarheid; de fix is een *verwijdering*. De conditie is
  meteen vereenvoudigd, want `pause()` op een stilstaande speler is een no-op.
- **`MobileContent`** — de viewport en "draait dit al in de browser?" zijn externe bronnen, geen
  state van de component. Ze lezen nu via `useSyncExternalStore`, precies waarvoor die hook bestaat,
  met `false` als serversnapshot. Het sluiten van de drawer bij navigatie én bij het schalen naar
  desktop gebeurt nu tijdens de render in plaats van in een effect — dat sluit de drawer vóór de
  browser schildert, zonder de zichtbare tussenstap die een effect ná de paint oplevert.
- **`EmailDisplay`** — hier wás de setState-in-effect de bescherming: het adres wordt pas in de
  browser samengesteld zodat scrapers van de statische HTML het niet zien. Die bescherming is intact
  en aantoonbaar: de span is in de gebouwde HTML nog steeds leeg. Het verschil is dat "leeg" nu de
  serversnapshot is in plaats van een beginstate die een effect moet overschrijven.

**Vijf `any`'s, waarvan er één zwaarder woog dan de rest.** Op de mix-detailpagina stond
`const allMixes: Mix[] = [...] as any` — die cast zette de typecontrole op de **hele mix-dataset**
uit, inclusief de annotatie ernaast. Hij kon zonder één andere wijziging weg: de JSON voldoet gewoon
aan `Mix`. Vanaf nu wordt dat ook echt gecontroleerd, dus een hernoemd veld in de data valt voortaan
door de mand bij `tsc`. De twee `any[]`-tracklists kregen een eigen `Track`-type, en in `ContactForm`
verdween de cast op de dynamische reCAPTCHA-import plus `catch (error: any)` — die laatste vroeg
`.message` zonder te weten of er een `Error` was, precies in de tak die een fout netjes hoort af te
handelen.

**Vier JSX-entities** zijn `&quot;` geworden. Dat rendert letterlijk hetzelfde teken; er is bewust
geen typografisch aanhalingsteken van gemaakt, want dat is een ontwerpkeuze en geen opruimwerk.

**De uitgeleverde HTML is ongewijzigd, en dat is gemeten in plaats van beloofd.** De site is met en
zonder deze branch gebouwd en alle **86** pagina's zijn vergeleken. Na normalisatie van de drie
build-artefacten die per build verschillen — chunk-bestandsnamen, de build-id en de favicon-hash —
zijn er **0** verschillen. Wat deze meting niet dekt is het runtime-gedrag: de audioplayer, de
drawer en de hydration van het e-mailadres draaien pas in de browser. Daarvoor is de deploy preview
het bewijsmiddel, en dat is precies waarom deze branch op Dave's woord wacht.

### Significance

#### Tier 0

Sluit een achterstand die drie documenten en twee scripts van een instructie voorzag die niemand
betrouwbaar kon volgen. Belangrijker dan het getal: de `as any` op de mixdata zette de typecontrole
op de complete dataset uit, en de vier hook-fouten zaten in de audioplayer en de mobiele navigatie —
de twee dingen die elke bezoeker aanraakt. De poort kan hierna dicht, wat de telling definitief
vervangt door een check.

**Score:** 4

#### Tier 1

N/A — de opdrachtgever ziet geen verschil. De gebouwde HTML is aantoonbaar identiek op alle 86
pagina's; wat verandert is het aantal renderrondes en de typeveiligheid eronder.

**Score:** N/A

### Pull Request

[PR #37](https://github.com/DaveKJohn/djcylow-react/pull/37) · merged 2026-08-14

---

## `config/overbodige-ts-ignores` changelog

### Branch title

Zestien overbodige ts-ignores verdwijnen boven de stylesheet-imports

### Branch ID

20260814-204723

### Branch type

config

### What does the change on this branch bring to main?

Zestien `// @ts-ignore`-regels verdwijnen uit `src/`, elk boven een stylesheet-import. Ze waren
overbodig: `tsc` accepteert die imports gewoon, want `next-env.d.ts` levert de declaratie al via
`/// <reference types="next" />`. Wat er stond was dus een onderdrukking van een fout die er niet is —
en een `@ts-ignore` is niet ongevaarlijk, want hij dempt élke fout op de regel eronder, ook een echte
die er later bij komt.

Twee van de zestien stonden niet in de ESLint-telling: in `Playlist.tsx` en `Filter.tsx` lag er een
`// eslint-disable-next-line @typescript-eslint/ban-ts-comment` overheen. Daar was de melding ooit
gesmoord in plaats van de oorzaak weggenomen; die twee disable-regels gaan mee weg.

Daarmee gaat het aantal pre-existing ESLint-errors van **27 naar 13** en is `ban-ts-comment` volledig
verdwenen. De vier tekstplekken die het getal noemen zijn opnieuw meegegaan.

**Het plan was een ander, en het verschil is de moeite van het opschrijven waard.** Het voorstel waar
deze branch uit voortkwam stelde een eigen `src/types/scss.d.ts` voor met `declare module '*.scss'`.
Bij het meten — één `@ts-ignore` weghalen en `tsc` draaien — bleek dat bestand niet nodig, en ook nooit
nodig geweest. Was het plan zonder die meting uitgevoerd, dan stond er nu een declaratiebestand in de
repo dat niets doet en dat een latere lezer als noodzakelijk zou lezen. De remedie van een plan is een
aparte aanname dan de diagnose, en faalt onafhankelijk daarvan.

De branch heette daarom eerst `config/scss-typedeclaratie` en is vóór de push hernoemd: een naam die
een bestand belooft dat er niet komt, misleidt precies de lezer die later terugzoekt waaróm iets zo
is opgelost.

Aan de site verandert niets: geen regel gedragscode is aangeraakt, alleen commentaarregels. De diff is
achttien verwijderde regels in `src/` en nul toegevoegde. De build levert dezelfde 89 pagina's.

### Significance

#### Tier 0

Haalt zestien blinde vlekken weg. Elke `@ts-ignore` die er stond dempte niet alleen de fout die er
niet was, maar zou ook een echte typefout op die importregel hebben verzwegen — en juist een
verkeerd gespeld stylesheet-pad is de klasse fout die deze repo op Linux breekt en op Windows niet.
Daarnaast is dit de tweede van vier stappen naar een ESLint-poort die zichzelf bewaakt in plaats van
door een mens geteld te worden; na deze stap is meer dan tweederde van de achterstand weg.

**Score:** 3

#### Tier 1

N/A — de opdrachtgever merkt hier niets van. De site levert exact dezelfde 89 pagina's; er zijn
uitsluitend commentaarregels verwijderd.

**Score:** N/A

### Pull Request

[PR #36](https://github.com/DaveKJohn/djcylow-react/pull/36) · merged 2026-08-14

---

## `config/eslint-node-overrides` changelog

### Branch title

ESLint stopt met Node-scripts als browsercode te lezen

### Branch ID

20260814-203611

### Branch type

config

### What does the change on this branch bring to main?

`eslint.config.mjs` krijgt een override voor `scripts/**/*.js` en `netlify/functions/**/*.js`: daar
staat `@typescript-eslint/no-require-imports` uit. Die drie bestanden — `add-mix.js`,
`convert-to-webp.js` en de Netlify-function `send-email.js` — draaien op Node en niet in de browser,
en gaan niet door de Next-bundler heen. CommonJS is er het juiste module-systeem, dus de tien errors
die ESLint er meldde waren geen fouten in die bestanden maar een ontbrekende override in de config:
een Next-*browser*-config las Node-scripts alsof het frontend was.

Daarmee gaat het aantal pre-existing ESLint-errors van **37 naar 27**, en dat getal is hier geen
detail maar een instructie. `CLAUDE.md` schrijft over deze poort letterlijk *"vergelijk het aantal,
niet de exitcode"* — de enige poort in deze repo die een mens met het blote oog moet aflezen. Alle
vier de plekken die het oude getal noemden zijn meegegaan: `CLAUDE.md` (2×), `CONTRIBUTING.md`,
`scripts/repo-config.ps1` en de header plus het TODO-blok van `scripts/lint/lint-web.ps1`. De
vindplaatsen in `releases/` blijven staan: dat is historie, en een record herschrijf je niet.

Wat het bovendien oplevert is een afgebakende route naar een dichte poort. De 27 die resteren zijn
gemeten en het is allemaal code in plaats van config: 14× een `@ts-ignore` boven een SCSS-import (één
module-declaratie maakt ze alle veertien overbodig), 4× `react-hooks/set-state-in-effect` in de
audioplayer en de mobiele navigatie, 5× `no-explicit-any` en 4× `no-unescaped-entities`. Die twee
vervolgstappen raken `src/` en wachten dus op Dave's woord; deze niet.

### Significance

#### Tier 0

Haalt de ruis weg die deze poort onbetrouwbaar maakt: wie nu `npm run lint` draait, ziet geen tien
meldingen meer over bestanden waarin niets mis is. Dat maakt de handmatige telling waar `CLAUDE.md`
op leunt aantoonbaar makkelijker vol te houden — en het is de eerste van vier stappen naar een poort
die zichzelf bewaakt in plaats van door een mens geteld te worden.

**Score:** 3

#### Tier 1

N/A — de opdrachtgever merkt hier niets van. De site levert exact dezelfde 89 pagina's: er is geen
regel gedragscode aangeraakt, alleen een lint-override en de documentatie die het getal noemt.

**Score:** N/A

### Pull Request

[PR #35](https://github.com/DaveKJohn/djcylow-react/pull/35) · merged 2026-08-14

---

