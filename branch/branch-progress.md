## `docs/releases-drie-roots` progress

### Steps

- [x] De bron uitgelezen: drie reader-genoemde roots (`development/`, `audience/`, `github/`) plus een
      `releases/README.md` met een draagbare helft boven de streep en een repo-eigen helft eronder
- [x] Nagegaan of `releases/github/` een seam heeft — die is er niet: het pad staat hardcoded in
      `cut-release.ps1` regel 792, bewust, omdat een nieuwe root geen bestaande plaatsing hoeft te
      accommoderen
- [x] `releases/highlights/` → `releases/audience/` via `git mv` (23 mappen, 23 bestanden; alle 23
      door git als rename herkend, dus de historie per document blijft intact)
- [x] `releases/github/` aangemaakt met een `.gitkeep`, want git trackt geen lege map
- [x] `Get-ReleaseNoteRoot` in `scripts/repo-config.ps1` op `releases/audience`, met de rename
      verantwoord en de reden waarom `github/` daar géén knop krijgt
- [x] `releases/README.md`: "Twee versies per release" vervangen door de drie roots, de
      `gh`-commando's herschreven, en de stappenlijst uitgebreid met de aankondiging
- [x] `CLAUDE.md`: de release-branch-scope in de safety-rules, stap 6 (audience), een nieuwe stap 7
      (aankondiging) en hernummering van 7–14 naar 8–15
- [x] `CONTRIBUTING.md`: de seam-tabel wijst naar `releases/audience/`, met een rij erbij voor
      `releases/github/`
- [x] `README.md` (root): de mappenboom en de Version-History-alinea
- [x] Gecontroleerd op achtergebleven verwijzingen en dode links — de twee resterende treffers zijn
      bewust historisch (de titel van v2.20.1 en twee oude development-notes)
- [x] De poort gedraaid: `scripts/lint/lint-web.ps1` groen, 0 fouten, 89 statische pagina's
- [~] Het documentmodel van de 23 bestaande `audience/`-documenten omzetten naar het
      één-document-met-secties-per-lezer van de bron — **bewust niet in deze branch.** Dit is een
      herziening van gepubliceerde inhoud, niet van de mapstructuur, en de opdracht ging over de
      structuur. Staat verantwoord in `releases/README.md` en in `repo-config.ps1`
- [~] `releases/github/` met terugwerkende kracht vullen voor de 37 bestaande releases — **niet
      gedaan, en niet te doen**: een aankondiging voor een moment dat al voorbij is zou verzonnen
      zijn. De eerste komt bij de eerstvolgende release

### Where I left off

Klaar. De branch is af, de poort is groen en er staat niets meer open dat bij deze opdracht hoort.

Twee dingen om te weten voor wie hierna verder gaat:

1. **Deze branch is gestapeld op `docs/contributing-en-branch-readme`**, die zelf nog niet gemerged
   is. Dat moest, want `Get-ReleaseNoteRoot` bestaat pas sinds commit `aa54f66` op die branch — een
   branch vanaf `main` had de seam niet gehad en zou bij de merge botsen op de waarde die daar net is
   gezet. De onderliggende branch gaat dus eerst.
2. **Het documentmodel is de openstaande helft.** De mapstructuur loopt nu gelijk met de bron; de 23
   `audience/`-documenten volgen nog het oude model van één register zonder secties per lezer. Dat is
   eigen werk voor een eigen branch.
