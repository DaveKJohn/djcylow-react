### 68 lege date-velden hersteld uit het id, één wacht op een besluit · Data · 2026-07-26

77 van de 85 mixen hadden `"date": ""`, terwijl de veldspec ISO-formaat `YYYY-MM-DD` voorschrijft en
expliciet "niet leeg". Anders dan bij het `title`-veld had dit **wel zichtbare gevolgen**, nagegaan in
de code én in de build-output:

| Plek | Gevolg van een lege `date` | Vindplaats |
|---|---|---|
| JSON-LD structured data | `datePublished` en `dateModified` werden **volledig weggelaten** | `src/app/luister/mix/[slug]/page.tsx` |
| `<time>`-element | rendeerde als `<time dateTime="">` — leeg én ongeldige HTML | idem |

Google kreeg voor deze mixen dus geen publicatiedatum mee. De zichtbare datum op de pagina klopte
wel: die komt uit de losse velden `dag`/`maand`/`jaar`, die gevuld zijn. Alleen de machineleesbare
variant ontbrak.

**Wat er is gedaan.** 68 velden zijn gevuld met de datum afgeleid uit het `id`, dat het formaat
`YYYYMMDD` heeft (`"20240408"` → `"2024-04-08"`). De 8 preview-entries (`ignore: true`) houden een
tekst-id en blijven leeg; die krijgen geen pagina omdat `generateStaticParams` ze overslaat.

Regelgericht bewerkt in plaats van via `JSON.parse` + `stringify`, zodat de diff precies 68 regels
beslaat en de opmaak van de 13 geraakte bestanden onaangeroerd blijft. Resultaat: 68 wijzigingen, nul
regels daarbuiten.

**De kruiscontrole betaalde zich uit.** Vóór het wegschrijven is elke afgeleide datum vergeleken met
de bestaande `dag`/`maand`/`jaar`-velden van hetzelfde record. Dat leverde één tegenspraak op, en die
is bewust **niet** gevuld:

`full-blue.json` `20220406` — het `id`, de `permalink` en de audio-bestandsnaam op R2
(`Blue_Full_m_EDM_DNB_20220406_Audio_V2 (Vol. 1).mp3`) zeggen alle drie **2022**-04-06, en
`maand: "Apr"` met `dag: "06"` kloppen daarmee. Maar `jaar` staat op `"2021"`. Drie bronnen tegen één,
dus vermoedelijk een typefout in `jaar` — maar dat veld levert de **zichtbare** datum op de pagina, dus
die mix toont nu "Apr 06 2021" op de live site. Dat corrigeren verandert zichtbare content en is
daarom een beslissing van Dave, geen aanname van een specialist. Zolang dat besluit uitblijft houdt
dit ene record een lege `date`.

**Geverifieerd na de wijziging.** `npm run build` slaagt met 89 pagina's. Van de 77 mixpagina's dragen
er nu **76** een gevulde `datePublished`, `dateModified` en `<time dateTime="...">`; de enige die dat
mist is precies het overgeslagen record hierboven. Vóór deze branch was dat 8 van de 77.
