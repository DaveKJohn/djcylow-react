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
    "id_spotify": "mmc_edm_128bpm_light_m_red_20260615",
    "title": "Tech House Mix · Red Light (m) · Vol. 6",
    "title_spotify": "EDM 128BPM 🔴 Red Light (m) 🔴 Vol. 6",
    "description_nl": "Tech House mix van DJ Cylow. Warm en gedreven, vol strakke kicks en diepe basslines. Perfect voor sporten, rijden of je pre-party.",
    "description_en": "Tech House mix by DJ Cylow. Warm and driven, with tight kicks and deep basslines. Perfect for working out, driving, or pre-party.",
    "genre": "House",
    "subgenre": "Tech House",
    "bpm": 128,
    "color": "Red",
    "power": "Light",
    "frequency": "(m)",
    "volume": "Vol. 6",
    "volume_spotify": 6,
    "date": "2026-06-15",
    "jaar": "2026",
    "maand": "Jun",
    "dag": "15",
    "permalink": "luister/mix/red-light-m-EDM-128BPM-20260615.html",
    "audioSrc": "https://pub-4fa4c2c1f9a644c4878cba29a7926443.r2.dev/red/Red_Light_m_EDM_128BPM_20260615_Audio_V1%20(Vol.%206).mp3",
    "image_wide_small": "/images/light/red/wide/image_light_red_wide_20260615_small.jpg",
    "image_wide_large": "/images/light/red/wide/image_light_red_wide_20260615_large.webp",
    "image_square": "/images/light/red/square/image_light_red_square_20260615.jpg",
    "featured": false,
    "ignore": false,
    "top_artists": ["Tiësto", "MEDUZA", "Chris Lake"],
    "tags": ["tech house mix 2026", "tech house", "DJ mix"],
    "tracks": 2,
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

### `id_spotify` — string, required

Identifier used when the mix is published on Spotify. Not used anywhere in the site code — it exists
so the JSON stays the single administration of a mix across both channels.

**Format:**

```
mmc_edm_[bpm]bpm_[power-lowercase]_[frequency-letter]_[color-lowercase]_[YYYYMMDD]
```

**Example:** `"mmc_edm_128bpm_light_m_yellow_20251021"`

**Rules:**

- `mmc` (Music Mood Colours) and `edm` are fixed segments — `edm` does **not** change for Drum & Bass
  mixes; the BPM already distinguishes them (176 vs 128)
- Everything lowercase, segments separated by underscores
- `bpm` is the `bpm` field with the literal suffix `bpm`
- The frequency loses its parentheses: `"(m)"` → `m`
- Ends with the `id`, which makes the value **unique across all mixes**
- Preview entries (`ignore: true`) use `""`

---

### `title_spotify` — string, required

The title as used for the Spotify upload. Deliberately different from `title`: no subgenre, but with
the BPM in front and the volume at the end, and the mood colour as an emoji separating the two parts.

**Format:**

```
EDM [bpm]BPM [emoji] [Color] [Power] ([frequency]) [emoji] Vol. [N]
```

**Example:** `"EDM 128BPM 🟡 Yellow Light (m) 🟡 Vol. 7"`

**Emoji per colour:**

| Colour | Emoji | Colour | Emoji |
|---|---|---|---|
| Red | 🔴 | Cyan | 🧊 |
| Orange | 🟠 | Blue | 🔵 |
| Yellow | 🟡 | Purple | 🟣 |
| Green | 🟢 | Magenta | not yet determined |

Cyan uses an ice cube because Unicode has no cyan circle. Magenta has no marker yet — there is no
Magenta mix (only the preview entry), so pick one together with the first Magenta release.

> **This table said 💠 for Cyan until 2026-08-15, and all seven Cyan mixes use 🧊.** The spec was
> changed to match the data rather than the other way round, for one reason: those seven titles are
> already published on Spotify. Rewriting them here would leave the repo saying one thing and the
> live uploads another, and would make every future Cyan release the odd one out among its own
> siblings. Seven out of seven is a convention, not a slip.

**Rules:**

