## Development cycle: `config/adopt-development-cycle-model-v1` · 20260827-090518

> **How this file is read.** A step is `- [ ]` until it is resolved -- `- [x]` done, or
> `- [~]` dropped with the reason, which exists so nobody ticks a box for work they did not do.
> open-pr and ship-pr both refuse while one is still open, and there is no `-Force`.
>
> **FOUR `###` HEADINGS, AND NEVER A FIFTH** -- PLAN, CREATE, TEST, DEPLOY are the whole top
> level. A section needing its own heading goes in as a `####` UNDER whichever of the four owns
> it. No gate sees a heading, so this one is on you (Dave, August 26, 2026).
>
> **AND NOTHING BRANCH-SPECIFIC ABOVE `### PLAN`** -- everything between the title and that heading
> is this guidance, which is identical in every branch document. A status line, a note about
> THIS branch or an instruction to a session belongs under one of the four, normally as a `####`
> in PLAN. Same rule, same reason: no gate reads this region (Dave, August 26, 2026).
>
> **DEPLOY takes no steps of its own, and it is WRITTEN LAST** -- it is what the branch DID, once
> TEST says so. Written while steps above it are still open it states an INTENTION, and no gate
> holds it against what landed: the step gate splits this file at that heading and counts only
> above it. The PR title is the one exception -- new-branch -Title writes it at creation, because
> open-pr composes the PR title from it. It is the one part of this file that travels verbatim
> into `CHANGELOG.md` at the merge. In each tier, write the reason
> ABOVE the Score line -- anything below it is discarded.
>
> Relative links in that text resolve FROM THE REPO ROOT, not from this directory:
> write `scripts/x.ps1`, never `../../scripts/x.ps1`.
>
> For tier 1 audiences: management and the employer/commissioner. That reader and nobody else -- what matters only
> inside this repo belongs under the first `**Score:**`. If the change reaches that reader
> not at all, N/A is a complete answer and the common one.
>
> The phase arc, the marks and the whole form: `DEVELOPMENT-portable.md`, which ships
> with this workflow.

### PLAN

- [x] Issue #152 gelezen en geverifieerd tegen de geïnstalleerde plugin v4.20.0: het bestaande
  tweebestandsmodel is inderdaad vervangen door één `development-cycle.md`, en de map zelf is
  hernoemd naar `contributing-davekjohn/`.
- [x] Onderzoek gedaan (via een fork) naar `Get-BranchFilePaths`, `Resolve-BranchFilePath`,
  `fold-changelog-entry.ps1`, `adopt-workflow-folder.ps1` (dry run) en de CONTRIBUTING.md-model-vraag.
  Conclusie: `adopt-workflow-folder -Apply` zou een lege parallelle boom aanmaken naast de bestaande
  inhoud — de juiste route is een handmatige `git mv` die de bestaande content meeneemt.
- [x] `DEVELOPMENT-portable.md` volledig gelezen. Ontdekt dat de significance-secties sinds
  19-23 augustus 2026 óók zijn veranderd voor een repo die een audience-tier heeft opgegeven: geen
  aparte `#### Tier 0`/`#### Tier 1`-koppen meer, maar de DEPLOY-kop zelf als tier-0-vraag en één
  resolved audience-heading eronder. Dat gold hier al sinds 12 augustus 2026 (`Get-ReleaseAudienceTier`
  is gezet) en had dus niets met deze migratie te maken, maar de bestaande documentatie beschreef nog
  het oude model — meegenomen in dezelfde herschrijving omdat het dezelfde documentparagrafen raakt.

### CREATE

- [x] `new-branch` gedraaid voor deze branch — schreef dit document al op zijn definitieve pad,
  vóór de map-hernoeming, wat een tijdelijke split-brain gaf (`contributing-davekjohn/development-cycle.md`
  naast `workflow-davekjohn/branch/`). Gecorrigeerd door de map-inhoud er omheen te bewegen in plaats
  van andersom.
- [x] `git mv workflow-davekjohn contributing-davekjohn` (in twee stappen wegens een geneste-map-val
  van `git mv` toen de doelmap al bestond), gevolgd door verwijdering van de vijf bestanden van het
  oude `branch/`-tweebestandsmodel en zijn `templates/`.
- [x] `scripts/repo-config.ps1` en `scripts/lib/branch-info.ps1` bijgewerkt: drie hardcoded
  `workflow-davekjohn`-strings (`$workflowDir`, `$script:ReleaseHistoryPath`, `$script:ReleaseNoteRoot`)
  plus de bijbehorende commentaarblokken.
