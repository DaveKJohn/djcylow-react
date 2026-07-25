### 69 lege date-velden herstellen uit het id · Data · 2026-07-26

**To do / where I left off:**

Nog niets gewijzigd. Onderzoek is af, inclusief de verificatie in de gebouwde HTML.

## Waarom dit telt

77 van de 85 mixen hebben `"date": ""`, terwijl `CLAUDE.md` voorschrijft: ISO-formaat `YYYY-MM-DD`,
**niet leeg**. Anders dan bij het `title`-veld heeft dit wél zichtbare gevolgen — nagegaan in de
code én in de build-output:

| Plek | Gevolg van een lege `date` | Vindplaats |
|---|---|---|
| JSON-LD structured data | `datePublished` en `dateModified` worden **volledig weggelaten** | `src/app/luister/mix/[slug]/page.tsx:205` |
| `<time>`-element | rendert als `<time dateTime="">` — leeg én ongeldige HTML | `src/app/luister/mix/[slug]/page.tsx:311` |

Geverifieerd in `out/luister/mix/blue-full-f-dnb-20240408.html`: `datePublished` komt daar niet in
voor, en het `<time>`-element staat er als `<time dateTime="">`. Google krijgt voor deze mixen dus
geen publicatiedatum mee.

De zichtbare datum op de pagina klopt wel: die komt uit de losse velden `dag`/`maand`/`jaar`
(`page.tsx:311` en `Playlist.tsx:118`), die wél gevuld zijn. Alleen de machineleesbare variant
ontbreekt.

## Wat er moet gebeuren

69 van de 77 lege velden zijn af te leiden uit `id`, dat het formaat `YYYYMMDD` heeft — bijvoorbeeld
`"20240408"` wordt `"2024-04-08"`.

De 8 overige zijn precies de `ignore: true`-previews; die hebben een tekst-id
(`blue_light_preview`, `Red_light_preview`, …) en horen leeg te blijven. Ze krijgen geen pagina,
want `generateStaticParams` slaat ze over.

Aanpak zoals bij de titel-migratie: **regelgericht bewerken**, niet via `JSON.parse` +
`stringify`, anders wordt de opmaak van alle 15 bestanden herschreven en is de diff onleesbaar.
Verwacht resultaat: 69 gewijzigde regels, 0 andere. Let bij een regex-vervanging op de regeleindes:
deze bestanden zijn CRLF, en een patroon dat op `\n` matcht laat een losse `\r` achter.

**Kruiscontrole vóór het wegschrijven:** vergelijk de uit `id` afgeleide datum met de bestaande
`dag`/`maand`/`jaar`-velden van hetzelfde record. Spreken die elkaar tegen, dan eerst uitzoeken
welke leidend is — niet gokken. Dat was bij de frequentie-conflicten precies de val.

Na afloop: `npm run build` en controleren dat `datePublished` nu wél in de JSON-LD staat en dat
`<time dateTime="...">` gevuld is.
