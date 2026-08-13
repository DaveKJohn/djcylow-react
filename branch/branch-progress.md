## `docs/releases-readme-spiegelt-de-bron` progress

### Steps

- [x] De spec gelezen: `life-hub` PR [#239](https://github.com/DaveKJohn/life-hub/pull/239), en de
      portable helft van die repo gediffd tegen de bron om het patroon te meten (7 link-instanties, de
      rest verbatim)
- [x] De taalvraag aan Dave gesteld — deze repo had, anders dan `life-hub`, géén besluit dat `releases/`
      Engels is. Antwoord: Engels verbatim
- [x] Portable helft neergezet en bewezen verbatim: 4154 woorden aan beide kanten, nul verschil na
      normalisatie van de vijf absolute link-substituties
- [x] Repo-eigen helft geschreven met `Get-ReleaseAudienceTier = 1` als uitgangspunt — dat is het
      inhoudelijke verschil met `life-hub`, dat op tier 2 staat
- [x] De seam-waarden nagemeten in `scripts/repo-config.ps1` in plaats van ze van de oude pagina over te
      nemen; drie verouderde beweringen daarbij gecorrigeerd
- [x] De twee repo-eigen extra secties (*Git tags & rollback*, *What gets which version number*) mee naar
      het Engels, want ze staan op dezelfde pagina
- [x] Alle 42 relatieve links en alle 6 anchors nagelopen — geen dode
- [x] De inserter-regex en de major-guardrail uit `release-lib.ps1` getest tegen het resultaat: precies
      één tabelkop, één `#### 2.x` erboven, in de juiste orde
- [x] Het taalbesluit vastgelegd in `CLAUDE.md` (taalsectie), plus de aanleiding van de kolomkop-blockquote
      bij stap 9 bijgesteld zodat die niet meer suggereert dat de rest van de pagina Nederlands is
- [x] Poort groen: `lint-web.ps1` — 0 TypeScript-fouten, build geslaagd, 89 statische pagina's
- [~] Geen duplicaat-inbound naar de bron. Het niet-portable zijn van de portable helft staat al open als
      [#643](https://github.com/DaveKJohn/claude-code-specialists/issues/643) (uit `life-hub`) en dekt twee
      van de drie bridge-paragrafen. Het **vierde** punt — de `CHANGELOG.md`-bewering, die over een
      consumer-bestand gaat en dus als "over jou" leest — is nieuw en staat níet in #643. Vastgelegd op de
      pagina; het versturen wacht op Dave (zie hieronder)
- [~] `CLAUDE.md`'s Release Workflow niet herschreven. De weerlegde "cut-release draait niets zelf" staat
      daar ook nog, maar hoort bij `docs/release-route-naar-script` — daar komt hij met de vijftien stappen
      waar hij bij staat. Op deze pagina is hij wél rechtgezet, met de verwijzing erbij
- [~] De 23 bestaande `audience/`-documenten niet herschreven, en de 60 documenten niet vertaald. Beide
      bewust buiten scope (Dave, 2026-08-13); gepubliceerde documenten en release-titels zijn historie

### Where I left off

Branch is af en de poort staat open. Wat hierna nog aan de orde komt, en niet in deze branch hoort:

- **Eén inbound-punt is voorbereid maar niet verstuurd**, want een issue is naar buiten gericht — zelfde
  afweging als de al liggende melding over de tegenstrijdige `cut-release`-frontmatter in
  `.claude/handover.md`. Het punt: de intro van de portable helft beweert dat het release-blok in
  `CHANGELOG.md` hierheen wijst "voor alles behalve de huidige versie", terwijl dat blok hier is afgeschaft.
  Anders dan de drie punten in #643 gaat dit over een bestand dat de **consumer** bezit, achter een
  relatieve link die oplost — dus het leest als een uitspraak over ons. Advies: sturen, en als comment op
  #643 in plaats van als nieuw issue, want het is hetzelfde onderwerp met een scherper voorbeeld.

- **`config/release-notes-in-het-nederlands` is door dit besluit achterhaald.** Die branch stond gepland om
  `Get-ReleaseNoteWording` en `Get-InternalNoteWording` in het Nederlands te vullen. Nu de map Engels is,
  betekenen lege seams het juiste antwoord en zou die branch de pagina van de bron af bewegen. Wat van het
  punt overblijft is smaller en staat op de pagina: `SectionOpen` is niet cosmetisch, want
  `session-status.ps1` zoekt de open-werk-sectie erop en met Engelse koppen werkt die lookup nu vanzelf.
  Dit is een schrapping van gepland werk, dus het wacht op Dave's woord.
- **`docs/release-route-naar-script`** — de vijf werkpunten uit `.claude/handover.md`, waaronder de
  weerlegde cut-release-bewering in `CLAUDE.md`. Deze branch heeft één van die vijf punten (het tier-model
  dat drie keer voluit stond) gedeeltelijk opgelost: `releases/README.md` schrijft het model niet meer
  zelf, het draagt nu de gedeelde tekst. `CONTRIBUTING.md` beschrijft het nog wel.
