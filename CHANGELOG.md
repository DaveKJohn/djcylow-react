# Changelog

De geschiedenis van de DJ Cylow-website: onder **Pull Requests** elke gemergde branch met zijn PR,
onder **Releases** de vastgelegde versies. Het mechanisme (entry-bestanden, folden, een release
knippen) staat in [`CLAUDE.md`](CLAUDE.md).

**`origin/main` is de live site.** Netlify bouwt en publiceert bij elke push naar `main`, en een
PR-merge schrijft daar rechtstreeks in. Alles hieronder staat dus al op `djcylow.com`; wat onder
**Pull Requests** staat is live maar heeft nog geen versienummer, en een release is een label op wat
al draait.

> Tot 2026-07-26 stond hier het omgekeerde, met een `← LIVE`-markering die zou aanwijzen welke versie
> draaide. Dat model was onjuist en de markering stond maandenlang fout — op v2.20.1, terwijl
> v2.20.2, v2.21.0 en vijf PR's al live waren. De markering is vervallen: de bovenste uitgebrachte
> versie draait per definitie al.

## Pull Requests

Alles wat sinds de laatste release naar `main` is gemergd en daarmee live staat — nieuwste bovenaan,
één blok per pull request.

### #22 · Onjuiste SEO- en GA4-claims uit de v2.21.0-documentatie gehaald · Docs · 2026-07-26

De titel-migratie in v2.21.0 is correct uitgevoerd, maar in de documentatie verkeerd verantwoord. Aan
de titels zelf verandert hier niets; alleen de verantwoording is rechtgezet.

## Wat er fout stond

De release-note en de highlights beweerden dat het `title`-veld SEO-kritisch is en dat de migratie 77
`<title>`-tags, de `<h1>`, de mix-kaarten en `mix_title` in GA4 raakte. Daaruit volgde ook de
waarschuwing dat historische GA4-rapportages onvergelijkbaar zouden worden, plus de belofte aan de
lezer dat bezoekers en Google de nieuwe titels zouden zien.

**Dat klopte geen van alle.** Opnieuw geverifieerd in de code van vandaag:

| Plek | Werkelijke bron |
|---|---|
| `<h1>` detailpagina | `{color} {subgenre} Mix {volume}` |
| `<title>`, og:title, twitter:title | dezelfde velden + `\| DJ Cylow` |
| GA4 `mix_title` | dezelfde velden, via de `MixAnalytics`-aanroep |
| mix-kaart op `/luister` | `{color} {subgenre} Mix · {volume}` |

Doorslaggevend: de JSON-titel komt in **geen enkel** HTML-bestand van de build voor. Hij staat alleen
in een JS-chunk (`out/_next/static/chunks/`), omdat de volledige mix-JSON in de client-bundel wordt
gebakken — meegeleverd, niet getoond. Reproduceerbaar met
`grep -rl "Mix · Blue Full" out/ --include=*.html`, wat niets oplevert.

Netto is de migratie dus een **dataconsistentie-verbetering**, geen SEO-verbetering. Er waren geen 63
pagina's met een identieke `<title>`; die waren al uniek omdat ze uit de losse velden komen. De
GA4-waarschuwing was vals alarm: `mix_title` verandert niet, dus er breekt niets en er is geen
annotatie nodig.

## Wat er is gedaan

1. **`releases/development/2.21/2.21.0.md`** — de samenvatting, de "wat het oplost"-alinea en de
   passage over wat meebeweegt zijn herschreven. De laatste is vervangen door een tabel met de
   werkelijke bron per plek, plus het reproduceerbare grep-commando. Bovenaan staat een gedateerde
   correctie-aantekening: de note stilletjes herschrijven zou de fout onvindbaar maken.
2. **`releases/highlights/2.21/2.21.0.md`** — de sectie beloofde de lezer iets zichtbaars. Die is
   herschreven naar wat het werkelijk is, met een expliciete regel dat er op de website niets
   verandert. Ook hier een correctie-aantekening.
