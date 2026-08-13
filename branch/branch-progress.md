## `config/pr-route-gelijk-aan-de-regel` progress

### Steps

- [x] Placeholder op regel 2 vervangen door de canonieke regel die `open-pr` verbatim herkent
- [x] Goedkeuringsvinkje vervangen door de tweedeling van de PR-regel (zichtbaar resultaat / niet)
- [x] De `messages/en.json` + `messages/nl.json`-regel geschrapt — die map bestaat niet en komt niet meer
- [x] Het changelog-vakje naar `branch/branch-changelog.md` gewezen, met de prefix behouden die
      `open-pr.ps1:934` afvinkt
- [x] Prefix-lijst gelijkgetrokken met `scripts/lib/branch-info.ps1` — `chore/` toegevoegd, volgorde gelijk
- [~] `Get-PrDescriptionPlaceholder` vullen — laten vallen (Dave, 2026-08-13). De plugin noemt de
      template-route zelf de juiste voor een nieuw template, en die vraagt geen zesde seam die de
      contract-check niet meldt. `scripts/repo-config.ps1` blijft daarmee onaangeroerd.
- [x] Lint-poort gedraaid: `scripts\lint\lint-web.ps1` — 0 fouten, 89 statische pagina's
- [x] Edith's blik: template nagelopen op tegenspraak met de PR-regel en op dode verwijzingen. Dat leverde
      de prefix-drift hierboven op, die eerst niet in scope zat

### Where I left off

Het werk op deze branch is af en de poort staat open. Wat hierna komt valt buiten de stappenlijst omdat het
pas ná de push bestaat: de PR openen, de CI-run afwachten, mergen en de entry folden.

**Deze PR loopt door** — hij raakt `.github/` en niets in `src/`, `public/` of `src/data/mixes/`, dus geen
zichtbaar resultaat en geen wachtmoment. Dat is meteen de eerste PR die zijn eigen nieuwe vakje gebruikt.

**Twee dingen om bij de PR op te letten**, omdat ze precies hier zichtbaar worden:

1. **Of de beschrijving nu wél in de body komt.** Dat is de hele inzet van deze branch en het bewijs komt
   pas bij het openen. Blijft de body leeg, dan matcht de placeholder alsnog niet en is het regel 2 die
   niet klopt — niet de entry.
2. **De versie-as.** Het install record voor deze repo staat op plugin 4.7.0
   (`installed_plugins.json:80-88`), maar de `new-branch`-skill laadde uit **4.8.0**, een cache-versie
   zonder enig install record. Voor deze branch maakt het niets uit — de drie placeholder-defaults zijn in
   beide versies byte-identiek — maar het is de as die hier eerder een verkeerde conclusie opleverde, en
   het staat nergens in de repo opgeschreven.

**Eén vraag bewust niet beantwoord in deze branch:** of het `## Type wijziging`-blok zijn plek verdient. De
plugin meet in de bron dat zo'n blok altijd één van de opties aangevinkt krijgt, dat de entry het onder
`### Branch type` al zegt, en dat het GitHub-label uit `Get-BranchInfo` komt in plaats van uit het vinkje —
maar de plugin zegt er in één adem bij dat de méting reist en het antwoord niet. Die meting over de PR's van
deze repo is hier niet gedaan, dus het blok is gecorrigeerd en niet geschrapt.
