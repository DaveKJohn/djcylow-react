## `config/tailwind-eruit` changelog

### Branch title

Tailwind verwijderd en de ongedefinieerde utility-klassen opgeruimd

### Branch ID

20260815-143542

### Branch type

config

### What does the change on this branch bring to main?

**Tailwind draaide niet, en dat wist niemand.** Tailwind v4 genereert alleen utilities voor een
stylesheet die `@import "tailwindcss"` bevat. De enige stylesheet die de app laadt is
`src/styles/main.scss`, en die had die regel niet. Het enige bestand met een Tailwind-at-rule was
`src/app/globals.scss` — dat **nergens werd geïmporteerd**, en de regel erin was bovendien
`@theme "tailwindcss"`, wat geen geldige entry is. Er is dus nooit één utility gegenereerd,
geverifieerd in de gebouwde CSS: nul Tailwind-signaturen (`--tw-`, `::backdrop`).

Dave heeft gekozen voor **eruit halen**. Aanzetten was de andere weg, maar die zet Preflight bovenop
de eigen reset in `base/_reset.scss` — een zichtbare wijziging op elke pagina, voor utilities die
niemand gebruikt. Weg zijn: `tailwindcss` en `@tailwindcss/postcss` uit `package.json`,
`postcss.config.mjs`, en `src/app/globals.scss`.

**Dat het niet draaide, is aantoonbaar in de markup gaan zitten** (#75). Er werden klassen
geschreven die stil niets deden:

| klasse | voorkomens | wat er gebeurt |
|---|---|---|
| `.w-fix` | 28× | **verwijderd** — bestond nergens, en niemand kon vaststellen welke breedte het hoorde te zetten |
| `.flex` | 6× | **verwijderd** — was Tailwind; de `.column`/`.row`-klassen zetten `display: flex` al |
| `.size-base` | 8× | **gedefinieerd** — de scale-key bestond al |
| `.size-lg` | 1× | **gedefinieerd** — idem |

De eerste twee zijn een no-op voor het uiterlijk: ze deden al niets, dus weghalen verandert geen
pixel en haalt alleen de suggestie weg dat er een regel achter zat. **De laatste twee zijn dat
niet.** Op de mixpagina staan `.size-base` en `.size-lg` náást wél werkende `.size-sm`/`.size-xs` in
dezelfde blokken; daar heeft iemand expliciet om een tekstgrootte gevraagd en de overgeërfde
gekregen. Die tekst krijgt nu de grootte die er stond — **dat is de enige zichtbare wijziging van
deze branch**, en precies wat op de preview bekeken moet worden.

Gemeten in de gebouwde CSS na afloop: `size-base` en `size-lg` staan er nu in (waren er niet),
`w-fix` nergens, en nog steeds geen enkele Tailwind-signatuur.

**En de documentatie beweerde het omgekeerde**, op drie plekken. `CLAUDE.md` zei "Tailwind v4 +
SCSS: beide worden naast elkaar gebruikt"; `README.md` had een tabelrij, een `tailwind.config` in
de mappenlijst die nooit heeft bestaan, en een eigen sectie die naar dat bestand verwees. Die zijn
vervangen door wat er werkelijk staat, inclusief een overzicht van de eigen utility-klassen.

Sluit #48 en #75.

### Significance

#### Tier 0

Er stond een frameworkafhankelijkheid in `package.json` die niets deed, en de documentatie stuurde
iedereen die hier styling schreef de verkeerde kant op — aantoonbaar, want er zijn 34 klassen in de
markup beland die nooit iets konden doen. De eigen utility-set is nu de enige, en staat beschreven.

**Score:** 3

#### Tier 1

Op de mixpagina's krijgt tekst die om `size-base`/`size-lg` vroeg eindelijk die grootte, dus de
typografische hiërarchie klopt daar weer met wat er in de code staat. Verder verandert er niets
zichtbaars: de verwijderde klassen deden al niets.

**Score:** 2

### Pull Request

