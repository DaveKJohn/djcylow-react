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
