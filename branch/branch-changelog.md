## `docs/vooruitlopende-main-en-scriptkopie` changelog

### Branch title

Twee valkuilen die deze week zijn gemeten staan nu opgeschreven

### Branch ID

20260815-164708

### Branch type

docs

### What does the change on this branch bring to main?

Twee dingen die deze week gemeten zijn maar alleen in een sessie stonden, staan nu in de documenten.

**`CONTRIBUTING.md` waarschuwt bij stap 1 dat een vooruitlopende `main` meereist.** Takt een branch af
van een lokale `main` die vóór ligt op `origin` — hier de normale stand, want de fold-commit blijft
bewust lokaal — dan draagt hij die commits mee, en bij de merge landen ze allemaal op `origin/main`
zonder dat er ooit `git push origin main` is gedraaid. Gemeten bij PR #108 (negentien commits) en
opnieuw bij #109. Er gaat niets stuk, maar het verklaart waarom `main` na een merge ineens gelijkloopt
terwijl niemand heeft gepusht; wie dat niet weet, gaat zoeken naar een push die niet bestaat. Met de
uitweg erbij: `git checkout -b <naam> origin/main` als je die commits niet wilt meedragen.

**`CLAUDE.md` krijgt het tweede gemeten geval van de cache-versus-marketplace-val**, en dat is de
nuttige kant ervan. `session-status.ps1` uit de cache print de open issues als één regel
`#System.Object[]`, gereproduceerd onder Windows PowerShell 5.1 waar `ConvertFrom-Json` een JSON-array
als één object teruggeeft. De reflex is een `inbound`-issue; de marketplace-clone laat zien dat de bron
het al heeft gerepareerd, en die reparatie is hier nagemeten onder 5.1 (29 issues, correct
geformatteerd). Het onderscheid bespaarde dus een overbodig issue, waar het de vorige keer een
verkeerde repo-brede verhuizing tegenhield.

**En de poortbeschrijving in `CONTRIBUTING.md` is bijgewerkt**: die noemde alleen `tsc` en de build,
terwijl ESLint er sinds 2026-08-14 in zit en de paginadrempel sinds gisteren.

### Significance

#### Tier 0

Twee valkuilen die allebei tot een verkeerde diagnose leiden in plaats van tot een foutmelding: zoeken
naar een push die niet bestaat, en een inbound-issue indienen voor iets dat al gerepareerd is. Precies
het soort kennis dat anders per sessie opnieuw wordt ontdekt.

**Score:** 3

#### Tier 1

Documentatie over de eigen werkwijze; buiten de mensen die in deze repo werken merkt niemand er iets
van, en de site verandert niet.

**Score:** N/A

### Pull Request

