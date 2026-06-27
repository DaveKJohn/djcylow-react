# Changelog
Wijzigingen op deze branch (feature/cookie-banner). Bij merge naar main schuiven deze regels onder ## [Unreleased] in de hoofd-CHANGELOG. Zie de werkwijze in CLAUDE.md.

## [Unreleased]

### Added
- Cookiebanner toegevoegd (`CookieBanner` component) — toont bij eerste bezoek, slaat keuze op in `localStorage`. GTM laadt alleen na accepteren; bij weigeren blijft GTM uitgeschakeld.

### Changed
- GTM-script verwijderd uit `layout.tsx` — GTM wordt nu volledig beheerd door de cookiebanner.
