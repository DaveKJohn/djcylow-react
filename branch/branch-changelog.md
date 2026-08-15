## `fix/shared-ps1-named-parameters` changelog

### Branch title

Named parameters komen weer aan door de wrapper heen

### Branch ID

20260815-160737

### Branch type

fix

### What does the change on this branch bring to main?

`scripts/task/shared.ps1` gaf zijn doorgegeven argumenten stil als positionele door in plaats van
als named. De wrapper draait de gedeelde workflow-scripts uit de plugin-cache, dus dit raakte elke
repo-eigen skill-ingang: `open-pr`, `fold-changelog` en `park`. Gemeten tegen de signature van
`open-pr.ps1` kwam `-Resolves 47` aan als `Title='-Resolves'` met een lege `Resolves` — de vlag
verdween, en de enige aanwijzing was een waarschuwing over `-Title`, een parameter die niemand
meegaf. Zo zijn PR's #98 tot en met #107 alle tien zonder hun `-Resolves` geopend.

De oorzaak is array-splatting: `& $doel @Rest` geeft elk element als positioneel argument door, dus
een `-Resolves` in die array is geen parameternaam meer maar een gewone string die op de eerste
positionele parameter landt. De argumenten gaan nu als losse tokens naar een nieuwe host, die de
parameterbinding zelf doet — zonder dat de wrapper hoeft te weten welke parameters switches zijn en
welke een waarde slikken. Getoetst op vijf argumentvormen, mét en zonder vlaggen, plus de
exitcode-doorgifte in beide richtingen.

Twee kandidaat-oorzaken zijn gemeten en verworpen in plaats van aangenomen: de `[string[]]`-typecast
op `$Rest` (een ongetypeerde `ValueFromRemainingArguments` gedraagt zich identiek) en
`[CmdletBinding()]` op de wrapper. De redenering staat in het script zelf, zodat een volgende lezer
niet opnieuw bij de titel gaat zoeken.

Daarnaast miste het `Draaien`-blok van `.claude/skills/fold-changelog/SKILL.md` de vlag `-Commit`,
terwijl stap 4 van diezelfde pagina belooft dat de fold `fold: <branch> changelog` commit. Zonder
die vlag schreef het script alleen naar schijf. `open-pr` en `park` zijn op hetzelfde soort gat
gecontroleerd en bleken schoon: hun scripts kennen geen commit-vlag en pushen zelf.

### Significance

#### Tier 0

De gereedschapskist die de resterende issues moet dragen, geeft vlaggen weer door. Zonder deze
reparatie loopt elke volgende branch erlangs, en de foutmelding wijst de verkeerde kant op: wie hem
leest zoekt in de titel en niet in het doorgeefmechanisme, wat een tweede lezer hetzelfde half uur
kost. De fold-skill deed bovendien niet wat zijn eigen pagina beloofde.

**Score:** 4

#### Tier 1

Raakt niets wat buiten de repo zichtbaar is: de website verandert niet en de build levert dezelfde
pagina's. Wat het oplevert is dat issue-koppeling op PR's weer werkt, en dat is administratie die
alleen binnen het ontwikkelwerk telt.

**Score:** N/A

### Pull Request

