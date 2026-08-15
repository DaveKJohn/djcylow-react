## `docs/release-v2240-audience-document` progress

### Steps

- [x] `What it is worth` geschreven: de drie soorten opbrengst, in de eenheid van de organisatie
- [x] `What was still open at this release` geschreven, in de verleden tijd — #68 plus de twee open beslissingen
- [x] De gegenereerde `For whom`-regel gecorrigeerd: hij beloofde een consumer-sectie die er niet is
- [x] Gecontroleerd dat er geen link naar `development/` of `internal/` in staat (test 7 van de zeven)

### Where I left off

De cut zelf is af en gepusht: commit `ef98b04` en tag `v2.24.0` staan op `origin`. Wat na de merge van
deze branch nog volgt is stap 5 van de `cut-release`-checklist — de GitHub Release aanmaken met
`releases/github/2.x/2.24.0.md` als body, met de development-note en dit document als bijlagen onder
unieke bestandsnamen (alle drie heten `2.24.0.md`, dus de tweede upload botst anders met HTTP 404).

Eén waarneming voor de inbound-route, niet op deze branch te repareren: het gedeelde
`cut-release.ps1` weet dat geen entry tier 2 haalde — het meldt dat in zijn uitvoer en laat de
consumer-sectie terecht weg — maar schrijft desondanks de vaste `For whom`-regel die twee secties
aankondigt. Dat is een correctie in de bron, niet hier.

