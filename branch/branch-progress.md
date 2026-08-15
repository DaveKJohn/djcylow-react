## `fix/mix-imports-een-bron` progress

### Steps

- [x] Gemeten welke van de zes bestanden nog een eigen kopie droegen: `Playlist.tsx` was al over,
      `sitemap.ts` en `[slug]/page.tsx` hadden 15 imports, de drie MMC-carousels elk 8
- [x] Dat verschil (8 versus 15) uitgezocht in plaats van weggepoetst: de carousels importeerden
      **alleen light**, dus hun `featured`-filter betekende impliciet ook "light"
- [x] Gemeten of dat vandaag uitmaakt: alle 8 featured entries zijn light previews, 0 in `full-*`.
      Overzetten op `allMixes` zou dus vandaag hetzelfde resultaat geven — maar niet noodzakelijk
      morgen, dus het filter is expliciet gemaakt in `featuredMixByColor()`
- [x] `all.ts` uitgebreid: het volledige `Mix`-type (30 velden), `Track`, en `featuredMixByColor()`
- [x] `sitemap.ts` overgezet op `liveMixes` + `mixSlug`
- [x] `[slug]/page.tsx` overgezet: 15 imports, twee typedefinities en **vier** slug-afleidingen weg
- [x] Vastgesteld dat die vier niet identiek waren — twee mét `.toLowerCase().trim()` en twee zonder
      — en dat dat een pagina onvindbaar had kunnen maken. De `decodeURIComponent` op de inkomende
      slug is bewust blijven staan
- [x] De drie MMC-carousels overgezet op `featuredMixByColor()`
- [x] De poort gedraaid, één nieuwe ESLint-warning gezien (`Mix` ongebruikt) en die meteen opgelost —
      de teller staat weer op 0/0, en dat is precies waarom hij op 0 hoort te staan
- [x] Gedragsgelijkheid gemeten in plaats van aangenomen: sitemap-suite groen (13 tests, waaronder de
      koppeling met `mixSlug`), 89 pagina's, 84 URL's in `out/sitemap.xml`, en 8 mp3-bronnen op de
      Music Mood Colours-pagina
- [~] De onbereikbare "Mix niet gevonden"-tak in `[slug]/page.tsx` — het issue noemt hem als
      aanpalend. Niet weggehaald: met `dynamicParams = false` is hij inderdaad onbereikbaar bij de
      static export, maar het is defensieve code die niets kost, en hem verwijderen is riskanter dan
      hem laten staan
- [~] Het honeypot-veld `bot-field` dat `send-email.js` nooit uitleest — óók aanpalend genoemd in
      #83, maar dat is een **securitybevinding** en geen DRY-kwestie: de botbescherming van het
      contactformulier doet aantoonbaar niets. Dat verdient een eigen behandeling; zie hieronder

### Where I left off

Af, poort groen (0 errors, 0 warnings), 143 tests groen. **Geparkeerd**: raakt `src/`, dus de merge
wacht op Dave.

**Wat er te bekijken is.** De bedoeling is dat er niets verandert, en dat is op vier manieren gemeten
(zie hierboven). De plek om met het oog te kijken is **Music Mood Colours**: de drie carousels
(basiskleuren, erlenmeyers, vs-kleuren) horen alle drie hun acht covers te tonen en af te spelen — dat
is de code die het meest is aangeraakt. Daarnaast een willekeurige **mixdetailpagina** via /luister,
want daar zijn de vier slug-afleidingen vervangen.

**Eén bevinding die hier niet thuishoort maar wel gemeld moet worden:** `ContactForm.tsx` zet een
honeypot-veld `bot-field` neer, en `netlify/functions/send-email.js` leest dat veld nooit uit. De
botbescherming die daar lijkt te staan, doet dus niets. Dat is geen refactor-kwestie en het raakt de
Netlify-function; het staat als aanpalend punt in #83 en verdient een eigen issue of branch.

Sluit #83 bij een merge.
