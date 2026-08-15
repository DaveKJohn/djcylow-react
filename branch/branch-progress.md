## `fix/switch-account-herstelpad` progress

### Steps

- [x] De fout gereproduceerd in een los proces vóór er iets veranderde:
      `$ErrorActionPreference='Stop'; & cmd /c 'echo oops 1>&2 & exit 1' 2>&1` gooit `RemoteException`
- [x] Beide `gh auth status`-aanroepen achter één `Get-GhAuthStatus` gezet, met `Continue` lokaal en
      een beoordeling op de tekst — dezelfde aanpak die `lint-web.ps1` al documenteert
- [x] Getoetst dat de constructie niet meer gooit: de tekst komt terug in plaats van een terminating
      error, en bevat de melding die de `-notmatch` nodig heeft
- [x] De adressen uit het script gehaald naar een gitignored `accounts.local.ps1`, met
      `accounts.local.example.ps1` als vorm in de repo
- [x] Beide leespaden getoetst: zonder het bestand blijft het adres leeg (val terug op de
      browserkeuze), met het voorbeeldbestand komt het adres door
- [x] `git check-ignore -v` bevestigt dat `accounts.local.ps1` genegeerd wordt
- [x] Parse-check op het gewijzigde script: geen fouten
- [x] Geverifieerd dat er geen echt adres meer in de tree staat (`git grep`), en vastgesteld dat het
      nog wél in de history zit (commit `3c8418a`)
- [~] Het script end-to-end draaien — bewust niet gedaan: het logt accounts uit bij `gh` en Claude,
      dus draaien zou de sessie waarin het wordt getest onderuithalen. Alle onderdelen zijn los
      getoetst, en dat is hier de eerlijke dekking
- [~] Het adres uit de git-history verwijderen — buiten scope. Dat vraagt een rewrite van
      gepubliceerde commits en is Dave's beslissing, zoals het issue zelf ook stelt

### Where I left off

Af. Raakt alleen `scripts/env/` en `.gitignore`, dus de keten loopt door tot en met de fold.

Twee dingen voor Dave:

- **Wil je dat het script het Claude-adres weer zelf invult**, kopieer dan
  `scripts\env\accounts.local.example.ps1` naar `scripts\env\accounts.local.ps1` en vul je adressen
  in. Zonder dat bestand werkt het script gewoon; je kiest het account dan in de browser.
- **Het adres staat nog in de git-history** (commit `3c8418a`). Dat weghalen is een aparte,
  zwaardere ingreep.
