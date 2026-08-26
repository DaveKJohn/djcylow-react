## `docs/changelog-naar-workflow-map` progress

### Steps

#### PLAN
- [x] Uitzoeken waarom de fold van PR #149 handmatig moest: `Assert-WorkflowIsolatedSeamPath` in de
      v4.20.0-cache weigert een `Get-ChangelogPath`-antwoord buiten de workflow-map, ook impliciet via
      de computed default
- [x] Met Dave afgestemd: CHANGELOG.md verhuist mee naar `workflow-davekjohn/`, in plaats van
      voorlopig handmatig blijven folden of een inbound-issue op de bron

#### CREATE
- [x] `git mv CHANGELOG.md workflow-davekjohn/CHANGELOG.md`
- [x] Interne links in het verhuisde bestand zelf bijgewerkt (naar `CLAUDE.md` en naar `releases/README.md`)
- [x] `scripts/repo-config.ps1`: `CHANGELOG.md` uit `Get-ReservedRootMd` gehaald, commentaar bij
      `Get-MojibakePaths` bijgewerkt
- [x] Alle daadwerkelijke markdown-links naar `CHANGELOG.md` in de repo doorgelopen en op de juiste
      diepte gezet (`CONTRIBUTING.md`, `workflow-davekjohn/CONTRIBUTING.md`,
      `workflow-davekjohn/releases/README.md` -- boven én onder de mirror-streep)
- [x] Prozalijsten die CHANGELOG.md los van `workflow-davekjohn/` opsomden bijgewerkt (`CLAUDE.md`,
      `.claude/skills/open-pr/SKILL.md`, `.claude/specialists/lenses/01-01-extension.md`)
- [x] Rij + toelichting toegevoegd aan de `workflow-davekjohn/`-inhoudstabel in `CLAUDE.md`

#### TEST
- [x] `check-links.ps1` -- geen dode links of ankers
- [x] `check-script-contract.ps1` uit de 4.20.0-cache -- 0 errors
- [x] `lint-web.ps1` (tsc, ESLint, build, link-check) -- groen
- [x] `npm test` -- 213/213
- [x] Een dry run van de fold-mechaniek geverifieerd: `Get-WorkflowFolderName` + de computed
      `Get-ChangelogPath`-default wijzen nu naar `workflow-davekjohn/CHANGELOG.md`, en dat bestand
      bestaat daar

### Where I left off
Klaar. Vanaf de volgende merge zou `fold-changelog-entry.ps1` (via de repo-eigen `fold-changelog`-skill)
weer automatisch moeten werken -- dat is pas met zekerheid te zeggen bij de eerstvolgende echte fold,
niet bewijsbaar zonder een tweede branch en merge alleen daarvoor.
