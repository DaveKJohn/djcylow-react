# DJ Cylow — Official Website

Portfolio, booking, and music discovery website for **DJ Cylow**, a House & Nu-Disco DJ based in Alphen aan den Rijn, the Netherlands. Built with Next.js and deployed as a fully static site on Netlify.

---

## Table of Contents

1. [Project Purpose](#project-purpose)
2. [Tech Stack](#tech-stack)
3. [Local Development](#local-development)
4. [Environment Variables](#environment-variables)
5. [Directory Structure](#directory-structure)
6. [Routing & Pages](#routing--pages)
7. [Component Architecture](#component-architecture)
8. [Data Layer — Mixes](#data-layer--mixes)
9. [Public Assets — Images](#public-assets--images)
10. [Styling System](#styling-system)
11. [State Management](#state-management)
12. [Content Layer](#content-layer)
13. [Audio & Media](#audio--media)
14. [Contact Form & Email](#contact-form--email)
15. [Deployment — Netlify](#deployment--netlify)
16. [Adding a New Mix](#adding-a-new-mix)
17. [Design Constants & Breakpoints](#design-constants--breakpoints)

---

## Project Purpose

This site has four main goals:

| Section | Purpose |
|---|---|
| **Home** | DJ Cylow intro, bio, promo video, services overview, contact |
| **Diensten** (Services) | Booking landing pages for three service types (weddings, corporate, house) |
| **Luister** (Listen) | Browsable mix library with color/genre/intensity filtering and built-in audio player |
| **Music Mood Colours** | Educational/interactive page explaining the "colour theory of music moods" system |

The "Music Mood Colours" concept is central to the brand: each mix is assigned a **color** (representing emotional mood) and an **intensity** (Light or Full), inspired by complementary color theory and neuroscience (the Lövheim Cube model for dopamine/serotonin/adrenaline).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.4 (App Router, static export) |
| UI Library | React 19.2.3 |
| Language | TypeScript 5 |
| Styling | SASS/SCSS + CSS modules |
| Email | Nodemailer 8 via Netlify Functions |
| HTTP | Axios 1.13 |
| Forms | react-google-recaptcha 3.1 |
| Analytics | Google Tag Manager (`@next/third-parties`) |
| Reviews | react-google-reviews 1.8 |
| Audio storage | Cloudflare R2 (CDN bucket) |
| Hosting | Netlify (static export) |

**Key architectural decision:** `output: 'export'` in `next.config.ts` means this is a **fully static site** — no Node.js server at runtime. All dynamic behavior (contact form email) runs via Netlify serverless functions.

---

## Local Development

```bash
npm install
npm run dev        # starts dev server at http://localhost:3000
npm run build      # static export → out/ (.next/ is build-output and cache)
npm run lint       # ESLint check
```

---

## Environment Variables

Create a `.env` file in the project root (never commit this):

```env
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=465
MAIL_USER=<smtp username>
MAIL_PASS=<smtp password>
RECAPTCHA_SECRET_KEY=<google recaptcha v2 secret>
```

These are used exclusively by the Netlify serverless function at `netlify/functions/` that handles contact form submissions via Nodemailer.

---

## Directory Structure

```
djcylow-react/
├── src/
│   ├── app/                    # Next.js App Router — pages & layouts
│   │   ├── layout.tsx          # Root layout (Nav, Footer, GTM, UX Mode toggle)
│   │   ├── page.tsx            # Home page
│   │   ├── diensten/           # Services pages (booking)
│   │   │   ├── page.tsx        # Services landing
│   │   │   ├── bruiloft-dj/    # Wedding DJ page
│   │   │   ├── bedrijfsfeest-dj/  # Corporate event DJ page
│   │   │   └── house-dj/       # House DJ page
│   │   ├── luister/            # Mix library
│   │   │   ├── page.tsx        # Playlist grid + filter ('use client')
│   │   │   └── mix/[slug]/     # Dynamic mix detail page (static params)
│   │   └── musicmoodcolours/   # Educational interactive page
│   │       └── page.tsx
│   │
│   ├── components/             # All React components
│   │   ├── home/               # 7 components for the home page
│   │   ├── layout/             # Navigation.tsx, Footer.tsx
│   │   ├── luister/            # Filter.tsx, Playlist.tsx
│   │   ├── sections/           # ContactForm.tsx
│   │   ├── ui/                 # Reusable UI: AudioPlayer, Carousel, BackButton, ReadMore, MobileContent
│   │   ├── common/             # EmailDisplay.tsx (obfuscated email)
│   │   └── musicmoodcolours/   # 6 interactive/visual components
│   │
│   ├── styles/                 # SCSS architecture (see Styling section)
│   │   ├── abstracts/          # Variables, mixins, functions
│   │   ├── base/               # Reset, typography, root, layout
│   │   ├── components/         # Per-component styles
│   │   ├── layout/             # Nav/footer styles
│   │   ├── modules/            # CSS Modules (home, luister, musicmoodcolours)
│   │   ├── pages/              # Page-level styles
│   │   ├── utilities/          # Spacing, colors
│   │   └── main.scss           # Central SCSS entry point
│   │
│   ├── data/
│   │   └── mixes/              # 15 JSON files, one per color/intensity combo
│   │
│   ├── content/                # TypeScript content objects (text, images)
│   │   ├── home.ts
│   │   ├── diensten.ts
│   │   ├── musicmoodcolours.ts
│   │   └── referenties.ts
│   │
│   └── constants/
│       └── design.ts           # Breakpoints: LARGE 1774px, MEDIUM 1331px, SMALL 884px
│
├── public/                     # Static assets served at root
│   ├── djcylow_logo.webp       # Navigation logo (130×51)
│   ├── hero_desktop.webp       # Hero image (desktop)
│   ├── hero_mobile.webp        # Hero image (mobile)
│   ├── face.webp               # DJ portrait
│   ├── pattern.webp            # Background texture
│   ├── verzoek.webp            # Song request section image
│   └── images/                 # Mix cover images (see Assets section)
│
├── netlify/
│   └── functions/              # Serverless functions (contact form email)
│
├── scripts/                    # Build/utility scripts
├── releases/                   # Generated release notes (development/ + github/, v1.0.0 – present)
├── contributing-davekjohn/     # The workflow's own folder: development-cycle.md (while a branch is
│                               #   open), release history, audience notes, and its CONTRIBUTING layer
├── CONTRIBUTING.md             # The standard workflow; the plugin's layer is in contributing-davekjohn/
├── CLAUDE.md                   # Operating guide: safety rules, the specialists, repo conventions
├── next.config.ts              # output: 'export', images: unoptimized, sassOptions
├── tsconfig.json               # strict, ES2017, path alias @/* → ./src/*
└── netlify.toml                # Build command, publish dir, security headers
```

---

## Routing & Pages

All routes are statically generated at build time.

| URL | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Home (Hero, Promo, ContactForm) |
| `/diensten` | `app/diensten/page.tsx` | Services landing page |
| `/diensten/bruiloft-dj` | `app/diensten/bruiloft-dj/page.tsx` | Wedding DJ |
| `/diensten/bedrijfsfeest-dj` | `app/diensten/bedrijfsfeest-dj/page.tsx` | Corporate event DJ |
| `/diensten/house-dj` | `app/diensten/house-dj/page.tsx` | House DJ |
| `/luister` | `app/luister/page.tsx` | Mix library with filters |
| `/luister/mix/[slug]` | `app/luister/mix/[slug]/page.tsx` | Individual mix detail + player |
| `/musicmoodcolours` | `app/musicmoodcolours/page.tsx` | Interactive music theory page |

**Mix slug: derived from `permalink`, not constructed.** The slug is whatever `permalink` says, with
the directory and the `.html` suffix stripped and the rest lowercased — see `mixSlug()` in
`src/data/mixes/all.ts`. Do not build a slug from the other fields: an entry whose `permalink` is
missing or misspelled yields no page at all, and the build will not complain.

```
permalink : luister/mix/red-light-m-EDM-128BPM-20260615.html
slug      : red-light-m-edm-128bpm-20260615
```

In practice the filename follows `[color]-[power]-[frequency]-[genre]-[bpm]-[YYYYMMDD]`, but older
entries omit the BPM segment. That is a description of what happens to be there, not a rule the code
enforces. Note that the `genre` segment carries historical values such as `EDM` that the `genre`
*field* never uses.

The `generateStaticParams()` in `mix/[slug]/page.tsx` reads all mix JSON files and pre-generates every detail page at build time. `tests/mix-data.test.ts` asserts that every live mix has a non-empty `permalink` ending in `.html`, and that the derived slugs are unique.

---

## Component Architecture

### Home Components (`src/components/home/`)

| Component | Purpose |
|---|---|
| `Hero.tsx` | Full-width hero with title, subtitle, desktop/mobile images |
| `Promo.tsx` | Embedded YouTube promo video with `<ReadMore>` expansion for bio |

> **Only `Hero` and `Promo` are rendered.** The home page also mounts `ContactForm` from
> `src/components/common/`. Five further components live in this directory but are not on the page:
> `Diensten.tsx`, `MeetTheDJ.tsx`, `Referenties.tsx`, `Verzoeknummers.tsx` and `GoogleReviews.tsx` —
> the last two are commented out in `page.tsx`, the rest are not imported at all. This table listed
> all seven as if they shipped until 2026-08-15. Their removal is tracked separately, because
> deleting files under `src/` is a change that has to be looked at rather than reasoned about.

### Layout Components (`src/components/layout/`)

| Component | Purpose |
|---|---|
| `Navigation.tsx` | Top nav: logo, menu links, "Boek nu!" CTA button; uses `<MobileContent>` for hamburger menu |
| `Footer.tsx` | Logo + social links (Instagram, LinkedIn, Facebook) |

### Luister (Listen) Components (`src/components/luister/`)

| Component | Purpose |
|---|---|
| `Playlist.tsx` | Mix grid with `useMemo` filtering, load-more pagination, and `<AudioPlayer>` per card. `activeId` tracks which mix is playing. |
| `Filter.tsx` | Filter UI: color mood (8 colors), genre (House / Techno / Drum & Bass / Nu-Disco), intensity (Full / Light) |

### UI Components (`src/components/ui/`)

| Component | Purpose |
|---|---|
| `AudioPlayer.tsx` | Custom audio player: play/pause, time scrubber, volume, duration. Manages `<audio>` ref. |
| `Carousel.tsx` | Horizontal scroll carousel with prev/next arrow controls |
| `BackButton.tsx` | Back navigation button |
| `ReadMore.tsx` | Collapsible content (show more / show less toggle) |
| `MobileContent.tsx` | Responsive drawer/hamburger menu logic; tracks `isMobile` via media query, auto-closes on route change |

### MusicMoodColours Components (`src/components/musicmoodcolours/`)

| Component | Purpose |
|---|---|
| `BasiskleurenCarousel.tsx` | Audio carousel for "base colors" sound examples |
| `VsKleurenCarousel.tsx` | Comparative carousel (same beat, different mood colors) |
| `CanvasCircle.tsx` | Canvas-based color wheel visualization |
| `Erlenmeyers.tsx` | Interactive neurotransmitter vials: dopamine, serotonin, adrenaline (Lövheim Cube concept) |
| `KubusNeuro.tsx` | 3D cube visualization for neuro model |
| `KubusHoeken.tsx` | 3D cube corners visualization |

### Common Components (`src/components/common/`)

| Component | Purpose |
|---|---|
| `EmailDisplay.tsx` | Renders email address in a way that avoids plain-text scraping |

### Sections (`src/components/sections/`)

| Component | Purpose |
|---|---|
| `ContactForm.tsx` | Contact/booking form with reCAPTCHA v2 (lazy-loaded), posts to Netlify function |

---

## Data Layer — Mixes

All mix metadata lives in `src/data/mixes/` as JSON files. There are **30 files** total.

### File naming convention

```
[power]-[color].json
```

Examples: `full-blue.json`, `light-red.json`, `light-magenta.json`

### Available colors

| Color | Full mix | Light mix |
|---|---|---|
| blue | ✓ | ✓ |
| cyan | ✓ | ✓ |
| green | ✓ | ✓ |
| orange | ✓ | ✓ |
| red | ✓ | ✓ |
| purple | ✓ | ✓ |
| yellow | ✓ | ✓ |
| magenta | — | ✓ |

### JSON structure (one entry per mix within the file)

Each JSON file is an **array** of mix objects:

```json
[
  {
    "id": "20240408",
    "featured": false,
    "ignore": false,
    "title": "Blue Full (f)",
    "genre": "Drum & Bass",
    "subgenre": "",
    "color": "Blue",
    "power": "Full",
    "frequency": "(f)",
    "volume": "Vol. 2",
    "date": "",
    "jaar": "2024",
    "maand": "Apr",
    "dag": "08",
    "permalink": "luister/mix/blue-full-f-DNB-20240408.html",
    "audioSrc": "https://pub-4fa4c2c1f9a644c4878cba29a7926443.r2.dev/...",
    "image_wide_small": "/images/full/blue/wide/image_full_blue_wide_20240408_small.jpg",
    "image_wide_large": "/images/full/blue/wide/image_full_blue_wide_20240408_large.webp",
    "image_square": "/images/full/blue/square/image_full_blue_square_20240408.jpg",
    "description": "",
    "tracklist": [
      { "time": "00:00", "track": "1991 - Power (ft. BullySongs)" },
      { "time": "02:37", "track": "Delta Heavy - Kaleidoscope" }
    ]
  }
]
```

**Field notes:**
- `id` — date string `YYYYMMDD`. Used for sorting and as the entry's key; **not** for the slug
- `featured` — if `true`, shown prominently in the playlist grid
- `ignore` — if `true`, excluded from the public playlist
- `genre` — one of `"House"`, `"Techno"`, `"Drum & Bass"` or `"Nu-Disco"` — must be the family of
  `subgenre`, or the mix drops out of its own filter. Measured over the 77 live mixes: Drum & Bass 46,
  House 18, Nu-Disco 10, Techno 3
- `power` — either `"Full"` or `"Light"` — the intensity dimension of Music Mood Colours
- `audioSrc` — hosted on **Cloudflare R2** CDN bucket
- `tracklist` — structured array of `{ time, track }` objects; displayed on mix detail page
- `permalink` — **the source of the URL slug.** Not a legacy field: `Playlist`, the mix detail page
  and `sitemap.ts` all derive the route from it. An entry without a valid `permalink` gets no page

> **Two of these read the opposite way until 2026-08-15.** `genre` was documented as *"either `EDM` or
> `Drum & Bass`"* while no mix has ever carried `genre: "EDM"` — that value only survives inside older
> `permalink` filenames. And `permalink` was written off as legacy while it is the one field the whole
> routing hangs on. The full field spec lives in [`src/data/mixes/README.md`](src/data/mixes/README.md);
> where the two disagree, that one is closer to the data.

**Slug derivation** (`mixSlug()` in `src/data/mixes/all.ts`):
```
permalink -> strip directory -> strip ".html" -> lowercase -> trim
```
Example: `luister/mix/blue-full-f-DnB-176BPM-20240408.html` → `blue-full-f-dnb-176bpm-20240408`

---

## Public Assets — Images

Mix cover images follow a strict naming convention and folder structure under `public/images/`:

```
public/images/
├── full/           # Full-intensity mixes
│   ├── blue/
│   │   ├── wide/
│   │   │   ├── image_full_blue_wide_YYYYMMDD_small.jpg    # ~400px wide, used as preview
│   │   │   └── image_full_blue_wide_YYYYMMDD_large.webp   # Hi-res, used on detail page
│   │   └── square/
│   │       └── image_full_blue_square_YYYYMMDD.jpg        # Square crop, used in playlist cards
│   ├── cyan/ ... green/ ... orange/ ... purple/ ... red/ ... yellow/
│
└── light/          # Light-intensity mixes (same structure, includes magenta)
    ├── blue/ ... cyan/ ... green/ ... magenta/ ... orange/ ... purple/ ... red/ ... yellow/
```

**Image types:**
- `wide_{date}_small.jpg` — JPG, ~400px wide, fast-loading playlist thumbnail
- `wide_{date}_large.webp` — WebP, full resolution, used on mix detail page
- `square_{date}.jpg` — JPG, square crop, used in mix cards in the playlist grid

---

## Styling System

The project uses a custom **SCSS architecture**, and nothing else.

> Until 2026-08-15 this section claimed Tailwind CSS v4 ran alongside it. It did not: no stylesheet
> the app loads ever contained the `@import "tailwindcss"` entry, so not a single utility was ever
> generated — verified against the built CSS. Tailwind has been removed rather than switched on,
> because enabling it would drop Preflight on top of the existing reset in `base/_reset.scss`.

### SCSS Architecture (`src/styles/`)

```
styles/
├── abstracts/
│   ├── _variables.scss     # Color palette, spacing scale, font sizes
│   ├── _mixins.scss        # Responsive helpers, flex/grid shortcuts
│   └── _functions.scss     # SCSS functions
├── base/
│   ├── _root.scss          # CSS custom properties (:root)
│   ├── _reset.scss         # Normalize/reset
│   ├── _typography.scss    # Font faces, heading/body styles
│   └── _layout.scss        # Global container/grid helpers
├── components/             # Per-component SCSS partials
├── layout/                 # Navigation and footer SCSS
├── modules/                # CSS Modules (scoped to pages)
│   ├── home.module.scss
│   ├── luister.module.scss
│   └── musicmoodcolours.module.scss
├── pages/                  # Page-level layout styles
├── utilities/
│   ├── _spacing.scss       # Margin/padding utilities
│   └── _colors.scss        # Color utility classes
└── main.scss               # Imports all partials in correct order
```

`next.config.ts` includes `src/styles` in the SASS load path, so partials can be imported without relative paths.

### Utility classes

Generated from `base/_layout.scss` and `base/_typography.scss` — there is no utility framework.

| class | effect |
|---|---|
| `w-fill` / `w-hug` | `width: 100%` / `width: fit-content` |
| `size-xs` … `size-lg` | font size from the design scale |
| `spacing-*` | gap from the spacing scale |
| `balanced`, `bold`, `italic`, `left`, `center` | text helpers |

> `size-base` and `size-lg` were used in the markup but not generated until 2026-08-15, so they
> silently did nothing. A `w-fix` class was used 28 times and never existed at all; those usages
> have been removed rather than given a definition, since nobody could establish what width it was
> meant to set.

---

## State Management

No global state management library (no Redux, Zustand, etc.). All state is **local component state**.

| Component | State | Purpose |
|---|---|---|
| `luister/page.tsx` | `activeColor`, `activeGenre`, `activePower` | Filter selections, passed as props to `<Playlist>` and `<Filter>` |
| `Playlist.tsx` | `limit`, `activeId` | Load-more pagination; currently playing mix ID |
| `AudioPlayer.tsx` | `isPlaying`, `isLoading`, `currentTime`, `duration`, `volume` | Audio playback state; wraps an `<audio>` ref |
| `MobileContent.tsx` | `isOpen`, `isMobile` | Hamburger menu drawer; media query tracking; auto-closes on navigation |
| `Navigation.tsx` | (via MobileContent) | Hamburger menu |
| `Promo.tsx` | `isPlaying`, `isExpanded` | Video player state and ReadMore expansion |

---

## Content Layer

Text content and static data (not mix metadata) lives in `src/content/` as TypeScript objects.

| File | Contains |
|---|---|
| `home.ts` | Hero title/subtitle, DJ bio paragraphs, image paths for home sections |
| `diensten.ts` | Services metadata — names, descriptions, images for the three booking types |
| `musicmoodcolours.ts` | Full content for the Music Mood Colours page: sections (intro, spectrum, complementair, neuro, conclusie), descriptions, audio examples |
| `referenties.ts` | `Referentie` TypeScript interface + array of testimonials (client name, quote, event type) |

To update text content on any page, edit the corresponding file in `src/content/` — no need to touch the component files themselves.

---

## Audio & Media

- All mix audio files are hosted on a **Cloudflare R2 CDN bucket**:
  `https://pub-4fa4c2c1f9a644c4878cba29a7926443.r2.dev/`
- The `audioSrc` field in each mix JSON points to the full CDN URL.
- The custom `<AudioPlayer>` component manages an HTML `<audio>` element via a React ref.
- The promo video on the home page is an **embedded YouTube video** (via `@next/third-parties`).
- Google Tag Manager is lazy-loaded (only after first user interaction) to not block initial render.

---

## Contact Form & Email

The contact form (`src/components/sections/ContactForm.tsx`):
1. Collects name, email, event type, message
2. Validates with Google reCAPTCHA v2 (lazy-loaded)
3. POSTs to a Netlify serverless function at `netlify/functions/`
4. The function uses **Nodemailer** to send via SMTP (`smtp.hostinger.com`, port 465)
5. Email is sent to the DJ Cylow inbox.

Required environment variables: `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`, `RECAPTCHA_SECRET_KEY`.

`<EmailDisplay>` in the footer/contact renders the email address in a scraping-resistant way.

---

## Deployment — Netlify

Config: `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "out"

[functions]
  directory = "netlify/functions"
```

> **`publish` was `.next` tot 2026-08-15.** With `output: 'export'`, `next build` writes the complete
> static site to `out/`; `.next/` holds build output and cache and has no `index.html`. The site
> worked regardless because Netlify's Next.js runtime recognises `output: 'export'` and picks the
> export directory itself — but that runtime is declared nowhere in `netlify.toml`, so the config
> relied on a detection the repo does not record. See the comments in `netlify.toml` for how this was
> verified before merging.

Security headers set in `netlify.toml`:
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

> This listed `DENY` until 2026-08-15 while the config has always said `SAMEORIGIN`. The doc was
> corrected to match the config and not the other way round: `netlify.toml` is a protected file here,
> and tightening a live security header is a change to make deliberately rather than to slip in as a
> documentation fix.

**Why static export?** `next.config.ts` sets `output: 'export'` and `images: { unoptimized: true }`. This means:
- No server-side rendering at request time
- All pages are pre-generated HTML at build time
- Next.js Image Optimization is disabled (images are served as-is from `/public`)
- Contact form email functionality runs in Netlify Functions (not Next.js API routes)

---

## Adding a New Mix

1. **Add the audio file** to the Cloudflare R2 bucket and note the CDN URL.
2. **Add cover images** to `public/images/[full|light]/[color]/[wide|square]/` following the naming convention: `image_[power]_[color]_YYYYMMDD_[size].jpg/.webp`
3. **Edit the JSON file** at `src/data/mixes/[power]-[color].json` — append a new object to the array with all required fields (see Data Layer section above).
4. **Run `npm run build`** — `generateStaticParams()` will automatically pick up the new entry and generate its detail page.

The `ignore: true` flag can be used to add a mix to the data without making it public.

---

## Design Constants & Breakpoints

Defined in `src/constants/design.ts`:

```ts
export const BREAKPOINTS = {
  LARGE: 1774,    // px — wide desktop
  MEDIUM: 1331,   // px — standard desktop / large tablet
  SMALL: 884,     // px — tablet / mobile breakpoint
}
```

`MobileContent.tsx` uses these breakpoints programmatically (via `window.matchMedia`) to determine when to render the hamburger drawer versus the full navigation.

---

## Language & Locale

The site is in **Dutch**, and since 2026-08-15 the markup says so too: `<html lang="nl">`. It carried
`lang="en"` until then, which is why `CLAUDE.md` described the site as English — the attribute was
taken for a decision. All content has always been Dutch. Key Dutch terms used throughout the codebase:

| Dutch | English meaning |
|---|---|
| Luister | Listen (the mix library page) |
| Diensten | Services (booking pages) |
| Bruiloft | Wedding |
| Bedrijfsfeest | Corporate party/event |
| Referenties | Testimonials / References |
| Verzoeknummers | Song requests |
| Boek nu! | Book now! (CTA) |
| Maand / Dag / Jaar | Month / Day / Year (used in mix JSON) |

---

## Version History

Detailed release notes are stored in three directories named after their reader, all under `contributing-davekjohn/releases/`: `changelog/` holds the full per-PR record of every release, `audience/` holds a plain-language note for Minor/Major releases, and `github/` holds the short announcement used as the GitHub Release body. `audience/` moved into that folder on 2026-08-16 (plugin v4.12.0) because it was the first of the three to become a configurable seam; `changelog/` (named `development/` until then) and `github/` stayed hardcoded in the release script and sat at the repo root until 2026-08-27, when the source turned them into seams too and this repo moved the files to match. See [`contributing-davekjohn/releases/README.md`](contributing-davekjohn/releases/README.md).
