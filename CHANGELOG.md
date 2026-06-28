# Changelog

De belangrijkste wijzigingen aan deze repo kort bijgehouden. Één regel per noemenswaardige wijziging.

## Hoe dit werkt

- **`## [Unreleased]`** — wijzigingen die al in `main` zitten maar nog niet live zijn. Dit blok vult zich met elke branch die naar `main` wordt gemergd, en blijft staan tot de eerstvolgende live-push.
- **`## [vX.Y.Z] - YYYY-MM-DD — Patch/Minor/Major`** — op die datum live gegaan via een push naar het live thema. De volledige uitwerking staat in `release-notes/X.Y/X.Y.Z.md`.

De bovenste uitgebrachte versie draagt de markering **← LIVE**: dat is de versie die op dit moment op het live thema staat. Bij elke live-push verschuift die markering naar de nieuwe versie.

### Levenscyclus van een regel

1. **Op een branch** schrijf je je belangrijkste wijzigingen onder `## [Unreleased]` (op de branch zelf, in dezelfde commit als het werk). Een branch mag gerust weken geparkeerd blijven.
2. **Branch klaar en goedgekeurd** → merge naar `main`, branch verwijderen. Je `[Unreleased]`-regels reizen mee naar `main`.
3. **Meer branches** die later mergen vullen `[Unreleased]` op `main` verder aan. `main` kan dus een tijd met een gevulde `[Unreleased]` rondlopen — dat is gewoon "wel gemergd, nog niet live".
4. **`main` naar live pushen** → alles onder `## [Unreleased]` is nieuw en wordt de eerstvolgende release-note: maak `release-notes/X.Y/X.Y.Z.md` op basis van de inhoud, voeg de versie toe aan `release-notes/README.md`, hernoem het blok naar `## [vX.Y.Z] - YYYY-MM-DD — Patch/Minor/Major` (met "Zie release-notes/X.Y.Z.md"), en maak een vers leeg `## [Unreleased]` bovenaan aan.

> **Merge-conflict op `[Unreleased]`?** Dat kan, want elke branch bewerkt hetzelfde blok. Het is een verwacht, triviaal conflict: behoud simpelweg beide sets regels onder `[Unreleased]`. Geen werk gaat verloren — de volgorde maakt niet uit.

---

## [Unreleased]

---

## [v2.19.1] - 2026-06-28 — Patch ← LIVE

Zie [release-notes/2.19/2.19.1.md](release-notes/2.19/2.19.1.md)

### robots.txt en sitemap.xml: static export fix
**Branch naam** fix/robots-sitemap-static-export
**Datum merge op main** 2026-06-28
**Branch type** Fix

`export const dynamic = 'force-static'` toegevoegd aan `robots.ts` en `sitemap.ts`. Verplicht voor Next.js static export (`output: 'export'`) — zonder deze export faalt de Netlify build met "export const dynamic not configured".

---

## [v2.19.0] - 2026-06-28 — Minor

Zie [release-notes/2.19/2.19.0.md](release-notes/2.19/2.19.0.md)

### Mix-detailpagina: subgenre-fallbacks, key-facts herstructurering en Shade-label
**Branch naam** fix/mix-detail-subgenre
**Datum merge op main** 2026-06-28
**Branch type** Fix

Alle `mix.subgenre || mix.genre` fallbacks verwijderd — subgenre is verplicht. Energy/datum verplaatst van header naar key-facts blok. Key-facts dl herstructureerd: Colour/Shade (Power + Frequency)/Subgenre/Tracks. H2 tracklist vereenvoudigd naar "Tracklist". `<dl>`-comment toegevoegd. stray `s`-bug gecorrigeerd.

---

### Unieke NL/EN mix descriptions voor alle 77 mixen
**Branch naam** content/mix-descriptions-all
**Datum merge op main** 2026-06-28
**Branch type** Content

