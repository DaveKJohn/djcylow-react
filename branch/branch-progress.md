## `docs/release-route-volgt-de-bron` progress

### Steps

- [x] De bron gelezen in plaats van geinterpreteerd: `CLAUDE.md` regel 365-378 (de release-commit als
      uitzondering 2, "deliberately no branch/PR") en 781-797 (de bump volgt de hoogste tier)
- [x] Uitzondering 2 in de safety-rules herschreven: release-commit in plaats van release-branch, met de
      reden van Dave uit de bron en de harde voorwaarde "schone tree" in plaats van een scope-lijstje
- [x] De Release Workflow van vijftien stappen naar zeven, met een tabel die per taak zegt wie hem doet
- [x] De versienummertabel vervangen door de tier-regel, met tier 1 als audience vastgelegd
- [x] De skill-beschrijving van `cut-release`: de twee botsingen zijn beslecht in plaats van "wacht op
      Dave", met `-SkipTierGate` erbij
- [x] De stand van de vier pijlers bijgewerkt op twee plekken, met de twee redenen waarom site-werk
      alsnog wacht
- [x] De deploy-preview-vondst vastgelegd, inclusief dat PR #33 hem voor het eerst als bewijs gebruikte
- [x] `releases/README.md` bijgewerkt: het aangekondigde werk is gedaan, en de bewering dat de drie
      documenten met de hand worden geschreven is niet meer waar
- [x] Twee verouderde versienummers meegenomen (`2.22` -> `2.23` in `releases/README.md`, en hetzelfde in
      het verantwoordingsblok van `repo-config.ps1`). ASCII-conventie nagemeten: 0 non-ASCII bytes
- [x] Ankers nagelopen: alle vijf `](#...)`-verwijzingen in `CLAUDE.md` wijzen naar een bestaande kop
- [x] Poort en testsuite gedraaid

### Where I left off

Deze PR raakt `CLAUDE.md`, `releases/README.md`, `scripts/repo-config.ps1` en de twee `branch/`-bestanden
— niets in `src/`, `public/` of `src/data/mixes/`, dus hij **loopt door**.

**Hiermee zijn Dave's drie antwoorden van vanavond alle drie uitgevoerd**: `cut-release` mag en moet
draaien (deze branch), de bump volgt de tier zoals de bron (deze branch), en de testsuite, `.nvmrc` en de
ruleset staan er (PR #33 plus de ruleset `main-ci-gate`).

**Wat nog nooit is gebeurd en het echte restrisico is: er is nog geen release met `cut-release` gecut.**
De route staat nu opgeschreven zoals het script werkt, maar dat is gelezen uit de code en niet gemeten in
een echte run. De eerstvolgende cut is dus tegelijk de eerste test ervan. Twee dingen om dan op te letten:
de development-note houdt de branchnaam als kop, en het script stageert met `git add -A`.

**Een inbound-kandidaat voor de bron, niet verstuurd want een issue openen is naar buiten gericht:** laat
de bron zijn eigen antwoord formuleren als *"the source repo answers 2"* in plaats van *"this repo answers
2"*. Nu wordt die zin onwaar zodra hij gespiegeld wordt, en geen diff kan dat vinden omdat beide kopieen
byte-identiek blijven.

**Twee defecten uit PR #33 staan nog open en zijn Dave's beslissing:** 25 live mixen met een gebroken
`image_square` (zichtbaar op de Music Mood Colours-pagina) en 25 live mixen op de legacy R2-bucket.
