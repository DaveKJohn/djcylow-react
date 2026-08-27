## Development cycle: `docs/github-body-is-gegenereerd-v1` · 20260827-151100

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

Issue #163: `CLAUDE.md` beschrijft het aankondigingsdocument in
`contributing-davekjohn/releases/github/<major>.x/<versie>.md` als handwerk, terwijl `cut-release` het
bij elke cut zelf schrijft. Drie plekken dragen die claim, in het bestand dat elke sessie meelaadt.

#### Wat er geverifieerd moest worden voordat er iets veranderde

De issue is een rapport, en een rapport wordt tegen de tree gehouden voordat het geloofd wordt. Drie
beweringen, alle drie nagemeten:

- **Het script schrijft het.** `cut-release.ps1` van de geinstalleerde 4.20.0 (de cache -- dus wat hier
  werkelijk draait), blok `# --- The GitHub Release body (generated, every release) ---`. `$bodyRelPath`
  staat onvoorwaardelijk in `$plannedFiles`, dus bij elke release en niet alleen bij een Minor/Major.
- **Het kan niet later.** De scriptcomment geeft de reden zelf: de cut leegt `CHANGELOG.md`, dus de
  entries waar de body een lijst van is bestaan een moment later niet meer.
- **De tree bevestigt het.** `contributing-davekjohn/releases/github/2.x/2.25.0.md` is aangemaakt in de
  cut-commit `8b95958` en heeft de vorm die `Build-GitHubReleaseBody` oplevert.

#### De ene open keuze, en Dave's antwoord

De issue liet expliciet open of stap 5 moest vervallen of moest omkeren naar nalezen -- *"dat is een
keuze, niet een constatering"*. Voorgelegd met drie opties; Dave koos **nalezen voor de publicatie**, en
daarmee ook dat uitzondering 3 **niet** wordt verbreed: een bijgeschaafd `github/`-document is gegenereerd
en valt dus op de gewone route.

### CREATE

- [x] Release Workflow-tabel: de rij gesplitst -- de aankondiging naar het script, de Release en de
      bijlagen blijven handwerk
- [x] Stap 5 omgezet van *schrijven* naar *nalezen*, met de titelregel als het enige deel dat van een
      mens komt, en een waarschuwing om de `## What landed`-lijst niet te herschrijven
- [x] De begrenzing genoteerd die Dave koos: bijschaven is gewoon werk op de gewone route, want
      uitzondering 3 dekt het handgeschreven document en dit is het gegenereerde
- [x] Een bullet toegevoegd aan *"Wat het script hierboven al voor je deed"*, met de reden waarom het
      niet later kan en wat `Build-GitHubReleaseBody` precies oplevert
- [x] De slotalinea van de Scripts-sectie: `github/` weg bij het handwerk van Rendall, met de historische
      noot erbij zoals dit bestand die overal draagt
- [x] De `cut-release`-skill-bullet meebewogen, want die somde dezelfde generatie op zonder de body
- [x] Stap 6 verwijst nu naar de gegenereerde body en naar stap 5

#### Een vierde plek die de issue niet noemde

De vierde bullet van de issue vroeg de gemeten legs na te lopen. Bij de v2.25.0-tabel klopte het
vermoeden -- daar verandert niets. Bij de **v2.24.0**-tabel niet: daaronder stond *"Bijna vijf zesde van
de tijd zit in stap 4 en 5"*, en stap 5 kostte niets. Gemeten: `releases/github/2.x/2.24.0.md` is
aangemaakt in cut-commit `ef98b04`, dus binnen de eerste leg van 3m 04s. De zin schreef tijd toe aan een
stap die er niet in zat.

- [x] Die zin gecorrigeerd naar *"stap 4 plus de PR-route die er destijds omheen liep"*, met de meting
      als noot. Aan de getallen zelf verandert niets -- alleen aan welke stap ze toebehoren

### TEST

- [x] `scripts/lint/lint-web.ps1` groen (tsc, eslint, build, link- en anker-check)
- [x] De testsuite groen
- [x] Nagelezen dat de vier aangeraakte passages elkaar niet tegenspreken: tabel, stap 5, de
      script-lijst, de slotalinea en de skill-bullet zeggen nu alle vijf hetzelfde

### DEPLOY: `docs/github-body-is-gegenereerd-v1`

De Release Workflow droeg op om een document te schrijven dat het script zelf al had neergezet. Wie stap 5
volgde deed dubbel werk of overschreef de `## What landed`-lijst -- en die is na de cut niet meer te
reconstrueren, want `CHANGELOG.md` is dan geleegd. De aankondiging in `github/` staat nu op alle vijf de
plekken als gegenereerd, met de reden waarom het niet later kan, en stap 5 is omgekeerd naar nalezen voor
de publicatie: het enige moment waarop iemand die body ziet voordat hij publiek is. Onderweg bleek de
kostenraming onder de v2.24.0-tabel dezelfde fout te dragen -- vijf zesde van de tijd werd toegeschreven
aan "stap 4 en 5", terwijl stap 5 in die run nul seconden kostte.

**Score:** 3

#### What makes this deploy extra special

N/A -- dit is de interne routebeschrijving van een release. De opdrachtgever leest de release-documenten,
niet de instructie waarmee ze worden gemaakt, en aan die documenten verandert niets.

**Score:** N/A

#### Pull Request

CLAUDE.md noemt het github/-aankondigingsdocument gegenereerd in plaats van handwerk
