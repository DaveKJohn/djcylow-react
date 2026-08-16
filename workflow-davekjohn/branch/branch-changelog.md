## `docs/contributing-twee-lagen` changelog

### Branch title

CONTRIBUTING.md splitst in twee lagen, net als de bron

### Branch ID

20260816-151558

### Branch type

docs

### What does the change on this branch bring to main?

`CONTRIBUTING.md` stond volledig in de repo-root: 29 KB die tegelijk het pad was waar GitHub een
willekeurige bezoeker heen stuurt én de lokale helft van de plugin-cyclus. Die twee onderwerpen zijn
nu uit elkaar getrokken, zoals de bron het op 14 augustus deed (`627f030`).

- **De root-pagina is de standaardwerkwijze** en past op één scherm: nooit direct op `main`, CI
  (`poort`) groen vóór de merge, één wijziging per branch, plus de waarschuwing dat een merge hier
  een deploy is. Die pagina blijft kloppen op de dag dat de plugin er niet is.
- **`workflow-davekjohn/CONTRIBUTING.md` is de pluginlaag** — de bestaande pagina, ongewijzigd
  verhuisd met `git mv` — en die **wint waar de twee elkaar tegenspreken**.

De reden die de afwijking tot nu toe droeg was *"GitHub zoekt hem in de root"*. Dat argument was juist
en pleitte bij nader inzien juist vóór de splitsing: de bron houdt óók een root-pagina, alleen een
dunne die klopt zonder plugin. Deze repo was de enige van de drie zonder de splitsing — life-hub heeft
de pluginlaag wel maar mist juist de root-pagina.

**Bijvangst: zestien dode links, vijftien daarvan van gisteren.** De mapverhuizing naar
`workflow-davekjohn/` (PR #145) heeft verwijzingen achtergelaten die nergens meer op uitkwamen, en
niets meldde dat:

| waar | wat er stuk was |
|---|---|
| `workflow-davekjohn/releases/README.md` | 14 links naar `development/2.x/*.md`, terwijl die boom in de repo-root staat |
| `workflow-davekjohn/branch/README.md` | verwees naar `../CONTRIBUTING.md` — een bestand dat sinds gisteren niet bestond, en dat door deze branch vanzelf weer heel is |
| `CHANGELOG.md` | de intro wees naar `releases/README.md` in plaats van naar de verhuisde pagina |
| `README.md` | de projectboom noemde nog een root-`branch/` die niet meer bestaat |

Er staat nu een link- en anker-checker achter, gedraaid over alle 106 markdown-bestanden in de repo:
geen dood pad, geen dood anker. Die 14 `development/`-links zijn precies de splitsing die
`Get-RelativeLinkPath` in de plugin beschrijft — de bestaande rijen waren er alleen niet in meegegaan.

### Significance

#### Tier 0

Een bijdrager die de repo binnenkomt leest niet langer 29 KB plugin-mechaniek op het pad waar GitHub
hem heen stuurt, en de zestien dode links die de vorige verhuizing achterliet zijn weg. Het meeste
gewicht zit in die tweede helft: dode links in de governance-documentatie kosten pas iets op het
moment dat iemand ze volgt, en dan is het vertrouwen in de rest van de pagina ook weg.

**Score:** 3

#### Tier 1

N/A — dit raakt niets aan `djcylow.com`. De build levert dezelfde pagina's; het is documentatie over
hoe er in deze repo gewerkt wordt.

**Score:** N/A

### Pull Request

