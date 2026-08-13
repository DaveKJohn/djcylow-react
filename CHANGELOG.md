# Changelog

De geschiedenis van de DJ Cylow-website: elke gemergde branch met zijn pull request, nieuwste
bovenaan. Er zijn geen secties meer — **elke `##`-kop hieronder is één wijziging**, en dat is wat de
gedeelde workflow-scripts lezen. Het mechanisme (het entry-bestand in `branch/`, folden, een release
knippen) staat in [`CLAUDE.md`](CLAUDE.md).

**`origin/main` is de live site.** Netlify bouwt en publiceert bij elke push naar `main`, en een
PR-merge schrijft daar rechtstreeks in. Alles hieronder staat dus al op `djcylow.com` — live, maar
nog zonder versienummer. Een release is een label op wat al draait.

**De uitgebrachte versies staan niet hier maar in [`releases/README.md`](releases/README.md)**, met
datum, type en een samenvattende regel per versie. Dit bestand houdt alleen wat nog géén
versienummer heeft; een release-cut haalt die entries eruit en laat deze intro achter.

> Tot 2026-07-26 stond hier het omgekeerde, met een `← LIVE`-markering die zou aanwijzen welke versie
> draaide. Dat model was onjuist en de markering stond maandenlang fout — op v2.20.1, terwijl
> v2.20.2, v2.21.0 en vijf PR's al live waren. De markering is vervallen: de bovenste uitgebrachte
> versie draait per definitie al.

## #25 · Van `specialists` naar `team-alpha` + `workflow-davekjohn` · Config · 2026-08-12

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

## #24 · Specialists-plugin opnieuw geadopteerd op de hernoemde bron · Config · 2026-08-03

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
