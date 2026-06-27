# Changelog
Wijzigingen op deze branch (feature/i18n-setup). Bij merge naar main schuiven deze regels onder ## [Unreleased] in de hoofd-CHANGELOG. Zie de werkwijze in CLAUDE.md.

## [Unreleased]

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
