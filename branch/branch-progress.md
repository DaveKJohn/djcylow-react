## `fix/nederlandse-taal-en-404` progress

### Steps

- [x] `lang="en"` → `lang="nl"`, met de twee concrete gevolgen in de code genoteerd
- [x] De Engelse fallback-description vervangen; die belandde via `layout.tsx` in `out/404.html`
- [x] Een eigen `src/app/not-found.tsx` in de huisstijl, met `robots: noindex, follow`
- [x] Gemeten in de build: beide pagina's dragen `lang="nl"`, de 404 heeft een Nederlandse titel en
      description
- [x] De documentatie-tegenspraak opgelost: `CLAUDE.md` zei Engels, `README.md` zei Nederlands, de
      code gaf een derde antwoord. Alle drie zeggen nu hetzelfde, mét de reden waarom het misging
- [x] Poort groen
- [~] `description_en` uitfaseren — bewust niet. Dat veld is er voor een eventuele Engelse variant
      later, en de testsuite bewaakt het net zo streng als de Nederlandse

### Where I left off

Af. Zichtbaar: de 404-pagina is niet langer de kale Engelse Next-standaard maar een eigen pagina met
twee knoppen. De rest is een signaal naar browsers en zoekmachines.

Sluit #50.