Nieuw schema-veld `description_nl` (hernoemd van `description`) en `description_en` toegevoegd aan alle 77 actieve mix-entries in alle 15 JSON-bestanden. Elke description is uniek, 120–160 tekens, zonder dashes of artiestnamen (artiesten staan uitsluitend in `top_artists`). Veldvolgorde in alle JSON-bestanden herschikt naar de canonieke volgorde uit het README-model (title en descriptions direct na id, featured/ignore na de afbeeldingen). Alle 219 afbeeldingsbestanden hernoemd van `image_{power}_{color}_{date}_wide-{size}` naar `image_{power}_{color}_wide_{date}_{size}` (en square variant dienovereenkomstig). Alle JSON-paden bijgewerkt. README.md en CLAUDE.md bijgewerkt. Mix-detailpagina (`page.tsx`) aangepast om `description_nl` te lezen.

---

### Dode `uppercase` Tailwind classes verwijderd
**Branch naam** fix/remove-unused-uppercase-h1
**Datum merge op main** 2026-06-27
**Branch type** Fix

Zes `uppercase` className-waarden verwijderd uit de mix-detailpagina (`page.tsx`). De classes hadden geen effect omdat Tailwind utility classes niet geladen zijn in dit project — alleen SCSS is actief. Verwijderd van: H1, Energy-label, key-facts labels (Genre/Energy/Tracks) en de Tracklist H2.

---

## [v2.18.0] - 2026-06-27 — Minor

Zie [release-notes/2.18/2.18.0.md](release-notes/2.18/2.18.0.md)

### `subgenre` veld ingevuld voor alle actieve mixen
**Branch naam** data/subgenre-fill
**Datum merge op main** 2026-06-27
**Branch type** Data

Subgenre bepaald en ingevuld voor alle actieve mixen met een leeg `subgenre` veld — op basis van tags, tracklist en artiestenlinknamen. Gebruikte subgenres: Liquid Drum & Bass, Neurofunk, Progressive House, Tech House, Nu-Disco, Deep House en House. Preview-entries (ignore:true) zijn ongewijzigd gelaten.

### `top_artists` veld toegevoegd aan mix JSON schema
**Branch naam** data/top-artists-field
**Datum merge op main** 2026-06-27
**Branch type** Data

Nieuw veld `top_artists` toegevoegd aan alle 77 bestaande mix-entries (als lege array `[]`). De DJ vult per mix de meest gezochte artiesten in. De mix-detailpagina laadt het veld en gebruikt het als artistvermelding in de fallback-beschrijving. Het `add-mix.js` script zet het veld bij nieuwe mixen automatisch als lege array klaar. Schema-documentatie (README.md) bijgewerkt.

### SEO/GEO verbeteringen mix-detailpagina's
**Branch naam** feature/seo-geo-mix-pages
**Datum merge op main** 2026-06-27
**Branch type** Feature

Sitemap.xml en robots.txt toegevoegd zodat Google alle mix-URL's systematisch kan ontdekken. Mix-detailpagina verbeterd met: `keywords` meta-tag gevuld vanuit de `tags` array in JSON, Twitter/X card tags, BreadcrumbList JSON-LD voor rich snippets in de SERP, `AudioObject` in de MusicPlaylist JSON-LD zodat Google de audio-URL herkent, `isAccessibleForFree`, `dateModified`, en een gecorrigeerd `creator` type (Person i.p.v. MusicGroup). Visueel: de unieke `mix.description` is nu zichtbaar op de pagina, een key-facts blok toont genre/energy/tracks als gestructureerde data voor AI-crawlers, datum is omgezet naar een `<time>` element, H1 en title tag zijn consistent gemaakt, en subgenre wordt nu als primaire genrelabel gebruikt.

### GA4 IP-filter — eigen bezoeken uitsluiten
**Branch naam** config/ga4-ip-filter
**Datum merge op main** 2026-06-27
**Branch type** Config

GA4 gegevensfilter "Eigen bezoeken" aangemaakt en geactiveerd. IP-adresregel ingesteld voor thuisIP `83.86.198.113` (traffic_type=internal). Eigen bezoeken worden uitgesloten van alle analytics-rapporten. Werk-IP (Limpergstraat 6, Rijswijk) volgt zodra dat IP-adres bekend is.

---

## [v2.17.0] - 2026-06-27 — Minor

Zie [release-notes/2.17/2.17.0.md](release-notes/2.17/2.17.0.md)

---

## [v2.16.4] - 2026-06-27 — Patch

