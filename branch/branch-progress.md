## `docs/vooruitlopende-main-en-scriptkopie` progress

### Steps

- [x] Geverifieerd of de bron al een issue heeft over de `#System.Object[]`-print: nul open issues,
      en niets in de historie dat erover gaat
- [x] De fout gereproduceerd onder Windows PowerShell 5.1: `ConvertFrom-Json` geeft de JSON-array als
      één object terug, dus `Count = 1`, element `Object[]`, en `$_.number` plakt alle 29 nummers
- [x] De marketplace-clone gelezen: de bron heeft het al gerepareerd (`$raw = gh issue list …` met een
      `Where-Object`-filter). **Dus geen inbound-issue** — de fout zit in de uitgebrachte kopie, niet
      in de bron
- [x] Die bron-fix nagemeten onder 5.1 in plaats van aangenomen dat hij het probleem ook dekt: 29
      issues, correct geformatteerd
- [x] De vooruitlopende-`main`-valkuil opgeschreven bij stap 1 van `CONTRIBUTING.md`, met de meting
      (#108, #109) en de uitweg via `origin/main`
- [x] Het tweede geval van de cache-versus-marketplace-val toegevoegd aan `CLAUDE.md`, bij de alinea
      die de val al beschrijft
- [x] De poortbeschrijving in stap 4 van `CONTRIBUTING.md` bijgewerkt: ESLint stond er niet in en de
      paginadrempel evenmin
- [~] Inbound-issue indienen — vervallen: de bron heeft de reparatie al. Dit was de aanleiding voor de
      branch en het antwoord bleek nee, wat de meting waard was

### Where I left off

Af. Dit raakt alleen documentatie, dus de keten loopt door tot en met de fold.

De `#System.Object[]`-print blijft zichtbaar bij elke `/continue` tot de volgende plugin-release hier
geïnstalleerd is. Dat is bekend en vraagt geen actie; `gh issue list` is de omweg.
