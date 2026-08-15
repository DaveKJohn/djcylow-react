## `fix/scroll-lock-met-cleanup` progress

### Steps

- [x] Beide instanties opgezocht en bevestigd dat ze samen op één pagina staan: `Navigation.tsx` en
      `LuisterFilters.tsx`, allebei op `/luister`
- [x] De lock omgezet van een toewijzing naar een geteld mechanisme op module-scope, met een cleanup
      uit het effect
- [x] Een guard tegen dubbel vrijgeven toegevoegd — React roept een cleanup in StrictMode twee keer
      aan, en dan zou de teller onder nul zakken
- [x] Bij het bouwen een derde probleem gevonden dat het issue niet noemt: het vrijgeven zette
      `overflow` hard op `''` en wiste daarmee ook een bestaande waarde. Die wordt nu bewaard en
      teruggezet
- [x] Zes tests geschreven die beide gemelde faalscenario's reproduceren, plus het herstel van de
      bestaande waarde en het desktopgeval
- [x] Negatief getoetst met de oude implementatie: **vier van de zes** vielen om
- [x] Poort groen; volledige suite 165 tests groen (was 152)

### Where I left off

Af. Raakt `src/`, loopt door onder het yolo-akkoord.

**Wat er te bekijken is als je wilt**: open op mobiel het filterpaneel op `/luister` en ga met
browser-back terug. De vorige pagina hoort gewoon te scrollen — dat deed hij vóór deze branch niet.

Sluit #58.
