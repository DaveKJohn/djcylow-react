## `config/eslint-node-overrides` progress

### Steps

- [x] Gemeten wat de 37 errors werkelijk zijn, per regel en per bestand (`eslint -f json`)
- [x] Override voor `scripts/**/*.js` + `netlify/functions/**/*.js` in `eslint.config.mjs`
- [x] Nagemeten: 37 → 27 errors, warnings onveranderd op 8
- [x] Het getal 37 bijgewerkt op alle vier de levende plekken (`CLAUDE.md` 2×, `CONTRIBUTING.md`,
      `scripts/repo-config.ps1`, `scripts/lint/lint-web.ps1` header + TODO)
- [~] Vindplaatsen in `releases/` niet aangeraakt — dat zijn gepubliceerde documenten en dus
      historie; het getal klopte op het moment dat ze uitgingen
- [x] Poort groen: `lint-web.ps1` (tsc + build, 89 pagina's) en `npm test` (36 tests)

### Where I left off

De branch is af. Dit is stap 1 van vier uit het voorstel om ESLint van een handmatige telling naar
een echte poort te brengen:

1. **deze branch** — override voor Node-scripts, −10 errors, raakt geen `src/`
2. `refactor/scss-module-declaratie` — één `.d.ts`, 14× `@ts-ignore` weg, −14 errors → **wacht op Dave**
3. `fix/react-hooks-en-types` — de 13 resterende, hooks in de audioplayer eerst → **wacht op Dave**
4. `config/eslint-in-de-poort` — ESLint in `lint-web.ps1` en dus in CI; daarna is "vergelijk het
   aantal" niet langer een afspraak die iemand moet onthouden

Stap 2 en 3 raken `src/` en vallen daarmee onder de uitzondering "zichtbaar resultaat", ook al is er
bij stap 2 visueel niets te zien. De deploy preview van de PR is daar het bewijsmiddel.

