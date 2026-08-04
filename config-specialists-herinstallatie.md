### Specialists-plugin opnieuw geadopteerd op de hernoemde bron · Config · 2026-08-03

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
