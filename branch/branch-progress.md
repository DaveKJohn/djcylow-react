## `style/dode-componenten-weg` progress

### Steps

- [x] Geverifieerd dat geen van de vijf ergens gerenderd wordt; alleen `Referenties` en
      `GoogleReviews` stonden uitgecommentarieerd in `page.tsx`
- [x] De vijf componenten, hun drie stylesheets en `src/content/referenties.ts` verwijderd
- [x] De twee uitgecommentarieerde JSX-regels weg, met in de code waarom en waar het werk terug te
      vinden is
- [x] `react-google-reviews` uit de dependencies — die kon in PR #114 nog niet weg omdat
      `GoogleReviews.tsx` er als enige naar verwees. Alle zes resterende pakketten worden gebruikt
- [x] De teksten in `home.ts` **niet** verwijderd, met de afweging erboven: dode code is schuld, een
      ongebruikte alinea is voorraad
- [x] De slapers-test omgedraaid: van "wijzen hun imports ergens naartoe" naar "wordt elke component
      in `src/components/home/` ook gerenderd" — dezelfde regel, een stap eerder
- [x] Een test toegevoegd dat er geen uitgecommentarieerde JSX-secties achterblijven
- [x] De alt-tekst-test losgemaakt van een vaste bestandenlijst: die viel na het verwijderen op een
      ontbrekend bestand in plaats van op een slechte alt-tekst. Loopt nu over de hele boom
- [x] Poort groen; 207 tests groen; nog steeds 89 pagina's

### Where I left off

Af. De site levert exact dezelfde pagina's.

Sluit #59, en het losse eindje uit #94 (de derde dode dependency) is hiermee ook weg.
