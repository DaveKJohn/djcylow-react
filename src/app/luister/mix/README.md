# src/app/luister/mix — Mix Detail Pagina

Deze map bevat de dynamische detail pagina voor individuele mixes: `[slug]/page.tsx`.

De pagina leest mix data uit de JSON bestanden in `src/data/mixes/`. Voor de volledige JSON schema specificatie, zie [`src/data/mixes/README.md`](../../../data/mixes/README.md).

---

## Hoe de pagina een mix vindt

```
URL: /luister/mix/[slug]
         ↓
findMixBySlug(slug)
  — vergelijkt slug met permalink van elke mix (zonder .html)
  — case-insensitive, URL-decoded
  — slaat mixes met ignore: true over
         ↓
Render MixDetail
```

**Slug formaat:** afgeleid van `permalink`-veld in de JSON:
```
luister/mix/red-light-m-EDM-128BPM-20260615.html
              ↓ slug ↓
red-light-m-EDM-128BPM-20260615
```

---

## Welke JSON velden worden gebruikt

| Veld | Waar |
|---|---|
| `id` | AudioPlayer `id` prop |
| `ignore` | Uitsluitingscheck — `ignore: true` → 404 |
| `genre` | h1 titel, SEO metadata, JSON-LD `genre` |
| `subgenre` | Zichtbaar onder h1 (indien gevuld) |
| `color` | h1 titel, AudioPlayer className, SEO |
| `power` | h1 titel, SEO metadata |
| `frequency` | h1 titel |
| `volume` | h1 titel, SEO metadata |
| `date` | JSON-LD `datePublished` |
| `jaar` / `maand` / `dag` | Datumweergave onder h1 (indien `jaar` gevuld) |
| `permalink` | Slug matching (essentieel) |
| `audioSrc` | AudioPlayer `src` prop |
| `image_wide_large` | AudioPlayer afbeelding, Open Graph, JSON-LD |
| `description` | SEO meta description, Open Graph, JSON-LD |
| `tracklist` | Tracklist tabel, JSON-LD MusicRecording items |

### Niet gebruikt op de detail pagina (wel aanwezig in JSON)

| Veld | Reden |
|---|---|
| `featured` | Alleen relevant voor de playlist grid |
| `title` | Pagina bouwt de titel dynamisch op uit `color`, `genre`, `power`, `frequency`, `volume` |
| `image_wide_small` | Alleen gebruikt in playlist cards |
| `image_square` | Alleen gebruikt in playlist cards |

---

## Statische pagina generatie

`generateStaticParams()` genereert bij build-time een statische HTML pagina voor elke mix. Mixes met `ignore: true` worden overgeslagen.

```
allMixes (alle JSON bestanden gecombineerd)
  → filter: ignore !== true en permalink aanwezig
  → map: slug = permalink zonder pad en .html extensie
  → Next.js genereert /luister/mix/[slug] voor elke slug
```

---

## SEO structuur

Elke detail pagina genereert:

- **`<title>`** — `{Color} {Genre} Mix {Volume} ({Power} Energy) | DJ Cylow`
- **`<meta description>`** — `mix.description` als die gevuld is, anders automatisch gegenereerd uit tracklist artiesten
- **Open Graph** — type `music.playlist`, afbeelding via `image_wide_large`
- **JSON-LD** — `schema.org/MusicPlaylist` met `track[]` als `MusicRecording` items, `datePublished` indien `date` gevuld

---

## Een nieuw veld toevoegen aan de pagina

1. Voeg het veld toe aan het JSON schema in `src/data/mixes/README.md`
2. Voeg het veld toe aan de `Mix` interface in `page.tsx`
3. Voeg het veld toe aan `src/data/mixes/add-mix.js` zodat `npm run mix:add` het vraagt
4. Gebruik het veld in de JSX of metadata

---

## Relatie met src/data/mixes/

```
src/data/mixes/          →   src/app/luister/mix/[slug]/
─────────────────────────────────────────────────────────
JSON bestanden               page.tsx leest alle JSON in via imports
README.md (schema)           Mix interface in page.tsx volgt dit schema
add-mix.js script            Genereert entries die direct door page.tsx gebruikt worden
```

Wijzigingen in het JSON schema vereisen een update van de `Mix` interface in `page.tsx`.
