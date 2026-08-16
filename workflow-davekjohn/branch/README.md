# `branch/` — de twee bestanden waarin een branch werkt

Alles wat een branch bij zich moet dragen woont hier, verdeeld over twee bestanden met elk één taak:

| bestand | onderwerp | wie het leest | levensduur |
|---|---|---|---|
| [`branch-changelog.md`](branch-changelog.md) | wát de wijziging **doet** | wie later `CHANGELOG.md` leest | gevouwen bij de merge, daarna gereset |
| [`branch-progress.md`](branch-progress.md) | wat er nog **moet gebeuren** | wie aan de branch werkt | gereset bij de merge; nooit gevouwen |

Beide worden geschreven door de gedeelde **`new-branch`**-skill, op het moment dat de branch wordt
aangemaakt. **Je maakt ze niet met de hand, en je verwijdert ze niet.**

De cyclus eromheen — de zes secties van een entry, het tier-model, de poorten vóór de PR en wat de fold
doet — staat in [`../CONTRIBUTING.md`](../CONTRIBUTING.md). Deze pagina gaat alleen over de twee
bestanden zelf.

## De referentiekopieën in `templates/`

Een blanco versie van elk bestand staat in [`templates/`](templates/), om in te kijken of uit te
plakken:

| template | voor |
|---|---|
| [`branch_template_changelog.md`](templates/branch_template_changelog.md) | `branch-changelog.md` |
| [`branch_template_progress.md`](templates/branch_template_progress.md) | `branch-progress.md` |

**Ze zijn gegenereerd, niet onderhouden.** Hun inhoud komt uit dezelfde formatters die `new-branch`
gebruikt, dus bewerk je er één met de hand, dan zet de volgende run hem terug — dat is geen bug maar het
mechanisme. Het is ook precies wat deze kopieën waard maakt in een repo als deze: er is hier geen lint
die de vorm nakijkt, dus de skill is het enige dat de referentie meebeweegt met een plugin-update.

**Het bestand dat je invult is kaal; de veldtoelichting zit in de template.** Elk veld draagt daar een
HTML-commentaar met wat een goed antwoord is. De vuistregel: het bestand waarin je typt is de vragen en
jouw antwoorden, de uitleg staat één map verderop.

**Ze markeren hun eigen kop met `(template)`,** en dat is geen versiering. Een geschreven entry en een
template openen met dezelfde `##`, en dat is precies het signaal waarop de fold een entry herkent — de
markering is wat voorkomt dat een template ooit als iemands werk wordt gelezen.

## Waarom de namen vast zijn

`branch-changelog.md` en `branch-progress.md` heten op elke branch hetzelfde, wat eruitziet als een
botsing zodra er twee branches zijn. Dat kan niet: **git houdt deze bestanden al per branch apart**, dus
elke branch draagt zijn eigen versie van hetzelfde pad en een checkout wisselt ze om. De naam-per-branch
die dit verving loste een probleem op dat versiebeheer al had opgelost, en kostte een repo-root die
volliep met het lopende werk van anderen.

Tot 2026-08-11 heette het entry-bestand hier `<branch-naam-met-koppeltekens>.md` in de repo-root. Dat
model had een geschreven regel nodig die `-v2` in een branchnaam verbood, omdat de fold de entry op de
exacte branchnaam opzocht. Die val bestaat niet meer: de fold leest de branch nu uit de **kop** van deze
bestanden.

## De reset-staat op `main`

Op `main` staan beide bestanden in een lege **reset-staat**: een korte uitleg, met een waarschuwing dat
je hier niet schrijft zolang er geen branch is. Zie je dat, dan kijk je naar de lege staat en niet naar
een verdwenen entry.

Die reset-staat opent met een `#` (H1), en dat is dragend in plaats van cosmetisch: de fold herkent een
entry aan zijn kopniveau, en een geschreven entry opent met `##`. Zo kan het lege bestand op de trunk
nooit als wijziging worden gevouwen, en is twee keer folden onmogelijk in plaats van slechts
onwaarschijnlijk. **Beide bestanden volgen die regel** — H1 zolang ze leeg zijn, H2 zodra een branch ze
bezit.

## De drie stappentekens

De stappenlijst is van jou: hij reist nergens naartoe en mag alles dragen wat helpt de branch weer op te
pakken. Twee dingen erin worden door scripts gelezen — **de branchnaam in de kop** en **de
stappentekens onder `### Steps`**:

