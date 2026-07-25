### Social previews en de canonical van /diensten gerepareerd

**Branch naam** fix/metadatabase-og-images
**Datum merge op main**
**Branch type** Fix

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
