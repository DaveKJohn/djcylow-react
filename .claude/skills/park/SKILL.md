---
name: park
description: >-
  Commit het openstaande werk op de huidige branch en push die met git push -u naar origin, zodat
  je hem elders precies zo oppakt. Opent geen Pull Request en zet niets live. Gebruik dit om werk
  veilig te stellen dat nog niet af is, of om een branch klaar te zetten waarvan de PR op Dave
  wacht -- site-werk in src/, public/ of src/data/mixes/.
---

# park — werk veiligstellen zonder PR

Dit is de **repo-eigen ingang** naar het gedeelde `park`-script uit de plugin. Het script komt
onveranderd uit de plugin-cache; hier staat geen kopie van.

## Waarom deze skill bestaat

De plugin-skill draagt `disable-model-invocation: true`, samen met de zeven andere skills die naar
buiten schrijven. Voor `park` weegt dat het lichtst van allemaal: **een push is geen PR**. De
branch wordt bereikbaar vanaf een ander apparaat, en de PR-regel uit `CLAUDE.md` blijft
onaangetast en apart.

Juist daarom is dit de skill die site-werk afsluit: de branch staat veilig op `origin`, en de PR
wacht op Dave.

## Draaien

Vanaf de branch die je wilt parkeren:

```powershell
powershell -NoProfile -File scripts/task/shared.ps1 -Script task/park-branch.ps1
```

## Wat het niet doet

- **Geen PR.** Dat is de `open-pr`-skill, en voor site-werk is dat Dave's beslissing.
- **Niets live.** Alleen een merge naar `main` deployt in deze repo.
