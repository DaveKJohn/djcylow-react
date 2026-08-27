## Development cycle: `docs/derde-directe-main-uitzondering-v1` · 20260827-145038

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

Issue #162: `CLAUDE.md` zegt op twee plekken dat er precies twee directe commits op `main` bestaan,
terwijl de `cut-release`-checklist van plugin 4.20.0 sinds 2026-08-23 een derde draagt — en die route
is bij v2.25.0 werkelijk gelopen (commits `638c2c6` en `3de44b8`). Daaruit volgt een tweede fout: de
gemeten kostenraming van de v2.24.0-run draagt een PR-leg die niet meer bestaat, met de conclusie
*"reken op een half uur voor een minor"*.

Beide beweringen zijn eerst tegen de tree gehouden voordat er iets veranderde:

- de derde uitzondering staat in `skills/cut-release/SKILL.md` van de **cache** (4.20.0, stap 4,
  regel 337) — dus in de versie die deze repo werkelijk draait, niet alleen in de marketplace-clone;
- de twee beweringen in `CLAUDE.md` stonden er nog letterlijk (regel 202/233 en 1197);
- de v2.25.0-timings zijn zelfstandig nagemeten uit `git log --format=%cI` en
  `gh release view v2.25.0`, niet uit het issue overgenomen.

#### Wat die hermeting veranderde aan het issue

Het issue rekent een totaal van **4m 14s**, opgebouwd uit een cut-leg van 26s. Die leg heeft geen
anker in git — de cut-commit is het eerste spoor van de run — en het totaal stopt bij de eerste
audience-pass, terwijl er ná de publicatie nog een tweede pass (`3de44b8`) en een tweede bijlage
volgden. Gemeten zoals de v2.24.0-tabel meet, tot en met de laatste bijlage, is het **5m 15s**. De
conclusie van het issue blijft daarmee volledig staan (minuten in plaats van een half uur); alleen het
getal is gecorrigeerd, en `CLAUDE.md` zegt nu zelf waarom de twee getallen verschillen.

#### Wat buiten deze branch is gehouden

`cut-release` **genereert** het `github/`-document zelf (`Build-GitHubReleaseBody`, regel 971-993 van
`cut-release.ps1`), terwijl `CLAUDE.md` het bij stap 5 en in de Release Workflow-tabel als handwerk
beschrijft. Dat is een echte drift, maar een ander onderwerp dan issue #162 en is als eigen issue
gemeld.

### CREATE

- [x] De derde uitzondering opnemen in `CLAUDE.md` bij *Nooit direct committen*, mét zijn begrenzing
      (alleen het handgeschreven audience-document, alleen tijdens een gevraagde cut, pad genoemd in
      `git add`, poorten er alsnog voor) en de reden waarom de route van 2026-08-04 is teruggedraaid
- [x] De afsluiting *"Dit zijn de **enige** twee"* meebewegen naar drie
- [x] De rij in de Safety-invulling (*"Twee uitzonderingen op nooit direct op `main`"*) meebewegen
- [x] Stap 4 van de Release Workflow de commit-route laten beschrijven in plaats van alleen het
      herschrijven, met het commandoblok erbij
- [x] De tabelrij `audience-document` in de Release Workflow-tabel noemt nu dat die commit
      rechtstreeks op `main` gaat
- [x] De v2.25.0-meting naast de v2.24.0-tabel zetten — de oude tabel blijft staan als record, met de
      reden voor het verschil en een expliciete noot over welke leg git níet kan afbakenen
- [x] De verwijzing in `contributing-davekjohn/CONTRIBUTING.md` (*"de twee uitzonderingen"*)
      meebewegen — gevonden door de bewering repo-breed te grepen in plaats van alleen de twee plekken
      uit het issue te repareren

### TEST

- [x] `scripts/lint/lint-web.ps1` groen: tsc, ESLint, build met de paginaondergrens, en de link- en
      anker-check over alle markdown — die vierde stap is hier de stap die telt, want deze branch
      raakt twee documenten vol relatieve links en ankers
- [x] Regeleindes gecontroleerd: de working copy van `CLAUDE.md` en `CONTRIBUTING.md` staat op CRLF
      (`core.autocrlf=true`, geen `.gitattributes`), en beide bestanden zijn ná de wijziging nog
      zuiver CRLF — 0 losse LF. Een eerste poging leverde gemengde regeleindes op en is teruggedraaid
- [x] Diacritieken nagelezen op mojibake in de volledige diff

### DEPLOY: `docs/derde-directe-main-uitzondering-v1`

De grondwet kent de derde directe-`main`-uitzondering nu wél: het committen van het handgeschreven
release-document tijdens een cut, mét de begrenzing die hem veilig maakt. Wie een cut draait leest zijn
eigen twee commits niet meer als een overtreding, en wie er een inplant leest een kostenraming die op
de laatste run is gemeten in plaats van op de vorige: 5m 15s bij v2.25.0 tegen 35m 40s bij v2.24.0,
met de PR-leg die dat verschil structureel maakt. De v2.24.0-tabel blijft staan als het record van die
run — er is niets vervangen, er is een meting naast gezet.

**Score:** 4

#### What makes this deploy extra special

Raakt de website, de levering of de opdrachtgever niet: dit is de interne werkwijze van de repo.

**Score:** N/A

#### Pull Request

CLAUDE.md kent de derde directe-main-uitzondering en de gemeten kosten van v2.25.0
