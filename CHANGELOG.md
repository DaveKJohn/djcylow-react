# Changelog

De geschiedenis van de DJ Cylow-website: onder **Pull Requests** elke gemergde branch met zijn PR,
onder **Releases** de vastgelegde versies. Het mechanisme (entry-bestanden, folden, een release
knippen) staat in [`CLAUDE.md`](CLAUDE.md).

**`origin/main` is de live site.** Netlify bouwt en publiceert bij elke push naar `main`, en een
PR-merge schrijft daar rechtstreeks in. Alles hieronder staat dus al op `djcylow.com`; wat onder
**Pull Requests** staat is live maar heeft nog geen versienummer, en een release is een label op wat
al draait.

> Tot 2026-07-26 stond hier het omgekeerde, met een `← LIVE`-markering die zou aanwijzen welke versie
> draaide. Dat model was onjuist en de markering stond maandenlang fout — op v2.20.1, terwijl
> v2.20.2, v2.21.0 en vijf PR's al live waren. De markering is vervallen: de bovenste uitgebrachte
> versie draait per definitie al.

## Pull Requests

Alles wat sinds de laatste release naar `main` is gemergd en daarmee live staat — nieuwste bovenaan,
één blok per pull request.

### #25 · Van `specialists` naar `team-alpha` + `workflow-davekjohn` · Config · 2026-08-12

De specialists-plugin heette in de bron niet meer zoals deze repo hem aanriep. `claude plugin list`
meldde `specialists@claude-code-specialists` als **failed to load — Plugin specialists not found in
marketplace**: de bron is sinds v4.0.0 gesplitst in *teams* (wie de specialisten zijn) en *workflows*
(hoe werk door een repo beweegt), en `specialists` bestaat als id niet meer. Deze repo stond nog op
v3.2.0, geïnstalleerd op 2026-08-03; de marketplace-clone liep zestien commits achter.

Wat er is gebeurd:

- **De marketplace bijgewerkt** naar `afed1b1`, gelijk met `origin/main` van de bron — **v4.5.0**
  plus 42 commits.
- **`.claude/settings.json`** — `specialists@claude-code-specialists` eruit,
  `team-alpha@claude-code-specialists` (de kernploeg) en `workflow-davekjohn@claude-code-specialists`
  (het branch-, changelog- en release-model) erin, beide op v4.5.0 met `--scope project`.
  `workflow-davekjohn` is geen nieuwe keuze maar dezelfde: `CLAUDE.md` beschrijft dat model al woord
  voor woord, inclusief de vijf skills die het meebrengt.
- **De `@`-import van Chris' body herstelt** in `.claude/specialists/SPECIALISTS.md`. Die wees naar
  `plugins/specialists/personas/01-01-persona.md` — een pad dat met de splitsing verdween. Nu:
  `plugins/teams/team-alpha/personas/01-01-persona.md`. Dit is de stille breuk van de twee: Claude
  Code laat een `@`-import die het niet kan vinden zonder één woord vallen, dus het roster rendert
  normaal terwijl de orchestrator zonder zijn ritueel en zijn routeringsregels draait.
- **Hetzelfde pad in vier lenzen** (`01-01`, `03-02`, `05-05`, `05-06`) meegecorrigeerd. Dat zijn
  prozaverwijzingen in de kop, geen imports, dus die faalden niet — ze wezen alleen de weg naar een
  map die er niet meer is.

Wat hierna nog moet, en waarom het hier niet kon:

- **Een sessie-herstart**, gevolgd door `specialists-init` (additief; overschrijft niets). Een
  herstart kan een specialist niet zelf uitvoeren.
- **`CLAUDE.md` volgt in een eigen beweging.** `workflow-davekjohn@4.x` verplaatst het changelog
  entry-bestand van de repo-root (`<branch-naam>.md`) naar `branch/branch-changelog.md` plus
  `branch/branch-progress.md`, en `scripts/release/new-changelog-entry.ps1` is vervangen door
  `scripts/task/new-branch.ps1`. Dat raakt stap 3 en stap 7 van de ontwikkelworkflow — een
  inhoudelijke wijziging van de werkwijze, niet iets om ongemerkt mee te nemen in een config-commit.
  Deze branch houdt zich daarom nog aan het root-model.

