## `fix/emaillek-en-dode-imports` changelog

### Branch title

Het e-mailadres lekte langs zijn eigen bescherming

### Branch ID

20260814-214410

### Branch type

fix

### What does the change on this branch bring to main?

**Het e-mailadres stond op zes pagina's gewoon in de statische HTML, terwijl de component die dat
hoort te voorkomen er ongebruikt boven hing.** `ContactForm.tsx` importeerde `EmailDisplay` maar
gebruikte het niet, en zette `info@djcylow.com` drie regels verderop voluit in de zin *"Stuur een
e-mail naar ..."*. Die component bestaat juist om het adres pas in de browser samen te stellen, zodat
scrapers die alleen de HTML lezen het niet vinden. De bescherming was begonnen en nooit afgemaakt.

Dat is nu wel afgemaakt, en het resultaat is gemeten: **6 → 0** gebouwde HTML-bestanden met het adres
erin. De zin blijft staan met een lege `<span>` die de browser vult. De footer deed dit al goed; het
lek zat in het contactformulier, dat op de home, `diensten` en de drie dienstenpagina's staat.

De aanleiding was een ESLint-**warning** over een ongebruikte import — de laagste categorie melding
die er is. De achterliggende fout was een beveiligingsmaatregel die niets deed.

**Verder alle resterende warnings weg; de teller staat nu op 0 errors en 0 warnings.**

- `Navigation.tsx` — `useState`/`useEffect` geïmporteerd maar nergens gebruikt
- `send-email.js` — `catch (e)` zonder `e` te lezen, nu `catch {}` met de reden erbij
- `page.tsx` — de imports van `Referenties` en `GoogleReviews`, die in de JSX **uitgeschakeld**
  staan. De uitgecommentarieerde regels blijven staan: díe dragen de bedoeling, een ongebruikte
  import doet dat niet. Of die twee secties terugkomen is een contentvraag en blijft open
- `Hero.tsx` — de twee `no-img-element`-warnings zijn onderdrukt mét de afweging erbij, niet
  stilgezet. `next/image` levert hier weinig: deze repo draait op `images: { unoptimized: true }`
  (vereist voor de static export), dus er is geen resizing en geen formaatconversie — precies waar de
  regel om vraagt. Wat het wél toevoegt is lazy loading, en dat wil je voor een hero niet

**Bijvangst, gemeten en vastgelegd in de code:** achter die warning zit wél een echt probleem. Beide
hero-afbeeldingen staan in de DOM en worden met `display: none` geschakeld, terwijl een browser een
`<img src>` met `display:none` in de regel gewoon ophaalt. Een mobiele bezoeker downloadt daardoor
`hero_desktop.webp` (**105 KB**) bovenop de `hero_mobile.webp` (**56 KB**) die hij ziet — bijna
tweemaal de nuttige lading, juist op de verbinding waar dat het meest telt. De oplossing is
`<picture>` met een `<source media=...>`, maar die vraagt ook een samenvoeging in `hero.scss` en dus
een blik op het resultaat. Dat staat als aparte klus genoteerd in `Hero.tsx` zelf.

**En de alt-teksten van de hero zijn vervangen.** Er stond `alt="heroDesktop"` en `alt="heroMobile"`
— dat beschrijft het bestand, niet de foto, en wordt door een screenreader als betekenisloze ruis
voorgelezen. Het is een foto van DJ Cylow met koptelefoon achter zijn Pioneer-controller, en dat staat
er nu.

### Significance

#### Tier 0

Een ongebruikte import bleek een beveiligingsmaatregel te zijn die niets deed. Dat is precies waarom
de warning-teller op 0 hoort te staan in plaats van "acht, en die kennen we": in een lijst van acht
bekende meldingen valt niet op welke er één te veel is. De teller staat nu op 0/0, dus de volgende
melding is per definitie nieuw.

**Score:** 4

#### Tier 1

Het e-mailadres van de opdrachtgever stond geïndexeerd en scrape-baar op zes pagina's, terwijl de site
de indruk wekte dat het beschermd was. Dat is nu dicht. Merkbaar wordt het pas op termijn — in wat er
níet binnenkomt — en aan de pagina zelf verandert niets zichtbaars.

**Score:** 3

### Pull Request