3. **`src/data/mixes/README.md`** — de bron van de verkeerde aanname. Het `title`-veld stond als
   **SEO-critical** met "Shown on mix cards, detail page `<h1>`, and in metadata". Dat label is weg;
   het veld is nu beschreven als de canonieke naam bínnen de JSON, met een blokkade-notitie die
   uitlegt dat het nergens gerenderd wordt en hoe je dat zelf nagaat. In de SEO-tabel is de
   `title`-regel vervangen door `color` + `subgenre` + `volume` als de velden die de titel
   werkelijk bouwen, en `title` staat er nu bij met impact **None**.

**Stap 3 uit de oorspronkelijke opzet is vervallen.** Die wilde de gevouwen entry in het
`[Unreleased]`-blok van `CHANGELOG.md` corrigeren, maar dat blok bestaat sinds PR #18 niet meer:
v2.21.0 is nu één regel onder `## Releases` met een verwijzing naar de release-note. De onjuiste
claims stonden daar dus al niet meer.

## Erbij gekomen tijdens de controle

Dezelfde verificatie is op de andere velden gedaan die de spec als SEO-kritisch aanmerkt, want die
konden dezelfde fout dragen. `description_nl`, `tags` en `top_artists` staan alle drie wél in de
gebouwde HTML — die claims zijn correct. `description_en` staat er niet in, simpelweg omdat de site
nog niet tweetalig is; die tabelregel is daarop genuanceerd. Ook zijn de vijf velden die deze week
zijn toegevoegd (`bpm`, `tracks`, `id_spotify`, `title_spotify`, `volume_spotify`) expliciet met
impact **None** in de tabel gezet, zodat niemand ze later voor SEO-velden aanziet.

## Wat nog buiten de repo moet

De **al gepubliceerde GitHub Release-body van v2.21.0** draagt de oude tekst nog. Bijwerken is een
naar buiten gerichte actie en wacht op Dave:

```bash
gh release edit v2.21.0 --notes-file releases/development/2.21/2.21.0.md
```

## De les

Verifieer in de **code** wat een veld doet voordat je op de veldspec of `CLAUDE.md` afgaat. Beide
beschreven `title` als SEO-kritisch; `generateMetadata` doet iets anders. De code is de waarheid — en
een veldspec die daarnaast staat, plant de fout in elk volgend document dat erop leunt.

