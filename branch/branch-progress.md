## `fix/shared-ps1-named-parameters` progress

### Steps

- [x] Meten wat er werkelijk gebeurt, vóór er een remedie wordt gekozen: een wegwerpdoel met de
      exacte signature van `open-pr.ps1`, aangeroepen door een replica van de wrapper. Uitkomst:
      `-Resolves 47` komt aan als `Title='-Resolves'`, `Resolves=''`
- [x] De twee andere kandidaat-oorzaken toetsen in plaats van aannemen — de `[string[]]`-typecast op
      `$Rest` en `[CmdletBinding()]`. Beide verworpen: een ongetypeerde `ValueFromRemainingArguments`
      gedraagt zich identiek, en klassieke `$args` weigert de parameter al bij de wrapper
- [x] De remedie bouwen in `scripts/task/shared.ps1`: doorgeven aan een nieuwe host in plaats van
      `& $doel @Rest`, met de meting en de twee verworpen kandidaten in een comment erboven
- [x] De fix negatief toetsen tegen de échte `shared.ps1`: vijf argumentvormen (enkele waarde,
      komma-lijst, losse switch, geen argumenten, waarde met spaties plus twee switches)
- [x] De exitcode-doorgifte toetsen in beide richtingen — een doelscript dat `exit 3` doet moet 3
      opleveren en niet 0. Gemeten: 0 bij succes, 3 bij falen
- [x] `.claude/skills/fold-changelog/SKILL.md`: `-Commit` toevoegen aan het `Draaien`-blok, met de
      reden erbij, en `-Push` expliciet uitsluiten omdat pushen Dave's initiatief is
- [x] `open-pr` en `park` op hetzelfde soort gat controleren. Beide schoon: hun scripts kennen geen
      commit-vlag en pushen zelf
- [x] De meetbestanden uit de plugin-cache opruimen

### Where I left off

De branch is af. Wat hierna nog wacht en geen stap van deze branch is: de PR, de merge en de fold.

Twee dingen die tijdens het meten opvielen en hier bewust **niet** zijn meegenomen, omdat ze een
eigen branch of een eigen route verdienen:

- **`session-status.ps1` print de open issues als `#System.Object[]`.** Zat al in de vorige lock als
  kandidaat voor een `inbound`-issue. Het is een formatteerfout in het gedeelde script, niet in deze
  repo, dus repareren gebeurt in de bron — check daar eerst of het issue er al staat.
- **De komma-lijstvorm `-Resolves 42,51,57` uit `.claude/skills/open-pr/SKILL.md` werkt, maar niet
  omdat de wrapper hem als lijst doorgeeft.** Hij komt aan als de string `42,51,57`, en dat is
  precies wat `open-pr.ps1` verwacht — de parameter is daar `[string]$Resolves`, niet `[int[]]`.
  Zou hij `[int[]]` zijn geweest, dan had `-File` er 425157 van gemaakt: PowerShell leest de komma
  dan als duizendtalscheider. Dat geldt óók zonder deze wrapper, gemeten bij een directe aanroep.
  Geen actie nodig, maar het is een valkuil voor wie ooit het type van die parameter aanpast.

