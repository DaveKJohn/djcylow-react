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

