### Eigen metadata voor /luister en /musicmoodcolours · Content · 2026-07-26

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
