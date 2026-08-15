## `config/webp-veiligheid-en-ignore` changelog

### Branch title

images:webp verwijdert niets meer ongevraagd en faalt eerlijk

### Branch ID

20260815-142550

### Branch type

config

### What does the change on this branch bring to main?

Drie safety-rules stonden in `CLAUDE.md` en nergens in de machinerie. Die staan er nu wel.

**`npm run images:webp` verwijderde bestanden zonder iets te vragen.** Het liep recursief door
`public/images/`, converteerde, en `unlink`te het origineel — terwijl "bestanden verwijderen uit
`public/images/`" hierboven expliciet onder *Nooit zonder expliciete toestemming van Dave* staat,
juist omdat een pad in de mix-JSON er stil door breekt. Erger nog: via de `npm run *`-prefixregel op
de allowlist kon dat draaien **zonder permissieprompt**. Preview is nu de default; verwijderen
vraagt `--apply`. Alle vier de gedragingen zijn getoetst op een wegwerpbestand in plaats van
aangenomen:

| | resultaat |
|---|---|
| `npm run images:webp` | toont de lijst, `.jpg` staat er daarna nog |
| `npm run images:webp:apply` | converteert, origineel weg |
| tweede run met bestaande `.webp` | overgeslagen in plaats van overschreven |
| kapot bestand | `1 mislukt`, **exit 1** |

Die laatste was de ernstigste: het script zette nooit `process.exitCode`, dus het gaf **exit 0
terwijl elke conversie faalde**. Een bestaande `.webp` werd bovendien stil overschreven waarna het
origineel verdween — twee bestanden kwijt bij één naamconflict; `--force` doet dat nu alleen op
verzoek. En `main()` had geen `.catch()`.

**De vier beschermde bestanden hebben nu enforcement** (#62). `.claude/settings.json` draagt een
`ask`-lijst voor `next.config.ts`, `netlify.toml` en `public/images/**`. Bewust `ask` en geen
`deny`: `CLAUDE.md` vraagt om Dave's woord, niet om onbereikbaarheid. De denylist heeft er daarnaast
de refspec-vorm `git push origin +HEAD:main` bij gekregen, die langs de bestaande
`git push --force`-regels glipte.

> **Het issue nam aan dat dit niet zelf kon** — *"schrijfacties op settings-bestanden worden
> geblokkeerd, de route is `/permissions` of met de hand"*. Dat bleek niet zo: de wijziging is
> gewoon geschreven. De aanname is dus weerlegd en niet omzeild.

**`.claude/settings.local.json` staat nu in `.gitignore`** (#64). Het bleef hier alleen ongetrackt
door een **machine-globale** ignore (`~/.config/git/ignore`), niet door de repo zelf. In een verse
clone, op een andere machine of bij een collaborator staat het gewoon in `git status` — één
`git add -A` verwijderd van meecommitten, en `git add -A` is precies wat `cut-release.ps1` doet. Dan
landt een persoonlijke allowlist met lokale paden en een e-mailadres in een publieke repo.

**Wat hier bewust níet is gedaan: het snoeien van die allowlist zelf (#63).** Dat bestand is
machine-lokaal en staat vanaf nu in `.gitignore`, dus zo'n wijziging verschijnt in géén enkele diff
— en hij verandert wel wat er dagelijks zonder prompt mag draaien. Dat hoort niet ongezien te
gebeuren. Het voorstel staat in issue #63 en blijft open, inclusief de waarschuwing die daar staat:
de uitvoerregel voor de plugin-cache geeft `cut-release` vrije doorgang naar `origin/main`, dus die
mag alleen samen met het dichtzetten van de push-regels.

Sluit #61, #62 en #64.

### Significance

#### Tier 0

Drie regels die alleen bestonden zolang iedereen `CLAUDE.md` gelezen had en zich eraan hield, zijn
nu mechanisme. Het opruimscript kan niet meer stil bestanden verwijderen of een mislukking als
succes rapporteren, en een persoonlijke allowlist kan niet meer per ongeluk in de publieke repo
belanden.

**Score:** 4

#### Tier 1

N/A — dit raakt de gereedschapskist en de guardrails, niet djcylow.com. De build levert dezelfde
pagina's.

**Score:** N/A

### Pull Request

