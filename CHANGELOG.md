# Changelog

Alle noemenswaardige wijzigingen worden hier bijgehouden.

- **`[Unreleased]`** — werk op een feature-branch, nog niet live
- **`[vX.X.X]`** — op die datum live gegaan via merge naar `main`

Bij een release: hernoem `[Unreleased]` naar `[vX.X.X] - YYYY-MM-DD`, maak een
`release-notes/X.X.X.md` aan op basis van deze inhoud, en voeg de versie toe aan
`release-notes/README.md`.

---

## [Unreleased] — feature/i18n-setup

### Infrastructuur
- `next.config.ts`: `withNextIntl` plugin toegevoegd
- `src/i18n/routing.ts`: locales `['en', 'nl']`, defaultLocale `'en'`, localePrefix `'always'`
- `src/i18n/request.ts`: next-intl server-side configuratie
- `src/i18n/navigation.ts`: locale-aware `Link`, `redirect`, `usePathname`, `useRouter`
- `src/middleware.ts`: next-intl middleware voor locale-routing en redirects

### Routing
- `src/app/page.tsx`: rootpagina is nu taalpicker (EN | NL)
- `src/app/[locale]/`: alle pagina's verplaatst naar locale-segment met `layout.tsx`, `page.tsx`, `luister/`, `luister/mix/[slug]/`, `musicmoodcolours/`, `diensten/`

### UI strings
- `messages/en.json` + `messages/nl.json`: namespaces nav, common, mix, luister, musicMoodColours, diensten, footer, contact
- Navigation, Footer, BackButton, ReadMore, ContactForm: `useTranslations()` / `getTranslations()`
- Emotion labels (MusicMoodColours) vertaald: BasiskleurenCarousel + Erlenmeyers

### Tweetalige content
- `src/content/home.ts`: `getHomeContent(locale)` — volledige EN + NL teksten
- `src/content/musicmoodcolours.ts`: `getMusicMoodColoursContent(locale)`
- `src/content/diensten.ts`: `getDienstenContent(locale)`

### Mix beschrijvingen
- `description_en` veld toegevoegd aan alle mix-entries
- `scripts/add-mix.js`: genereert nu zowel `description` (NL) als `description_en` (EN)

### SEO
- `src/lib/metadata.ts`: helpers `localeAlternates()`, `ogLocale()`, `ogAlternateLocale()`
- Alle pages: hreflang alternate links + `og:locale` per taal

### LanguageSwitcher
- `src/components/ui/LanguageSwitcher.tsx`: EN | NL switcher in navigatie

### Bug fixes
- `Playlist.tsx`: mix-links gebruiken nu `@/i18n/navigation` Link (locale prefix werd niet meegestuurd)
- Inline CSS verplaatst naar SCSS (page.tsx, ContactForm, Filter, BasiskleurenCarousel, Erlenmeyers, Footer)

---

## [v1.15.0] - 2026-06-25

Zie [release-notes/1.15.0.md](release-notes/1.15.0.md)

## [v1.14.4] - 2026-06-25

Zie [release-notes/1.14.4.md](release-notes/1.14.4.md)

## [v1.14.3] - 2026-06-25

Zie [release-notes/1.14.3.md](release-notes/1.14.3.md)

## [v1.14.2] - 2026-06-25

Zie [release-notes/1.14.2.md](release-notes/1.14.2.md)

## [v1.14.1] - 2026-06-25

Zie [release-notes/1.14.1.md](release-notes/1.14.1.md)

## [v1.14.0] - 2026-06-25

Zie [release-notes/1.14.0.md](release-notes/1.14.0.md)

## [v1.13.0] - 2026-06-18

Zie [release-notes/1.13.0.md](release-notes/1.13.0.md)

## [v1.12.0] - 2026-06-16

Zie [release-notes/1.12.0.md](release-notes/1.12.0.md)

## [v1.11.1] - 2026-05-10

Zie [release-notes/1.11.1.md](release-notes/1.11.1.md)

## [v1.11.0] - 2026-05-08

Zie [release-notes/1.11.0.md](release-notes/1.11.0.md)

## [v1.10.0] - 2026-05-05

Zie [release-notes/1.10.0.md](release-notes/1.10.0.md)

## [v1.9.0] - 2026-05-01

Zie [release-notes/1.9.0.md](release-notes/1.9.0.md)

## [v1.8.0] - 2026-04-20

Zie [release-notes/1.8.0.md](release-notes/1.8.0.md)

## [v1.7.0] - 2026-04-13

Zie [release-notes/1.7.0.md](release-notes/1.7.0.md)

## [v1.6.0] - 2026-04-11

Zie [release-notes/1.6.0.md](release-notes/1.6.0.md)

## [v1.5.0] - 2026-04-10

Zie [release-notes/1.5.0.md](release-notes/1.5.0.md)

## [v1.4.0] - 2026-03-20

Zie [release-notes/1.4.0.md](release-notes/1.4.0.md)

## [v1.3.0] - 2026-03-19

Zie [release-notes/1.3.0.md](release-notes/1.3.0.md)

## [v1.2.0] - 2026-03-13

Zie [release-notes/1.2.0.md](release-notes/1.2.0.md)

## [v1.1.0] - 2026-03-11

Zie [release-notes/1.1.0.md](release-notes/1.1.0.md)

## [v1.0.1] - 2026-03-08

Zie [release-notes/1.0.1.md](release-notes/1.0.1.md)

## [v1.0.0] - 2026-03-07

Zie [release-notes/1.0.0.md](release-notes/1.0.0.md)
