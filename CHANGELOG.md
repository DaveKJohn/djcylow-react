# Changelog

De belangrijkste wijzigingen aan deze repo kort bijgehouden. Één regel per noemenswaardige wijziging.

## Hoe dit werkt

- **`## [Unreleased]`** — wijzigingen die al in `main` zitten maar nog niet live zijn. Dit blok vult zich met elke branch die naar `main` wordt gemergd, en blijft staan tot de eerstvolgende live-push.
- **`## [vX.Y.Z] - YYYY-MM-DD — Patch/Minor/Major`** — op die datum live gegaan via een push naar het live thema. De volledige uitwerking staat in `releases/development/X.Y/X.Y.Z.md`.

De bovenste uitgebrachte versie draagt de markering **← LIVE**: dat is de versie die op dit moment op het live thema staat. Bij elke live-push verschuift die markering naar de nieuwe versie.

### Levenscyclus van een regel

`CHANGELOG.md` zelf wordt **nooit direct bewerkt op een branch** — dat gaf bij lang-openstaande
branches merge-conflicten, omdat elke branch hetzelfde `[Unreleased]`-blok aanpaste. In plaats
daarvan schrijft elke branch zijn eigen entry-bestand; volledige uitleg staat in
[`workflow/workflow-CLAUDE.md`](workflow/workflow-CLAUDE.md).

1. **Op een branch** maak je een eigen entry-bestand `<branch-naam-met-koppeltekens>.md` in de
   repo-root aan (via de gedeelde `new-branch`-skill, die branch en entry in één stap neerzet), met
   dezelfde inhoud die vroeger direct in `[Unreleased]` ging. Een branch mag gerust weken geparkeerd
   blijven — er is niets om over te conflicteren.
2. **Branch klaar en goedgekeurd** → merge naar `main`, branch verwijderen. Vouw daarna de entry
   bovenaan `[Unreleased]` in en verwijder het entry-bestand. Dit commit gaat direct op `main`
   (toegestane uitzondering op de geen-directe-main-commits-regel) met een `chore:`-prefix. De
   gedeelde `fold-changelog`-skill kan dit nog niet automatisch — zie de aantekening bij stap 7 in
   [`workflow/workflow-CLAUDE.md`](workflow/workflow-CLAUDE.md).
3. **Meer branches** die later mergen en gevouwen worden vullen `[Unreleased]` op `main` verder
   aan. `main` kan dus een tijd met een gevulde `[Unreleased]` rondlopen — dat is gewoon "wel
   gemergd, nog niet live".
4. **`main` naar live pushen** → alles onder `## [Unreleased]` is nieuw en wordt de eerstvolgende
   release-note: maak `releases/development/X.Y/X.Y.Z.md` op basis van de inhoud, voeg de versie
   toe aan `releases/README.md`, hernoem het blok naar
   `## [vX.Y.Z] - YYYY-MM-DD — Patch/Minor/Major` (met "Zie releases/development/X.Y.Z.md"), en
   maak een vers leeg `## [Unreleased]` bovenaan aan.

---

## [Unreleased]

### Social previews en de canonical van /diensten gerepareerd
**Branch naam** fix/metadatabase-og-images
**Datum merge op main** 2026-07-25
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

---

---

## [v2.21.0] - 2026-07-25 — Minor

Zie [releases/development/2.21/2.21.0.md](releases/development/2.21/2.21.0.md)

> Gecut, **nog niet live**. De `← LIVE`-markering verschuift hierheen zodra v2.20.2 en v2.21.0
> samen zijn uitgerold en de deploy geslaagd is.

---

## [v2.20.2] - 2026-07-25 — Patch

Zie [releases/development/2.20/2.20.2.md](releases/development/2.20/2.20.2.md)

> Gecut, **nog niet live**. Gaat samen met v2.21.0 uit bij de eerstvolgende live-push; de
> `← LIVE`-markering springt dan naar v2.21.0, de bovenste van de twee.

---

## [v2.20.1] - 2026-07-02 — Patch ← LIVE

Zie [releases/development/2.20/2.20.1.md](releases/development/2.20/2.20.1.md)

---

## [v2.20.0] - 2026-07-02 — Minor

Zie [releases/development/2.20/2.20.0.md](releases/development/2.20/2.20.0.md)

---

## [v2.19.2] - 2026-06-28 — Patch

Zie [releases/development/2.19/2.19.2.md](releases/development/2.19/2.19.2.md)

---

## [v2.19.1] - 2026-06-28 — Patch

Zie [releases/development/2.19/2.19.1.md](releases/development/2.19/2.19.1.md)

---

## [v2.19.0] - 2026-06-28 — Minor

