## `config/dode-dependencies` progress

### Steps

- [x] Gemeten welke van de vier kandidaten écht dood zijn: `gray-matter` 0 treffers,
      `@next/third-parties` 0, `react-google-reviews` 2, `yaml` 0
- [x] De twee uitzonderingen begrepen in plaats van geteld: `react-google-reviews` wordt gebruikt door
      `GoogleReviews.tsx` (uitgecommentarieerd in `page.tsx`, maar het bestand bestaat), en `yaml` is
      een bewust gedeclareerde optionele peer van vite die `ci.yml` in twaalf regels verantwoordt
- [x] Met `npm ls` gecontroleerd dat de twee te verwijderen pakketten niet transitief nodig zijn
- [x] `npm uninstall gray-matter @next/third-parties` — 129 regels uit de lockfile
- [x] De poort gedraaid: groen, en de build levert nog steeds 89 statische pagina's
- [~] `react-google-reviews` verwijderen — hoort bij #59 (dode componenten), dat `src/` raakt en dus
      op Dave's woord wacht

### Where I left off

Af, poort groen. Raakt `package.json` en `package-lock.json`, geen site-werk, dus de keten loopt door.

Dit is punt 1 van #94, met opzet als eigen PR zoals het issue vraagt: zo is de dependency-wijziging
apart terug te draaien van de rest van dat onderhoud (dat in PR #113 zit). **#94 blijft open** voor
punt 5, de `npm audit`-ronde die het issue zelf "zonder haast" noemt.