Zie [release-notes/2.16/2.16.4.md](release-notes/2.16/2.16.4.md)

---

## [v2.16.3] - 2026-06-27 — Patch

Zie [release-notes/2.16/2.16.3.md](release-notes/2.16/2.16.3.md)

---

## [v2.16.2] - 2026-06-27 — Patch

Zie [release-notes/2.16/2.16.2.md](release-notes/2.16/2.16.2.md)

---

## [v2.16.1] - 2026-06-27 — Patch

Zie [release-notes/2.16/2.16.1.md](release-notes/2.16/2.16.1.md)

---

## [v2.16.0] - 2026-06-25 — Minor

Zie [release-notes/2.16/2.16.0.md](release-notes/2.16/2.16.0.md)

---

## [v2.15.0] - 2026-06-25 — Minor

Zie [release-notes/2.15/2.15.0.md](release-notes/2.15/2.15.0.md)

## [v2.14.4] - 2026-06-25 — Patch

Zie [release-notes/2.14/2.14.4.md](release-notes/2.14/2.14.4.md)

## [v2.14.3] - 2026-06-25 — Patch

Zie [release-notes/2.14/2.14.3.md](release-notes/2.14/2.14.3.md)

## [v2.14.2] - 2026-06-25 — Patch

Zie [release-notes/2.14/2.14.2.md](release-notes/2.14/2.14.2.md)

## [v2.14.1] - 2026-06-25 — Patch

Zie [release-notes/2.14/2.14.1.md](release-notes/2.14/2.14.1.md)

## [v2.14.0] - 2026-06-25 — Minor

Zie [release-notes/2.14/2.14.0.md](release-notes/2.14/2.14.0.md)

## [v2.13.0] - 2026-06-18 — Minor

Zie [release-notes/2.13/2.13.0.md](release-notes/2.13/2.13.0.md)

## [v2.12.0] - 2026-06-16 — Minor

Zie [release-notes/2.12/2.12.0.md](release-notes/2.12/2.12.0.md)

## [v2.11.1] - 2026-05-10 — Patch

Zie [release-notes/2.11/2.11.1.md](release-notes/2.11/2.11.1.md)

## [v2.11.0] - 2026-05-08 — Minor

Zie [release-notes/2.11/2.11.0.md](release-notes/2.11/2.11.0.md)

## [v2.10.0] - 2026-05-05 — Minor

Zie [release-notes/2.10/2.10.0.md](release-notes/2.10/2.10.0.md)

## [v2.9.0] - 2026-05-01 — Minor

Zie [release-notes/2.9/2.9.0.md](release-notes/2.9/2.9.0.md)

## [v2.8.0] - 2026-04-20 — Minor

Zie [release-notes/2.8/2.8.0.md](release-notes/2.8/2.8.0.md)

## [v2.7.0] - 2026-04-13 — Minor

Zie [release-notes/2.7/2.7.0.md](release-notes/2.7/2.7.0.md)

## [v2.6.0] - 2026-04-11 — Minor

Zie [release-notes/2.6/2.6.0.md](release-notes/2.6/2.6.0.md)

## [v2.5.0] - 2026-04-10 — Minor

Zie [release-notes/2.5/2.5.0.md](release-notes/2.5/2.5.0.md)

## [v2.4.0] - 2026-03-20 — Minor

Zie [release-notes/2.4/2.4.0.md](release-notes/2.4/2.4.0.md)

## [v2.3.0] - 2026-03-19 — Minor

Zie [release-notes/2.3/2.3.0.md](release-notes/2.3/2.3.0.md)

## [v2.2.0] - 2026-03-13 — Minor

Zie [release-notes/2.2/2.2.0.md](release-notes/2.2/2.2.0.md)

## [v2.1.0] - 2026-03-11 — Minor

Zie [release-notes/2.1/2.1.0.md](release-notes/2.1/2.1.0.md)

## [v2.0.1] - 2026-03-08 — Patch

Zie [release-notes/2.0/2.0.1.md](release-notes/2.0/2.0.1.md)

## [v2.0.0] - 2026-03-07 — Major

Zie [release-notes/2.0/2.0.0.md](release-notes/2.0/2.0.0.md)
