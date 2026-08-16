## `config/plugin-v4-12-workflow-folder` progress

### Steps

#### PLAN

- [x] Gemeten wat er in de cache staat en wat er geïnstalleerd is: 4.12.0 lag er al (via life-hub), deze repo stond op 4.8.0
- [x] De vier minors doorgenomen op wat de consumer raakt — de verhuizing van `branch/`, de nieuwe `adopt-workflow-folder`-skill, de prompt-inbox
- [x] Nagegaan of er een fallback op de oude `branch/`-locatie is: nee, `Get-BranchFilePaths` sluit dat expliciet uit
- [x] Vastgesteld dat de breuk al latent was — `shared.ps1` pakt de hoogste cacheversie
- [x] `check-script-contract.ps1` uit 4.12.0 gedraaid als nulmeting: 1 error (de ontbrekende map), 7 optionele INFO's
- [x] De scope-vraag over `releases/` aan Dave voorgelegd — antwoord: volledig, zoals life-hub

#### CREATE

- [x] `claude plugin update` voor `team-alpha` en `workflow-davekjohn`, project-scope → beide 4.12.0
- [x] Branch aangemaakt met het 4.12.0-`new-branch`-script, zodat de entry meteen op de nieuwe plek landde
- [x] `releases/` en `branch/README.md` met `git mv` verplaatst, de oude `branch/` verwijderd
- [x] `adopt-workflow-folder -Apply` gedraaid — eerst droog, en pas ná de `git mv` zodat de bestaande `releases/README.md` niet door een scaffold werd vervangen
- [~] `development/` en `github/` mee laten verhuizen — teruggedraaid: beide staan hardcoded in `cut-release.ps1` (regel 728 en 820), dus een cut zou ernaast een tweede boom aanmaken. De bron schrijft deze splitsing zelf voor in `Get-RelativeLinkPath`
- [x] De overbodige `.gitkeep` uit `audience/` verwijderd (25 documenten aanwezig)
- [~] De gescaffolde `workflow-davekjohn/CONTRIBUTING.md` behouden — verwijderd in plaats daarvan: de root-pagina is hier al de lokale helft, en GitHub zoekt hem in de root. Vastgelegd in `workflow-davekjohn/README.md`
- [x] `Get-ReleaseNoteRoot`, `Get-ReleaseHistoryPath` en `Get-MojibakePaths` omgezet, met de verantwoording erbij
- [x] `CLAUDE.md`: de vervulde `branch/`-waarschuwing omgezet naar geschiedenis, plus een nieuwe sectie over de mapindeling
- [x] `CONTRIBUTING.md`, `README.md`, `.github/pull_request_template.md` en de release-pagina op de nieuwe paden
- [x] De tien gebroken relatieve links in de verhuisde release-pagina op `../../` gezet en als tweede spiegel-afwijking gedocumenteerd

#### TEST

- [x] `check-script-contract.ps1` tegen 4.12.0: **0 errors**
- [x] De drie seams teruggelezen uit een echte dot-source: beide paden correct, `Get-MojibakePaths` dekt 82 bestanden over beide bomen (41 + 37)
- [x] De PR-template-placeholder gelijkgetrokken met de canonieke string uit `Get-PrDescriptionPlaceholderDefaults`, zodat `open-pr` de body blijft vullen
- [x] `scripts/lint/lint-web.ps1`: 0 fouten, 89 statische pagina's
- [x] `npm test`: 16 suites, 213 tests groen

### Where I left off

Klaar voor de PR. Eén ding blijft over dat níet op deze branch thuishoort: het **`inbound`-issue** over de
tien relatieve links in de release-pagina van de bron. Dat is een reparatie in
`DaveKJohn/claude-code-specialists`, niet hier — hier is hij al omzeild.

