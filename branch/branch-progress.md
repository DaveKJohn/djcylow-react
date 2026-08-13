## `docs/release-route-naar-script` progress

### Steps

- [x] Gemeten wat `cut-release.ps1` werkelijk doet, in plaats van de bewering in `CLAUDE.md` te geloven:
      `git add -A`, `git commit`, `git tag -a`, `git push origin main` en `git push origin <tag>`
- [x] De skill-beschrijving van `cut-release` rechtgezet, met de twee botsingen met de grondwet erbij
- [x] Bij de safety-rules opgeschreven dat `cut-release` een niet-toegestane derde weg zou zijn, en dat
      `-NoPush` dat niet oplost
- [x] Tabel bij de Release Workflow: per stap wie hem doet
- [x] Stap 6 naar het Engels, met de letterlijke defaults uit `release-lib.ps1` als kopnamen (Dave,
      2026-08-13)
- [x] De taalsectie laten kloppen met stap 6, inclusief waarom het historie-argument de conclusie over
      de seam niet droeg
- [~] `Get-ReleaseNoteWording['SectionOpen']` vullen — laten vallen. De lock stelde dit voor, maar Dave
      koos Engels, en dan is de lege seam juist het goede antwoord en stap 6 het bestand dat moest
      bewegen. `scripts/repo-config.ps1` is niet aangeraakt
- [x] De versienummertabel tegenover de bump-poort gezet, met de beslissing bij Dave gelaten
- [x] De vier ontbrekende skills toegevoegd aan de skill-lijst
- [x] Ankers `#scripts` en `#release-workflow` nagelopen: beide wijzen naar een bestaande kop
- [x] Lint-poort gedraaid

### Where I left off

Deze PR raakt alleen `CLAUDE.md` en de twee `branch/`-bestanden — geen zichtbaar resultaat, dus hij
**loopt door** tot en met de fold.

**Drie beslissingen liggen nu expliciet bij Dave**, en geen ervan is in deze branch vooruitgelopen:

1. **Mag `cut-release` hier draaien, en zo ja hoe?** Het commit op de branch waar je op staat (aanname:
   `main`) terwijl stap 2 een release-branch voorschrijft, en het stageert met `git add -A` zonder
   scope. Zolang dit openstaat blijft de route handwerk.
2. **Versienummertabel of bump-poort?** Ze meten iets anders — soort wijziging tegen wie het merkt — en
   v2.23.0 liet zien dat ze verschillende antwoorden geven op hetzelfde werk.
3. **Branch protection, een testsuite en `.nvmrc`** staan onveranderd open; die drie bepalen samen of de
   ruime PR-uitzondering nog nodig is.

**Eén ding dat deze branch bewust niet heeft aangeraakt:** `CONTRIBUTING.md`. De release-route staat
daar niet in — die pagina draagt de contributie-cyclus van branch tot fold — maar het loont te
controleren of de bewering "een merge is hier een deploy" daar nog dezelfde onderbouwing draagt nu
blijkt dat elke PR een Netlify deploy preview krijgt.
