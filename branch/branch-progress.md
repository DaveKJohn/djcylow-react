## `docs/releases-drie-roots` progress

### Steps

**Ronde 1 — de drie roots (2026-08-13)**

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

**Ronde 2 — de rest van "precies zo als de bron" (2026-08-13, opdracht van Dave)**

- [x] De bron opnieuw naast deze repo gelegd, nu op álle assen. Zeven verschillen gevonden: twee
      functioneel (Nederlandse kolomkoppen, geen `<n>.x`-kop), één structureel (de pagina volgt het
      mirror-model niet), twee legitiem (grouping per minor, documentmodel) en twee non-issues
      (`.gitkeep`, `Get-ReleasePluginTier` ongedeclareerd)
- [x] Scope-keuze aan Dave voorgelegd, want de grouping is géén afwijking die gerepareerd hoort — de
      bron laat `<dir>` uitdrukkelijk voor beide waarden staan. Hij koos **volledig gelijktrekken**,
      inclusief de verhuizing, en het documentmodel bewust buiten deze branch
- [x] Collision-check vóór de verhuizing: 37 unieke basenames in `development/`, 23 in `audience/` —
      geen enkele botsing bij het samenvoegen tot één map per root
- [x] **60 documenten** met `git mv` naar `2.x/` (37 development, 23 audience), lege mappen opgeruimd;
      geen letter aan hun inhoud aangeraakt
- [x] `Get-ReleaseNotesGrouping` op `'major'`, met in de toelichting dat dit de enige seam in dat
      bestand is die van *afgelezen* naar *gekozen* ging, plus wat er meebeweegt bij een terugdraai
- [x] De twee andere seam-toelichtingen in `repo-config.ps1` bijgetrokken (`Get-ReleaseNoteRoot` en
      `Get-ReleaseConsumerBumps`), want die beschreven nog de boom van 23 mappen
- [x] Kolomkoppen van de overzichtstabel naar het Engels en een `#### 2.x`-kop erboven — machine-gelezen
      sleutels, geen proza. Beide versies door de gedeelde `release-lib.ps1` gehaald als bewijs:
      **oud `$null`/`$null`, nieuw `'2'`/`'#### 2.x'`**
- [x] Alle 37 rijen herschreven naar `2.x/`, en de Versie-cel naar het leesbaarste document per release:
      `audience/` bij de 23 minors en de major, `development/` bij de 14 patches
- [x] `releases/README.md` omgebouwd naar het mirror-model van de bron: portable helft, horizontale
      streep, repo-slot met de vijf subsecties inclusief *Hoe je deze pagina mirrort*. Taal Nederlands
      gehouden en de inhoud waar voor deze repo — zie de entry voor de afweging. Niets uit de oude pagina
      is verdwenen: de tag/rollback-uitleg en de SemVer-tabel staan nu onder de streep
- [x] De bewering "`cut-release.ps1` is niet bruikbaar in deze repo" teruggenomen: het script in de
      plugin is byte-identiek aan dat van de bron (`diff -q`, ook op `release-lib.ps1`) en gate't de
      marketplace-afhankelijkheid achter `Get-ReleasePluginTier`, hier `false`. In principe draaibaar;
      of het schoon doorloopt is **niet gemeten** en staat er nu ook zo
- [x] `CLAUDE.md` (paden in de release-branch-scope en de stappen 5/6/7/13/14, plus een waarschuwing bij
      stap 9 over de Engelse kolomkoppen) en `CONTRIBUTING.md` (de grouping-rij) meegetrokken
- [x] Gecontroleerd op achtergebleven `<X.Y>`-paden buiten de gepubliceerde documenten — niets meer
- [x] De poort opnieuw gedraaid: `scripts/lint/lint-web.ps1` groen, 0 fouten, 89 statische pagina's

**Bewust niet gedaan**

- [~] Het documentmodel van de 23 bestaande `audience/`-documenten omzetten naar het
      één-document-met-secties-per-lezer van de bron — **bewust niet in deze branch**, in ronde 2
      expliciet aan Dave gevraagd en door hem bevestigd. Dit is een herziening van gepubliceerde inhoud,
      niet van de mapstructuur. Staat verantwoord in `releases/README.md` en in `repo-config.ps1`
- [~] `releases/github/` met terugwerkende kracht vullen voor de 37 bestaande releases — **niet
      gedaan, en niet te doen**: een aankondiging voor een moment dat al voorbij is zou verzonnen
      zijn. De eerste komt bij de eerstvolgende release
- [~] De gedeelde `cut-release.ps1` hier daadwerkelijk proefdraaien. Dat zou een release cutten en valt
      dus buiten deze branch; het is de open vraag achter de nuance hierboven

### Where I left off

Klaar. `releases/` is nu op elke as gelijk aan de bron behalve het documentmodel, en dat verschil is een
gedragen keuze van Dave in plaats van een achterstand. De poort is groen en de guardrail-meting is
reproduceerbaar.

Drie dingen om te weten voor wie hierna verder gaat:

1. **Deze branch is gestapeld op `docs/contributing-en-branch-readme`**, die zelf nog niet gemerged is —
   en die weer op `config/seam-adoptie` en `docs/entry-model-migratie`. Dat moest, want
   `Get-ReleaseNoteRoot` bestaat pas sinds commit `aa54f66`. De keten gaat dus van onderop.
2. **Het documentmodel is de openstaande helft**, nu als expliciet uitgestelde keuze. Eigen werk voor een
   eigen branch.
3. **De Engelse kolomkoppen van de overzichtstabel zijn geen slordigheid.** Wie ze "verbetert" naar het
   Nederlands zet de rij-inserter en de new-major-guardrail stil uit. `CLAUDE.md` stap 9 en
   `releases/README.md` zeggen dat nu op beide plekken.
