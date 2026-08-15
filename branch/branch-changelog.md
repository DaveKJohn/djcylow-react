## `fix/switch-account-herstelpad` changelog

### Branch title

switch-account bereikt zijn eigen herstelpad, en het priveadres staat niet meer in de tree

### Branch ID

20260815-170314

### Branch type

fix

### What does the change on this branch bring to main?

**`switch-account.ps1` stierf precies in het geval dat het zegt op te vangen.** Het script zet
`$ErrorActionPreference = "Stop"` en haalde daarna `gh auth status` op met `2>&1`. Maar `gh auth
status` schrijft naar stderr en geeft exit 1 zodra er géén account is ingelogd — exact de situatie
waarvoor het herstelpad eronder bestaat ("nog niet ingelogd → start de browser-flow"). Onder PS 5.1
maakt `2>&1` van die stderr een ErrorRecord die als terminating error wordt gegooid, dus het script
brak af vóór de `if`. Wie wél was ingelogd merkte niets — 0 bytes stderr, exit 0 — en daarom is het
nooit opgevallen. Gereproduceerd in een los proces: `& cmd /c 'echo oops 1>&2 & exit 1' 2>&1` gooit
`RemoteException`.

Beide aanroepen lopen nu via één `Get-GhAuthStatus`, die `$ErrorActionPreference` lokaal op
`Continue` zet en op de tékst beoordeelt in plaats van op de exitcode — bij "geen account" ís die
melding namelijk het antwoord dat de aanroeper nodig heeft. Dat is dezelfde aanpak die
`scripts/lint/lint-web.ps1` al kiest en daar uitgebreid documenteert; die kennis was hierheen niet
gereisd, en dat is de eigenlijke les.

**En het privéadres staat niet meer in de tree.** Er stond een persoonlijk gmail-adres voluit in dit
gecommitte script, in een **publieke** repo, dus via GitHub-codesearch te vinden — in dezelfde repo
die op `src`-niveau juist moeite doet om `info@djcylow.com` uit de HTML te houden. De adressen komen
nu uit een gitignored `scripts/env/accounts.local.ps1`, met een `.example` ernaast die wel meegaat.
Ontbreekt dat bestand, dan draait de Claude-login gewoon zonder `--email` en kies je het account in
de browser: het script blijft dus bruikbaar zonder setup, en er is geen stap die je eerst moet doen.

Dit haalt het adres uit de **huidige tree**, niet uit de git-history — daar staat het nog in commit
`3c8418a`. Dat opschonen vraagt een rewrite van gepubliceerde commits en is een aparte beslissing.

### Significance

#### Tier 0

Een hulpscript dat afbreekt op het enige pad waarvoor de helft van zijn code geschreven is, plus een
privéadres dat uit een publieke repo verdwijnt. Het eerste kost tijd op precies het moment dat je
haast hebt (je bent net uitgelogd); het tweede is een lek dat vanzelf niet weggaat.

**Score:** 3

#### Tier 1

Een lokaal ontwikkelhulpmiddel; het raakt de site niet en niemand buiten de machine van de
ontwikkelaar merkt er iets van.

**Score:** N/A

### Pull Request

