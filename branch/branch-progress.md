## `docs/audit-correcties` progress

### Steps

- [x] Chris' lens: de twee redenen die de PR-grens wél dragen (#84)
- [x] Vijftien lenzen naar het bestand dat er werkelijk staat — per lens gecontroleerd (#90)
- [x] `repo-config.ps1`: testaantal, branch protection, en de major-recap-tegenspraak (#89)
- [x] `CONTRIBUTING.md`: het blok dat opdracht gaf tot werk aan een lege seam (#85)
- [x] `src/data/mixes/README.md`: titelformaat op vier plekken, plus de i18n-branchstatus (#88)
- [x] `CLAUDE.md`: vijf punten uit #87 (pijler-tabel, `npm run lint`, ESLint-in-de-poort,
      de release-taakverdeling, en de verouderende tellingen)
- [x] De poort als drie stappen beschreven i.p.v. twee, op drie plekken
- [x] PR-template: de poort op 0/0 plus een regel voor de testsuite
- [x] Lint-poort groen, 71 tests

### Where I left off

Klaar voor PR. Dit is documentatie, dus het loopt door tot en met de fold.

**Twee dingen om te weten bij het mergen:**

1. **`src/data/mixes/README.md` wordt ook door `data/covers-en-afbeeldingspaden` gewijzigd.** Die
   branch corrigeert de twee afbeeldingssecties (`.jpg` → `.webp`, en `required` genuanceerd); deze
   het titelformaat en de i18n-noot. Verschillende plekken in hetzelfde bestand, dus een conflict is
   onwaarschijnlijk maar niet uitgesloten. Merge ze niet gelijktijdig.
2. **`CLAUDE.md` wordt ook door `config/tailwind-eruit` en `config/webp-veiligheid-en-ignore`
   gewijzigd**, eveneens op andere plekken.

#86 (README, zeven punten) is **niet** in deze branch afgerond: de Tailwind-punten daarvan zitten in
`config/tailwind-eruit`, en de rest is nog open. Dat issue blijft dus staan.
