## `config/onderhoud-deno-engines-ci` progress

### Steps

- [x] De vier punten van #94 gemeten in plaats van overgenomen: `deno.lock` is getrackt en er is geen
      `netlify/edge-functions/`, er staat geen `engines` en geen `.npmrc`, en `ci.yml` heeft geen
      `concurrency` en geen `timeout-minutes`
- [x] `deno.lock` untracked en in `.gitignore`, met de reden dat hij aantoonbaar stale was — hij
      noemde nog `@tailwindcss/postcss`
- [x] `engines` (`>=22.15.1 <23`) in `package.json` en `engine-strict=true` in `.npmrc`, met de
      afweging range-versus-pin in het bestand zelf
- [x] Getoetst dat `engine-strict` geen dependency blokkeert op zijn eigen `engines` — dat is het
      echte risico van die vlag: `npm ci` slaagt, 504 packages
- [x] Negatief getoetst: `engines` tijdelijk op `>=99.0.0` gaf `EBADENGINE` en exit 1, daarna
      teruggezet. De diff van `package.json` is precies drie regels, dus geen formatting-schade
- [x] `concurrency` met `cancel-in-progress` en `timeout-minutes: 10` in `ci.yml`, mét de kanttekening
      dat dit ook voor `main` geldt en waarom dat hier acceptabel is
- [x] De jobnaam `poort` ongemoeid gelaten — dat is de required-check-context van de ruleset
- [x] `CLAUDE.md` bijgewerkt bij de `ci.yml`-beschrijving
- [~] Punt 1 van #94 (de dode dependencies) — bewust niet in deze branch. Het issue vraagt daar zelf
      een eigen PR voor omdat het `package.json` en dus de build raakt, en dat is een verstandige
      splitsing: deze branch is terug te draaien zonder de dependency-boom te beroeren
- [~] Punt 5 van #94 (`npm audit`, 9 high) — het issue stelt zelf vast dat geen ervan aantoonbaar
      bereikbaar is en adviseert dit "zonder haast" bij een volgende ronde. #94 blijft daarvoor open

### Where I left off

Af, de poort groen. Raakt `package.json`, `.npmrc`, `.gitignore`, `ci.yml` en `CLAUDE.md` — geen
site-werk, dus de keten loopt door tot en met de fold.

**#94 blijft open**: punt 1 (dode dependencies) krijgt een eigen branch, en punt 5 (`npm audit`) is
bewust uitgesteld. Beide staan hierboven als `[~]`.

Eén ding om te weten na deze merge: door `engine-strict` faalt `npm ci` voortaan hard op een andere
Node-major. Dat is de bedoeling, maar het is wel nieuw gedrag — draait er ooit een machine op Node 24,
dan is dat vanaf nu een foutmelding in plaats van stilte.
