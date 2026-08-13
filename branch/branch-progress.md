## `config/ci-poort-in-github-actions` progress

### Steps

- [x] Gemeten dat er werkelijk niets stond: `.github/` bevatte alleen `pull_request_template.md`, nul
      workflows — de bewering "nul GitHub Actions" in `CLAUDE.md` klopte
- [x] Het CI-patroon van de bron gelezen (`.github/workflows/ci.yml` daar) in plaats van er zelf een te
      verzinnen: `name: CI`, `permissions: contents: read`, `pull_request` + `push: [main]`, en de
      expliciete les dat de workflow het gedeelde poort-script aanroept in plaats van het over te schrijven
- [x] De runner-keuze afgewogen en bewust van de bron afgeweken: ubuntu in plaats van windows, omdat
      Netlify op Linux bouwt en letterkast-fouten in imports alleen daar zichtbaar worden. Reden staat in
      de workflow zelf, want een afwijking van het bron-patroon hoort uit te leggen waarom
- [x] `lint-web.ps1` doorgenomen op PS 5.1-aannames vóór hij onder `pwsh` zou draaien; één gevonden en
      afgedekt: `PSNativeCommandUseErrorActionPreference` kan een falende `tsc`/build tot terminating
      error maken, waardoor de eigen samenvatting van het script wegvalt. Guard is versie-veilig
- [x] Het aangepaste script lokaal onder Windows PowerShell 5.1 gedraaid — nog steeds groen, dus de
      cross-versie-guard breekt de bestaande route niet
- [x] Vastgesteld dat `npm ci` vóór het script moet: het weigert te starten zonder `node_modules`, en
      `package-lock.json` is aanwezig
- [x] Gemeten dat de Node-versie **nergens** gepind is (geen `.nvmrc`, `.node-version`, `engines` of
      `NODE_VERSION`). Niet zelf opgelost: Netlify leest `.nvmrc`, dus dat toevoegen verandert de live
      build. Als comment in de workflow vastgelegd en aan Dave gemeld
- [x] De vijf plekken bijgewerkt die "er is geen CI" als vaststaand feit aanvoerden: `CLAUDE.md`
      (blockquote bij de PR-regel, de safety-invulling, de `ship-pr`-skillregel, de scripts-lijst),
      Chris' lens, `CONTRIBUTING.md` stap 6 en de `Get-PrMergeMethod`-verantwoording in `repo-config.ps1`
- [x] De PR-grens **niet** verschoven, en dat expliciet als besluit opgeschreven in plaats van als
      omissie: er zijn nog nul testsuites, en zonder branch protection is de run een signaal en geen slot
- [x] `repo-config.ps1` na de edit gecontroleerd op de ASCII-conventie (0 non-ASCII bytes) en
      `check-script-contract.ps1` gedraaid: **0 errors / 5 info** — exact de vijf die het bestand
      verantwoordt
- [x] De i18n-verwijzingen in `CLAUDE.md` rechtgezet nadat de branch vandaag is gesloten en getagd
- [~] Branch protection niet aangezet. Dat is een repo-setting en dus Dave's woord; zonder die stap
      blokkeert een rode CI geen merge. Als openstaande beslissing gemeld in plaats van stil uitgevoerd
- [~] ESLint niet aan de poort toegevoegd. De 37 pre-existing errors staan er nog en zouden elke PR
      blokkeren op werk dat er niets mee te maken heeft; het TODO-blok in `lint-web.ps1` blijft de plek
      waar dat hoort. Sinds vandaag zet één wijziging daar hem wel meteen op beide plekken aan

### Where I left off

De workflow kan pas op GitHub zelf bewijzen dat hij draait — `pwsh` op Linux is lokaal niet te testen
(er staat geen PowerShell 7 op deze machine). De eerste run is dus de PR van deze branch zelf, en dat is
meteen de nette test: faalt hij op een PS-versieverschil in plaats van op de code, dan is dat een
reparatie aan het script en niet aan de site.

Wat hierna nog aan de orde komt en niet in deze branch hoort:

- **Branch protection op `main`** — de stap die van deze CI een echt slot maakt. Repo-setting, dus Dave.
- **Een testsuite.** Dat is de derde pijler die nog ontbreekt, en de enige die kan bewijzen dat het
  *gedrag* gelijk bleef. Zolang die er niet is, blijft de ruime uitzondering voor `src/` verdedigd.
- **`.nvmrc`** — als CI en Netlify aan dezelfde Node-versie moeten hangen. Raakt de live build.
- **De PR-template staat scheef.** `.github/pull_request_template.md` vraagt om een checkbox *"Merge
  goedgekeurd door: @DaveKJohn"*, wat de PR-regel van vanochtend tegenspreekt voor alles wat doorloopt,
  en verwijst naar `<branch-naam>.md in de repo-root` (het entry-model woont sinds 2026-08-11 in
  `branch/`) en naar `messages/en.json` (bestaat niet). Bewust buiten scope gelaten: het is een eigen
  onderwerp met een eigen entry, en deze branch raakt de template niet.
- **`Get-PrDescriptionPlaceholder`** is nog steeds niet gevuld, dus elke PR komt hier zonder beschrijving
  uit `open-pr` en moet met de hand worden bijgewerkt — gebeurde vandaag bij PR #29 opnieuw. Stond al
  gepland op `docs/release-route-naar-script`.
