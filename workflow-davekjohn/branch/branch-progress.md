## `docs/pushen-vrij-en-een-merge-uitzondering` progress

### Steps

#### PLAN

- [x] De twee regels opgezocht in hun bron in plaats van uit het hoofd: `CLAUDE.md` regel 60, de `park`- en `fold-changelog`-skills, en de gedragscorrectie van 2026-07-02 in het geheugen
- [x] Gemeten waar ze overal herhaald staan: 21 plekken over 8 bestanden
- [x] Vastgesteld wat Dave's uitspraak wél en niet raakt — de merge-regel wel, de lijst *Nooit zonder toestemming* niet

#### CREATE

- [x] `CLAUDE.md`: de push-bullet geschrapt, de twee merge-uitzonderingen teruggebracht tot één, de herweging van de grens afgerond, de fold-uitzondering op `-Push`
- [x] `CLAUDE.md`: de samenvatting "drie regels zijn óók grondwet" naar twee, en de approval-bullet uit elkaar getrokken (vooraf wegen ≠ achteraf mergen)
- [x] `.claude/settings.json`: de vier `git push origin main|HEAD`-regels van de `ask`-lijst; deny-lijst onaangeroerd
- [x] `CONTRIBUTING.md`: stap 4 (de derde tabelrij weg, kop hernoemd), stap 5 (niet meer "vraag niet naar pushen"), stap 7 (`-Push`)
- [x] `.claude/specialists/lenses/01-01-extension.md`: de gatekeeper-tabel en de verantwoording van de grens
- [x] De drie repo-eigen skills en `.github/pull_request_template.md`
- [x] Het geheugen omgekeerd in plaats van verwijderd — de oude reflex is hardnekkig, dus het bestand legt nu uit wat er verviel en waarom
- [~] `.claude/handover.md` bijwerken — bewust niet: dat is een lock-notitie van 2026-08-15 die bij de volgende `/lock` wordt overschreven, geen governance-document

#### TEST

- [x] Sweep op tegenstrijdige formuleringen: alleen historische noten (*"stond hier tot 2026-08-16"*) blijven over
- [x] Het anker `#4-push-de-branch-en-open-de-pr--behalve-bij-site-werk` meegenomen toen die kop hernoemd werd — anders was de link uit regel 59 stil kapot
- [x] `scripts/lint/lint-web.ps1`: 0 fouten, 89 statische pagina's
- [x] `npm test`: 16 suites, 213 tests groen

### Where I left off

Af. De fold van deze branch is meteen de eerste die met `-Push` draait.

