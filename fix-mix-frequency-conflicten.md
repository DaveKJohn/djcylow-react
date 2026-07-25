### Drie mixen toonden een andere frequentie dan hun eigen data

**Branch naam** fix/mix-frequency-conflicten
**Datum merge op main**
**Branch type** Fix

Drie mixen droegen in hun `title` een andere frequentie dan in hun `frequency`-veld stond. Omdat de
titel in de `<h1>`, op de mix-kaarten en in de metadata terechtkomt, en `frequency` de filters
voedt, zag de bezoeker iets anders dan waarop hij filterde.

Welke van de twee leidend is, is niet gegokt maar afgeleid uit onafhankelijke getuigen: de
`permalink` en de bestandsnaam in `audioSrc` dragen de frequentie namelijk óók. Bij alle drie
wezen die naar `m`.

| Bestand | id | Was | Wordt | Aangepast veld |
|---|---|---|---|---|
| `full-green.json` | 20231127 | `frequency: "(f)"` bij titel `Green Full (m)` | `frequency: "(m)"` | het veld |
| `full-orange.json` | 20230705 | `title: "Orange Full (f)"` bij `frequency: "(m)"` | `Orange Full (m)` | de titel |
| `full-orange.json` | 20221003 | `title: "Orange Full (fm)"` bij `frequency: "(m)"` | `Orange Full (m)` | de titel |

De eerste twee spiegelden elkaar: bij `full-green` was het veld fout, bij `full-orange` de titel.
Eén vaste regel ("het veld wint" of "de titel wint") zou daarom bij precies één van de twee de fout
juist hebben bestendigd.

Het derde geval kwam pas boven water bij een bredere scan. `(fm)` is geen geldige waarde: de
veldspec in `src/data/mixes/README.md` staat uitsluitend `"(f)"` en `"(m)"` toe. Het was dus een
typefout in de titel, geen derde variant. Alle 85 `frequency`-velden zelf zijn wél geldig; de
verdeling is nu 54 × `(f)` en 31 × `(m)`.

**Bijwerking, bewust geaccepteerd.** `Orange Full (m)` komt hierdoor 4 keer voor in plaats van 2.
Dat is geen regressie maar een symptoom van het legacy-titelformaat: **63 van de 85 mixen dragen op
dit moment een titel die niet uniek is** (11 × `Purple Light (f)`, 9 × `Orange Light (f)`, enzovoort).
Het new-standard-formaat uit de veldspec lost dat op doordat het subgenre en volumenummer meeneemt.
Die migratie blijft een aparte beslissing; deze branch corrigeert alleen de tegenstrijdigheden.

Gecontroleerd: alle 85 records parsen, 0 resterende conflicten, en `npm run build` slaagt.
