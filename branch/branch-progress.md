## `docs/gedeelde-docs-spiegelen-de-bron` progress

### Steps

- [x] De spec gelezen: `life-hub` PR [#239](https://github.com/DaveKJohn/life-hub/pull/239), en de
      portable helft van die repo gediffd tegen de bron om het patroon te meten (7 link-instanties, de
      rest verbatim)
- [x] De taalvraag aan Dave gesteld — deze repo had, anders dan `life-hub`, géén besluit dat `releases/`
      Engels is. Antwoord: Engels verbatim
- [x] Portable helft neergezet en bewezen verbatim: 4154 woorden aan beide kanten, nul verschil na
      normalisatie van de vijf absolute link-substituties
- [x] Repo-eigen helft geschreven met `Get-ReleaseAudienceTier = 1` als uitgangspunt — dat is het
      inhoudelijke verschil met `life-hub`, dat op tier 2 staat
- [x] De seam-waarden nagemeten in `scripts/repo-config.ps1` in plaats van ze van de oude pagina over te
      nemen; drie verouderde beweringen daarbij gecorrigeerd
- [x] De twee repo-eigen extra secties (*Git tags & rollback*, *What gets which version number*) mee naar
      het Engels, want ze staan op dezelfde pagina
- [x] Alle 42 relatieve links en alle 6 anchors nagelopen — geen dode
- [x] De inserter-regex en de major-guardrail uit `release-lib.ps1` getest tegen het resultaat: precies
      één tabelkop, één `#### 2.x` erboven, in de juiste orde
- [x] Het taalbesluit vastgelegd in `CLAUDE.md` (taalsectie), plus de aanleiding van de kolomkop-blockquote
      bij stap 9 bijgesteld zodat die niet meer suggereert dat de rest van de pagina Nederlands is
- [x] Poort groen: `lint-web.ps1` — 0 TypeScript-fouten, build geslaagd, 89 statische pagina's
- [x] Inbound [#646](https://github.com/DaveKJohn/claude-code-specialists/issues/646) geopend op Dave's
      verzoek: een `RELEASES-portable.md` in de plugin, zodat de gedeelde helft meereist in plaats van in
      elke consumer met de hand gekopieerd te worden. Het vierde bevinding-punt (de `CHANGELOG.md`-bewering
      over een consumer-bestand) is daar als bewijs in meegegaan
- [~] Geen duplicaat naar [#643](https://github.com/DaveKJohn/claude-code-specialists/issues/643), dat twee
      van de drie bridge-paragrafen al dekt — een tweede melding zou met de reparatie concurreren
- [~] `CLAUDE.md`'s Release Workflow niet herschreven. De weerlegde "cut-release draait niets zelf" staat
      daar ook nog, maar hoort bij `docs/release-route-naar-script` — daar komt hij met de vijftien stappen
      waar hij bij staat. Op deze pagina is hij wél rechtgezet, met de verwijzing erbij
- [~] De 23 bestaande `audience/`-documenten niet herschreven, en de 60 documenten niet vertaald. Beide
      bewust buiten scope (Dave, 2026-08-13); gepubliceerde documenten en release-titels zijn historie
- [x] **`CONTRIBUTING.md`:** de vorm-vraag aan Dave gesteld (verbatim spiegelen zoals `releases/README.md`,
      of de duplicatie eruit en verwijzen). Antwoord: eruit en verwijzen — de portable tekst reist daar al
      met de plugin mee, dus een kopie zou een tweede bron maken
- [x] De gedeelde mechaniek uit de zeven stappen gehaald: het tier-model met zijn score-tabel, de zes
      entry-secties, de vier `open-pr`-poorten, de fold-mechaniek. **126 regels weg, 100 erbij, 333 → 307**
- [x] De zeven koppen intact gehouden — `CLAUDE.md` linkt naar twee ervan, de pagina naar drie van zichzelf
- [x] Vier repo-eigen dingen vastgelegd die nergens stonden: de twee plugin-paden met de versie-les, de
      PR-template-placeholder die `open-pr` niet vindt (PR #26), de kopniveau-valkuil van de fold (PR #27),
      en de ESLint-nuance van de poort
- [x] Zelf-audit op nieuwe duplicatie: de tier-1-uitleg die ik eerst in `CONTRIBUTING.md` schreef stond
      daarmee in **beide** documenten. Vervangen door een verwijzing naar
      `releases/README.md#what-tier-1-means-here` — anders ruimt deze branch duplicatie op één plek op en
      maakt hij die op een andere
- [x] Alle 10 cross-file anchors tussen `CLAUDE.md`, `CONTRIBUTING.md` en `releases/README.md` nagelopen
- [x] **De PR-regel:** eerst de maatstaf rechtgezet. Ik gebruikte `life-hub` als vergelijking; Dave: *"als er
      iets leidend is dan is het de bron"*. Vastgelegd in memory als werkregel
- [x] De bron-regel gemeten: default omgezet op 27 juli 2026, twee uitzonderingen, toets is *voegt Dave's
      blik iets toe dat de poorten niet kunnen?* Deze repo droeg de tekst van daarvóór
- [x] Gezocht naar een besluit dat de afwijking dekte — `CLAUDE.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, de
      handover: **er is er geen.** Het was achterstand, geen keuze
- [x] De tegenspraak vastgesteld: Chris' body zegt "runs on its own, see the repo lens", de lens was een leeg
      `VUL-IN`-scaffold, `CLAUDE.md` zei "nooit". Drie stemmen, strengste won ongewogen
- [x] Gemeten wat de poort hier wél en niet bewijst: **0 testsuites, 0 GitHub Actions, geen branch
      protection, repo publiek.** Dat is de onderbouwing voor de ruimere grens die Dave koos
- [x] De regel overgenomen in de safety-rules, plus de vijf plekken die de oude aannamen: de
      approval-bullet, `open-pr` en `ship-pr` in de skill-lijst, `CONTRIBUTING.md` stap 4/5/6, en de
      `Get-PrMergeMethod`-verantwoording in `repo-config.ps1`
- [x] Chris' lens gevuld — verwijzend naar de safety-rules, niet herformulerend
- [x] `repo-config.ps1` na de edit gecontroleerd: laadt, seams geven de juiste waarden, en
      `check-script-contract.ps1` meldt **0 errors / 5 info** — exact de vijf die het bestand verantwoordt
- [~] `ship-pr` niet in gebruik genomen. De oude reden is onwaar geworden, maar er is geen CI om op te
      wachten en de site-of-niet-beoordeling past niet in een skill die in één run mergt

### Where I left off

Branch is af en de poort staat open. **Deze branch valt onder de nieuwe default** — hij raakt `src/`,
`public/` en `src/data/mixes/` niet, dus de site wordt byte-identiek herbouwd (89 pagina's, ongewijzigd).
Onder de regel die hij zelf invoert loopt hij dus door zonder tussenvraag. Hij is alleen gebouwd tóen die
regel nog niet gold, dus hij is gestopt en gemeld — en dat is ook het nettere: de regel zelf hoort niet door
zijn eigen versoepeling naar binnen te glippen.

Wat hierna nog aan de orde komt, en niet in deze branch hoort:

- **Overweeg CI.** Dat is het ontbrekende net waar de gedeelde default op leunt en dat hier niet bestaat: een
  GitHub Actions-workflow die `tsc --noEmit` + `npm run build` server-side draait, zodat de poort niet meer
  afhangt van of iemand `open-pr` gebruikt. Landt dat, dan is het moment om de grens van "zichtbaar resultaat"
  opnieuw te wegen — nu wacht álles in `src/`, ook een refactor die visueel niets doet, en die ruimte is
  precies met het ontbreken van tests en CI verantwoord.
- **Eén pre-existing conventie-schending gerepareerd, en dat hoort gemeld:** `repo-config.ps1` schrijft
  bovenaan dat het bewust puur ASCII is (PowerShell 5.1 leest een BOM-loos script als ANSI), maar regel 401
  droeg `één` met accenten — al op `main`, niet uit deze branch. Eén woord in een comment; rechtgezet naar
  "een enkel register" omdat het bestand toch open was. Mijn eigen toevoegingen zijn ASCII gecontroleerd.

- **De melding over de tegenstrijdige `cut-release`-frontmatter uit `.claude/handover.md` ligt er nog**, en
  is nog steeds niet verstuurd. Die stond al vóór deze branch klaar. Advies blijft: sturen — onze eigen
  onjuiste bewering kwam er rechtstreeks uit en de bron kan hem in één regel repareren.

- **`config/release-notes-in-het-nederlands` is door dit besluit achterhaald.** Die branch stond gepland om
  `Get-ReleaseNoteWording` en `Get-InternalNoteWording` in het Nederlands te vullen. Nu de map Engels is,
  betekenen lege seams het juiste antwoord en zou die branch de pagina van de bron af bewegen. Wat van het
  punt overblijft is smaller en staat op de pagina: `SectionOpen` is niet cosmetisch, want
  `session-status.ps1` zoekt de open-werk-sectie erop en met Engelse koppen werkt die lookup nu vanzelf.
  Dit is een schrapping van gepland werk, dus het wacht op Dave's woord.
- **`docs/release-route-naar-script`** — de vijf werkpunten uit `.claude/handover.md`, waaronder de
  weerlegde cut-release-bewering in `CLAUDE.md` en het vullen van `Get-PrDescriptionPlaceholder`. **Punt 4
  van die vijf is door deze branch afgehandeld:** het tier-model stond drie keer voluit (portable helft,
  `CONTRIBUTING.md`, `releases/README.md`) en staat nu één keer. `releases/README.md` draagt de gedeelde
  tekst zelf, `CONTRIBUTING.md` verwijst ernaar en noemt alleen het antwoord `= 1`. Wat van punt 4 overblijft
  is de spanning tussen de versienummertabel in `CLAUDE.md` (docs → PATCH) en de gedeelde bump-gate
  (tier 1+ → minor); dat is in `CONTRIBUTING.md` én in `releases/README.md` benoemd maar niet opgelost, want
  het is een keuze over `CLAUDE.md`'s tabel.
- **`.claude/handover.md` is op twee punten achterhaald door deze branch** en hoort bijgewerkt bij de
  volgende stempeling: punt 4 (hierboven) en de opmerking dat de gegenereerde notes Engels zijn "terwijl de
  37 bestaande Nederlands zijn" — dat is nu het gewenste gedrag in plaats van een defect.
