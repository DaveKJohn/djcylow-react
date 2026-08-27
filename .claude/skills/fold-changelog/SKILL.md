---
name: fold-changelog
description: >-
  Vouw de changelog-entry van een zojuist gemergede branch in CHANGELOG.md, verrijkt met de
  PR-link en de merge-datum, en zet de twee bestanden in workflow-davekjohn/branch/ terug in hun
  resetstaat. Dit is stap 7 van de cyclus in workflow-davekjohn/CONTRIBUTING.md en de enige
  directe commit op main, met een
  scope die beperkt blijft tot CHANGELOG.md plus die twee bestanden. Gebruik dit direct na een
  merge, vanaf main.
---

# fold-changelog — stap 7 van de cyclus, in deze repo

Dit is de **repo-eigen ingang** naar het gedeelde `fold-changelog-entry.ps1`. Het script komt
onveranderd uit de plugin-cache; hier staat geen kopie van.

## Waarom deze skill bestaat

De plugin-skill draagt `disable-model-invocation: true`. De reden daarvoor is echt — de fold
commit rechtstreeks op `main` — maar `CLAUDE.md` noemt die commit expliciet als **uitzondering 1**
op "nooit direct op main", met een scope die vastligt: `CHANGELOG.md` en de twee vaste bestanden in
`branch/`. Die uitzondering is hier dus al gemaakt; deze skill is de ingang ernaartoe.

**Uitzondering 2 — de release-commit — heeft bewust géén repo-eigen skill gekregen.** `cut-release`
blijft slash-only, want die staat in `CLAUDE.md` aan Dave's expliciete verzoek.

## Draaien

Vanaf `main`, direct na de merge:

```powershell
powershell -NoProfile -File scripts/task/shared.ps1 -Script release/fold-changelog-entry.ps1 -Push
```

**Een vlag is niet optioneel.** Zonder `-Commit` of `-Push` schrijft `fold-changelog-entry.ps1` de
wijzigingen alleen naar schijf en commit het niets — terwijl stap 4 hieronder belooft dat hij
`fold: <branch> changelog` commit. Het script stageert zelf alleen `CHANGELOG.md` en de twee
bestanden in `workflow-davekjohn/branch/`, dus de scope van uitzondering 1 blijft gehandhaafd ook als er
verder iets in de tree rondslingert.

**`-Push` impliceert `-Commit`**, dus geef alleen die mee. Sinds 2026-08-16 is dat de route hier: pushen
naar `origin/main` is vrijgegeven door Dave, en de fold hoort de laatste stap van de keten te zijn in
plaats van een commit die blijft liggen.

> **Tot 2026-08-16 stond hier `-Commit`, met de instructie `-Push` bewust wég te laten** omdat pushen
> Dave's initiatief was. Die regel is geschrapt. De reden dat hij juist hier het langst gold, is ook de
> reden dat hij verviel: na de omzetting van de PR-stap was dit het enige dat er nog onder viel, en het
> is de minst riskante commit die deze repo kent — `CHANGELOG.md` plus twee bestanden die geen enkele
> gebouwde pagina veranderen.

## Wat het doet

1. Leest `workflow-davekjohn/branch/branch-changelog.md` en zoekt de bijbehorende PR op via `gh`.
2. Voegt de entry op tier/score-volgorde in `CHANGELOG.md` in, met de PR-link en de merge-datum.
3. Zet de twee bestanden in `workflow-davekjohn/branch/` terug in hun resetstaat.
4. Commit dat als `fold: <branch> changelog` en pusht het naar `origin/main`.

Elke `###`-kop onder `## [Unreleased]` in `CHANGELOG.md` is één wijziging. Sinds 2026-08-11 zonder de
oude `## Tier N`-/`## Releases`-secties; sinds 2026-08-27 wél weer met die ene vaste `## [Unreleased]`-kop
(de plugin's eigen "pending section"), waardoor elke entry en zijn interne secties één niveau dieper
staan dan daarvoor.

## Let op

- **Vanaf `main`, na de merge.** Vóór de merge is er nog geen PR-link om in te vullen.
- **De zes sectiekopjes van de entry blijven Engels.** Het zijn machine-gelezen sleutels; vertaal
  je ze, dan kan de fold de eigen entry niet meer lezen. Zie de taalsectie in `CLAUDE.md`.
