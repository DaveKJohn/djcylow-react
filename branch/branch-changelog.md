## `config/testsuite-mixdata-en-node-pin` changelog

### Branch title

Testsuite op de mix-data, Node gepind en de CI-poort onontkoombaar

### Branch ID

20260813-225720

### Branch type

config

### What does the change on this branch bring to main?

Deze repo had **nul testsuites** en pinde zijn Node-versie nergens vast. Dat waren twee van de drie
pijlers waar de gedeelde PR-default op leunt. Beide staan er nu.

**36 tests over de mix-data, en ze zijn gemeten in plaats van overgeschreven.** `src/data/mixes/README.md`
beschrijft tientallen veldregels, maar niets hield ze tegen: een fout erin haalt de build (JSON is
geldig, TypeScript tevreden) en wordt daarna op `djcylow.com` zichtbaar. De spec heeft echter een sectie
*"Known Inconsistencies in Legacy Data"*, dus die regels hard afdwingen levert een suite die op dag één
rood staat — en een suite die altijd rood staat bewaakt niets. Daarom is de data eerst gemeten:

- **23 regels haalt de data nu al volledig** en staan als harde assertie: `tracks` gelijk aan
  `tracklist.length`, unieke `id`/`title`/`id_spotify`/`title_spotify`/`description_nl`, `color` met
  hoofdletter en passend bij de bestandsnaam, ISO-`date` die met `jaar`/`maand`/`dag` en `id`
  overeenkomt, `genre` als familie van `subgenre`, 176 bpm voor Drum & Bass, titels onder 60 tekens,
  oplopende tracklist-tijden, en het bestaan van elk `image_wide_*`-bestand.
- **7 regels haalt de data niet** en staan als **ratchet**: het gemeten aantal is het plafond. Een
  nieuwe overtreding faalt, en een opgelóste overtreding faalt óók — met de melding dat het plafond
  omlaag moet. Zo blijft de achterstand zichtbaar in plaats van stil weer op te lopen. Die werking is
  in beide richtingen bewezen voordat de suite werd vastgelegd.

**En dat meten legde meteen een zichtbaar defect op de live site bloot.** 25 live mixen verwijzen naar
een `image_square` die niet bestaat, en dat veld wordt gerenderd door `BasiskleurenCarousel`,
`Erlenmeyers` en `VsKleurenCarousel` — dus de Music Mood Colours-pagina laadt daar 404's. Het is geen
extensie-mismatch: de `square/`-mappen bestaan grotendeels niet (`public/images/full/blue/` heeft alleen
`wide/`). Repareren vraagt echte afbeeldingen en is Dave's beslissing, dus de suite legt het exact vast
in plaats van het op te lossen. Tweede vondst van dezelfde soort: 25 live mixen staan op de legacy
R2-bucket, terwijl de veldspec beweert dat dat alleen `full-blue.json` betreft.

**De Node-versie staat vast in `.nvmrc`.** CI had `'22'` hardgecodeerd terwijl Netlify zijn eigen default
draaide, en niets meldde het als die twee uit elkaar liepen. Netlify **leest** `.nvmrc`, dus dit is nu de
enige plek waar de versie wordt verklaard; `ci.yml` haalt hem daar op via `node-version-file`.

**De poorten draaien de suite ook echt.** `Get-TestCommands` in `scripts/repo-config.ps1` geeft
`npx vitest run` terug — de seam die plugin 4.8.0 hiervoor toevoegde. Zonder die waarde meldde `open-pr`
eerlijk *"scripts\tests not found — test gate skipped"* en draaide er niets, terwijl de poort zegt "all
test suites green". In CI staat de suite als gewone `npm test`-stap: de gedeelde gate woont in
`native-capture-lib.ps1` van de bron, en dat bestand heeft een consumer niet in zijn repo.

### Significance

#### Tier 0

De derde pijler onder de PR-default bestaat nu. Waar de poort alleen bewees dat de code **bouwt**,
bewaakt de suite of het **gedrag** gelijk bleef — op precies de data waar de regels tot nu toe alleen in
proza stonden. En de eerste run leverde al twee defecten op die niemand kon zien.

**Score:** 4

#### Tier 1

De Node-versie van de live build kan niet meer stil divergeren van CI, en er ligt nu een exacte lijst van
25 mixen met een gebroken afbeelding op de Music Mood Colours-pagina — een zichtbaar defect dat
maandenlang onopgemerkt bleef omdat geen enkele poort ernaar keek.

**Score:** 3

### Pull Request