- [x] `contributing-davekjohn/README.md`, `contributing-davekjohn/CLAUDE.md` en
  `contributing-davekjohn/CONTRIBUTING.md` herschreven voor het één-documentmodel — inclusief de
  Significance-sectie, die het oude `Tier 0`/`Tier 1`-model beschreef terwijl deze repo al sinds
  12 augustus op het nieuwe model draait.
- [x] Root `CLAUDE.md`, root `CONTRIBUTING.md`, root `README.md`, `.github/pull_request_template.md`,
  `.claude/skills/open-pr/SKILL.md`, `.claude/skills/fold-changelog/SKILL.md`,
  `.claude/specialists/lenses/01-01-extension.md` en `.claude/specialists/SPECIALISTS.md` bijgewerkt.
  Genuine historische vermeldingen (PR #145 op 2026-08-16, de val van 2026-08-15 met de
  marketplace-clone, `.claude/handover.md` als bevroren sessiestand) bewust **niet** aangepast — die
  beschrijven wat toen waar was.
- [x] `contributing-davekjohn/releases/README.md` bijgewerkt **onder** de mirror-streep (regel 336)
  — de tabel met de drie release-roots en de sluitende quote. Boven de streep niet aangeraakt: dat is
  een verbatim spiegel van de bron, en een correctie daar hoort als `inbound`-issue naar
  `claude-code-specialists` in plaats van hier gerepareerd te worden.

### TEST

- [x] `scripts\lint\lint-web.ps1` (tsc, ESLint, build, link-checker): **0 fouten** —
  89 statische pagina's, ondergrens gehaald.
- [x] `npx vitest run`: **213/213 tests groen** (16 suites).
- [x] `check-script-contract.ps1` (v4.20.0): **0 errors, 14 info-signalen** — allemaal bestaande,
  bewust onbeantwoorde optionele seams (zie de eigen verantwoording onderaan `repo-config.ps1`), geen
  nieuwe. `[OK] workflow folder: contributing-davekjohn/ exists.`
- [~] Handmatige nieuwe-branch-proefrun op een tweede branch — niet gedaan: `new-branch.ps1` is al
  ééns gedraaid vóór de mv (voor déze branch zelf) en toonde daarmee al aan dat het script het nieuwe
  pad correct schrijft; een tweede losse proefrun zou hetzelfde nogmaals bewijzen.

### DEPLOY: `config/adopt-development-cycle-model-v1`

Deze repo liep nog volledig op het tweebestandsmodel (`workflow-davekjohn/branch/branch-changelog.md` +
`branch-progress.md`) en de mapnaam `workflow-davekjohn/`, terwijl plugin v4.20.0 die allebei heeft
vervangen: één `contributing-davekjohn/development-cycle.md` dat alleen bestaat zolang een branch
openstaat, met `PLAN`/`CREATE`/`TEST`/`DEPLOY` als vaste `###`-secties. Issue #152 signaleerde dit op
2026-08-27 nadat de fold van PR #149 de oude bestanden al stil verwijderde in plaats van te resetten.

Deze branch voert de volledige adoptie door: de map is hernoemd via `git mv` (met behoud van alle
bestandshistorie), het oude tweebestandsmodel is verwijderd, en elke plek in de repo die het oude
model of de oude mapnaam beschreef — `CLAUDE.md`, beide `CONTRIBUTING.md`'s, de skill-bestanden, de
lens, `SPECIALISTS.md`, de PR-template en `README.md` — is bijgewerkt naar wat de scripts nu
daadwerkelijk doen. Onderweg bleek de significance-sectie van een entry ook al sinds 12 augustus 2026
op het nieuwe (tier-loze) model had moeten staan; die documentatie is in dezelfde beweging
gecorrigeerd. Geen gedeeld script is gedupliceerd of gewijzigd — alleen deze repo's eigen configuratie
en documentatie.

**Score:** 4
<!-- Elke toekomstige branch gebruikt dit model; het oude wordt door de gedeelde scripts niet meer
     geschreven, dus dit was geen optionele opfrisbeurt maar het dichten van een gat tussen wat de
     documentatie beloofde en wat er feitelijk gebeurde. Geen 5: er is geen breaking change voor een
     lezer die de skills gebruikt in plaats van de documentatie zelf te lezen -- de scripts hadden de
     dual-read al. -->

#### What makes this deploy extra special

N/A — dit raakt alleen de interne werkwijze van deze repo (branches, entries, documentatie). Niets
aan `djcylow.com` verandert, en niemand buiten wie hier meewerkt merkt dit.

**Score:** N/A

#### Pull Request

Adopteer het development-cycle.md-model en de contributing-davekjohn/-map van plugin v4.20.0

Sluit issue #152.

