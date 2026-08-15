## `config/poort-isolatie-en-paginadrempel` progress

### Steps

- [x] Gemeten dat #92 nog staat: `tsc -p tsconfig.lint.json --listFiles` gaf 680 bestanden mét
      `.next/types/routes.d.ts`, en `next-env.d.ts` staat op `.gitignore:41`
- [x] De tweede weg van #92 nagemeten in plaats van overgenomen — en de reporter zat er net naast:
      `next-env.d.ts` uit de `include`-lijst halen doet niets, want de glob `**/*.ts` matcht hem
      alsnog. Het moest via `exclude`
- [x] Gemeten dat de dekking niet wegvalt: `next/types/global.d.ts` komt transitief binnen (levert
      `declare module '*.scss'`), en er zijn geen statische image-imports die `next/image-types/global`
      nodig hebben. Resultaat 677 bestanden, exit 0
- [x] `next-env.d.ts` in de `exclude` van `tsconfig.lint.json`, en de `"//"`-comment herschreven zodat
      hij beschrijft wat er werkelijk gebeurt
- [x] #74: het paginatal gemeten (89) en omgezet van een print naar een toets in `lint-web.ps1`, met
      een ondergrens die ook blokkeert als het getal onleesbaar is
- [x] De keuze uit stap 2 van de lock gemaakt: drempel in `lint-web.ps1`, niet als ratchet in de
      testsuite — de suite heeft de build-output niet, en dit is de plek waar de meting al stond
- [x] Negatief getoetst: ondergrens tijdelijk op 999 → exit 1 met de daling-melding; regex opzettelijk
      kapot → exit 1 met de onleesbaar-melding. Beide daarna teruggezet
- [x] De gemeten onwaarheid over `next-env.d.ts` gecorrigeerd in `CLAUDE.md` én in de header van
      `lint-web.ps1`, waar dezelfde bewering bleek te staan
- [x] De poort integraal groen gedraaid: exit 0, 89 pagina's, ondergrens gehaald

### Where I left off

Alles is af en de poort staat groen. Wat na de merge nog gebeurt: PR openen, CI afwachten, mergen en
folden — deze branch raakt `src/`, `public/` noch `src/data/mixes/`, dus de keten loopt door zonder
tussenvraag.

Twee dingen die tijdens deze branch zijn opgevallen en hier níet bij horen:

- CI draait `lint-web.ps1` op ubuntu zonder `.next` en zonder `next-env.d.ts`. Na deze wijziging
  checkt de poort daar hetzelfde als lokaal — dat is precies het doel, maar het is pas ná de merge in
  CI te zíen.
- De ondergrens 89 is de stand van vandaag. Bij de eerstvolgende mix die pagina's toevoegt meldt de
  poort dat hij verhoogd mag worden; dat is bedoeld gedrag, geen storing.
