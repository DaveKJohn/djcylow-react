### Verkeerd jaartal en lege date bij Blue Full (m) Vol. 1 hersteld · Data · 2026-07-26

`full-blue.json` `20220406` was het enige record dat na PR #19 nog een lege `date` had. Dat kwam
niet door de aanpak daar, maar door een tegenspraak in de data die de kruiscontrole van die branch
opving: het `id`, de `permalink` en de audio-bestandsnaam op R2 zeggen alle drie **2022**-04-06, en
`maand: "Apr"` met `dag: "06"` kloppen daarmee, maar `jaar` stond op `"2021"`. Drie bronnen tegen
één. Omdat `jaar` de zichtbare datum op de pagina levert, was dat een beslissing van Dave en niet
van een specialist; die is nu genomen.

Hersteld in dit record:

| Veld | Was | Is |
|---|---|---|
| `jaar` | `"2021"` | `"2022"` |
| `date` | `""` | `"2022-04-06"` |
| `tags[0]` | `"drum and bass mix 2021"` | `"drum and bass mix 2022"` |
| `tags[20]` | `"dnb mix 2021"` | `"dnb mix 2022"` |

De twee tags zijn meegenomen omdat ze dezelfde feitelijke fout droegen: een mix uit 2022 die zich
als 2021-materiaal aanbood. Dat is geen aparte SEO-keuze maar dezelfde correctie, doorgevoerd waar
hij nog stond. De beide `description`-velden bevatten geen jaartal, dus die bleven ongemoeid.

**Effect.** De pagina toonde "06 Apr, 2021" en leest nu "06 Apr, 2022"; `2021` komt nergens meer
voor in de gebouwde `/luister`. Belangrijker: dit was de laatste mixpagina zonder publicatiedatum.
Van de 77 mixpagina's dragen er nu **77** een gevulde `datePublished`, `dateModified` en
`<time dateTime="...">` — bij het begin van vandaag waren dat 8, na PR #19 zesenzeventig.

De kruiscontrole over alle 15 bestanden meldt nu 77 gevulde datums, 8 previews die leeg horen te
blijven, en **nul tegenspraken** tussen `id` en `dag`/`maand`/`jaar`.