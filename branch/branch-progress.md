## `fix/luister-crash-en-ssr` progress

### Steps

- [x] `MOOD_DATA` opzoeken i.p.v. dereferencen; normalisatie op één plek (#44)
- [x] Magenta toegevoegd, met de omschrijving die de rest van de site aanhoudt (#44)
- [x] `page.tsx` server component; statisch deel buiten de Suspense-grens (#43)
- [x] `PlaylistFallback`: server-gerenderde mixlijst als fallback, dus wél in de HTML (#43)
- [x] `mounted`-poort beperkt tot de class en de mobiele onderdelen (#43)
- [x] `onPlay`/`activeId` doorgegeven, zodat spelers elkaar pauzeren (#56)
- [x] `src/data/mixes/all.ts` als enige bron voor de imports en de slug
- [x] Resultaat gemeten in `out/`: 77 unieke mixlinks, `<main>` en `<h1>` aanwezig
- [x] Elf tests op de crash-guard en op magenta
- [x] Lint-poort groen, 82 tests

### Where I left off

Klaar voor PR, maar **dit is site-werk en wacht op Dave**. Twee dingen om op de deploy preview te
bekijken:

1. **De moodtekst van magenta is nieuwe publieke tekst.** Er stond niets, dus die is geschreven in
   de stijl van de andere zeven: *geïrriteerd · gespannen · rusteloos · fel*.
2. **De fallback is even zichtbaar tijdens de hydratie.** Hij toont dezelfde kaarten maar zonder
   speler, en de volledige lijst in plaats van de eerste tien. Op een trage verbinding kan die flits
   opvallen; dat is de prijs voor 77 links in de HTML.

Wat hierna komt: issue #83 zet de vier overige gebruikers van de mix-imports op `all.ts` over.

