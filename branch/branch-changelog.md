## `config/onderhoud-deno-engines-ci` changelog

### Branch title

deno.lock eruit, de Node-versie afgedwongen en CI annuleert verouderde runs

### Branch ID

20260815-170941

### Branch type

config

### What does the change on this branch bring to main?

Drie stukjes onderhoud aan de machinerie, elk te klein voor een eigen branch en samen wel de moeite.

**`deno.lock` stond in de tree zonder dat er iets is dat hem gebruikt.** Het is de lockfile van de
Netlify Edge Functions-bootstrap, achtergelaten door een `netlify dev`-run, terwijl deze repo geen
`netlify/edge-functions/` heeft. Dat hij stale was is niet aangenomen maar te lezen: hij noemde nog
`@tailwindcss/postcss`, dat er in augustus is uitgehaald. Untracked en in `.gitignore`.

**De Node-versie stond alleen in `.nvmrc`, en dat bestand leest `npm ci` op je eigen machine niet.**
Alleen `setup-node` in CI en Netlify kijken ernaar. Wie hier Node 20 of 24 draaide kreeg dus geen
enkele melding; de eerste rode vlag was een lockfile-conflict of een subtiel ander buildresultaat — en
`ci.yml` documenteert al een halve dag debugwerk aan precies zo'n divergentie, de `yaml`-peer die per
platform anders resolvet. Er staat nu een `engines`-regel in `package.json` met `engine-strict=true`
in `.npmrc`, zodat het een blokkade is en geen waarschuwing tussen honderd regels output. Getoetst in
beide richtingen: `npm ci` slaagt op 22.15.1 en faalt met `EBADENGINE` zodra de range niet wordt
gehaald. Bewust een **range** (`>=22.15.1 <23`) en geen exacte pin — die zou bij elke patch-upgrade op
twee plekken bijgewerkt moeten worden, wat juist de drift is die deze regel moet voorkomen.
Meegemeten: geen enkele dependency blokkeert op zijn eigen `engines`, wat het echte risico van die
vlag is.

**CI liet verouderde runs doorlopen en had geen tijdslimiet.** Bij een push bovenop een openstaande PR
bleef de vorige run draaien, en de required check kan dan kortstondig groen staan op een commit die
niet meer bovenaan ligt — precies het moment waarop iemand mergt. Een hangende `npm run build` liep
bovendien tot GitHub's default van zes uur. Nu `concurrency` met `cancel-in-progress` en
`timeout-minutes: 10`. De jobnaam `poort` is ongemoeid gelaten: dat is de required-check-context van
de ruleset, en hernoemen zou de poort stil uitzetten.

### Significance

#### Tier 0

Drie stille valkuilen weg: een lockfile die niets meer beschrijft, een versie-eis die alleen op twee
van de drie plekken gold, en een CI die een groene check op een achterhaalde commit kon tonen. Geen
ervan gaf ooit een foutmelding, en dat is precies wat ze duur maakt als ze toeslaan.

**Score:** 3

#### Tier 1

Ontwikkel- en CI-onderhoud; de site verandert niet en buiten de repo merkt niemand er iets van.

**Score:** N/A

### Pull Request