Als [inbound #612](https://github.com/DaveKJohn/claude-code-specialists/issues/612) naar de bron
gestuurd: de migratiehandleiding daar noemde één oud pad voor de `@`-import, en dat is niet het pad dat
`specialists@3.2.0` shipte. Wie zijn eigen regel in die tabel niet terugvindt, concludeert redelijkerwijs
dat de reparatie niet voor hem geldt — precies bij de stap die stil faalt. **Dat issue is op 2026-08-12
gesloten en de reparatie zit in v4.5.0**: `INSTALL.md` noemt nu beide oude padvormen, geeft een vormtest
voor wie geen van beide terugvindt, en zegt met zoveel woorden dat een niet-gevonden regel geen bewijs is
dat de reparatie niet van jou is. Dit is dus de eerste keer dat de inbound-route rond is — de
verbetering is in de bron gebouwd en komt via de plugin-update hier terug.

[PR #25](https://github.com/DaveKJohn/djcylow-react/pull/25)

### #24 · Specialists-plugin opnieuw geadopteerd op de hernoemde bron · Config · 2026-08-03

De repo hing aan drie generaties van de specialists-familie tegelijk: `.claude/settings.json` zette
`specialists@davekjohns-workshop` aan, de `@`-imports in `CLAUDE.md` laadden uit de
*davekjohns-workshop*-clone, en wat er feitelijk meeliep kwam uit een **machine-brede user-scope
install** van `specialists@claude-specialists`. Voor deze repo bestond geen eigen install record, dus
de plugin-skills laadden hier helemaal niet — `new-branch`, `open-pr` en `fold-changelog` waren in de
sessie onvindbaar terwijl `CLAUDE.md` ze als de normale route beschrijft.

Afgebroken volgens `UNINSTALL.md` en opnieuw geadopteerd volgens `QUICKSTART.md`, op de huidige bron
[`DaveKJohn/claude-code-specialists`](https://github.com/DaveKJohn/claude-code-specialists) — dezelfde
repo als `claude-specialists`, sinds de rename. Nu één project-scoped install: **v3.2.0**, payload
aanwezig.

De seam verhuist daarmee van `.claude/plugins/claude-specialists/specialists/*-extension.md` naar
`.claude/specialists/lenses/`, en `CLAUDE.md` importeert nog precies één bestand:
`.claude/specialists/SPECIALISTS.md`. Daar woont sindsdien het roster, de routing en de laadstrategie;
`CLAUDE.md` houdt de werkwijze. Dat is de eigenschap waar de nieuwe layout om is gebouwd — de-adoptie
is "verwijder één map en één regel".

Verder meegenomen:

- **`Get-RosterPath` wees nog naar `CLAUDE.md`.** Dat leverde bij elke sessiestart een
  `ROSTER-PENDING` over negentien specialisten die wél in het roster stonden, omdat de check een
  bestand las met alleen de `@`-import erin. Nu `.claude/specialists/SPECIALISTS.md`; `check-roster-sync`
  meldt alle negentien als roster + lens in orde.
- **Twee nieuwe gedeelde skills gedocumenteerd:** `cut-release` (de sluitende stappen van een release
  als afdwingbare checklist) en `park` (branch committen en pushen zonder PR). De regel dat er "nog geen
  `cut-release.ps1`" was, is daarmee achterhaald en vervangen.
- Een dode permission-entry naar de verdwenen `davekjohns-workshop`-cache uit
  `.claude/settings.local.json` gehaald.

De `davekjohns-workshop`-marketplace blijft geregistreerd: die bedient `life-hub` via een eigen
project-record. De registratie `claude-specialists` blijft ook staan — die houdt de project-records van
`smartwatchbanden` geldig. Beide raken deze repo niet meer.

[PR #24](https://github.com/DaveKJohn/djcylow-react/pull/24)

---

## Releases

De vastgelegde versies — nieuwste bovenaan; elke regel linkt naar de volledige release-notes.

### [v2.22.0] - 2026-07-26 — Minor

Zie [releases/development/2.22/2.22.0.md](releases/development/2.22/2.22.0.md)

---

### [v2.21.0] - 2026-07-25 — Minor

Zie [releases/development/2.21/2.21.0.md](releases/development/2.21/2.21.0.md)

---

### [v2.20.2] - 2026-07-25 — Patch

Zie [releases/development/2.20/2.20.2.md](releases/development/2.20/2.20.2.md)

---

### [v2.20.1] - 2026-07-02 — Patch

Zie [releases/development/2.20/2.20.1.md](releases/development/2.20/2.20.1.md)

---

### [v2.20.0] - 2026-07-02 — Minor

Zie [releases/development/2.20/2.20.0.md](releases/development/2.20/2.20.0.md)

---

### [v2.19.2] - 2026-06-28 — Patch

Zie [releases/development/2.19/2.19.2.md](releases/development/2.19/2.19.2.md)

---

### [v2.19.1] - 2026-06-28 — Patch

Zie [releases/development/2.19/2.19.1.md](releases/development/2.19/2.19.1.md)

---

### [v2.19.0] - 2026-06-28 — Minor

Zie [releases/development/2.19/2.19.0.md](releases/development/2.19/2.19.0.md)

---

### [v2.18.0] - 2026-06-27 — Minor

Zie [releases/development/2.18/2.18.0.md](releases/development/2.18/2.18.0.md)

---

### [v2.17.0] - 2026-06-27 — Minor

Zie [releases/development/2.17/2.17.0.md](releases/development/2.17/2.17.0.md)

---

### [v2.16.4] - 2026-06-27 — Patch

Zie [releases/development/2.16/2.16.4.md](releases/development/2.16/2.16.4.md)

---

### [v2.16.3] - 2026-06-27 — Patch

Zie [releases/development/2.16/2.16.3.md](releases/development/2.16/2.16.3.md)

---

### [v2.16.2] - 2026-06-27 — Patch

Zie [releases/development/2.16/2.16.2.md](releases/development/2.16/2.16.2.md)

---

### [v2.16.1] - 2026-06-27 — Patch

Zie [releases/development/2.16/2.16.1.md](releases/development/2.16/2.16.1.md)

---

### [v2.16.0] - 2026-06-25 — Minor

Zie [releases/development/2.16/2.16.0.md](releases/development/2.16/2.16.0.md)

---

### [v2.15.0] - 2026-06-25 — Minor

Zie [releases/development/2.15/2.15.0.md](releases/development/2.15/2.15.0.md)

### [v2.14.4] - 2026-06-25 — Patch

Zie [releases/development/2.14/2.14.4.md](releases/development/2.14/2.14.4.md)

### [v2.14.3] - 2026-06-25 — Patch

Zie [releases/development/2.14/2.14.3.md](releases/development/2.14/2.14.3.md)

### [v2.14.2] - 2026-06-25 — Patch

Zie [releases/development/2.14/2.14.2.md](releases/development/2.14/2.14.2.md)

### [v2.14.1] - 2026-06-25 — Patch

Zie [releases/development/2.14/2.14.1.md](releases/development/2.14/2.14.1.md)

### [v2.14.0] - 2026-06-25 — Minor

Zie [releases/development/2.14/2.14.0.md](releases/development/2.14/2.14.0.md)

### [v2.13.0] - 2026-06-18 — Minor

Zie [releases/development/2.13/2.13.0.md](releases/development/2.13/2.13.0.md)

### [v2.12.0] - 2026-06-16 — Minor

Zie [releases/development/2.12/2.12.0.md](releases/development/2.12/2.12.0.md)

### [v2.11.1] - 2026-05-10 — Patch

Zie [releases/development/2.11/2.11.1.md](releases/development/2.11/2.11.1.md)

### [v2.11.0] - 2026-05-08 — Minor

Zie [releases/development/2.11/2.11.0.md](releases/development/2.11/2.11.0.md)

### [v2.10.0] - 2026-05-05 — Minor

Zie [releases/development/2.10/2.10.0.md](releases/development/2.10/2.10.0.md)

### [v2.9.0] - 2026-05-01 — Minor

Zie [releases/development/2.9/2.9.0.md](releases/development/2.9/2.9.0.md)

### [v2.8.0] - 2026-04-20 — Minor

Zie [releases/development/2.8/2.8.0.md](releases/development/2.8/2.8.0.md)

### [v2.7.0] - 2026-04-13 — Minor

Zie [releases/development/2.7/2.7.0.md](releases/development/2.7/2.7.0.md)

### [v2.6.0] - 2026-04-11 — Minor

Zie [releases/development/2.6/2.6.0.md](releases/development/2.6/2.6.0.md)

### [v2.5.0] - 2026-04-10 — Minor

Zie [releases/development/2.5/2.5.0.md](releases/development/2.5/2.5.0.md)

### [v2.4.0] - 2026-03-20 — Minor

Zie [releases/development/2.4/2.4.0.md](releases/development/2.4/2.4.0.md)

### [v2.3.0] - 2026-03-19 — Minor

Zie [releases/development/2.3/2.3.0.md](releases/development/2.3/2.3.0.md)

### [v2.2.0] - 2026-03-13 — Minor

Zie [releases/development/2.2/2.2.0.md](releases/development/2.2/2.2.0.md)

### [v2.1.0] - 2026-03-11 — Minor

Zie [releases/development/2.1/2.1.0.md](releases/development/2.1/2.1.0.md)

### [v2.0.1] - 2026-03-08 — Patch

Zie [releases/development/2.0/2.0.1.md](releases/development/2.0/2.0.1.md)

### [v2.0.0] - 2026-03-07 — Major

Zie [releases/development/2.0/2.0.0.md](releases/development/2.0/2.0.0.md)