Zie [releases/development/2.19/2.19.0.md](releases/development/2.19/2.19.0.md)

---

## [v2.18.0] - 2026-06-27 — Minor

Zie [releases/development/2.18/2.18.0.md](releases/development/2.18/2.18.0.md)

---

## [v2.17.0] - 2026-06-27 — Minor

Zie [releases/development/2.17/2.17.0.md](releases/development/2.17/2.17.0.md)

---

## [v2.16.4] - 2026-06-27 — Patch

Zie [releases/development/2.16/2.16.4.md](releases/development/2.16/2.16.4.md)

---

## [v2.16.3] - 2026-06-27 — Patch

Zie [releases/development/2.16/2.16.3.md](releases/development/2.16/2.16.3.md)

---

## [v2.16.2] - 2026-06-27 — Patch

Zie [releases/development/2.16/2.16.2.md](releases/development/2.16/2.16.2.md)

---

## [v2.16.1] - 2026-06-27 — Patch

Zie [releases/development/2.16/2.16.1.md](releases/development/2.16/2.16.1.md)

---

## [v2.16.0] - 2026-06-25 — Minor

Zie [releases/development/2.16/2.16.0.md](releases/development/2.16/2.16.0.md)

---

## [v2.15.0] - 2026-06-25 — Minor

Zie [releases/development/2.15/2.15.0.md](releases/development/2.15/2.15.0.md)

## [v2.14.4] - 2026-06-25 — Patch

Zie [releases/development/2.14/2.14.4.md](releases/development/2.14/2.14.4.md)

## [v2.14.3] - 2026-06-25 — Patch

Zie [releases/development/2.14/2.14.3.md](releases/development/2.14/2.14.3.md)

## [v2.14.2] - 2026-06-25 — Patch

Zie [releases/development/2.14/2.14.2.md](releases/development/2.14/2.14.2.md)

## [v2.14.1] - 2026-06-25 — Patch

Zie [releases/development/2.14/2.14.1.md](releases/development/2.14/2.14.1.md)

## [v2.14.0] - 2026-06-25 — Minor

Zie [releases/development/2.14/2.14.0.md](releases/development/2.14/2.14.0.md)

## [v2.13.0] - 2026-06-18 — Minor

Zie [releases/development/2.13/2.13.0.md](releases/development/2.13/2.13.0.md)

## [v2.12.0] - 2026-06-16 — Minor

Zie [releases/development/2.12/2.12.0.md](releases/development/2.12/2.12.0.md)

## [v2.11.1] - 2026-05-10 — Patch

Zie [releases/development/2.11/2.11.1.md](releases/development/2.11/2.11.1.md)

## [v2.11.0] - 2026-05-08 — Minor

Zie [releases/development/2.11/2.11.0.md](releases/development/2.11/2.11.0.md)

## [v2.10.0] - 2026-05-05 — Minor

Zie [releases/development/2.10/2.10.0.md](releases/development/2.10/2.10.0.md)

## [v2.9.0] - 2026-05-01 — Minor

Zie [releases/development/2.9/2.9.0.md](releases/development/2.9/2.9.0.md)

## [v2.8.0] - 2026-04-20 — Minor

Zie [releases/development/2.8/2.8.0.md](releases/development/2.8/2.8.0.md)

## [v2.7.0] - 2026-04-13 — Minor

Zie [releases/development/2.7/2.7.0.md](releases/development/2.7/2.7.0.md)

## [v2.6.0] - 2026-04-11 — Minor

Zie [releases/development/2.6/2.6.0.md](releases/development/2.6/2.6.0.md)

## [v2.5.0] - 2026-04-10 — Minor

Zie [releases/development/2.5/2.5.0.md](releases/development/2.5/2.5.0.md)

## [v2.4.0] - 2026-03-20 — Minor

Zie [releases/development/2.4/2.4.0.md](releases/development/2.4/2.4.0.md)

## [v2.3.0] - 2026-03-19 — Minor

Zie [releases/development/2.3/2.3.0.md](releases/development/2.3/2.3.0.md)

## [v2.2.0] - 2026-03-13 — Minor

Zie [releases/development/2.2/2.2.0.md](releases/development/2.2/2.2.0.md)

## [v2.1.0] - 2026-03-11 — Minor

Zie [releases/development/2.1/2.1.0.md](releases/development/2.1/2.1.0.md)

## [v2.0.1] - 2026-03-08 — Patch

Zie [releases/development/2.0/2.0.1.md](releases/development/2.0/2.0.1.md)

## [v2.0.0] - 2026-03-07 — Major

Zie [releases/development/2.0/2.0.0.md](releases/development/2.0/2.0.0.md)
