## `config/lokale-workflow-skills` changelog

### Branch title

Repo-eigen slash-skills voor de workflow-stappen die de plugin niet autonoom aanbiedt

### Branch ID

20260815-125827

### Branch type

config

### What does the change on this branch bring to main?

Acht van de tien skills uit `workflow-davekjohn` dragen `disable-model-invocation: true`, en dat
kwam pas aan het licht toen een specialist stap 4 van de cyclus wilde zetten en de Skill-tool
weigerde met *"reserved for explicit user invocation"*. Het zijn precies de acht die naar buiten
schrijven: `open-pr`, `ship-pr`, `park`, `fold-changelog`, `cut-release`, `lock`, `continue` en
`fix-mojibake`. Dat is geen storing maar de guardrail van de bron — bij PR #155 beschreven als
*"closes the autonomous-invocation surface"* — en daarmee dezelfde regel als de safety-rules hier,
alleen gegoten in een mechanisme in plaats van in proza.

**Deze repo heeft die guardrail niet weggehaald maar verlegd**, en alleen waar `CLAUDE.md` de
uitzondering zelf al maakt. Drie skills krijgen een repo-eigen ingang in `.claude/skills/`:
`open-pr` (de PR-regel zegt al *doorlopen tenzij*), `fold-changelog` (uitzondering 1 op "nooit
direct op `main`", met een vastgelegde scope) en `park` (een push is geen PR). `cut-release` en
`ship-pr` krijgen er bewust géén: die staan hier aan Dave's expliciete verzoek, en dat blijft zo.

**Er wordt geen enkel gedeeld script gedupliceerd.** De drie ingangen roepen via het nieuwe
`scripts/task/shared.ps1` het origineel uit de plugin-cache aan — dezelfde kopie die een
plugin-skill zou draaien, dus de "cache om te draaien"-regel blijft intact. Dat helperscript lost de
versiemap op het moment van draaien op, want er staan acht versies in de cache en een skill die het
pad hardcodeert breekt bij de eerstvolgende plugin-update.

Twee dingen zijn gemeten in plaats van aangenomen, en beide bleken anders dan de eerste opzet:

- **De versiesortering moet op `[version]`**, niet op tekst. Anders wint `3.9.0` van `3.10.0`, en
  dat zijn allebei mappen die er nu werkelijk staan.
- **Een `--` tussen de argumenten werkt niet.** PowerShell leest die bij `-File` zelf als
  parameternaam en stopt met *"the parameter name '' is ambiguous"*. De eerste versie van de
  skill-documentatie schreef het voor; dat is gecorrigeerd nadat het faalde.

Ook de exitcode is gerepareerd: een `.ps1` die via `&` wordt aangeroepen en zelf geen `exit` doet,
laat de `LASTEXITCODE` van de vorige aanroep staan — een geslaagde run meldde daardoor 255.

### Significance

#### Tier 0

Zonder dit kan een specialist geen enkele stap van de cyclus afmaken: het werk staat op een branch
en blijft daar. Met 56 openstaande auditissues is dat het verschil tussen doorwerken en per branch
op een handmatig commando wachten. De guardrail die de bron bedoelde blijft staan waar `CLAUDE.md`
hem ook stelt — bij de release en bij site-werk.

**Score:** 4

#### Tier 1

N/A — dit raakt de gereedschapskist, niet djcylow.com. De build levert dezelfde pagina's.

**Score:** N/A

### Pull Request

