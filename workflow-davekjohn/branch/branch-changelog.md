## `docs/changelog-naar-workflow-map` changelog

### Branch title
CHANGELOG.md verhuist naar workflow-davekjohn/, volgens de nieuwe isolate-by-default-regel van de plugin

### Branch ID
20260827-013040

### Branch type
docs

### What does the change on this branch bring to main?
PR #149 legde bloot dat `fold-changelog-entry.ps1` uit plugin v4.20.0 een consumer-repo's `CHANGELOG.md`
sindsdien **isolate-by-default** verwacht: `Get-ChangelogPath`s computed default wijst naar
`<workflow-map>/CHANGELOG.md`, en `Assert-WorkflowIsolatedSeamPath` weigert (exit 1) élk antwoord —
ook een expliciete override in `scripts/repo-config.ps1` — dat buiten die map wijst (issue #885/#914 in
de bron, 25-26 augustus 2026). Deze repo bewaarde `CHANGELOG.md` tot dan als vaste root-doc; de fold
van #149 moest daardoor handmatig gebeuren.

Dit brengt de repo in lijn met de nieuwe regel:
- `CHANGELOG.md` → `workflow-davekjohn/CHANGELOG.md` (`git mv`). Geen eigen `Get-ChangelogPath`
  gedefinieerd: de computed default volgt `Get-WorkflowFolderName` en wijst dus vanzelf naar de juiste
  plek zolang die map zo heet, en zou automatisch meebewegen als de map ooit naar
  `contributing-davekjohn/` hernoemt.
- `scripts/repo-config.ps1`: `CHANGELOG.md` uit `Get-ReservedRootMd`'s lijst gehaald — die dekt alleen
  root-*.md, en zou daar toch nooit meer iets matchen. `Get-MojibakePaths`'s commentaar bijgewerkt: het
  bestand wordt nu gedekt door het recursieve `workflow-davekjohn/`-blok, niet meer door de root-glob.
- Alle daadwerkelijke markdown-links naar `CHANGELOG.md` bijgewerkt naar hun nieuwe relatieve diepte:
  `CONTRIBUTING.md` (root), `workflow-davekjohn/CONTRIBUTING.md`, en drie links in
  `workflow-davekjohn/releases/README.md` — twee daarvan boven de mirror-streep (alleen het pad
  aangepast, de omringende tekst is letterlijk uit de bron en blijft dat), één eronder waar ook de
  bijbehorende uitleg is bijgewerkt (van "twee mechanische edits" naar "drie", met de derde
  toegevoegd).
- Prozaverwijzingen die `CHANGELOG.md` als los item naast `workflow-davekjohn/` opsomden
  (`CLAUDE.md`, `.claude/skills/open-pr/SKILL.md`, `.claude/specialists/lenses/01-01-extension.md`)
  aangepast: nu vermeld als "erin" in plaats van als apart item, om niet te suggereren dat het nog op
  twee plekken tegelijk zou kunnen staan.
- Een nieuwe rij toegevoegd aan de `workflow-davekjohn/`-inhoudstabel in `CLAUDE.md`, plus een korte
  toelichting analoog aan die van de `branch/`-verhuizing.

Wat bewust **niet** is aangepast: losse proza-vermeldingen van de bestandsnaam `CHANGELOG.md` zonder
pad (bijv. in `workflow-davekjohn/branch/README.md`, de skill-beschrijvingen, `SPECIALISTS.md`) — die
noemen het bestand, niet een pad ernaartoe, en blijven kloppen ongeacht waar het leeft. Historische
release-documenten in `releases/development/` zijn niet aangeraakt: dat is een record, geen vertaling.

### Significance

#### Tier 0

Zonder deze verhuizing blijft de gedeelde `fold-changelog-entry.ps1` voor deze repo onbruikbaar, en
moet elke volgende merge zijn entry met de hand in `CHANGELOG.md` invoegen — foutgevoeliger dan het
gescripte pad, en een herhaalde handeling. Dit haalt de repo in lijn met de plugin-conventie en maakt
de fold-skill weer bruikbaar.

**Score:** 3

Niet zichtbaar voor de opdrachtgever: dit is interne documentatie- en tooling-structuur, geen
wijziging aan de site.

**Score:** N/A

### Pull Request
<!-- link to the PR in github when branch is merged to main and the date this happened-->
