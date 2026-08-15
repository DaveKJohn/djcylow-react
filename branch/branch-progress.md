## `fix/dode-componenten-ontmanteld` progress

### Steps

- [x] De kapotte import geverifieerd: `components/home/diensten.scss` bestaat niet en heeft nooit
      bestaan; `pages/_diensten.scss` is een ánder bestand en wordt al via `main.scss` geladen
- [x] Die import weggehaald in plaats van vervangen — de component leunt op de generieke
      layout-klassen en had nooit eigen styling
- [x] `referenties.ts` geleegd, met de vorm en de reden in het type ernaast
- [x] Het scrolldoel van `ReadMore` naar een prop gebracht, met `promo` als standaard
- [x] Tien tests die de **dode code lezen** — de bundler doet dat niet, dus een fout daarin blijft
      onzichtbaar tot het duurste moment
- [x] Negatief getoetst door de kapotte import terug te zetten: de test viel om met een melding die
      uitlegt wat er bij het terugzetten gebeurt
- [x] Twee valse rode tests opgelost door alleen naar de data te kijken en niet naar de toelichting —
      die citeert de oude plaatsvullers bewust
- [x] Poort groen; volledige suite 193 tests groen (was 183)
- [~] De vijf componenten verwijderen — **bewust niet gedaan**. Twee staan uitgecommentarieerd in
      `page.tsx`, wat "later misschien weer" betekent, en dat is een beslissing over het product.
      #59 blijft daarvoor open
- [~] De drie dode SCSS-bestanden (`meetTheDJ`, `verzoeknummers`, `referenties`) — die horen bij
      diezelfde beslissing en gaan mee met de componenten

### Where I left off

Af. Raakt `src/`, loopt door onder het yolo-akkoord.

Aan de site verandert vandaag niets: alle drie de reparaties zaten in code die niet draait. De waarde
zit in wat er niet meer misgaat zodra een van die secties terugkomt.

Sluit **#60**. **#59 blijft open** voor de vraag of de vijf componenten weg mogen — dat is jouw keuze,
niet die van een specialist.
