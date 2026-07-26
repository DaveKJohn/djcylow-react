### Onjuiste SEO- en GA4-claims uit de v2.21.0-documentatie gehaald · Docs · 2026-07-26

De titel-migratie in v2.21.0 is correct uitgevoerd, maar in de documentatie verkeerd verantwoord. Aan
de titels zelf verandert hier niets; alleen de verantwoording is rechtgezet.

## Wat er fout stond

De release-note en de highlights beweerden dat het `title`-veld SEO-kritisch is en dat de migratie 77
`<title>`-tags, de `<h1>`, de mix-kaarten en `mix_title` in GA4 raakte. Daaruit volgde ook de
waarschuwing dat historische GA4-rapportages onvergelijkbaar zouden worden, plus de belofte aan de
lezer dat bezoekers en Google de nieuwe titels zouden zien.

**Dat klopte geen van alle.** Opnieuw geverifieerd in de code van vandaag:

| Plek | Werkelijke bron |
|---|---|
| `<h1>` detailpagina | `{color} {subgenre} Mix {volume}` |
| `<title>`, og:title, twitter:title | dezelfde velden + `\| DJ Cylow` |
| GA4 `mix_title` | dezelfde velden, via de `MixAnalytics`-aanroep |
| mix-kaart op `/luister` | `{color} {subgenre} Mix · {volume}` |

Doorslaggevend: de JSON-titel komt in **geen enkel** HTML-bestand van de build voor. Hij staat alleen
in een JS-chunk (`out/_next/static/chunks/`), omdat de volledige mix-JSON in de client-bundel wordt
gebakken — meegeleverd, niet getoond. Reproduceerbaar met
`grep -rl "Mix · Blue Full" out/ --include=*.html`, wat niets oplevert.

Netto is de migratie dus een **dataconsistentie-verbetering**, geen SEO-verbetering. Er waren geen 63
pagina's met een identieke `<title>`; die waren al uniek omdat ze uit de losse velden komen. De
GA4-waarschuwing was vals alarm: `mix_title` verandert niet, dus er breekt niets en er is geen
annotatie nodig.

## Wat er is gedaan

1. **`releases/development/2.21/2.21.0.md`** — de samenvatting, de "wat het oplost"-alinea en de
   passage over wat meebeweegt zijn herschreven. De laatste is vervangen door een tabel met de
   werkelijke bron per plek, plus het reproduceerbare grep-commando. Bovenaan staat een gedateerde
   correctie-aantekening: de note stilletjes herschrijven zou de fout onvindbaar maken.
2. **`releases/highlights/2.21/2.21.0.md`** — de sectie beloofde de lezer iets zichtbaars. Die is
   herschreven naar wat het werkelijk is, met een expliciete regel dat er op de website niets
   verandert. Ook hier een correctie-aantekening.
3. **`src/data/mixes/README.md`** — de bron van de verkeerde aanname. Het `title`-veld stond als
   **SEO-critical** met "Shown on mix cards, detail page `<h1>`, and in metadata". Dat label is weg;
   het veld is nu beschreven als de canonieke naam bínnen de JSON, met een blokkade-notitie die
   uitlegt dat het nergens gerenderd wordt en hoe je dat zelf nagaat. In de SEO-tabel is de
   `title`-regel vervangen door `color` + `subgenre` + `volume` als de velden die de titel
   werkelijk bouwen, en `title` staat er nu bij met impact **None**.

**Stap 3 uit de oorspronkelijke opzet is vervallen.** Die wilde de gevouwen entry in het
`[Unreleased]`-blok van `CHANGELOG.md` corrigeren, maar dat blok bestaat sinds PR #18 niet meer:
v2.21.0 is nu één regel onder `## Releases` met een verwijzing naar de release-note. De onjuiste
claims stonden daar dus al niet meer.

## Erbij gekomen tijdens de controle

Dezelfde verificatie is op de andere velden gedaan die de spec als SEO-kritisch aanmerkt, want die
konden dezelfde fout dragen. `description_nl`, `tags` en `top_artists` staan alle drie wél in de
gebouwde HTML — die claims zijn correct. `description_en` staat er niet in, simpelweg omdat de site
nog niet tweetalig is; die tabelregel is daarop genuanceerd. Ook zijn de vijf velden die deze week
zijn toegevoegd (`bpm`, `tracks`, `id_spotify`, `title_spotify`, `volume_spotify`) expliciet met
impact **None** in de tabel gezet, zodat niemand ze later voor SEO-velden aanziet.

## Wat nog buiten de repo moet

De **al gepubliceerde GitHub Release-body van v2.21.0** draagt de oude tekst nog. Bijwerken is een
naar buiten gerichte actie en wacht op Dave:

```bash
gh release edit v2.21.0 --notes-file releases/development/2.21/2.21.0.md
```

## De les

Verifieer in de **code** wat een veld doet voordat je op de veldspec of `CLAUDE.md` afgaat. Beide
beschreven `title` als SEO-kritisch; `generateMetadata` doet iets anders. De code is de waarheid — en
een veldspec die daarnaast staat, plant de fout in elk volgend document dat erop leunt.
