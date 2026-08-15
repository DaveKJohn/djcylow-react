## `fix/canonical-wijst-naar-een-redirect` progress

### Steps

- [x] Meten waar de site werkelijk staat: www geeft 301, kaal geeft 200
- [x] Meten wat de HTML beweert: canonical, og:url, JSON-LD, robots.txt, alle 84 sitemap-URL's
- [x] De 22 voorkomens in elf bestanden vervangen door één `SITE_URL`
- [x] `tests/canonical-urls.test.ts` tegen de gebouwde export, negatief getoetst
- [x] `tests/sitemap.test.ts` van zijn eigen kopie afhalen, met de reden erbij
- [x] Poort en volledige suite (213 tests)

### Where I left off

0 www-voorkomens in de export. Poort groen, 213 tests groen.

Wat hierna nog kan, en aan Dave is: in Google Search Console staat het www-domein mogelijk als
property. De 301 blijft gewoon werken, dus er gaat niets stuk, maar de nieuwe sitemap moet op het
kale domein worden aangemeld als dat er nog niet staat.
