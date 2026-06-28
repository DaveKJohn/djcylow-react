# src/data/mixes — Mix Data Specification

This folder contains all DJ Cylow mix metadata. Each file represents one **color+intensity combination** and contains an array of mix objects, from newest to oldest.

This README is the single source of truth for:

- JSON schema and field rules
- Allowed values per field
- SEO content guidelines
- Inconsistencies to fix in legacy data
- The "Music Mood Colours" system explained

---

## Table of Contents

1. [File Naming Convention](#file-naming-convention)
2. [Complete JSON Schema](#complete-json-schema)
3. [Field Reference](#field-reference)
4. [The Music Mood Colours System](#the-music-mood-colours-system)
5. [SEO Strategy per Field](#seo-strategy-per-field)
6. [Tracklist Time Format](#tracklist-time-format)
7. [Preview Entries](#preview-entries)
8. [Audio Storage — Cloudflare R2](#audio-storage--cloudflare-r2)
9. [Known Inconsistencies in Legacy Data](#known-inconsistencies-in-legacy-data)
10. [Complete Example — Correct & SEO-Optimized](#complete-example--correct--seo-optimized)

---

## File Naming Convention

```
[power]-[color].json
```

| File | Color | Intensity |
|---|---|---|
| `full-blue.json` | blue | Full |
| `full-cyan.json` | cyan | Full |
| `full-green.json` | green | Full |
| `full-orange.json` | orange | Full |
| `full-purple.json` | purple | Full |
| `full-red.json` | red | Full |
| `full-yellow.json` | yellow | Full |
| `light-blue.json` | blue | Light |
| `light-cyan.json` | cyan | Light |
| `light-green.json` | green | Light |
| `light-magenta.json` | magenta | Light |
| `light-orange.json` | orange | Light |
| `light-purple.json` | purple | Light |
| `light-red.json` | red | Light |
| `light-yellow.json` | yellow | Light |

**Note:** Magenta only exists as `light-magenta.json` — there is no Full-magenta.

Within each file, mixes are sorted **newest first** (descending by date).

---

## Complete JSON Schema

```json
[
  {
    "id": "20260615",
    "featured": false,
    "ignore": false,
    "title": "Tech House · Red Light (m) Mix · Vol. 6",
    "genre": "EDM",
    "subgenre": "Tech House",
    "color": "Red",
    "power": "Light",
    "frequency": "(m)",
    "volume": "Vol. 6",
    "date": "2026-06-15",
    "jaar": "2026",
    "maand": "Jun",
    "dag": "15",
    "permalink": "luister/mix/red-light-m-EDM-128BPM-20260615.html",
    "audioSrc": "https://pub-4fa4c2c1f9a644c4878cba29a7926443.r2.dev/red/Red_Light_m_EDM_128BPM_20260615_Audio_V1%20(Vol.%206).mp3",
    "image_wide_small": "/images/light/red/wide/image_light_red_20260615_wide-small.jpg",
    "image_wide_large": "/images/light/red/wide/image_light_red_20260615_wide-large.webp",
    "image_square": "/images/light/red/square/image_light_red_20260615_square.jpg",
    "description_nl": "Tech House mix van DJ Cylow. Warm en gedreven, vol strakke kicks en diepe basslines. Perfect voor sporten, rijden of je pre-party.",
    "description_en": "Tech House mix by DJ Cylow. Warm and driven, with tight kicks and deep basslines. Perfect for working out, driving, or pre-party.",
    "top_artists": ["Tiësto", "MEDUZA", "Chris Lake"],
    "tracklist": [
      { "time": "00:00:59", "track": "Anabel Englund & Kamino - Belong to Me" },
      { "time": "00:03:00", "track": "Roddy Lima - Shadows" }
    ]
  }
]
```

---

## Field Reference

### `id` — string, required

Unique identifier for the mix. Used to build the URL slug.

**Format:** `YYYYMMDD` (date the mix was published/recorded)

**Rules:**

- Must be unique across ALL mix files combined
- Use the actual recording/publish date, not today's date
- For preview entries only: use a descriptive string like `"Red_light_preview"` (see Preview Entries)

**Examples:** `"20260615"`, `"20241009"`, `"20220523"`

---

### `featured` — boolean, required

Whether this mix appears prominently highlighted in the playlist grid.

**Values:** `true` | `false`

**Rules:**

- At most 1–2 mixes per color file should be `featured: true`
- Preview entries typically use `featured: true` (but `ignore: true` too)
- Normal mixes: `false`

---

### `ignore` — boolean, required

When `true`, this entry is completely excluded from the public playlist and detail pages. It will not appear on the site.

**Values:** `true` | `false`

**Use cases:**

- Draft/work-in-progress mixes not ready for publication
- Preview audio clips (see Preview Entries section)
- Mixes taken offline temporarily

---

### `title` — string, required, **SEO-critical**

The full display title of the mix. Shown on mix cards, detail page `<h1>`, and in metadata.

**Target format (new standard):**

```
[Subgenre] · [Color] [Power] ([Frequency]) Mix · Vol. [N]
```

**Examples (new standard):**

- `"Tech House · Red Light (m) Mix · Vol. 6"`
- `"Progressive House · Red Light (m) Mix · Vol. 4"`
- `"Melodic Techno · Red Light (m) Mix · Vol. 5"`
- `"Neurofunk · Red Light (m) Mix · Vol. 1"`

**Legacy format (old — do not use for new mixes):**

- `"Blue Full (f)"` ← too short, no SEO value
- `"Purple Light (f)"` ← too short, no SEO value

**Rules:**

- Always include the subgenre first (e.g., "Progressive House", "Tech House", "Neurofunk")
- Use middle dot `·` as separator (not hyphen, not dash)
- Capitalize color (Red, Blue, Purple, etc.)
- Frequency in parentheses: `(f)` or `(m)`
- Volume number: `Vol. 1`, `Vol. 2`, etc.

---

### `genre` — string, required

The main genre category. Used by the Filter component on the Luister page.

**Allowed values (exactly as written):**

- `"EDM"` — Electronic Dance Music (House, Techno, Progressive, Organic, etc.)
- `"Drum & Bass"` — Drum & Bass, Neurofunk, Liquid, Jump Up

**Rules:**

- Only these two values are valid
- All EDM sub-styles (Tech House, Progressive House, Melodic Techno, Organic House, etc.) use `"EDM"` here — the subgenre field carries the specifics
- Do not add new top-level genres without updating the `Filter.tsx` component

---

### `subgenre` — string, required (for new mixes), empty string allowed for legacy

The specific sub-style of the mix. Shown on the mix detail page and used in the title.

**Examples for EDM:**

- `"Tech House"`
- `"Progressive House"`
- `"Melodic Techno"`
- `"Organic House"`
- `"Afro House"`
- `"Deep House"`
- `"Melodic House"`
- `"Hard Techno"`

**Examples for Drum & Bass:**

- `"Liquid Drum & Bass"`
- `"Neurofunk"`
- `"Jump Up"`
- `"Vocal DnB"`
- `"Techstep"`

**Rules:**

- Must match exactly what appears in the `title` field
- Use the same casing as in the title
- Legacy mixes may have `""` — that's acceptable for old entries, but fill it in when updating

---

### `color` — string, required

The mood color of this mix in the Music Mood Colours system.

**Allowed values (capitalized):**

- `"Blue"` | `"Cyan"` | `"Green"` | `"Orange"` | `"Red"` | `"Purple"` | `"Yellow"` | `"Magenta"`

**Rules:**

- Capitalize the first letter (new standard)
- Must match the containing file name: `light-red.json` → `"color": "Red"`
- Legacy data may use lowercase (`"blue"`, `"red"`) — this is a known inconsistency to fix

---

### `power` — string, required

The energy intensity of the mix in the Music Mood Colours system.

**Allowed values:**

- `"Full"` — high energy, intense, driving
- `"Light"` — softer, melodic, emotional

**Rules:**

- Capitalize: `"Full"` or `"Light"` (not `"full"` or `"FULL"`)
- Must match the containing file name: `light-red.json` → `"power": "Light"`

---

### `frequency` — string, required

A secondary dimension within the same color+power combination. Used to distinguish mix variants with the same color and intensity.

**Allowed values:**

- `"(f)"` — "full" frequency variant
- `"(m)"` — "melodic" or "mid" frequency variant

**Rules:**

- Always include parentheses: `"(f)"` not `"f"`
- A single color+power file can contain mixes of both `(f)` and `(m)` frequencies

---

### `volume` — string, required

Volume number within the same color+power+frequency series.

**Format:** `"Vol. N"` where N is the sequential number

**Examples:** `"Vol. 1"`, `"Vol. 6"`, `"Vol. 10"`

**Rules:**

- Number sequentially within the same color+power+frequency combination
- Preview entries use `""` (empty string)

---

### `date` — string, required for new mixes

The publication/recording date in ISO 8601 format.

**Format:** `"YYYY-MM-DD"`

**Examples:** `"2026-06-15"`, `"2024-10-09"`, `"2022-05-23"`

**Rules:**

- Always fill this in for new mixes — used by search engines for freshness signals
- Legacy mixes have `""` — this is a known inconsistency
- Must match `jaar` + `maand` + `dag` fields

---

### `jaar` — string, required

Year of the mix.

**Format:** 4-digit year string: `"2026"`, `"2024"`, `"2022"`

---

### `maand` — string, required

Abbreviated month name (English, 3 letters).

**Allowed values:** `"Jan"` | `"Feb"` | `"Mar"` | `"Apr"` | `"May"` | `"Jun"` | `"Jul"` | `"Aug"` | `"Sep"` | `"Oct"` | `"Nov"` | `"Dec"`

---

### `dag` — string, required

Day of the month, zero-padded to 2 digits.

**Format:** `"01"` through `"31"`

---

### `permalink` — string, legacy field

The legacy URL for this mix (`.html` suffix, relative path). Kept for reference and backwards compatibility but **not used for routing** in the current Next.js app.

**Format:** `"luister/mix/[slug].html"`

**Rules:**

- Do not use this field for navigation in the codebase — use the slug derived from `id`, `color`, `power`, `frequency`, `genre`, and BPM
- Fill it in for new mixes to maintain consistency, but the app ignores it
- Old mixes: may have different slug patterns — that's okay, they're legacy

---

### `audioSrc` — string, required

Full URL to the audio file on Cloudflare R2.

**CDN base URL:** `https://pub-4fa4c2c1f9a644c4878cba29a7926443.r2.dev/`

**URL-encode spaces** in filenames as `%20`.

**Examples:**

```
https://pub-4fa4c2c1f9a644c4878cba29a7926443.r2.dev/red/Red_Light_m_EDM_128BPM_20260615_Audio_V1%20(Vol.%206).mp3
```

**Rules:**

- Must be a direct `.mp3` link (no redirect, no playlist format)
- The path within the bucket is `[color]/[Filename].mp3`
- See Audio Storage section for full bucket details

---

### `image_wide_small` — string, required

Path to the small-width wide-format cover image (used as playlist card thumbnail).

**Format:** `/images/[power-lowercase]/[color-lowercase]/wide/image_[power-lowercase]_[color-lowercase]_[YYYYMMDD]_wide-small.jpg`

**Example:** `/images/light/red/wide/image_light_red_20260615_wide-small.jpg`

**Rules:**

- Leading slash
- Power and color in lowercase in the path, regardless of the `color`/`power` field capitalization
- File type: `.jpg`

---

### `image_wide_large` — string, required

Path to the large wide-format cover image (used on the mix detail page).

**Format:** `/images/[power-lowercase]/[color-lowercase]/wide/image_[power-lowercase]_[color-lowercase]_[YYYYMMDD]_wide-large.webp`

**Example:** `/images/light/red/wide/image_light_red_20260615_wide-large.webp`

**Rules:**

- Leading slash
- File type: `.webp` (for performance)

---

### `image_square` — string, required

Path to the square-cropped cover image (used in mix grid cards).

**Format:** `/images/[power-lowercase]/[color-lowercase]/square/image_[power-lowercase]_[color-lowercase]_[YYYYMMDD]_square.jpg`

**Example:** `/images/light/red/square/image_light_red_20260615_square.jpg`

**Rules:**

- Leading slash
- File type: `.jpg`

---

### `description_nl` — string, required, **SEO-critical**

Nederlandse beschrijving van de mix. Gebruikt voor:

- The `<meta name="description">` tag on the mix detail page
- Open Graph `og:description`
- Google search result snippets (typically 155–160 characters shown)
- Visible text on the mix detail page

**Target length:** 120–160 characters

**SEO rules:**

- **Must be unique per mix** — do NOT copy-paste the same description to all mixes
- Include the subgenre, color mood name, DJ name, and at least one track characteristic
- Write in Dutch (matches site locale)
- Mention at least 2–3 of: subgenre name, color/mood, vibe/energy, use case
- Avoid generic filler like "Een dikke uurset" across all mixes
- **NOOIT een dash (`-`) of em-dash (`—`) gebruiken** — dit ziet er AI-gegenereerd uit
- **Vermeld geen artiestnamen** — artiesten staan in het `top_artists` veld

**Good example:**

```
"Progressive House mix van DJ Cylow. Warme synths, melodische breaks en een opbouwende energie. Perfect voor een late avondrit of thuisfeest."
```

---

### `description_en` — string, required, **SEO-critical**

English description of the mix. Same rules as `description_nl` but in English.

**Target length:** 120–160 characters

**Rules:**

- Same structure as `description_nl` but in English
- **NEVER use a dash (`-`) or em-dash (`—`)** — looks AI-generated
- **Do not mention artist names** — artists go in `top_artists`

**Good example:**

```
"Progressive House mix by DJ Cylow. Warm synths, melodic breaks and building energy. Perfect for a late-night drive or a house party."
```

---

### `top_artists` — array of strings, optional, **SEO-critical**

The 3 most-searched artists featured in this mix. Used in the mix description fallback and as SEO signal when no `description` is set.

**Format:** Array of 1–3 artist name strings, exactly as they appear in the tracklist.

**Example:**

```json
"top_artists": ["Tiësto", "MEDUZA", "Chris Lake"]
```

**Rules:**

- Pick by online search volume / artist fame, not by tracklist order or frequency
- Maximum 3 entries — use the most recognizable names
- Spelling must match the tracklist exactly (used for consistency)
- Optional: if omitted, the page falls back to the first unique artists in tracklist order
- Fill this in for all new mixes — leave empty `[]` only if the tracklist has no well-known names

---

### `tracklist` — array, required

Array of track objects, ordered chronologically from start to end of the mix.

```json
"tracklist": [
  { "time": "00:00:00", "track": "Artist - Track Title" },
  { "time": "00:03:00", "track": "Artist feat. Other Artist - Track Title (Remix Artist Remix)" }
]
```

See [Tracklist Time Format](#tracklist-time-format) below for time field rules.

**`track` field format:**

- `"Artist - Track Title"` for originals
- `"Artist - Track Title (ft. Feature Artist)"` for featured artists
- `"Artist - Track Title (Remix Artist Remix)"` for remixes
- Multiple artists: `"Artist1 & Artist2 - Track Title"` or `"Artist1, Artist2 - Track Title"`

---

## The Music Mood Colours System

The entire mix library is organized around a proprietary system DJ Cylow developed that maps musical mood to color theory and neuroscience.

### Color → Emotional Mood

| Color | Mood / Energy | Neurotransmitter association |
|---|---|---|
| **Red** | Excitement, passion, high energy | Adrenaline-dominant |
| **Orange** | Warmth, euphoria, social | Dopamine + Adrenaline |
| **Yellow** | Happiness, optimism, energy | Dopamine-dominant |
| **Green** | Nature, flow, ease | Balanced / Serotonin |
| **Cyan** | Cool, focused, peaceful | Serotonin + Dopamine |
| **Blue** | Depth, melancholy, introspection | Serotonin-dominant |
| **Purple** | Spiritual, emotional, nostalgic | Low stimulation, introspective |
| **Magenta** | Unique, sensual, boundary-crossing | Complementary to Green |

### Power (Intensity)

| Value | Description |
|---|---|
| `"Full"` | Maximum energy — festival, main stage, hard drops. Higher BPM, more impact. |
| `"Light"` | Softer energy — melodic, emotional, introspective. Same color mood but gentler. |

### Frequency

Within the same color+power, `(f)` and `(m)` represent different sonic "frequencies" or character:

- `(f)` — "full" — rounder, more harmonic, slightly warmer tone
- `(m)` — "melodic" — more melodic focus, synth-driven

### Complementary Colors

Complementary color pairs represent contrasting emotional experiences (same as the color wheel):

- Red ↔ Cyan
- Orange ↔ Blue
- Yellow ↔ Purple
- Green ↔ Magenta

This is why the mix library is navigated by color — listeners can find their mood and also discover the contrast.

---

## SEO Strategy per Field

Google indexes individual mix pages at `/luister/mix/[slug]`. For each page to rank, these fields must be optimized:

| Field | SEO Impact | Priority |
|---|---|---|
| `title` | `<h1>`, `<title>` tag, OG title | **Critical** |
| `description` | Meta description, OG description | **Critical** |
| `subgenre` | Appears in title, structured data, URL context | **High** |
| `tracklist` | Indexed as text content on the page; artists are searchable | **High** |
| `color` | Used in structured data and page schema | Medium |
| `date` | Freshness signal for Google indexing | Medium |
| `genre` | Structured data, filter categories | Medium |
| `image_*` | Open Graph image (rich snippet in social shares) | Medium |

### Description writing guide

Each description should target search queries like:

- `"progressive house mix 2025"`
- `"liquid drum and bass mix"`
- `"[artist name] mix"`
- `"[mood] house mix"`

Include:

1. The genre/subgenre name (exactly as people search it)
2. The mood or atmosphere
3. A use-case signal ("voor het thuisfeest", "late night sessie", "rijden op de snelweg")

**Template (adapt per mix):**

```
[Subgenre] mix van DJ Cylow. [mood/sfeer omschrijving, 1–2 zinnen]. Perfect voor [use case].
```

---

## Tracklist Time Format

**Required format (new standard):** `"HH:MM:SS"` with leading zeros

| Format | Valid? | Notes |
|---|---|---|
| `"00:03:00"` | ✅ Correct | New standard |
| `"00:00:59"` | ✅ Correct | New standard |
| `"01:06:25"` | ✅ Correct | Hours > 0 |
| `"03:05"` | ⚠️ Legacy | Old MM:SS format — acceptable in old mixes |
| `"1:01:08"` | ⚠️ Legacy | Missing leading zero — acceptable in old mixes |
| `"1:06"` | ❌ Avoid | Ambiguous |

**Rules for new mixes:**

- Always use `HH:MM:SS` with leading zeros
- First track is typically `"00:00:00"` or `"00:00:59"` (some mixes start with a count-in)
- Verify timestamps by listening to the actual audio

---

## Preview Entries

Each color file may contain a special "preview" entry — a short audio clip that plays before the full mix starts on the Luister page.

**Identifying preview entries:**

- `"id"` is a string like `"Red_light_preview"` or `"Purple_light_preview"` (not a date)
- `"ignore": true` — excluded from public playlist
- `"featured": true` — used for special display logic
- `"tracklist": []` — empty array
- `"audioSrc"` — points to a short preview file (e.g., `Red_Light_Preview.mp3`)
- Most other fields (`date`, `volume`, `image_wide_*`, `description`) are empty strings

**Do not modify preview entries** unless you are changing the preview audio file itself.

---

## Audio Storage — Cloudflare R2

All audio files are hosted on Cloudflare R2 CDN.

### Active bucket (use for all new mixes)

```
https://pub-4fa4c2c1f9a644c4878cba29a7926443.r2.dev/
```

### Legacy bucket (old mixes only — do not upload new files here)

```
https://pub-9096148d84e34c73a3eca828877fcd5b.r2.dev/
```

The legacy bucket is used by some older mixes in `full-blue.json`. New mixes and re-uploads always go to the active bucket.

### Bucket folder structure

```
[active-bucket]/
├── red/          Red_Light_m_EDM_128BPM_20260615_Audio_V1 (Vol. 6).mp3
├── blue/         Blue_Full_f_EDM_DNB_20240408_Audio_V1 (Vol. 2).mp3
├── purple/       Purple_Light_f_EDM_DNB_20240803_Audio_V1 (Vol 10).mp3
├── cyan/
├── green/
├── orange/
├── yellow/
└── magenta/
```

### Audio filename convention (R2 bucket)

```
[Color]_[Power]_[Frequency-no-parens]_[Genre-abbreviation]_[BPM]BPM_[YYYYMMDD]_Audio_V[n] (Vol. [N]).mp3
```

**Example:** `Red_Light_m_EDM_128BPM_20260615_Audio_V1 (Vol. 6).mp3`

URL-encode the space before `(Vol.` as `%20`:

```
Red_Light_m_EDM_128BPM_20260615_Audio_V1%20(Vol.%206).mp3
```

---

## Known Inconsistencies in Legacy Data

These inconsistencies exist in older JSON files. They are **not bugs that break the site** but should be fixed when updating those mixes.

| Field | Old (legacy) | Target (new standard) | Files affected |
|---|---|---|---|
| `title` | `"Blue Full (f)"` | `"Subgenre · Blue Full (f) Mix · Vol. N"` | `full-blue.json`, most old entries |
| `color` | `"blue"` (lowercase) | `"Blue"` (capitalized) | `full-blue.json`, `light-purple.json`, others |
| `date` | `""` (empty) | `"YYYY-MM-DD"` | Most files except `light-red.json` |
| `subgenre` | `""` (empty) | e.g. `"Liquid Drum & Bass"` | Most old entries |
| `description_nl` | `""` (empty) | Unique 120–160 char Dutch description | Legacy entries if not yet backfilled |
| `description_en` | `""` (empty) | Unique 120–160 char English description | Legacy entries if not yet backfilled |
| `time` format | `"03:05"` or `"1:01:08"` | `"00:03:05"` or `"01:01:08"` | Most old tracklists |
| `audioSrc` domain | `pub-9096148d84e34c73a3eca828877fcd5b` | `pub-4fa4c2c1f9a644c4878cba29a7926443` | `full-blue.json` |

**Priority:** Fix `description` fields first — they have the highest SEO impact. Then `title`, `subgenre`, and `date`.

---

## Complete Example — Correct & SEO-Optimized

Below is a model entry that follows all rules and maximizes SEO value:

```json
{
  "id": "20260615", 
  "title": "Tech House · Red Light (m) Mix · Vol. 6",
  "description_nl": "Tech House mix van DJ Cylow. Een uur pumping grooves, strakke kicks en melodische elementen. Perfect voor een avondfeest of een lange drive.",
  "description_en": "Tech House mix by DJ Cylow. An hour of pumping grooves, tight kicks and melodic elements. Perfect for a house party or a long drive.",
  "description_EN": "Tech House mix by DJ Cylow. An hour of pumping grooves, tight kicks, and melodic elements. Perfect for a party night or a long drive.",
  "genre": "House",
  "subgenre": "Tech House",
  "color": "Red",
  "power": "Light",
  "frequency": "(m)",
  "volume": "Vol. 6",
  "date": "2026-06-15",
  "jaar": "2026",
  "maand": "Jun",
  "dag": "15",
  "permalink": "luister/mix/red-light-m-EDM-128BPM-20260615.html",
  "audioSrc": "https://pub-4fa4c2c1f9a644c4878cba29a7926443.r2.dev/red/Red_Light_m_EDM_128BPM_20260615_Audio_V1%20(Vol.%206).mp3",
  "image_wide_small": "/images/light/red/wide/image_light_red_20260615_wide-small.jpg",
  "image_wide_large": "/images/light/red/wide/image_light_red_20260615_wide-large.webp",
  "image_square": "/images/light/red/square/image_light_red_20260615_square.jpg", 
  "featured": false,
  "ignore": false,
  "top_artists": ["Tiësto", "MEDUZA", "Chris Lake"],
  "tags": [
      "tech house mix 2026",
      "tech house",
      "underground tech house",
      "driving tech house",
      "peak time tech house",
      "red music mood",
      "late night mix",
      "chilled electronic mix",
      "stil vor talent style",
      "drumcode vibe",
      "late night drive mix",
      "focus music",
      "club tech house 2026",
      "Tiesto mix",
      "deadmau5 mix",
      "Chris Lake",
      "MEDUZA mix",
      "SIDEPIECE",
      "Deeper Purpose",
      "Anabel Englund",
      "electronic music 2026",
      "DJ mix tech house"
    ],
  "tracklist": [
    { "time": "00:00:59", "track": "Anabel Englund & Kamino - Belong to Me" },
    { "time": "00:03:00", "track": "Roddy Lima - Shadows" },
    { "time": "00:04:59", "track": "JUNTARO - Paranoia" }
  ]
}
```

**Checklist for every new mix entry:**

- [ ] `id` is `YYYYMMDD`, unique across all files
- [ ] `title` follows `Subgenre · Color Power (frequency) Mix · Vol. N` format
- [ ] `subgenre` is filled in and matches the title
- [ ] `color` is capitalized and matches the filename
- [ ] `power` is `"Full"` or `"Light"` and matches the filename
- [ ] `date` is filled as `"YYYY-MM-DD"`
- [ ] `description_nl` is unique, 120–160 chars, in Dutch, geen dash (`-`/`—`), geen artiestnamen
- [ ] `description_en` is unique, 120–160 chars, in English, no dashes, no artist names
- [ ] `top_artists` contains the 3 most-searched artists from the tracklist
- [ ] `audioSrc` uses the active R2 bucket
- [ ] All three image paths are correct and files exist in `public/images/`
- [ ] Tracklist times use `"HH:MM:SS"` format
- [ ] Mix is placed at the **top** of the array (newest first)
