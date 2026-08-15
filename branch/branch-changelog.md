## `fix/canonical-wijst-naar-een-redirect` changelog

### Branch title

De canonical, og:url en sitemap wezen alle 84 URLs naar een domein dat redirect

### Branch type

fix

### What does the change on this branch bring to main?

**De site zei van zichzelf dat hij ergens anders stond dan waar hij staat.** Gemeten op de live
site: de www-variant van `/luister` antwoordt met `301 Moved Permanently` naar het kale domein, dat
zelf 200 geeft. De hosting heeft die keuze dus al gemaakt. Maar de HTML in datzelfde antwoord droeg
`<link rel="canonical" href="https://www.…">` — een canonical die naar een URL wijst die zichzelf
wegredirect. Hetzelfde gold voor `og:url`, voor de JSON-LD op elke mixpagina, voor `robots.txt` en
voor **alle 84 URL's in `sitemap.xml`**.

Dat is een tegenstrijdig signaal precies waar een zoekmachine op afgaat: de server zegt "het kale
domein is het origineel", en de pagina zegt "nee, www". Zoekmachines lossen dat meestal zelf op,
maar niet altijd hetzelfde, en het is nergens goed voor.

De oorzaak was duplicatie: `https://www.djcylow.com` stond hard op **22 plekken in elf bestanden**,
plus een twaalfde kopie in `tests/sitemap.test.ts`. Er is nu één bron, `src/constants/site.ts`, en
die volgt de server in plaats van hem te bepalen — wil je ooit naar `www`, dan begint dat bij het
omdraaien van de redirect en landt het pas daarna hier.

**Getoetst op het resultaat en niet op de constante**, want een `SITE_URL` die klopt bewijst niets
zolang er ergens weer een letterlijke URL naast kan. `tests/canonical-urls.test.ts` leest de
gebouwde export: geen enkel `.html`, `.xml`, `.txt` of `.json` mag het www-domein nog noemen, elke
`canonical` moet op de basis-URL beginnen, en de sitemap ook. Negatief getoetst door één URL terug
te zetten — twee van de drie tests sloegen aan, met het bestandspad in de melding.

`tests/sitemap.test.ts` importeert de constante nu in plaats van zijn eigen kopie te houden. Daarmee
bewijst die suite over het domein niets meer, en dat staat er ook bij: hij gaat over de **structuur**
van de sitemap (welke routes, welke slugs, geen dubbele slashes), terwijl het domein in de
gebouwde output wordt getoetst — de enige plek waar zo'n toets iets kan aantonen.

**Deze wijziging raakt de SEO en is daarmee normaal gesproken Dave's beslissing.** Ik heb hem
uitgevoerd onder het staande akkoord van deze sessie, en meld dat hier expliciet omdat het geen
smaakkeuze was: de server had al besloten, en de metadata sprak hem tegen. De omgekeerde reparatie —
`www` canoniek maken — kan niet in deze repo, want die begint bij de hostingconfiguratie.

Gemeten na afloop: **0** voorkomens van het www-domein in de hele export, canonical en sitemap staan
op het kale domein, 89 pagina's, poort groen, 213 tests groen.

### Significance

#### Tier 0

De basis-URL stond op twaalf plekken, waarvan één in een test die de andere elf had moeten bewaken
maar dezelfde aanname deelde. Dat is nu één constante met twee tests eromheen die de gebouwde output
lezen.

**Score:** 3

#### Tier 1

Elke pagina van de site vertelde zoekmachines dat de canonieke versie op een ander domein stond dan
waar hij geserveerd wordt, inclusief de complete sitemap. Dat raakt precies waar deze site voor
online staat: gevonden worden.

**Score:** 4

### Pull Request

