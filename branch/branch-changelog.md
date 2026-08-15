## `docs/welke-scriptkopie-draait` changelog

### Branch title

Borg welke kopie van een gedeeld workflow-script hier draait

### Branch ID

20260815-111453

### Branch type

docs

### What does the change on this branch bring to main?

De sectie **Scripts** in `CLAUDE.md` zegt nu waarvandaan een gedeeld workflow-script draait. Er staan
twee kopieën van elk script op de machine — de **plugin-cache** met de uitgebrachte release, waar
`${CLAUDE_PLUGIN_ROOT}` naar wijst en die dus werkelijk uitvoert, en de **marketplace-clone**, de
bron-checkout die vóórloopt met alles wat sinds de laatste cut is gemerged. De regel is **cache om te
dráaien, marketplace om te lézen**: die tweede is waar `.claude/specialists/SPECIALISTS.md` de persona's
vandaan `@`-importeert, en dat is daar juist. Het makkelijkste advies staat erbij: roep de skill aan in
plaats van het script, want elke skill print zijn eigen commando met de volledige cache-URL erin.

Daar hoort de verantwoording bij, want deze val is op 2026-08-15 dichtgelopen: een `open-pr.ps1` uit de
clone zocht de changelog-entry op `workflow-davekjohn/branch/` — een verplaatsing die in de bron zit maar
nog niet is uitgebracht — en faalde met *"the entry's title section is empty"* terwijl de entry gevuld
was. De conclusie die daaruit rolde was dat déze repo achterliep en zijn `branch/`-map moest verhuizen;
het omgekeerde was waar, en die migratie is ingetrokken vóór er iets verplaatst was. De alinea legt
daarom óók vast dat `branch/` blijft staan zolang de cache hem daar leest, en dat dit géén inbound-issue
voor de bron is: een bron-checkout die vóórloopt is precies wat een bron-checkout hoort te zijn.

De bestaande waarschuwing in `CONTRIBUTING.md` is meegenomen in plaats van herhaald. Die stond er sinds
2026-08-13 en heeft de val niet gevangen, want hij dekte alleen de **versie-as** (welke versie staat er
geïnstalleerd). De **map-as** — welke van twee bomen lees je — is er nu naast gezet, met een verwijzing
naar de regel in `CLAUDE.md` in plaats van een tweede formulering ervan.

### Significance

#### Tier 0

Voorkomt een verkeerde diagnose over de repo zelf, en dat is een zwaardere fout dan een verouderd
script: de vorige keer leidde hij tot een voorgestelde verhuizing van `branch/` die de repo vooruit zou
laten lopen op een ongereleasede wijziging, waarna de geïnstalleerde 4.8.0 de bestanden niet meer zou
vinden. De waarschuwing die dit had moeten vangen stond er al en dekte de verkeerde as, dus de kans op
herhaling was aantoonbaar, niet hypothetisch.

**Score:** 3

#### Tier 1

N/A — dit raakt de werkwijze van wie in deze repo werkt, niet het product. `djcylow.com` levert dezelfde
pagina's.

**Score:** N/A

### Pull Request

