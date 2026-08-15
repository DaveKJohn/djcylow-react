## `docs/welke-scriptkopie-draait` progress

### Steps

- [x] Verifieer de dragende feiten van de lock tegen de repo: noemt `CLAUDE.md` een van beide paden
      (nee), wijzen `SPECIALISTS.md` r.9/r.64 naar de marketplace (ja), bestaan beide bomen (ja)
- [x] Meet het verschil in plaats van het aan te nemen: `workflow-davekjohn/branch` komt 5× voor in
      `entry-scaffold-lib.ps1` van de clone en 0× in cache 4.8.0
- [x] Schrijf de alinea in de sectie **Scripts** van `CLAUDE.md`, boven de opsomming van de skills
- [x] Scherp de bestaande noot in `CONTRIBUTING.md` aan met de map-as, verwijzend naar `CLAUDE.md`
      in plaats van de regel te herhalen
- [x] Controleer dat de nieuwe interne link `CLAUDE.md#scripts` bestaat

### Where I left off

De alinea staat in beide bestanden. Wat afweek van de lock en hardop is gemeld: `CONTRIBUTING.md` zei
al *"de scripts draaien uit de cache"* (sinds `3b4cd1c`, 2026-08-13), terwijl de lock aannam dat die
pagina het verschil onbenoemd liet. De repo won, dus die kant is aangescherpt in plaats van
overgeschreven.

Wat bewust buiten deze branch blijft: de verhuizing van `branch/` naar `workflow-davekjohn/branch/`.
Die bestaat in de bron maar is niet uitgebracht; hij hoort pas te gebeuren als een release hem levert,
en dan in één keer mét `CONTRIBUTING.md`, `.github/pull_request_template.md` en `branch/templates/`.
`CHANGELOG.md` en `releases/development/2.x/2.23.0.md` blijven daarbij staan — historie.