- `EDM` is fixed, also for Drum & Bass
- The same emoji appears **twice**: before the colour name and after the frequency
- `frequency` keeps its parentheses
- The volume number comes from **`volume_spotify`**, not from `volume` — see below
- Ends with the volume — **no `id`**: the date belongs in `id` and `id_spotify`, not in a title that
  is read by listeners. It closed the format until 2026-08-11
- Preview entries (`ignore: true`) use `""`

**Which volume, and why it carries the uniqueness.** The site's `volume` runs *per subgenre*, so the
same `Vol. N` recurs within one colour + power + frequency combination: `Red Light (m) Vol. 1` exists
as Tech House, Progressive House and Melodic Techno. This title omits the subgenre, so it uses
`volume_spotify` instead — that series counts straight through per colour + power + frequency + bpm.
The mix whose site title reads `Vol. 1` can therefore read `Vol. 6` here; that is intended, not a
mismatch. Because `volume_spotify` counts through per series and the series itself is spelled out in
the title, all 77 filled values stay unique without a date. That does mean a duplicate
`volume_spotify` within one series now produces a duplicate title — check it when you add a mix.

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

### `title` — string, required

The canonical name of the mix **inside this JSON**. It identifies a mix for whoever reads or
maintains the data.

> **Not rendered anywhere, and not an SEO field.** This spec previously called `title`
> **SEO-critical** and claimed it appears on mix cards, in the detail page `<h1>` and in the
> metadata. That is wrong, and it caused a release note to credit a data migration as an SEO
> improvement (corrected in v2.21.0's note). Every visible place builds its own text from `color`,
> `subgenre` and `volume` — see the table under [SEO Strategy per Field](#seo-strategy-per-field).
> The value does ship to the browser, because the whole mix JSON is bundled client-side, but it is
> never displayed. Verify with `grep -rl "Mix · Blue Full" out/ --include=*.html` after a build: no
> hits.
>
> Keep the format below anyway. A unique, descriptive name is what makes the data workable, and the
> `<60` character guideline keeps it readable in an editor.

**Required format:**

```
[Subgenre] Mix · [Color] [Power] ([Frequency]) · Vol. [N]
```

**Examples:**

- `"Tech House Mix · Red Light (m) · Vol. 6"`
- `"Progressive House Mix · Red Light (m) · Vol. 4"`
- `"Liquid Drum & Bass Mix · Blue Full (f) · Vol. 2"`
- `"Neurofunk Mix · Red Light (m) · Vol. 1"`

**Legacy formats (no longer present — do not reintroduce):**

- `"Blue Full (f)"` ← too short, no SEO value, and not unique
- `"Red Melodic Techno Mix · Vol. 3"` ← intermediate form, omits power and frequency
- `"Melodic Techno · Red Light (m) Mix · Vol. 1"` ← earlier target format, superseded by the above

**Rules:**

- The title is derived entirely from `subgenre`, `color`, `power`, `frequency` and `volume` —
  it holds no information of its own. If one of those changes, the title changes with it.
- Subgenre first, directly followed by `Mix`
- Use middle dot `·` as separator (not hyphen, not dash)
- Capitalize color (Red, Blue, Purple, etc.)
- Frequency in parentheses: `(f)` or `(m)`
- Volume number: `Vol. 1`, `Vol. 2`, etc.
- The resulting title must be **unique across all mixes**. Because the subgenre is part of it,
  two mixes sharing color + power + frequency + volume still get distinct titles — that situation
  does occur (see the `volume` field).
- Keep it under 60 characters, or Google truncates it in the search result. The current longest
  is 53.

Exception: the eight `ignore: true` preview entries keep their short legacy title. They have no
`subgenre` and/or `volume`, get no page (`generateStaticParams` skips them), and never appear in
the public playlist.

---

### `genre` — string, required

The genre family. Used by the Filter component on the Luister page — this is the value the
"Genre" filter buttons match against, so it must equal the **family** the `subgenre` belongs to,
not a generic EDM/DnB split.

**Allowed values (exactly as written) and which subgenres map to them:**

- `"House"` — `"House"`, `"Tech House"`, `"Deep House"`, `"Progressive House"`, `"Organic House"`, `"Afro House"`, `"Melodic House"`
- `"Techno"` — `"Melodic Techno"`, `"Hard Techno"`
- `"Nu-Disco"` — `"Nu-Disco"`
- `"Drum & Bass"` — `"Liquid Drum & Bass"`, `"Dancefloor Drum & Bass"`, `"Neurofunk"`, `"Jump Up"`, `"Vocal DnB"`, `"Techstep"`

**Rules:**

- `genre` must always equal the family of the `subgenre` value (see mapping above) — e.g. `subgenre: "Progressive House"` → `genre: "House"`, `subgenre: "Melodic Techno"` → `genre: "Techno"`
- Do not add a new top-level genre without also adding it to the `Filter.tsx` genre button list
- Preview entries (`ignore: true`, `subgenre: ""` or `"Preview"`) are excluded from the public playlist, so their `genre` value doesn't matter — leave as-is

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

### `bpm` — number, required

Tempo of the mix in beats per minute. Feeds `id_spotify` and `title_spotify`, and is the field to read
instead of parsing the BPM out of the `audioSrc` filename or the `permalink`.

**Format:** a plain number, no quotes and no unit: `128`, `176`, `112`

**Rules:**

- Drum & Bass is **always** `176`
- For the other genres: the actual tempo of the set, typically `128`
- Preview entries (`ignore: true`) use `0`
- Do not derive it from the `permalink` — that value is wrong in places (`full-yellow.json`
  `20260303` is a House set whose permalink says `176BPM` while the audio is 128)

**Current distribution:** `176` for 46 mixes, `128` for 30, `112` for 1 (`light-red.json`
`20230121`).

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

Volume number within the same **subgenre** + color + power + frequency series.

**Format:** `"Vol. N"` where N is the sequential number

**Examples:** `"Vol. 1"`, `"Vol. 6"`, `"Vol. 10"`

**Rules:**

- Number sequentially within the same subgenre + color + power + frequency combination
- Preview entries use `""` (empty string)

> **That rule describes 19 of the 32 existing series, not all 32** (measured 2026-08-15). In the other
> thirteen, `volume` was in fact counted per **color + power**, straight through subgenre and
> frequency. `full-orange.json` shows it plainly: its `(m)` and `(f)` entries interleave as 1..9
> rather than forming two separate series.
>
> The visible effect is a gap or a series that starts above 1 — a visitor can meet
> `Blue Full (f) · Vol. 2` without a Vol. 1 ever existing. That matters more than it looks, because
> `volume` builds the `<h1>`, the `<title>`, the OG title and GA4's `mix_title`.
>
> **Renumbering is deliberately not the answer.** It would rewrite ten existing titles and their URLs
> to fix something cosmetic. Follow the rule above for **new** mixes; treat the thirteen as history.
> This spec was corrected once before to match reality, and that correction did not go far enough —
> hence the number here rather than another rewording.

> **Note.** This spec previously said the series ran per color+power+frequency, without the
> subgenre. The data has never worked that way: `Red Light (m) Vol. 1` exists four times — as Tech
> House, Progressive House, Melodic Techno and Neurofunk — and there are eight more such pairs.
> The subgenre is what separates them, which is also why it belongs in the title. Corrected here to
> match reality, rather than renumbering 9 series and breaking their titles.

---

### `volume_spotify` — number, required

Sequential number for the Spotify side, counted within the same **color + power + frequency + bpm**
series — deliberately *without* the subgenre, so a number never recurs inside one series. Exists
because the site's `volume` cannot be counted straight through: that series runs per subgenre.

**Format:** a plain number, no quotes and no `Vol.` prefix: `1`, `6`, `9`

**Rules:**

- Counted **chronologically, oldest mix is `1`** — the same direction as `volume`
- The series runs across files only in theory: color and power already fix the file, so in practice
  it is per frequency + bpm within one file
- Drum & Bass counts as its own series: `Red Light (m)` has six 128 BPM mixes numbered `1`–`6` plus
  one 176 BPM Neurofunk mix that is its own `1`
- Preview entries (`ignore: true`) use `0`
- Adding a mix in between (an older date than an existing one) shifts the numbers of the mixes after
  it — renumber the series in that case

**Current state:** 27 series across the 77 mixes, the longest being `Purple Light (f)` 176 BPM with
`1`–`9`.

**This is the number `title_spotify` uses.** So changing a `volume_spotify` means the matching
`title_spotify` has to be rebuilt too. For 30 of the 77 mixes this number differs from the site's
`volume` — that is by design.

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

### `permalink` — string, required · **this is the URL**

The source of the mix page's URL. Not a legacy field: `mixSlug()` in `src/data/mixes/all.ts` derives
the route from it, and `Playlist`, the mix detail page and `sitemap.ts` all use that.

**Format:** `"luister/mix/[slug].html"`

**How the slug is derived** — strip the directory, strip `.html`, lowercase, trim:

```
permalink : luister/mix/red-light-m-EDM-128BPM-20260615.html
slug      : red-light-m-edm-128bpm-20260615
URL       : /luister/mix/red-light-m-edm-128bpm-20260615
```

**Rules:**

- **Required and non-empty.** An entry without a usable `permalink` gets **no page at all**:
  `generateStaticParams` skips it and the build still succeeds, so nothing goes red — the mix is
  simply missing from the site.
- The derived slug must be **unique**. Two mixes with the same slug means the second one is
  unreachable while both appear in the sitemap.
- Use only lowercase letters, digits and hyphens after the derivation.
- Old entries may follow different slug patterns — that is fine, the value is taken as-is.

`tests/mix-data.test.ts` enforces all four of these, so a mistake here fails the test suite rather
than quietly costing a page.

> **This section said the opposite until 2026-08-15.** It called `permalink` a legacy field, stated it
> was *"not used for routing"*, and instructed readers to *"use the slug derived from `id`, `color`,
> `power`, `frequency`, `genre`, and BPM"*. No such derivation exists anywhere in the codebase — all
> four call sites read `permalink` directly. Following that instruction for a new mix produced an
> entry with no page, and the build reported success.

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

> **The filename convention applies to NEW uploads.** Five existing files deviate from it —
> `Orange_light_` instead of `Orange_Light_`, `Audio_v1` with a lowercase v, a space where an
> underscore belongs before the date, `(Vol 1)` without the full stop, and three files with no suffix
> at all. Those are not being renamed: renaming an object in R2 breaks the live audio of a published
> mix, and the gain would be cosmetic.
>
> The reason to spell this out rather than leave it implied: without the qualifier, an odd-looking
> filename reads as "wrong name" and gets waved through. Two entries once carried the byte-identical
> `audioSrc` of a *different* mix, and the tell was exactly that — a filename that did not match its
> entry. Knowing which deviations are expected is what makes the unexpected one visible.

---

### `image_wide_small` — string, required

Path to the small-width wide-format cover image (used as playlist card thumbnail).

**Format:** `/images/[power-lowercase]/[color-lowercase]/wide/image_[power-lowercase]_[color-lowercase]_wide_[YYYYMMDD]_small.webp`

**Example:** `/images/light/red/wide/image_light_red_wide_20260615_small.webp`

**Rules:**

- Leading slash
- Power and color in lowercase in the path, regardless of the `color`/`power` field capitalization
- File type: `.webp` (this said `.jpg` until 2026-08-15; every file on disk is and always was `.webp`)
- Must be the **small** variant (480x270), not the large one. Two 2026 entries carried the `_large`
  path in this field because the small variant had never been generated — see `npm run images:webp`

---

### `image_wide_large` — string, required

Path to the large wide-format cover image (used on the mix detail page).

**Format:** `/images/[power-lowercase]/[color-lowercase]/wide/image_[power-lowercase]_[color-lowercase]_wide_[YYYYMMDD]_large.webp`

**Example:** `/images/light/red/wide/image_light_red_wide_20260615_large.webp`

**Rules:**

- Leading slash
- File type: `.webp` (for performance)

---

### `image_square` — string, required for `featured`, may be empty otherwise

Path to the square cover image (300x300). Read **only** by `BasiskleurenCarousel`, `Erlenmeyers`
and `VsKleurenCarousel`, which all filter on `featured === true` — so this field is what produces
the eight covers on `/musicmoodcolours`.

**Format:** `/images/[power-lowercase]/[color-lowercase]/square/image_[power-lowercase]_[color-lowercase]_square_[YYYYMMDD].webp`

**Example:** `/images/light/red/square/image_light_red_square_20260615.webp`

For a preview entry the date is replaced by `preview`:
`/images/light/red/square/image_light_red_square_preview.webp`

**Rules:**

- Leading slash
- File type: `.webp` (this said `.jpg` until 2026-08-15; every file on disk is and always was `.webp`)
- **Required and must exist when `featured` is `true`** — `tests/mix-data.test.ts` enforces this
- **May be an empty string otherwise**

> **This field said "required" until 2026-08-15, and 25 entries proved that untrue.** Their paths
> pointed at `square/` directories that mostly do not exist, in a name order (`..._[YYYYMMDD]_square`)
> that occurs nowhere on disk — so they were never generated but filled in by hand. They have been
> emptied rather than repaired, because the images cannot be derived: a square is **not** a crop of
> the matching wide image but a separate photo (measured: average channel difference 87.9 out of
> 255). Generating one would be inventing artwork. If Full mixes should have square covers, the
> images have to be supplied; until then an empty field is the honest value.

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

The 3 most-searched artists featured in this mix. Used in the mix description fallback and as SEO signal when no `description_nl` is set.

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

### `tags` — array of strings, optional, **SEO-critical**

Search keywords for this mix. Indexed as invisible metadata and used by search engines to match long-tail queries.

**Format:** Array of strings, each a lowercase search phrase or keyword.

**Example:**

```json
"tags": [
  "tech house mix 2026",
  "tech house",
  "underground tech house",
  "driving tech house",
  "DJ mix tech house",
  "Tiesto mix",
  "Chris Lake mix"
]
```

**Rules:**

- Include the subgenre name exactly as people search it (e.g. `"tech house mix 2026"`)
- Include artist name variants searchers use (e.g. `"Tiesto mix"` not just `"Tiësto"`)
- Include mood/use-case phrases (e.g. `"late night drive mix"`, `"focus music"`)
- Lowercase preferred, but artist names can keep their casing
- No minimum/maximum count — aim for 10–25 meaningful tags
- Do NOT repeat tags that are already in `title`, `subgenre`, or `genre` verbatim — add variants and long-tails
- **Preview entries (`ignore: true`) may omit this field entirely.** All eight do, and that is
  correct: previews are filtered out of the playlist, so they are never indexed and have nothing to
  be found by. This joins `date`, `volume` and `description`, which are already documented as
  optional for previews — the omission of `tags` from that list made eight entries look incomplete
  when they are not.

---

### `tracks` — number, required

The number of tracks in `tracklist`. Counted once and stored, so the total never has to be recounted
when it is needed.

**Format:** a plain number, no quotes: `33`

**Rules:**

- Must always equal `tracklist.length` — when you add or remove a track, update this field too
- Preview entries (`ignore: true`) have an empty tracklist and therefore `0`
- `scripts/add-mix.js` fills it automatically for new mixes

**Current range:** 22 to 46 tracks, median 35, 2667 tracks across all 77 mixes.

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
| `color` + `subgenre` + `volume` | Together they build the `<h1>`, the `<title>` tag, OG/Twitter title, the mix card and GA4's `mix_title` | **Critical** |
| `description_nl` | Meta description, OG description (NL) | **Critical** |
| `description_en` | Meta description, OG description (EN) — **not live yet**. The `feature/i18n-setup` branch was CLOSED on 2026-08-13 and archived as tag `archive/feature-i18n-setup`, so this will not go live on its own; the field is currently absent from the built HTML | **Critical** |
| `subgenre` | Appears in title, structured data, URL context | **High** |
| `tracklist` | Indexed as text content on the page; artists are searchable | **High** |
| `color` | Used in structured data and page schema | Medium |
| `date` | Freshness signal for Google indexing | Medium |
| `genre` | Structured data, filter categories | Medium |
| `image_*` | Open Graph image (rich snippet in social shares) | Medium |
| `title` | **None** — never rendered; see the field reference above | — |
| `id_spotify`, `title_spotify`, `volume_spotify`, `bpm`, `tracks` | **None** — not read by the site at all | — |

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
- Most other fields (`date`, `volume`, `image_wide_*`, `description_nl`, `description_en`,
  `id_spotify`, `title_spotify`) are empty strings; `bpm`, `tracks` and `volume_spotify` are `0`

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

**The legacy bucket holds every Full mix — all 25 entries across all seven `full-*.json` files.** The
60 Light entries are all on the active bucket. Measured on 2026-08-15.

> This read *"used by some older mixes in `full-blue.json`"* until that date, and the difference
> matters at exactly the wrong moment. Anyone retiring the old bucket on the strength of that sentence
> would expect to rewrite two URLs and would in fact take **25 mix pages offline**. That is a
> misjudged blast radius on the one operation here that carries real risk.
>
> Nothing is broken while the legacy bucket keeps serving. Migrating those 25 entries is worth doing,
> but as its own deliberate piece of work — not as a side effect of something else.

New mixes and re-uploads always go to the active bucket.

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
| `title` | `"Blue Full (f)"` | `"Subgenre Mix · Blue Full (f) · Vol. N"` | `full-blue.json`, most old entries |
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
  "id_spotify": "mmc_edm_128bpm_light_m_red_20260615",
  "title": "Tech House Mix · Red Light (m) · Vol. 6",
  "title_spotify": "EDM 128BPM 🔴 Red Light (m) 🔴 Vol. 6",
  "description_nl": "Tech House mix van DJ Cylow. Een uur pumping grooves, strakke kicks en melodische elementen. Perfect voor een avondfeest of een lange drive.",
  "description_en": "Tech House mix by DJ Cylow. An hour of pumping grooves, tight kicks and melodic elements. Perfect for a house party or a long drive.", 
  "genre": "House",
  "subgenre": "Tech House",
  "bpm": 128,
  "color": "Red",
  "power": "Light",
  "frequency": "(m)",
  "volume": "Vol. 6",
  "volume_spotify": 6,
  "date": "2026-06-15",
  "jaar": "2026",
  "maand": "Jun",
  "dag": "15",
  "permalink": "luister/mix/red-light-m-EDM-128BPM-20260615.html",
  "audioSrc": "https://pub-4fa4c2c1f9a644c4878cba29a7926443.r2.dev/red/Red_Light_m_EDM_128BPM_20260615_Audio_V1%20(Vol.%206).mp3",
  "image_wide_small": "/images/light/red/wide/image_light_red_wide_20260615_small.jpg",
  "image_wide_large": "/images/light/red/wide/image_light_red_wide_20260615_large.webp",
  "image_square": "/images/light/red/square/image_light_red_square_20260615.jpg",
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
  "tracks": 3,
  "tracklist": [
    { "time": "00:00:59", "track": "Anabel Englund & Kamino - Belong to Me" },
    { "time": "00:03:00", "track": "Roddy Lima - Shadows" },
    { "time": "00:04:59", "track": "JUNTARO - Paranoia" }
  ]
}
```

**Checklist for every new mix entry:**

- [ ] `id` is `YYYYMMDD`, unique across all files
- [ ] `id_spotify` follows `mmc_edm_[bpm]bpm_[power]_[freq]_[color]_[id]` and is unique
- [ ] `title` follows `[Subgenre] Mix · [Color] [Power] ([Frequency]) · Vol. [N]` format
- [ ] `title_spotify` follows `EDM [bpm]BPM [emoji] Color Power (freq) [emoji] Vol. N` (no date) and is unique
- [ ] `bpm` is a number without quotes (`176` for Drum & Bass)
- [ ] `subgenre` is filled in and matches the title
- [ ] `color` is capitalized and matches the filename
- [ ] `power` is `"Full"` or `"Light"` and matches the filename
- [ ] `date` is filled as `"YYYY-MM-DD"`
- [ ] `description_nl` is unique, 120–160 chars, in Dutch, geen dash (`—`), geen artiestnamen
- [ ] `description_en` is unique, 120–160 chars, in English, no dash (`—`), no artist names
- [ ] `top_artists` contains the 3 most-searched artists from the tracklist
- [ ] `audioSrc` uses the active R2 bucket
- [ ] All three image paths are correct and files exist in `public/images/`
- [ ] Tracklist times use `"HH:MM:SS"` format
- [ ] `tracks` equals the number of items in `tracklist`
- [ ] `volume_spotify` continues the color+power+frequency+bpm series (no `Vol.` prefix)
- [ ] Mix is placed at the **top** of the array (newest first)
