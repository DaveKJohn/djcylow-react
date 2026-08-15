## `docs/ruleset-strict-aan` progress

### Steps

- [x] De volledige ruleset opgehaald en als backup weggeschreven vóór er iets veranderde
- [x] De payload opgebouwd uit die backup, zodat er exact één veld wijzigt en de rest letterlijk
      teruggaat zoals hij was
- [x] `PUT` uitgevoerd op ruleset 20818953
- [x] Vóór en ná gediff: **precies één verschil**
      (`strict_required_status_checks_policy` false → true), en `bypass_actors`, `enforcement`, de
      drie regeltypes en de required check `poort` alle vier ongemoeid
- [x] `CLAUDE.md` bijgewerkt: die beschreef nog de oude stand, inclusief de zin dat dit "Dave's
      beslissing" was — die is nu genomen
- [x] De kosten van de wijziging erbij gezet, niet alleen de winst: elke PR moet voortaan bij zijn met
      `main`, en `main` schuift hier bij elke fold op
- [~] Het eerste voorstel uit #91 (een tweede ruleset zonder bypass) — bewust niet uitgevoerd: die zou
      `cut-release`'s eigen push naar `main` blokkeren, wat precies de reden is dat de bypass bestaat

### Where I left off

Af. Raakt alleen `CLAUDE.md`, dus de keten loopt door tot en met de fold.

**Deze branch is meteen de eerste praktijktest van de nieuwe regel** — hij loopt zelf langs de strengere
ruleset. Gaat de merge zonder `Update branch`, dan weten we dat een branch die vóórloopt op `main` als
bij beschouwd wordt; vraagt hij er wel om, dan is dat het gedrag waar de zes wachtende branches ook mee
te maken krijgen.

**Voor de zes geparkeerde branches betekent dit iets praktisch:** ze takken allemaal af van dezelfde
`main`. Zodra de eerste gemerged is, zijn de andere vijf "out of date" en vragen ze elk een
`Update branch` vóór hun merge. Dat is precies de prijs die hierboven staat, en de reden dat ik dit
eerder wilde uitstellen tot ná die merges.

Sluit #91 bij een merge — beide punten zijn dan afgehandeld: punt 1 als correctie (PR #115), punt 2 als
uitgevoerde settingswijziging.
