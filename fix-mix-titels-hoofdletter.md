### Kleine letter in vijf mix-titels gecorrigeerd
**Branch naam** fix/mix-titels-hoofdletter
**Datum merge op main** 2026-07-25
**Branch type** Fix

Vijf `title`-velden begonnen met een kleine kleurnaam, terwijl de veldspecificatie in
`src/data/mixes/README.md` expliciet "Capitalize color (Red, Blue, Purple, etc.)" voorschrijft.
Omdat `title` SEO-kritisch is (mix-kaarten, de `<h1>` van de detailpagina en de metadata) is dit
zichtbaar op de site zelf.

- `full-green.json` — `green Full (m)` → `Green Full (m)`, `green Full (f)` → `Green Full (f)`
- `full-yellow.json` — 3 × `yellow Full (m)` → `Yellow Full (m)`

Alleen de beginletter is aangeraakt; geen enkele titel verandert van vorm of inhoud, en er is niets
aan de JSON-opmaak gewijzigd.

**Bewust niet meegenomen.** Dit is de kleine, veilige helft van een groter beeld dat bij deze
gelegenheid is opgemeten: van de 85 mixen volgen er **2** het "new standard"-titelformaat uit de
veldspec (`[Subgenre] · [Color] [Power] ([Frequency]) Mix · Vol. [N]`). De overige 83 dragen het
legacy-format, dat de spec voor oude entries ook uitdrukkelijk toestaat — het is dus geen bug maar
een migratie die nooit is uitgevoerd. 77 daarvan zijn volledig uit de losse velden te
reconstrueren; de 8 die dat niet zijn, zijn precies de `ignore: true`-preview-entries en tellen
niet mee voor de publieke playlist.

Die migratie is bewust een aparte beslissing gebleven: het herschrijft 75 SEO-titels in één keer,
en in minstens één record spreken de titel en het `frequency`-veld elkaar tegen (`green Full (m)`
tegenover `frequency: (f)`), zodat eerst bepaald moet worden welke van de twee leidend is.
