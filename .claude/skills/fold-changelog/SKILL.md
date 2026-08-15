---
name: fold-changelog
description: >-
  Vouw de changelog-entry van een zojuist gemergede branch in CHANGELOG.md, verrijkt met de
  PR-link en de merge-datum, en zet de twee bestanden in branch/ terug in hun resetstaat.
  Dit is stap 7 van de cyclus in CONTRIBUTING.md en de enige directe commit op main, met een
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
powershell -NoProfile -File scripts/task/shared.ps1 -Script release/fold-changelog-entry.ps1
```

## Wat het doet

1. Leest `branch/branch-changelog.md` en zoekt de bijbehorende PR op via `gh`.
2. Voegt de entry op tier/score-volgorde in `CHANGELOG.md` in, met de PR-link en de merge-datum.
3. Zet `branch/branch-changelog.md` en `branch/branch-progress.md` terug in hun resetstaat.
4. Commit dat als `fold: <branch> changelog`.

Elke `##`-kop in `CHANGELOG.md` is één wijziging; er is sinds 2026-08-11 geen sectiekop meer.

## Let op

- **Vanaf `main`, na de merge.** Vóór de merge is er nog geen PR-link om in te vullen.
- **De zes sectiekopjes van de entry blijven Engels.** Het zijn machine-gelezen sleutels; vertaal
  je ze, dan kan de fold de eigen entry niet meer lezen. Zie de taalsectie in `CLAUDE.md`.
