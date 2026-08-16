## `feat/link-en-anker-checker` progress

### Steps

#### PLAN

- [x] De lock geverifieerd tegen de repo: de checker bestond nog niet, het onderwerp was niet
      ingehaald, en de valkuil over de code-span in `workflow-davekjohn/branch/README.md` regel 91
      klopt letterlijk
- [x] Gemeten waar de check overheen moet: 107 door git gevolgde markdown-bestanden, 200 interne
      links

#### CREATE

- [x] `scripts/lint/check-links.ps1` geschreven: fences en code-spans strippen, inline-links matchen,
      paden tegen `git ls-files` houden (hoofdlettergevoelig) en ankers tegen het kop-algoritme van
      GitHub
- [x] Als vierde stap in `scripts/lint/lint-web.ps1` gehangen, áchter de build, met de reden erbij
- [x] `CLAUDE.md` bijgewerkt op de drie plekken die de poort als "drie stappen" beschreven, plus het
      nieuwe script in de scriptlijst

#### TEST

- [x] Negatief getoetst op scriptniveau met een tijdelijk proefbestand: dood pad, dood anker en
      letterkast-afwijking alle drie gemeld (exit 1), de code-span-illustratie en de link binnen een
      fence terecht stil, en het eigen anker mét code-span groen
- [x] Negatief getoetst op poortniveau: `lint-web.ps1 -SkipBuild` geeft exit 1 op één dode link
- [x] Positief: schone tree geeft exit 0, 0 fouten over 200 links
- [x] Twee cross-platform breekpunten gerepareerd (`Split-Path` en de omzetting naar backslashes),
      die op Linux elk relatief pad verkeerd zouden oplossen
- [~] Niet lokaal onder `pwsh` 7 gedraaid — die staat niet op deze machine. CI draait hem wel, en de
      twee bekende PS7-verschillen (native-command-preference en padscheiding) zijn expliciet
      afgevangen; de CI-run op deze PR is de meting

### Where I left off

De poort is af en groen. Wat hierna komt: PR openen, CI afwachten, mergen en folden — dit is
governance- en scriptwerk, geen frontend, dus de keten loopt door zonder Dave's woord.

Twee dingen die de lock als "voorleggen, niet bouwen" markeerde en die dus blijven liggen: de
spiegel-drift in `workflow-davekjohn/releases/README.md` (de verbatim-streep staat daar op regel 336
en in de bron op regel 21) en het inbound-issue voor `adopt-workflow-folder/SKILL.md` regel 52-54.

