## `docs/contributing-en-branch-readme` progress

### Steps

- [x] `CONTRIBUTING.md` geschreven: de lokale helft, met de seam-tabel, de prefix-tabel plus Dave's
      taxonomie-noot, de zeven stappen, het tier-model en de poorten
- [x] `branch/README.md` geschreven als Nederlandse lens (het enige bestand dat `branch/` hier nog
      miste ten opzichte van de bron)
- [x] De cyclus uit `CLAUDE.md` gehaald (ruim 180 regels) en vervangen door een verwijzing; de
      inleiding legt uit waarom dit geen tweede werkwijze-document is zoals de oude `workflow/`-map
- [x] `Get-ReservedRootMd` uitgebreid met `CONTRIBUTING.md`, met de toelichting bijgewerkt
- [x] Het tier-blok gerepareerd tijdens de verhuizing (tier 0 + tier 1, ladder vervallen) en de noot
      in `scripts/repo-config.ps1` bijgewerkt die deze correctie nog als openstaand werk aankondigde
- [x] Kruisverwijzingen nagelopen: `scripts/lib/branch-info.ps1`, `scripts/repo-config.ps1`,
      `.claude/specialists/SPECIALISTS.md` en de mappenboom in `README.md`
- [x] Alle gelinkte paden op bestaan geverifieerd
- [ ] **Wacht op de twee branches onder deze.** Zodra `docs/entry-model-migratie` en
      `config/seam-adoptie` gemerged en gevouwen zijn: `main` in deze branch mergen, en bij het
      conflict op de twee `branch/`-bestanden de versie van *deze* branch houden. Pas daarna mag de
      PR. Deze branch is bewust nog niet PR-klaar, om dezelfde reden als `config/seam-adoptie`.

### Where I left off

Het schrijfwerk is af; de branch staat lokaal en is nog niet gepusht.

**Deze branch is gestapeld op `config/seam-adoptie`**, dus op `main` staat de map `branch/` nog niet.
Aftakken van `main` zou de twee vaste entry-paden opnieuw aanmaken en bij de tweede merge een
add/add-conflict geven; dat is de reden dat de stapel bestaat. De keerzijde is de openstaande stap
hierboven.

**Wat er bij de merge te verwachten valt.** `CLAUDE.md` wordt op deze stapel drie keer aangeraakt —
`main` (PR #25), `docs/entry-model-migratie` (herschrijving) en deze branch (de verhuizing) — dus reken
op een conflict daar. De twee `branch/`-bestanden conflicteren zeker: `main` heeft ze na de fold in de
reset-staat, deze branch draagt de entry hierboven. Houd in beide gevallen de versie van deze branch en
laat de fold daarna zijn werk doen.

**Twee dingen die op de vervolglijst blijven staan** en hier bewust niet zijn meegenomen:

- Of `Get-EntrySignificanceRubricLevels` eigen woorden nodig heeft nu het publiek het management is in
  plaats van ontwikkelaars. Dat is een keuze, geen meting, en hij hoort gesteld te worden in plaats van
  stil gemaakt. De vijf banden staan nu in eigen woorden in `CONTRIBUTING.md`, inhoudelijk gelijk aan
  de gedeelde default.
- De kern-bevindingen voor de inbound-route uit `config/seam-adoptie`. Niets nieuws op deze branch:
  inbound #615 is in v4.5.0 gerepareerd en dat is in `branch/README.md` vastgelegd zoals het nu werkt.
