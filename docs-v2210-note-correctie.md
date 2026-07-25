### Onjuiste SEO- en GA4-claims uit de v2.21.0 release-note halen · Docs · 2026-07-26

**To do / where I left off:**

Nog niets gedaan. De titel-migratie in v2.21.0 is correct uitgevoerd, maar in de documentatie
verkeerd verantwoord. Deze branch corrigeert alleen die verantwoording; aan de titels zelf verandert
niets.

## Wat er fout staat

De release-note, de highlights en de changelog-entry beweren dat het `title`-veld SEO-kritisch is en
dat de migratie 77 `<title>`-tags, de `<h1>`, de mix-kaarten en `mix_title` in GA4 raakt. Daaruit
volgde ook de waarschuwing dat historische GA4-rapportages onvergelijkbaar zouden worden.

**Dat klopt geen van alle.** Het `title`-veld uit `src/data/mixes/*.json` wordt nergens gerenderd.
Elke plek bouwt zijn tekst op uit de losse velden:

| Plek | Bron | Vindplaats |
|---|---|---|
| `<h1>` detailpagina | `{mix.color} {mix.subgenre} Mix {mix.volume}` | `src/app/luister/mix/[slug]/page.tsx:285` |
| `<title>` en og:title | dezelfde velden + `\| DJ Cylow` | `src/app/luister/mix/[slug]/page.tsx:126` |
| GA4 `mix_title` | dezelfde velden | `src/app/luister/mix/[slug]/page.tsx:265` |
| mix-kaart op `/luister` | `{mix.color} {mix.subgenre} Mix · {mix.volume}` | `src/components/luister/Playlist.tsx:116` |

Doorslaggevend: de nieuwe titel komt in **geen enkel HTML-bestand** van de build voor. Hij staat
alleen in een JS-chunk, omdat de volledige mix-JSON in de client-bundel wordt gebakken —
meegeleverd, niet getoond. Te reproduceren met:

```bash
npm run build
grep -rl "Mix · Blue Full" out/ --include=*.html   # levert niets op
```

Netto is de migratie dus een **dataconsistentie-verbetering**, geen SEO-verbetering. Er waren geen
63 pagina's met een identieke `<title>`; die waren al uniek omdat ze uit de losse velden komen.
De GA4-waarschuwing was vals alarm: `mix_title` verandert niet, dus er breekt niets in de
historische rapportages en er is geen annotatie nodig.

## Wat er moet gebeuren

1. `releases/development/2.21/2.21.0.md` — de passage over 63 gedeelde titels, SEO-waarde en de
   GA4-breuk herschrijven naar wat het werkelijk is.
2. `releases/highlights/2.21/2.21.0.md` — sectie "Elke mix heeft nu een eigen, herkenbare titel"
   idem; die belooft de lezer nu iets zichtbaars dat niet zichtbaar is.
3. `CHANGELOG.md` — de gevouwen entry van `data/titel-migratie` in `[Unreleased]` van v2.21.0.
4. **Apart, buiten de repo:** de al gepubliceerde GitHub Release-body bijwerken.
   `gh release edit v2.21.0 --notes-file releases/development/2.21/2.21.0.md` na stap 1.

Overweeg meteen `src/data/mixes/README.md` bij te werken: die noemt `title` **SEO-critical**, en dat
is precies waar de verkeerde aanname vandaan kwam. De veldspec en de code spraken elkaar tegen.

## De les

Verifieer in de **code** wat een veld doet voordat je op de veldspec of `CLAUDE.md` afgaat. Beide
beschreven `title` als SEO-kritisch; `generateMetadata` doet iets anders. De code is de waarheid.
