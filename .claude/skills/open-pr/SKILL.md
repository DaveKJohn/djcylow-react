---
name: open-pr
description: >-
  Open de Pull Request voor de huidige branch via het gedeelde open-pr-script uit de plugin.
  Draait eerst de vier entry-poorten (resolves, scaffold, impact, step-list), daarna de lint-poort
  van deze repo en alle testsuites; bij een fout wordt er niets gepusht en geen PR geopend.
  Gebruik dit als een branch af is en de PR-regel uit CLAUDE.md het openen toestaat -- dus voor
  werk in scripts/, de governance-docs, CHANGELOG.md, releases/, .claude/ en onderzoek. Site-werk
  (src/, public/, src/data/mixes/) wacht op Dave; dat is stap 4 van de cyclus in CONTRIBUTING.md.
---

# open-pr — stap 4 van de cyclus, in deze repo

Dit is de **repo-eigen ingang** naar het gedeelde `open-pr.ps1`. Het script zelf komt onveranderd
uit de plugin-cache; hier staat geen kopie van.

## Waarom deze skill bestaat

De plugin levert `workflow-davekjohn:open-pr`, maar die draagt `disable-model-invocation: true` —
de guardrail van de bron tegen autonoom pushen en mergen. Deze repo wil de stap wél door een
specialist kunnen laten uitvoeren, binnen de grenzen die `CLAUDE.md` stelt. De afweging staat daar;
dit bestand is alleen de ingang.

**De guardrail is niet weggehaald maar verlegd.** `cut-release` en `ship-pr` hebben bewust géén
repo-eigen skill gekregen: die blijven slash-only, omdat `CLAUDE.md` ze aan Dave's expliciete
verzoek voorbehoudt.

## Draaien

Vanuit de root van de repo:

```powershell
powershell -NoProfile -File scripts/task/shared.ps1 -Script release/open-pr.ps1
```

`scripts/task/shared.ps1` zoekt zelf de hoogste geïnstalleerde pluginversie op, zodat dit blijft
werken na een plugin-update.

### De resolves-poort

Noemt de branch een open issue, dan eist het script een keuze — anders blijft een gerepareerd
issue open staan na de merge:

```powershell
# sluit het genoemde issue bij de merge
powershell -NoProfile -File scripts/task/shared.ps1 -Script release/open-pr.ps1 -Resolves 47

# meerdere
powershell -NoProfile -File scripts/task/shared.ps1 -Script release/open-pr.ps1 -Resolves 42,51,57

# bewust niets sluiten
powershell -NoProfile -File scripts/task/shared.ps1 -Script release/open-pr.ps1 -NoResolves
```

Alles wat niet `-Script` of `-Plugin` heet, gaat ongewijzigd door naar het gedeelde script.
**Zet er geen `--` tussen**: PowerShell leest dat bij `-File` zelf als parameternaam en stopt met
*"the parameter name '' is ambiguous"*.

## Vóór je dit draait

1. **Is dit site-werk?** Alles in `src/`, `public/` en `src/data/mixes/` wacht op Dave. Draagt een
   branch zowel site-werk als machinerie, dan telt het als site-werk.
2. **Staat de step-list op groen?** Het script weigert te pushen zolang er nog een `- [ ]` staat.
   Een stap die niet nodig bleek krijgt `- [~]` met de reden erbij — niet een vinkje voor werk dat
   niet gedaan is.
3. **Is de entry geschreven?** De scaffold-poort weigert een entry die nog de opzetwoorden draagt.

## Daarna

Stap 5 tot en met 7 uit [`CONTRIBUTING.md`](../../../CONTRIBUTING.md): de review, de merge, en de
fold via de `fold-changelog`-skill.
