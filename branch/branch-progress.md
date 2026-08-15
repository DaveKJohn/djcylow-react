## `docs/mixspec-klopt-met-de-data` progress

### Steps

- [x] `permalink` herschreven van "legacy field, not used for routing" naar wat het is: de bron van de
      URL, met de echte afleiding en de vier regels die de testsuite afdwingt
- [x] Geverifieerd dat de afleiding die de spec voorschreef (uit `id`, `color`, `power`, …) nergens in
      de codebase bestaat — het was geen verouderde beschrijving maar een instructie naar niets
- [x] De legacy-bucketzin op de gemeten stand gezet: 25 Full-entries over zeven bestanden, niet "some
      mixes in full-blue.json"
- [x] De volume-regel gekwalificeerd met het gemeten aantal (19 van de 32) en de reden waarom
      hernummeren juist géén goed idee is
- [x] De audio-naamconventie beperkt tot nieuwe uploads, met de reden waarom dat meer is dan netheid
- [x] Vastgelegd dat previews `tags` mogen weglaten, net als `date`, `volume` en `description`
- [x] Poort groen, 193 tests groen, geen dode links in het bestand
- [~] De **Cyan-emoji** (alle 7 gebruiken 🧊 waar de spec 💠 zegt) — niet aangeraakt. Het issue vraagt
      zelf welke van de twee de bedoeling is, en 7/7 consequent is te consequent om als slordigheid te
      behandelen. Dat is een keuze, geen fout
- [~] De **drie te lange `description_nl`** in `full-red.json` — SEO-tekst op de publieke site, en
      `CLAUDE.md` houdt dat expliciet bij Dave, los van de PR-regel
- [~] De **migratie van de 25 audio-URL's** naar de actieve bucket — het issue vraagt daar zelf een
      eigen, expliciet stuk werk voor, en het raakt R2 buiten deze repo
- [~] De **preview-id-conventies** (vijf varianten over acht entries) — het issue stelt voor die mee te
      nemen bij de `image_square`-fix, en die staat hier niet op de rol

### Where I left off

Af. Alleen documentatie in `src/data/mixes/`, dus de site verandert niet.

Sluit **#69** (het spec-deel; de tests landden al met PR #111) en **#68 punt 1**. **#95 blijft open**
voor de drie beslissingen die het issue zelf bij Dave legt: de Cyan-emoji, de drie descriptions, en de
preview-id's. **#68 blijft open** voor de migratie zelf.
