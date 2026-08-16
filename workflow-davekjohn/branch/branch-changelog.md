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