```text
- [ ] nog niet gedaan       -> blokkeert de PR
- [x] gedaan
- [~] vervallen -- <waarom het niet meer nodig bleek>
```

`- [~]` bestaat omdat een plan legitiem punten opneemt die later niet meer kloppen. Zonder dat teken
leert een poort mensen vakjes af te vinken voor werk dat niet is gedaan, en meldt daarna succes — erger
dan geen poort. Een vervallen stap houdt zijn regel én zijn reden, want dat is de helft die later nog
iets waard is. **Er is geen `-Force` op deze poort.**

Een stap die nog de placeholder van de scaffold draagt wordt geweigerd, afgevinkt of niet: dat zou een
plan als afgerond melden dat nooit is geschreven.

## Regels

1. **De entry bevat het entry-blok en niets eromheen** — geen inleiding, geen waarschuwing. Dat is wat
   hem in één keer in `CHANGELOG.md` plakbaar maakt, en dat is zijn hele bestaansreden.
2. **Noem paden in de entry als code-span, niet als link.** Een entry heeft twee woonplaatsen —
   `workflow-davekjohn/branch/` zolang de branch loopt, en `CHANGELOG.md` ná de fold — en een relatief
   pad kan niet in beide kloppen.
   `` `next.config.ts` `` is op beide plekken correct; `[x](next.config.ts)` is dat op precies één plek.
   In `branch-progress.md` mag een gewone relatieve link (`../scripts/...`): dat bestand reist nooit.
3. **Elke stap is opgelost vóór de PR** — `- [x]` of `- [~]`, zoals hierboven.
4. **Vul de `Significance`-secties vóór de PR.** Hoe ver de wijziging reikt bepaalt in welk
   release-document de entry belandt; wat hij daar weegt bepaalt wáár hij erin staat — zie
   [`../CONTRIBUTING.md`](../CONTRIBUTING.md).
5. **Bewerk `CHANGELOG.md` nooit vanaf een branch.** Elke branch zou hetzelfde stuk van hetzelfde
   bestand bewerken; dat is het merge-conflict waarvoor deze map bestaat.

## Wat er bij de merge gebeurt

De **`fold-changelog`**-skill, gedraaid op `main` direct na de merge:

1. haalt HTML-commentaren weg — de scaffold schrijft er geen, maar een uit een template geplakt bestand
   draagt ze, en ze zijn de vraag en niet het antwoord;
2. zet de entry op zijn gerangschikte plek in `CHANGELOG.md` (verste bereik eerst, binnen een tier de
   zwaarste eerst), met de PR-link en de merge-datum onder `### Pull Request`;
3. **reset beide bestanden** naar de lege staat;
4. commit precies die drie paden.

Wat er in `CHANGELOG.md` landt is **dit bestand zoals het er staat** — de kop, de titel, het ID, het
type, de body en de Significance-secties. De fold herschrijft niets: een fold die de entry zou
samenvatten, zou een tweede definitie van het entry-formaat zijn.

## Twee dingen die in déze repo opvallen

**Een gestapelde branch neemt de bestanden over, en zegt van wie.** Takt je af van een branch waarvan de
entry nog niet gevouwen is, dan draagt `branch/` nog het werk van die vorige branch. `new-branch`
overschrijft dat en meldt bij naam wiens entry hij verving — de vorige branch heeft zijn eigen versie nog
in git. Tot v4.5.0 van de plugin gebeurde iets anders: hij schreef níets en meldde onder de naam van de
nieuwe branch dat de bestanden al klaar waren, waarna de branch stil met de entry van zijn voorganger
verderging. Dat is als [inbound #615](https://github.com/DaveKJohn/claude-code-specialists/issues/615)
uit deze repo gemeld en in de bron gerepareerd.

**Neem `main` niet in tussen een merge en zijn fold.** In dat korte venster staat de entry van die
andere branch óók op `main`, en dan conflicteert hij met de jouwe. De oplossing is triviaal — houd de
jouwe; die van hen wordt vanaf `main` gevouwen — en het venster is klein, want de fold volgt direct op de
merge. Buiten dat venster botsen twee branches hier niet: de fold zet de bestanden terug in exact de
lege staat, dus `main` is dan weer gelijk aan de merge-base.
