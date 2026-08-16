## `docs/pushen-vrij-en-een-merge-uitzondering` changelog

### Branch title

Pushen naar origin mag altijd, en alleen frontend-werk wacht nog op Dave

### Branch ID

20260816-144520

### Branch type

docs

### What does the change on this branch bring to main?

Twee regels zijn op Dave's woord vereenvoudigd, allebei in de richting van minder wachten.

**Pushen naar `origin` is vrij, ook naar `origin/main`.** De regel luidde *"dit initiatief ligt altijd bij
Dave — vraag hier nooit naar, ook niet impliciet"* en kwam uit een correctie van 2 juli 2026, met als reden
dat een release live gaat op productie. Die reden was uitgehold: sinds de PR-stap op 2026-08-13 *doorlopen
tenzij* werd, bereikt al het overige `origin/main` allang via de merge — en `gh pr merge` schrijft daar
server-side rechtstreeks in. Wat er ná die uitholling nog onder viel was precies één handeling, de
**fold-commit**, en dat is de minst riskante van alles wat hier naar `origin/main` schrijft: `CHANGELOG.md`
plus twee bestanden in `workflow-davekjohn/branch/`, die geen enkele gebouwde pagina veranderen. Netlify
meldde bij PR #145 letterlijk *"Pages changed — skipping"*. De zwaarste stap liep dus automatisch en de
lichtste bleef wachten. Dat brengt de repo ook terug bij de bron, waar de gedeelde `fold-changelog`-skill
`-Push` als de normale route noemt.

**Een PR wacht nog om precies één reden: er valt iets aan de frontend te bekíjken.** Er stonden er twee;
de tweede — *onomkeerbaar of naar buiten gericht* — is geschrapt. Wat daarmee **niet** verdwijnt zijn de
beschermde bestanden zelf: `next.config.ts`, `netlify.toml` en verwijderingen uit `public/images/` staan
onverkort op de lijst *Nooit zonder expliciete toestemming van Dave*. Het verschil is wannéér dat woord
valt — bij het uitdelen van het werk, niet nóg eens bij de merge-knop, waar het een stempel was op een
besluit dat al genomen was. Een release en een tag hoorden sowieso niet in die opsomming: een release cut
loopt hier niet via een branch of een PR, dus er viel niets te mergen.

De grens zelf is dus blijven staan waar hij stond. Alles in `src/`, `public/` en `src/data/mixes/` wacht
nog steeds, ook een refactor die visueel niets verandert, want geen poort kan bewijzen dat een pagina er
góéd uitziet. Wat verdween is de rúimte eromheen.

Meebewogen in de machinerie: de vier `git push origin main|HEAD`-regels zijn van de `ask`-lijst in
`.claude/settings.json` gehaald — een `ask` op een vrije handeling is geen bescherming maar een prompt die
je leert wegklikken. De **deny**-lijst blijft onaangeroerd: force-push in alle drie zijn vormen,
`reset --hard`, `rebase` en `gh repo delete`. Vrij pushen is niet vrij herschrijven. De `ask` op het cutten
van een release en op repo-settings blijft ook staan.

Bijgewerkt: `CLAUDE.md` (de grondwet, de skill-tabel en de settings-noot), `CONTRIBUTING.md` (stap 4, 5 en
7), Chris' lens — de enige die elke sessie automatisch meelaadt — de drie repo-eigen skills en het
PR-template. De fold draait voortaan met `-Push` in plaats van `-Commit`.

Eén gevolg dat pas bij het narekenen opviel: `CONTRIBUTING.md` waarschuwde dat een vooruitlopende `main`
meereist in een nieuwe branch, *"wat hier de normale stand is, want de fold-commit blijft bewust lokaal"*.
Die oorzaak is nu weg, dus `main` hoort na elke ronde gelijk te staan. De waarschuwing blijft staan omdat
het mechanisme niet weg is — maar hij beschrijft nu een uitzondering in plaats van de regel, en daarmee is
een `ahead`-regel een signaal geworden in plaats van behang.

### Significance

#### Tier 0

Dit verandert hoe elke keten in deze repo eindigt: openen → mergen → folden → **pushen**, zonder tussenstop.
Een specialist die de oude regel volgt laat een fold-commit liggen en meldt hem als openstaand punt, wat
precies de vertraging is die deze wijziging opheft. Het raakt bovendien de enige lens die automatisch
meelaadt, dus de kans dat de oude reflex blijft hangen was reëel.

**Score:** 4

#### Tier 1

Voor het management verandert er niets zichtbaars aan de site. Wat het waard is: werk dat `djcylow.com`
niet raakt komt sneller op `main` terecht, terwijl de ene poort die er echt toe doet — een mens die naar de
frontend kijkt — onaangeroerd blijft.

**Score:** 1

### Pull Request

