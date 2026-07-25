### Alle mixtitels naar één formaat gemigreerd

**Branch naam** data/titel-migratie
**Datum merge op main**
**Branch type** Data

De 77 publieke mixen dragen nu allemaal hetzelfde titelformaat:
`{subgenre} Mix · {color} {power} {frequency} · {volume}`. Daarmee is de migratie afgerond die de
veldspec al langer voorschreef maar die nooit was uitgevoerd.

**Wat het oplost.** Titels waren niet uniek: **63 van de 85 mixen deelden 11 titels**, met
uitschieters van 11 × `Purple Light (f)` en 9 × `Orange Light (f)`. Evenzoveel pagina's droegen dus
een identieke `<title>` en `<h1>`, wat voor Google niet te onderscheiden is. Na de migratie is
**elke titel uniek**, zonder uitzondering. Dat komt doordat het subgenre nu in de titel staat: dat
is precies het veld dat mixen met dezelfde kleur, power en frequentie van elkaar scheidt.

Bijkomend wint elke titel aan SEO-waarde: `Blue Full (f)` zei niets over de muziek,
`Liquid Drum & Bass Mix · Blue Full (f) · Vol. 2` wel. De nieuwe titels zijn 35 tot 53 tekens lang
(gemiddeld 47), dus geen enkele wordt door Google afgekapt — dat gebeurt rond de 60.

**Er waren drie formaten in omloop**, niet twee. Naast 72 kale legacy-titels (`Blue Full (f)`)
bestond er een tussenvorm die het subgenre al noemde maar power en frequentie wegliet
(`Red Melodic Techno Mix · Vol. 4`, 12 stuks), plus één afwijkend geval. Alle drie zijn
rechtgetrokken.

**Wat níet verandert: de URL's.** De slug komt uit het `permalink`-veld, niet uit `title` — zie
`findMixBySlug` en `generateStaticParams` in `src/app/luister/mix/[slug]/page.tsx`. Er zijn dus geen
redirects nodig en er gaat geen enkele bestaande link kapot. Wat wel meebeweegt zijn de `<h1>`, de
mix-kaarten, de metadata (`<title>`, og:title, twitter:title) en `mix_title` in GA4. Dat laatste
betekent een breuk in de vergelijkbaarheid van historische rapportages: mixen verschijnen daar vanaf
nu onder hun nieuwe naam.

**Acht mixen blijven ongemoeid.** Dat zijn precies de preview-entries met `ignore: true`. Ze missen
`subgenre` en/of `volume`, worden door `generateStaticParams` overgeslagen en staan niet in de
publieke playlist, dus er valt voor hen geen titel op te bouwen en het heeft ook geen effect.

**Veldspec bijgewerkt.** `src/data/mixes/README.md` schreef nog de oudere volgorde voor
(`[Subgenre] · [Color] [Power] ([Frequency]) Mix · Vol. [N]`); twee mixen volgden die al en zijn
daarom mee gemigreerd. De spec beschrijft nu het werkelijke formaat, met de eis dat een titel uniek
moet zijn en onder de 60 tekens blijft.

Daarnaast is de `volume`-regel gecorrigeerd. Die stelde dat het volumenummer per
color+power+frequency-serie loopt, maar zo heeft de data nooit gewerkt: `Red Light (m) Vol. 1`
bestaat vier keer, als Tech House, Progressive House, Melodic Techno en Neurofunk, en er zijn nog
acht van zulke paren. Het subgenre is wat ze scheidt. De spec is aan de werkelijkheid aangepast in
plaats van 9 series te hernummeren, wat hun titels opnieuw zou breken.

Gecontroleerd: de diff raakt uitsluitend `title`-regels (77 wijzigingen, 0 andere regels), alle 85
records parsen, 0 dubbele titels, `npm run build` slaagt met 89 pagina's, en ESLint meldt onverkort
37 pre-existing errors.
