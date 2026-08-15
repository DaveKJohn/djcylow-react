## `config/permissions-die-meereizen` progress

### Steps

- [x] De 89 `allow`-regels doorlopen en vaststellen welke echt gevaarlijk zijn
- [x] Vaststellen dat `settings.local.json` gitignored is — dus dat repareren daar niets oplost
- [x] `deny`/`ask` in `.claude/settings.json` uitbreiden met de handelingen zelf
- [x] Vaststellen dat `ask` van `allow` wint (waargenomen bij `netlify.toml`, niet aangenomen)
- [x] De grens eerlijk opschrijven: `node *` omzeilt alles, en een kale `git push` is niet te matchen
- [~] Het lokale bestand opschonen — bewust niet gedaan, zie de entry: het verandert het gedrag niet
      en vergroot de kans op een prompt midden in een sessie
- [x] Poort en testsuite

### Where I left off

Poort groen (0/0, 89 pagina's), 207 tests groen.

Wat open blijft en niet met permissies op te lossen is: `Bash(node *)` maakt elke regel omzeilbaar.
Wie dat écht dicht wil, moet die regel uit het lokale bestand halen — en dan is de vraag hoe een
specialist nog moet meten, want een groot deel van het meetwerk in deze repo loopt via `node -e`.
Dat is een afweging, geen reparatie.