[PR #22](https://github.com/DaveKJohn/djcylow-react/pull/22)

---

### #21 · Verkeerd jaartal en lege date bij Blue Full (m) Vol. 1 hersteld · Data · 2026-07-26

`full-blue.json` `20220406` was het enige record dat na PR #19 nog een lege `date` had. Dat kwam
niet door de aanpak daar, maar door een tegenspraak in de data die de kruiscontrole van die branch
opving: het `id`, de `permalink` en de audio-bestandsnaam op R2 zeggen alle drie **2022**-04-06, en
`maand: "Apr"` met `dag: "06"` kloppen daarmee, maar `jaar` stond op `"2021"`. Drie bronnen tegen
één. Omdat `jaar` de zichtbare datum op de pagina levert, was dat een beslissing van Dave en niet
van een specialist; die is nu genomen.

Hersteld in dit record:

| Veld | Was | Is |
|---|---|---|
| `jaar` | `"2021"` | `"2022"` |
| `date` | `""` | `"2022-04-06"` |
| `tags[0]` | `"drum and bass mix 2021"` | `"drum and bass mix 2022"` |
| `tags[20]` | `"dnb mix 2021"` | `"dnb mix 2022"` |

De twee tags zijn meegenomen omdat ze dezelfde feitelijke fout droegen: een mix uit 2022 die zich
als 2021-materiaal aanbood. Dat is geen aparte SEO-keuze maar dezelfde correctie, doorgevoerd waar
hij nog stond. De beide `description`-velden bevatten geen jaartal, dus die bleven ongemoeid.

**Effect.** De pagina toonde "06 Apr, 2021" en leest nu "06 Apr, 2022"; `2021` komt nergens meer
voor in de gebouwde `/luister`. Belangrijker: dit was de laatste mixpagina zonder publicatiedatum.
Van de 77 mixpagina's dragen er nu **77** een gevulde `datePublished`, `dateModified` en
`<time dateTime="...">` — bij het begin van vandaag waren dat 8, na PR #19 zesenzeventig.

De kruiscontrole over alle 15 bestanden meldt nu 77 gevulde datums, 8 previews die leeg horen te
blijven, en **nul tegenspraken** tussen `id` en `dag`/`maand`/`jaar`.

[PR #21](https://github.com/DaveKJohn/djcylow-react/pull/21)

---

### #20 · Eigen metadata voor /luister en /musicmoodcolours · Content · 2026-07-26

De twee inhoudelijk belangrijkste pagina's na de homepage hadden helemaal geen eigen metadata. Ze
vielen terug op de titel `DJ Cylow` en de beschrijving `DJ Cylow - Professional DJ for your events`
uit `layout.tsx`, en hadden geen canonical. Voor `/luister` is dat het meest zonde: die pagina
ontsluit de hele playlist en heeft in `sitemap.ts` prioriteit 0.9, de hoogste na de homepage.

**Waarom het ontbrak.** Beide pagina's zijn client components (`'use client'`, vanwege de filters en
de URL-sync op de luisterpagina, en de audiofragmenten en carousels op Music Mood Colours). Een
client component kan in de App Router geen `metadata` exporteren. Het was dus een technische
blokkade, geen vergeetachtigheid. De oplossing is een `layout.tsx` per route: die mag wél een server
component zijn en draagt de metadata in plaats van de pagina.

Toegevoegd: `src/app/luister/layout.tsx` en `src/app/musicmoodcolours/layout.tsx`, allebei een pure
passthrough die alleen `metadata` exporteert.

| Pagina | Titel | Lengte |
|---|---|---|
| `/luister` | Luister alle mixen van DJ Cylow | 31 |
| `/musicmoodcolours` | Music Mood Colours — muziek indelen op stemming | 47 |

Beide titels blijven onder de 60 tekens en beide beschrijvingen vallen binnen de 120–160 die de
veldspec voor mixen ook aanhoudt (131 en 149). Elk krijgt een eigen canonical en Open Graph-blok;
Music Mood Colours met `type: "article"` omdat het een doorlopend verhaal is en geen overzichtspagina.

De mix-detailpagina eronder heeft een eigen `generateMetadata` en overschrijft de layout gewoon —
geverifieerd in de gebouwde HTML.

Gecontroleerd: `npm run build` slaagt met 89 pagina's, en in de output dragen `/luister` en
`/musicmoodcolours` hun eigen `<title>` en canonical, terwijl een mixpagina onveranderd
`Blue Liquid Drum & Bass Mix Vol. 2 | DJ Cylow` houdt met zijn eigen canonical.

[PR #20](https://github.com/DaveKJohn/djcylow-react/pull/20)

---

### #19 · 68 lege date-velden hersteld uit het id, één wacht op een besluit · Data · 2026-07-26

77 van de 85 mixen hadden `"date": ""`, terwijl de veldspec ISO-formaat `YYYY-MM-DD` voorschrijft en
expliciet "niet leeg". Anders dan bij het `title`-veld had dit **wel zichtbare gevolgen**, nagegaan in
de code én in de build-output:

| Plek | Gevolg van een lege `date` | Vindplaats |
|---|---|---|
| JSON-LD structured data | `datePublished` en `dateModified` werden **volledig weggelaten** | `src/app/luister/mix/[slug]/page.tsx` |
| `<time>`-element | rendeerde als `<time dateTime="">` — leeg én ongeldige HTML | idem |

Google kreeg voor deze mixen dus geen publicatiedatum mee. De zichtbare datum op de pagina klopte
wel: die komt uit de losse velden `dag`/`maand`/`jaar`, die gevuld zijn. Alleen de machineleesbare
variant ontbrak.

**Wat er is gedaan.** 68 velden zijn gevuld met de datum afgeleid uit het `id`, dat het formaat
`YYYYMMDD` heeft (`"20240408"` → `"2024-04-08"`). De 8 preview-entries (`ignore: true`) houden een
tekst-id en blijven leeg; die krijgen geen pagina omdat `generateStaticParams` ze overslaat.

Regelgericht bewerkt in plaats van via `JSON.parse` + `stringify`, zodat de diff precies 68 regels
beslaat en de opmaak van de 13 geraakte bestanden onaangeroerd blijft. Resultaat: 68 wijzigingen, nul
regels daarbuiten.

**De kruiscontrole betaalde zich uit.** Vóór het wegschrijven is elke afgeleide datum vergeleken met
de bestaande `dag`/`maand`/`jaar`-velden van hetzelfde record. Dat leverde één tegenspraak op, en die
is bewust **niet** gevuld:

`full-blue.json` `20220406` — het `id`, de `permalink` en de audio-bestandsnaam op R2
(`Blue_Full_m_EDM_DNB_20220406_Audio_V2 (Vol. 1).mp3`) zeggen alle drie **2022**-04-06, en
`maand: "Apr"` met `dag: "06"` kloppen daarmee. Maar `jaar` staat op `"2021"`. Drie bronnen tegen één,
dus vermoedelijk een typefout in `jaar` — maar dat veld levert de **zichtbare** datum op de pagina, dus
die mix toont nu "Apr 06 2021" op de live site. Dat corrigeren verandert zichtbare content en is
daarom een beslissing van Dave, geen aanname van een specialist. Zolang dat besluit uitblijft houdt
dit ene record een lege `date`.

**Geverifieerd na de wijziging.** `npm run build` slaagt met 89 pagina's. Van de 77 mixpagina's dragen
er nu **76** een gevulde `datePublished`, `dateModified` en `<time dateTime="...">`; de enige die dat
mist is precies het overgeslagen record hierboven. Vóór deze branch was dat 8 van de 77.

[PR #19](https://github.com/DaveKJohn/djcylow-react/pull/19)

---

### #18 · CHANGELOG en de workflow-docs op de gedeelde Pull Requests/Releases-structuur · Docs · 2026-07-26

`CHANGELOG.md` gebruikte een eigen Keep-a-Changelog-variant met `## [Unreleased]` en een
metadata-blok van drie regels onder elke kop, terwijl `life-hub` en `davekjohns-workshop` allebei
`## Pull Requests` + `## Releases` gebruiken met de metadata in de kop. Die afwijking was niet
alleen cosmetisch: de gedeelde `fold-changelog`-skill zoekt hardcoded naar een
`## Pull Requests`-kop, dus die werkte hier niet en het vouwen ging met de hand.

**De structuur.** De kop is teruggebracht tot een korte intro die naar `workflow-CLAUDE.md` wijst;
de secties "Hoe dit werkt" en "Levenscyclus van een regel" zijn vervallen omdat het mechanisme daar
al beschreven staat. Daaronder `## Pull Requests` met de gemergde-maar-niet-uitgebrachte entries, en
`## Releases` met de 36 versieblokken, van `##` naar `###` gedegradeerd zodat ze onder hun sectie
hangen.

**De entries.** De drie openstaande entries zijn omgezet van een kop met een metadata-blok van drie
regels (`**Branch naam**`, `**Datum merge op main**`, `**Branch type**`) naar
`### #17 · Titel · Data · 2026-07-26` met een `[PR #17](...)`-regel onderaan. De teksten zijn
letterlijk overgenomen; alleen de koppen zijn herschreven.

**Wat bewust anders blijft dan bij de andere twee.** De `← LIVE`-markering blijft staan. Deze repo
is de enige met een live site zonder staging en kent daardoor drie toestanden waar de andere twee er
twee hebben: gemergd, gecut, en daadwerkelijk live. Die markering wijst aan welke uitgebrachte
versie op dit moment draait, en die informatie is hier niet weg te laten. De intro legt dat verschil
expliciet uit.

**Getest.** Het gedeelde `fold-changelog`-script is met `-RepoRoot` op een wegwerp-kopie van de
nieuwe `CHANGELOG.md` gedraaid: het vindt de kop, voegt de entry na de intro-alinea maar boven de
bestaande entries in, en ruimt het entry-bestand op. Het handmatige vouwen is daarmee verleden tijd.

**Meegenomen in de docs**, zodat beschrijving en praktijk niet opnieuw uit elkaar lopen: het
entry-formaat, de fold-stap, Release Workflow stap 5 t/m 7, de Scripts-lijst en de contenttabel — nu
allemaal in `CLAUDE.md` — plus `releases/README.md` (het release-note-formaat). De waarschuwing dat
`fold-changelog` hier niet werkt is vervallen. De historische release-notes onder
`releases/development/` zijn niet aangeraakt: die beschrijven de situatie van toen.

### De `workflow/`-map is opgeheven

In dezelfde beweging is `workflow/workflow-CLAUDE.md` opgegaan in `CLAUDE.md`, zodat deze repo net
als `life-hub` en `davekjohns-workshop` **één CLAUDE-bestand** heeft. De reden om te consolideren is
dezelfde als hierboven: twee documenten over dezelfde werkwijze lopen onvermijdelijk uit elkaar, en
de `@workflow/workflow-CLAUDE.md`-import maakte het onderscheid voor Claude toch al onzichtbaar.

`CLAUDE.md` volgt nu ook de kopindeling van die twee repo's: `## De Claude Specialists` →
`## Safety rules` → `## Algemene werkwijze` (met de ontwikkelworkflow stap 1 t/m 7) →
`## Eigen aan deze repo (djcylow-react)` met daarin taal, roster, structuur/conventies, de Release
Workflow, de scripts, de safety-invulling en het `hóé vs. wát`-slot. Alle regels uit beide bestanden
zijn overgenomen; geen enkele safety-regel is vervallen.

Twee verwijzingen naar het verdwenen pad zijn meegetrokken: de intro van `CHANGELOG.md` en de
kopcommentaar van `scripts/lib/branch-info.ps1`. Die laatste beweerde bovendien dat de
branch-taxonomie uit de git-historie was afgeleid — precies de fout waardoor `style/` er eerder in
ontbrak; dat is nu rechtgezet naar de tabel in `CLAUDE.md` als canonieke bron.

[PR #18](https://github.com/DaveKJohn/djcylow-react/pull/18)

---

### #17 · Vijf afgeleide velden voor alle mixen: `id_spotify`, `bpm`, `title_spotify`, `tracks` en `volume_spotify` · Data · 2026-07-26

Alle 85 entries in `src/data/mixes/*.json` hebben vijf nieuwe velden gekregen, zodat de JSON de
enige administratie van een mix blijft, ook voor de Spotify-kant. De site gebruikt de velden
(nog) niet: er is geen component of route die ze leest, dus de publieke pagina's veranderen niet.

**`bpm`** — het tempo als getal, nieuw als eigenstandig veld. Tot nu toe zat de BPM alleen
versleuteld in de `audioSrc`-bestandsnaam en de `permalink`, en die spraken elkaar op twee plekken
tegen. Vastgestelde regel: Drum & Bass is altijd `176`, voor de overige genres geldt de BPM uit de
`audioSrc`. Dat dekt alle 77 echte mixen zonder gaten en levert 46× `176`, 30× `128` en 1× `112`.

**`id_spotify`** — `mmc_edm_{bpm}bpm_{power}_{freq}_{color}_{id}`, bijvoorbeeld
`mmc_edm_128bpm_light_m_yellow_20251021`. Uniek over alle mixen doordat het `id` erin zit.

**`title_spotify`** — `EDM {bpm}BPM {emoji} {Color} {Power} ({freq}) {emoji} {Vol. N} {emoji} {id}`,
bijvoorbeeld `EDM 128BPM 🟡 Yellow Light (m) 🟡 Vol. 7 🟡 20251021`. De kleur-emoji scheidt de drie
delen; Cyan krijgt 💠 omdat Unicode geen cyaan cirkel kent. Het nummer komt uit `volume_spotify` en
niet uit het site-`volume`: dat laatste loopt per subgenre, dus dezelfde `Vol. N` komt binnen één
kleur + power + frequentie meerdere keren voor (`Red Light (m) Vol. 1` bestaat als Tech House,
Progressive House én Melodic Techno). Ook een doortellend nummer is over de hele collectie niet
uniek, daarom sluit het `id` de titel af — alle 77 titels zijn daarmee uniek.

**`tracks`** — het aantal items in de `tracklist`, één keer geteld en vastgelegd zodat het nooit
meer opnieuw geteld hoeft te worden. Loopt van 22 tot 46 met een mediaan van 35; samen 2667 tracks
over de 77 mixen.

**`volume_spotify`** — een doorlopend nummer per kleur + power + frequentie + BPM, chronologisch met
de oudste mix als `1`. Bewust zonder het subgenre, zodat een nummer binnen één reeks nooit twee keer
voorkomt: het bestaande `volume` kan dat niet, omdat die reeks juist per subgenre loopt. Drum & Bass
vormt een eigen reeks, dus `Red Light (m)` heeft zes 128 BPM-mixen als `1` t/m `6` plus één
176 BPM Neurofunk-mix die zijn eigen `1` is. Levert 27 reeksen over de 77 mixen, met
`Purple Light (f)` 176 BPM als langste (`1` t/m `9`). Dit is ook het nummer dat `title_spotify`
draagt: bij 30 van de 77 mixen wijkt het daarmee af van het site-`volume`. Die mix die op de site
`Vol. 1` heet, staat op Spotify dus als `Vol. 6` — bedoeld, geen afwijking.

De acht preview-entries (`ignore: true`) krijgen lege waarden (`""` en `0` voor de getalvelden), in
lijn met hoe hun `date`, `volume` en `description`-velden al leeg staan.

Meegenomen zodat de data niet meteen weer uit de pas loopt: `scripts/add-mix.js` genereert de vijf
velden nu voor elke nieuwe mix (met `176` als voorstel bij Drum & Bass), de `Mix`-interface in
`src/app/luister/mix/[slug]/page.tsx` kent ze, en `src/data/mixes/README.md` beschrijft ze als
onderdeel van het schema.

[PR #17](https://github.com/DaveKJohn/djcylow-react/pull/17)

---

### #16 · GTM Laag 3 — content_group op mix_id, en de GA4-dimensie Mix ID · Config · 2026-07-25

Vastlegging van twee analytics-wijzigingen die al sinds **27 juni 2026** live staan in Google Tag
Manager en GA4, maar tot nu toe nergens in deze repo waren gedocumenteerd. Er verandert dus niets
aan de configuratie zelf; dit haalt alleen de administratie bij.

**GTM.** De parameter `content_group` is toegevoegd aan de tag `GA4 - view_mix`, met als waarde
`{{DLV - mix_id}}` (bijvoorbeeld `2026-06-15`). Gepubliceerd als GTM-versie 5 op 2026-06-27 16:59.
Hierdoor worden mix-weergaven in GA4 samengevoegd per mix-ID, ongeacht de URL-variant: met of zonder
`/en/`, met of zonder `.html`.

**GA4.** De aangepaste dimensie **Mix ID** is aangemaakt met bereik Gebeurtenis en parameternaam
`content_group`. Bruikbaar via Verkennen → vrije vorm → dimensie "Mix ID" als rij; dat toont de
weergaven per mix samengevoegd, ongeacht URL-variant.

**Waarom dit alsnog landt.** Het werk stond op de branch `config/ga4-content-group`, aangemaakt op
27 juni, die nooit is gemergd. Die branch bewerkte `CHANGELOG.md` rechtstreeks — de werkwijze van
vóór de omslag naar per-branch entry-bestanden — waardoor hij inmiddels zou conflicteren. De inhoud
is daarom overgezet naar het huidige entry-formaat en de oude branch is opgeruimd. Zonder deze stap
zou er een live analytics-configuratie bestaan waarvan in de repo geen spoor te vinden is.

[PR #16](https://github.com/DaveKJohn/djcylow-react/pull/16)

---

### #15 · Social previews en de canonical van /diensten gerepareerd · Fix · 2026-07-25

Drie SEO-defecten die alle drie in de gebouwde HTML terechtkwamen.

**1. Linkpreviews wezen naar localhost.** `metadataBase` was niet gezet in `src/app/layout.tsx`,
waardoor Next.js relatieve URL's in metadata oploste tegen `http://localhost:3000`. In de gebouwde
pagina's stond letterlijk:

```html
<meta property="og:image" content="http://localhost:3000/images/diensten.jpg"/>
<meta name="twitter:image" content="http://localhost:3000/images/diensten.jpg"/>
```

Wie een dienstenpagina op WhatsApp, Facebook of LinkedIn deelde, kreeg dus een preview zonder
afbeelding. De build waarschuwde hiervoor, maar die melding ging op in de rest van de output.
`metadataBase` staat nu op `https://www.djcylow.com`, in `layout.tsx` zodat elke pagina hem erft.
De mix-detailpagina had hem al lokaal staan; die was daardoor als enige wél in orde.

**2. De afbeelding bestond niet.** `/images/diensten.jpg` staat nergens in `public/images/`. Ook met
een correcte `metadataBase` zou die URL dus een 404 hebben opgeleverd. De verwijzing is verwijderd
uit de drie dienstenpagina's, plus uit `src/content/diensten.ts` waar een `image`-veld naar hetzelfde
niet-bestaande bestand wees (dat veld werd nergens gerenderd, dus er was geen zichtbaar kapot
plaatje op de site).

Er is bewust geen vervangende afbeelding gekozen: geen van de bestaande beelden is geschikt.
`hero_desktop.webp` is 882×1180 en dus staand, terwijl een og:image liggend 1200×630 wil zijn en
anders lelijk wordt bijgesneden. Een lege preview is beter dan een verminkte. Een echte og-image
laten maken is een aparte opdracht.

**3. `/diensten` verklaarde zichzelf een duplicaat van de homepage.** Zowel de `canonical` als de
`og:url` van die pagina stonden op `https://www.djcylow.com/`. Daarmee kreeg Google te horen dat
`/diensten` geen eigen pagina is maar een kopie van de homepage, wat betekent dat hij mogelijk niet
apart geïndexeerd werd. Beide wijzen nu naar `https://www.djcylow.com/diensten`. De drie
subpagina's (bruiloft, bedrijfsfeest, house) hadden wél een correcte canonical.

**Nog niet opgelost, want dit vraagt een inhoudelijke keuze:** `/luister` en `/musicmoodcolours`
hebben helemaal geen eigen metadata. Ze vallen terug op de titel `DJ Cylow` en de beschrijving
`DJ Cylow - Professional DJ for your events` uit `layout.tsx`, en hebben geen canonical. Voor de
luisterpagina, die de hele playlist ontsluit, is dat zonde. Daar horen een eigen titel, beschrijving
en canonical bij; wat daar precies moet staan is een SEO-beslissing.

Gecontroleerd: `npm run build` slaagt met 89 pagina's en meldt de `metadataBase`-waarschuwing niet
meer, de gebouwde output bevat geen enkele `localhost`-URL, beide canonicals kloppen in de HTML, en
ESLint meldt onverkort 37 pre-existing errors.

[PR #15](https://github.com/DaveKJohn/djcylow-react/pull/15)

---

## Releases

De vastgelegde versies — nieuwste bovenaan; elke regel linkt naar de volledige release-notes.

### [v2.21.0] - 2026-07-25 — Minor

Zie [releases/development/2.21/2.21.0.md](releases/development/2.21/2.21.0.md)

---

### [v2.20.2] - 2026-07-25 — Patch

Zie [releases/development/2.20/2.20.2.md](releases/development/2.20/2.20.2.md)

---

### [v2.20.1] - 2026-07-02 — Patch

Zie [releases/development/2.20/2.20.1.md](releases/development/2.20/2.20.1.md)

---

### [v2.20.0] - 2026-07-02 — Minor

Zie [releases/development/2.20/2.20.0.md](releases/development/2.20/2.20.0.md)

---

### [v2.19.2] - 2026-06-28 — Patch

Zie [releases/development/2.19/2.19.2.md](releases/development/2.19/2.19.2.md)

---

### [v2.19.1] - 2026-06-28 — Patch

Zie [releases/development/2.19/2.19.1.md](releases/development/2.19/2.19.1.md)

---

### [v2.19.0] - 2026-06-28 — Minor

Zie [releases/development/2.19/2.19.0.md](releases/development/2.19/2.19.0.md)

---

### [v2.18.0] - 2026-06-27 — Minor

Zie [releases/development/2.18/2.18.0.md](releases/development/2.18/2.18.0.md)

---

### [v2.17.0] - 2026-06-27 — Minor

Zie [releases/development/2.17/2.17.0.md](releases/development/2.17/2.17.0.md)

---

### [v2.16.4] - 2026-06-27 — Patch

Zie [releases/development/2.16/2.16.4.md](releases/development/2.16/2.16.4.md)

---

### [v2.16.3] - 2026-06-27 — Patch

Zie [releases/development/2.16/2.16.3.md](releases/development/2.16/2.16.3.md)

---

### [v2.16.2] - 2026-06-27 — Patch

Zie [releases/development/2.16/2.16.2.md](releases/development/2.16/2.16.2.md)

---

### [v2.16.1] - 2026-06-27 — Patch

Zie [releases/development/2.16/2.16.1.md](releases/development/2.16/2.16.1.md)

---

### [v2.16.0] - 2026-06-25 — Minor

Zie [releases/development/2.16/2.16.0.md](releases/development/2.16/2.16.0.md)

---

### [v2.15.0] - 2026-06-25 — Minor

Zie [releases/development/2.15/2.15.0.md](releases/development/2.15/2.15.0.md)

### [v2.14.4] - 2026-06-25 — Patch

Zie [releases/development/2.14/2.14.4.md](releases/development/2.14/2.14.4.md)

### [v2.14.3] - 2026-06-25 — Patch

Zie [releases/development/2.14/2.14.3.md](releases/development/2.14/2.14.3.md)

### [v2.14.2] - 2026-06-25 — Patch

Zie [releases/development/2.14/2.14.2.md](releases/development/2.14/2.14.2.md)

### [v2.14.1] - 2026-06-25 — Patch

Zie [releases/development/2.14/2.14.1.md](releases/development/2.14/2.14.1.md)

### [v2.14.0] - 2026-06-25 — Minor

Zie [releases/development/2.14/2.14.0.md](releases/development/2.14/2.14.0.md)

### [v2.13.0] - 2026-06-18 — Minor

Zie [releases/development/2.13/2.13.0.md](releases/development/2.13/2.13.0.md)

### [v2.12.0] - 2026-06-16 — Minor

Zie [releases/development/2.12/2.12.0.md](releases/development/2.12/2.12.0.md)

### [v2.11.1] - 2026-05-10 — Patch

Zie [releases/development/2.11/2.11.1.md](releases/development/2.11/2.11.1.md)

### [v2.11.0] - 2026-05-08 — Minor

Zie [releases/development/2.11/2.11.0.md](releases/development/2.11/2.11.0.md)

### [v2.10.0] - 2026-05-05 — Minor

Zie [releases/development/2.10/2.10.0.md](releases/development/2.10/2.10.0.md)

### [v2.9.0] - 2026-05-01 — Minor

Zie [releases/development/2.9/2.9.0.md](releases/development/2.9/2.9.0.md)

### [v2.8.0] - 2026-04-20 — Minor

Zie [releases/development/2.8/2.8.0.md](releases/development/2.8/2.8.0.md)

### [v2.7.0] - 2026-04-13 — Minor

Zie [releases/development/2.7/2.7.0.md](releases/development/2.7/2.7.0.md)

### [v2.6.0] - 2026-04-11 — Minor

Zie [releases/development/2.6/2.6.0.md](releases/development/2.6/2.6.0.md)

### [v2.5.0] - 2026-04-10 — Minor

Zie [releases/development/2.5/2.5.0.md](releases/development/2.5/2.5.0.md)

### [v2.4.0] - 2026-03-20 — Minor

Zie [releases/development/2.4/2.4.0.md](releases/development/2.4/2.4.0.md)

### [v2.3.0] - 2026-03-19 — Minor

Zie [releases/development/2.3/2.3.0.md](releases/development/2.3/2.3.0.md)

### [v2.2.0] - 2026-03-13 — Minor

Zie [releases/development/2.2/2.2.0.md](releases/development/2.2/2.2.0.md)

### [v2.1.0] - 2026-03-11 — Minor

Zie [releases/development/2.1/2.1.0.md](releases/development/2.1/2.1.0.md)

### [v2.0.1] - 2026-03-08 — Patch

Zie [releases/development/2.0/2.0.1.md](releases/development/2.0/2.0.1.md)

### [v2.0.0] - 2026-03-07 — Major

Zie [releases/development/2.0/2.0.0.md](releases/development/2.0/2.0.0.md)
