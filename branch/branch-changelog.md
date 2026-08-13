## `docs/releases-drie-roots` changelog

### Branch title

De releases-map krijgt de drie reader-genoemde roots van de bron

### Branch ID

20260813-110240

### Branch type

docs

### What does the change on this branch bring to main?

`releases/` had twee mappen waar de bron er drie heeft, en de tweede droeg de verkeerde naam. Nu staan
er `development/`, `audience/` en `github/`, met een `releases/README.md` die per root zegt wie de lezer
is en wat er dus in hoort.

**Elke root onder `releases/` noemt zijn lezer, en `highlights/` deed dat niet.** Die naam zei hoe het
document geschreven was — met highlights — in plaats van voor wie het bedoeld was. De bron maakte
dezelfde fout met zijn eigen `releases/notes/` en repareerde die op 2026-08-12; deze repo liep er precies
één dag achter. `highlights/` → `audience/` is met `git mv` gedaan, en alle 23 bestanden zijn door git
als rename herkend: de historie per document blijft dus intact. De **inhoud** van die 23 documenten is
niet aangeraakt. Noemt een oudere note in zijn tekst nog `releases/highlights/`, dan is dat wat er stond
op de dag dat hij uitging — een gepubliceerd record beweegt niet mee, en dat is dezelfde afweging die de
bron bij zijn eigen rename maakte.

**`releases/github/` is nieuw, en die map moest er komen ook al declareert deze repo hem niet.** Het pad
staat **hardcoded** in de `cut-release.ps1` van de bron (regel 792) en niet in een seam, bewust: een
nieuwe root heeft geen bestaande plaatsing om te accommoderen, dus wie er ooit van afwijkt kost dat één
functie in plaats van een migratie. Voor deze repo betekent het dat er niets te configureren valt maar de
naam wel vaststaat.

**Twee echte storingen in de GitHub-Release-stap zijn onderweg opgevallen en meegerepareerd.** Beide
lagen klaar in de Release Workflow zoals die er stond:

1. **De body kon afgekapt worden.** Stap 12 gaf de volledige `development/`-note als `--notes-file` mee,
   en `gh` kapt een release-body af op **125.000 tekens**. Een volledig per-PR record kan daar langs. De
   body is nu de korte aankondiging uit `github/`, en het record is bijlage geworden — precies de reden
   waarom die root in de bron bestaat.
2. **De tweede bijlage-upload zou botsen.** Alle drie de documenten van een release heten `<versie>.md`,
   dus twee ervan rechtstreeks uit `releases/` uploaden geeft `HTTP 404` op de tweede. De `file#label`-
   syntax van `gh` lost dat niet op — die zet het label, niet de bestandsnaam. Stap 14 kopieert ze nu
   eerst naar `v<versie>-development-notes.md` en `v<versie>-release-note.md`. Dit werd nooit geraakt
   omdat er tot nu toe maar één bijlage was; met drie roots was het de eerste keer geweest.

**Wat het handgeschreven document hier wél en niet heeft, staat er nu bij.** `Get-ReleaseAudienceTier`
staat op **1**, dus er komt geen sectie *voor consumenten* in: dat is tier 2, en bezoekers van
djcylow.com lezen geen release notes. Wat overblijft zijn de twee organisatie-secties — wat het waard is,
en wat er bij die release nog open stond. Die tweede in de verleden tijd, want het document wordt als
bijlage gepubliceerd en een zin in de tegenwoordige tijd is binnen een dag achterhaald.

**De structuur is overgenomen, de generator niet — en dat staat er expliciet.** In de bron genereert
`cut-release.ps1` twee van de drie documenten en draft het de derde. Dat script is **niet bruikbaar in
deze repo**: het leest `.claude-plugin/marketplace.json` als bron van waarheid en bumpt elke
`plugin.json` in lockstep, en geen van beide bestaat hier. De gedeelde `cut-release`-skill is dan ook
uitdrukkelijk een checklist die niets uitvoert. Alle drie de documenten blijven hier dus handwerk van
Rendall 🎬, en `releases/README.md` zegt dat nu in plaats van automatisering te suggereren die er niet is.

**De verwijzingen zijn meegelopen, want een rename die dat overslaat maakt dode links.** De
release-branch-scope in de safety-rules van `CLAUDE.md`, stap 6 en de nieuwe stap 7 in de Release
Workflow (met hernummering van 7–14 naar 8–15), de seam-tabel in `CONTRIBUTING.md` — met een rij erbij
voor `github/` — en in de root-`README.md` zowel de mappenboom als de Version-History-alinea. De
toelichting bij `Get-ReleaseNoteRoot` verantwoordt de rename, en die bij `Get-ReleaseConsumerBumps`
verwijst nu naar het juiste stapnummer.

**Wat bewust niet in deze branch zit.** De 23 `audience/`-documenten volgen nog het oude model: één
register leesbaar Nederlands, zonder secties per lezer. De bron ging op 2026-08-10 over op één document
met een sectie per lezer, na de meting dat de twee losse documenten bij alle twaalf voorgaande releases
over dezelfde wijzigingen gingen — 38% overlap in twee registers. Dat is een herziening van gepubliceerde
**inhoud**, niet van de mapstructuur, en staat als open werk verantwoord in `releases/README.md` en in
`repo-config.ps1`. `releases/github/` is om dezelfde reden niet met terugwerkende kracht gevuld: een
aankondiging voor een moment dat al voorbij is zou verzonnen zijn.

### Significance

#### Tier 0

Wie hier een release cut vindt de drie documenten vanaf nu in de mappen die de hele familie repo's
gebruikt, met per map een antwoord op "voor wie is dit". Daar komen twee storingen bij die klaarlagen en
nooit geraakt waren: een release-body die stil afgekapt kon worden op 125.000 tekens, en een tweede
bijlage-upload die met `HTTP 404` zou falen zodra er meer dan één bijlage was — wat met drie roots de
eerstvolgende keer was geweest.

**Score:** 3

#### Tier 1

De opdrachtgever leest zijn eigen release-document in een map die naar hém genoemd is in plaats van naar
de vorm van de tekst, en `releases/README.md` zegt nu welke twee secties daarin voor hem bedoeld zijn.
Aan de site, de mixen of het werk zelf verandert niets.

**Score:** 2

### Pull Request

