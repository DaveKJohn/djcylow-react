## `fix/nederlandse-taal-en-404` changelog

### Branch title

De site zegt tegen browsers en Google dat hij Nederlands is

### Branch ID

20260815-211644

### Branch type

fix

### What does the change on this branch bring to main?

De site draagt `<html lang="nl">` in plaats van `lang="en"`. Alle content is Nederlands — de teksten
in `src/content/`, alle koppen, alle UI-strings — dus dat attribuut beschreef niets. Het kostte twee
concrete dingen: schermlezers spraken Nederlandse tekst met een Engelse stem uit, en Google kreeg een
taalsignaal dat de rest van de pagina tegensprak, op een site die juist lokaal gevonden wil worden.

**De fallback-description was ook Engels** (*"DJ Cylow - Professional DJ for your events"*). De vier
hoofdpagina's zetten hun eigen description, maar wat dat niet doet krijgt deze — en `out/404.html`
droeg hem letterlijk.

**En er was geen eigen 404-pagina**, dus Next leverde zijn standaard: `404: This page could not be
found.`, in het Engels en zonder enige styling van deze site. Er staat nu een `not-found.tsx` in de
huisstijl, met `robots: noindex, follow` — een foutpagina hoort niet in de zoekresultaten, maar de
links erop mogen wel gevolgd worden.

Gemeten in de build: `out/404.html` en `out/index.html` dragen beide `lang="nl"`, de 404 heet
*"Pagina niet gevonden | DJ Cylow"* en draagt een Nederlandse description.

**De documentatie sprak zichzelf hierover tegen, en dat is meegecorrigeerd.** `CLAUDE.md` zei "de
website is Engels" met `lang="en"` als bewijs; `README.md` zei "the site is in Dutch". De code gaf
een derde antwoord. Het attribuut was dus geen taalbesluit maar een verkeerde waarde die als besluit
werd gepresenteerd — en die presentatie hield hem in stand. Alle drie zeggen nu hetzelfde.

`description_en` blijft bestaan en wordt net zo streng bewaakt door de testsuite: dat veld is er voor
een eventuele Engelse variant later.

### Significance

#### Tier 0

Een tegenspraak tussen twee governance-documenten en de code is weg, en de reden waarom hij ontstond
staat erbij: een verkeerd ingevuld attribuut dat als besluit werd gelezen.

**Score:** 3

#### Tier 1

Het taalsignaal naar Google klopt nu op een site die van lokale vindbaarheid leeft, en wie een
schermlezer gebruikt krijgt Nederlandse tekst niet langer met een Engelse stem. De 404 is bovendien
geen kale Next-standaardpagina meer.

**Score:** 4

### Pull Request

