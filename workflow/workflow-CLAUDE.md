# DJ Cylow website — werkwijze voor Claude

`main` is de **integratie-branch**, niet de live site. Een merge naar `main` zet niets live: het
`[Unreleased]`-blok in `CHANGELOG.md` verzamelt wat wél gemergd maar nog niet uitgebracht is, en
pas de expliciete **live-push** (zie Release Workflow) brengt dat naar de site. De `← LIVE`-markering
in `CHANGELOG.md` wijst altijd de versie aan die op dit moment daadwerkelijk draait.

Nooit direct op `main` committen — met de twee uitzonderingen hieronder.

---

## Nooit zonder expliciete toestemming van de gebruiker

- Een Pull Request **openen** — nooit uit jezelf. Werk de branch af, push hem, meld dat hij klaar
  is, en wacht. Zegt Dave "open de PR", dan geldt dat als goedkeuring voor de hele beweging:
  openen → mergen → de changelog-entry folden. Vraag ook niet ernaar ("zal ik de PR openen?") —
  rapporteer de stand en stop daar.
- Mergen van een Pull Request naar `main` — valt onder diezelfde goedkeuring; los daarvan nooit.
- Pushen naar `origin/main` specifiek — dit initiatief ligt altijd bij de gebruiker. **Vraag hier
  nooit naar, ook niet impliciet** ("zeg het maar als je wil pushen") — rapporteer feitelijk de
  git-status en stop daar.
- Een release cutten / live pushen — start alleen op expliciet verzoek ("commit en push live",
  "maak een nieuwe release en push live" of gelijkwaardig).
- `git push --force` (welke branch dan ook)
- `git reset --hard`
- `git rebase` op een gedeelde branch
- Bestanden verwijderen uit `public/images/` (afbeeldingen worden via pad gerefereerd in JSON)
- `next.config.ts` aanpassen (static export config — breekt de Netlify build bij een fout)
- `netlify.toml` aanpassen

Er zijn twee vaste uitzonderingen op "alles via een branch + Pull Request":
1. De **fold-commit** (na een merge, zie stap "Na de merge") is de enige echte **directe commit op
   `main`** (geen branch): scope beperkt tot `CHANGELOG.md` + het verwijderde entry-bestand.
2. De **release-branch** (zie Release Workflow) is wél een branch (`docs/release-v<versie>`) met
   scope beperkt tot `CHANGELOG.md`, `releases/development/<X.Y>/<X.Y.Z>.md`,
   `releases/highlights/<X.Y>/<X.Y.Z>.md` (alleen Minor/Major) en `releases/README.md` — maar wordt
   bewust gemerged via een kale `git merge --no-ff` (Release Workflow stap 10), niet via
   `gh pr merge`/een Pull Request. Dit blijft wel altijd wachten op expliciete goedkeuring van de
   gebruiker, net als een gewone PR-merge.

Alle overige wijzigingen gaan via een branch + Pull Request.

---

## Ontwikkelworkflow

### 1. Check de branch — voor je ook maar één bestand aanraakt

**Voor je code schrijft, een bestand aanmaakt, of iets wijzigt:** run `git status` en `git branch`
om de huidige branch te controleren. Dit is niet-onderhandelbaar — zelfs een script of
configbestand wordt niet geschreven vóór deze stap.

```bash
git status
git branch
```

- **Op `main`** → maak eerst de juiste branch aan, dan pas wijzigingen.
- **Op een feature branch** → ga door op die branch.

### 2. Classificeer de wijziging en noem de branch

| Type werk | Branch naam |
|---|---|
| Nieuwe feature of pagina | `feature/[korte-omschrijving]` |
| Bugfix | `fix/[korte-omschrijving]` |
| Mix data (JSON) | `data/[kleur-of-omschrijving]` |
| Tekst/content updates | `content/[korte-omschrijving]` |
| Styling/CSS | `style/[korte-omschrijving]` |
| Docs/README | `docs/[korte-omschrijving]` |
| Config-wijzigingen, scripts, workflow-tooling | `config/[korte-omschrijving]` |

**Voorbeelden:** `data/light-red-descriptions`, `feature/mix-bpm-filter`, `fix/audio-player-volume`

**Nooit "final" in een branchnaam.** Als een tweede poging nodig is, gebruik dan `-v2`, `-v3` etc.

```bash
git checkout -b [branch-naam]
```

### 3. Ontwikkel op de branch, houd een changelog entry-bestand bij

Maak wijzigingen op de branch en commit met een duidelijke boodschap. Scaffold in dezelfde
sessie een changelog entry-bestand — dat gaat via de gedeelde `new-branch`-skill uit de
specialists-plugin, die de branch én zijn entry-bestand in één stap neerzet (een branch is nooit
entry-loos). Doe je het met de hand, dan volstaat een bestand in het formaat hieronder.

Dit maakt `<branch-naam-met-koppeltekens>.md` aan in de repo-root (bijv. branch
`feature/mix-bpm-filter` → `feature-mix-bpm-filter.md`), met branch-naam, datum en branch-type
al ingevuld — vul zelf de titel (als je die nog niet meegaf) en de beschrijving aan. Formaat:

```markdown
### Korte sterke titel van de wijziging
**Branch naam** branch-naam
**Datum merge op main** YYYY-MM-DD
**Branch type** Docs/Feature/Fix/Data/Content/Style/Config

Korte beschrijving van wat er veranderd is op deze branch.
```

**`CHANGELOG.md` blijft met rust op de branch — nooit direct bewerken.** Elke branch bewerkte
vroeger hetzelfde `[Unreleased]`-blok in `CHANGELOG.md`, wat bij lang-openstaande branches tot
merge-conflicten leidde. Het per-branch entry-bestand lost dat op: elke branch heeft zijn eigen
bestand, dus er is niets om over te conflicteren.

**Nooit mergen zonder een entry-bestand.** Dit geldt ook voor kleine of puur documentatiewijzigingen.

### 4. Push de branch — de PR pas op verzoek

Zodra de branch klaar is (commits + het changelog entry-bestand): push hem en meld dat hij klaar
staat. **Open de PR niet uit jezelf** (zie "Nooit zonder expliciete toestemming" hierboven).

Zegt Dave "open de PR", gebruik dan de gedeelde `open-pr`-skill uit de specialists-plugin. Die
draait eerst de lint-poort uit `Get-LintScript` (`scripts/lint/lint-web.ps1`) en opent daarna de PR
met `.github/pull_request_template.md` als body — loop de checklist na en vink af wat van
toepassing is. Titel-prefix mirrort het branch-type: `feature:`, `fix:`, `data:`, `content:`,
`style:`, `docs:`, `config:`.

**Gebruik nooit `gh pr create --fill`** voor deze repo: `--fill` vult de body met de volledige
commit-geschiedenis sinds `main` (elke commit-titel als bullet, ontdekt bij PR #1/#2 — dat waren
tientallen irrelevante historische commits, niet de template). Gebruik `--body` met de
template-inhoud.

Draai je het handmatig i.p.v. via de skill, geef dan altijd `--repo DaveKJohn/djcylow-react` mee
— deze repo heeft zowel een `origin`- als een `upstream`-remote die naar dezelfde GitHub-URL
wijzen, wat `gh pr create`'s automatische branch-detectie in de war stuurt ("you must first push
the current branch to a remote").

### 5. Vertel de gebruiker wat er is gedaan — stop daar

Rapporteer wat er veranderd is en deel de PR-link. Vraag niet naar mergen, releasen of pushen naar
`main` — dat initiatief ligt altijd bij de gebruiker.

### 6. Na goedkeuring: merge de Pull Request

Pas na expliciete goedkeuring van de gebruiker. Wissel eerst naar `main` — `gh pr merge` kan de
huidige branch niet lokaal verwijderen als je er nog op staat (git staat dat niet toe), dus
`--delete-branch` ruimt dan alleen de remote op en laat een lokale rest-branch achter:

```bash
git checkout main
gh pr merge [branch] --merge --delete-branch --subject "merge: [branch] (#<PR-nummer>)"
```

`--merge` maakt een merge-commit (geen squash/rebase — behoudt de losse commits, consistent met
de oude `--no-ff`-aanpak). `--subject` geeft de merge-commit de `merge:` prefix, consistent met de
`feature:`/`fix:`/`docs:`/etc.-prefixes van de rest van de geschiedenis — zonder deze override
gebruikt GitHub het generieke "Merge pull request #N from ...". Vul `<PR-nummer>` in met het
nummer uit de PR-link van stap 4.

`--delete-branch` ruimt de branch op, zowel remote als lokaal. Stond je
toch nog op de branch toen je dit draaide, controleer dan of de lokale branch écht weg is en ruim
'm zo nodig alsnog op: `git branch -d [branch]`.

Synchroniseer daarna lokaal:

```bash
git checkout main
git pull --ff-only
```

### 7. Na de merge: vouw de changelog entry

Verplaats de inhoud van het entry-bestand naar bovenaan het `## [Unreleased]`-blok in
`CHANGELOG.md` (nieuwste entry eerst) en verwijder daarna het entry-bestand. Dit gebeurt zonder
aparte toestemming — het hoort bij het afronden van de zojuist goedgekeurde merge, net als de
branch-opruiming in stap 6.

> **Let op — de gedeelde `fold-changelog`-skill werkt hier nog niet.** Dat script zoekt een
> `## Pull Requests`-kop; deze repo gebruikt het Keep-a-Changelog-formaat met `## [Unreleased]`,
> en de kop staat in het script hardcoded (er is geen `Get-ChangelogHeading` in het contract van
> `scripts/repo-config.ps1`). Tot dat in de bron-repo is opgelost gaat het vouwen hier met de hand.
> Dit hoort als `inbound`-issue naar de workshop-repo, niet als lokale workaround.

Commit het resultaat direct op `main` — dit is een van de twee toegestane directe main-commits:

```bash
git add CHANGELOG.md [branch-naam-met-koppeltekens].md
git commit -m "chore: fold changelog entry [branch]"
```

`main` houdt zo een groeiend `[Unreleased]`-blok bij van alles wat gemergd maar nog niet live is.
Meerdere branches mogen hier dagen of weken opstapelen voor de volgende live-push.

**Pushen van deze fold-commit naar `origin` gebeurt niet automatisch** — dat blijft, net als elke
push naar `origin/main`, initiatief van de gebruiker.

---

## Voor het schrijven van JSON-databestanden

- Controleer dat het resultaat geldige JSON is (parseable, geen trailing commas)
- Houd de array gesorteerd **nieuwste eerst** (hoogste `id`-datum bovenaan)
- Wijzig nooit entries met `"ignore": true` (preview-entries)
- Overschrijf nooit een niet-lege `description` tenzij gevraagd

## Voor het committen

- Run `npm run lint` om TypeScript/ESLint-fouten te vangen
- Controleer dat afbeeldingspaden uit JSON daadwerkelijk bestaan in `public/images/`

---

## Release Workflow

Wanneer de gebruiker zegt "commit en push live" of "maak een nieuwe release en push live":

### Stap voor stap

1. **Check de status**: `git status && git branch`
2. **Maak een branch** (nooit direct op `main` committen):
   ```bash
   git checkout -b docs/release-v<versie>
   ```
3. **Run de poort én de build**:
   - `powershell -NoProfile -File scripts\lint\lint-web.ps1` — de TypeScript-poort, moet groen zijn.
   - `npm run lint` — ESLint. Deze meldt op dit moment 37 **pre-existing** errors in de bestaande
     codebase; die zijn acceptabel zolang jij geen `.ts`/`.tsx` hebt aangeraakt. Wat niet acceptabel
     is: een fout erbij. Vergelijk dus het aantal, niet alleen de exitcode.
   - `npm run build` — **niet overslaan.** Dit is de enige controle vóór de live-push, en een
     kapotte build legt de site plat (er is geen staging).
4. **Bepaal versienummer** (zie `releases/README.md`):
   - PATCH (`x.y.Z+1`): bugfix, hotfix, kleine correctie
   - MINOR (`x.Y+1.0`): nieuwe content, feature, backwards-compatible
   - MAJOR: ingrijpende verbouwing (zelden)
5. **Maak de development-release note** aan (altijd, elke Patch/Minor/Major):
   `releases/development/<major.minor>/<versie>.md` — gebruik de `[Unreleased]`-sectie uit
   `CHANGELOG.md` als inhoud, inclusief het metadata-blok (`**Branch naam**`,
   `**Datum merge op main**`, `**Branch type**`) onder elke heading
6. **Maak de highlights-versie** aan (alleen bij Minor of Major):
   `releases/highlights/<major.minor>/<versie>.md` — dezelfde wijzigingen, herschreven in
   leesbaar Nederlands zonder jargon en zonder branch-metadata (geen branch-namen, merge-datums
   of branch-types), bedoeld voor stakeholders/collega's in plaats van developers
7. **Update `CHANGELOG.md`**: hernoem `[Unreleased]` naar
   `[v<versie>] - <datum> — Patch/Minor/Major`, vervang alle branch-details door één
   `Zie [releases/development/...]`-regel (de details staan al in de release note), voeg
   `← LIVE` toe aan de nieuwe versie, verwijder `← LIVE` bij de vorige versie, en maak een vers
   leeg `## [Unreleased]` bovenaan aan
8. **Voeg versie toe** aan overzichtstabel in `releases/README.md` (bovenaan), linkend naar de
   development-versie
9. **Stage en commit** op de feature branch
10. **Merge naar main** (na gebruikersbevestiging) — bewust via een kale `git merge`, niet via
    `gh pr merge`: dit is de enige branch die niet via een Pull Request gaat (zie "Nooit zonder
    expliciete toestemming" hierboven):
    ```bash
    git checkout main
    git merge [branch] --no-ff -m "merge: [branch] — v<versie>"
    ```
11. **Tag en push**:
    ```bash
    git tag -a v<versie> -m "v<versie> - <korte titel>"
    git push origin main
    git push origin v<versie>
    ```
12. **GitHub Release aanmaken** (development-versie is altijd de release-body):
    ```bash
    gh release create v<versie> \
      --title "v<versie> - <korte titel>" \
      --notes-file releases/development/<major.minor>/<versie>.md \
      --verify-tag
    ```
13. **Highlights als bijlage uploaden** (alleen bij Minor/Major):
    ```bash
    gh release upload v<versie> releases/highlights/<major.minor>/<versie>.md
    ```
14. **Verwijder de feature branch** (lokaal + remote):
    ```bash
    git branch -d [branch]
    git push origin --delete [branch]
    ```

Deze push naar `origin/main` is het moment waarop de wijzigingen daadwerkelijk live gaan. Er is
geen staging-omgeving — een kapotte build betekent dat de live site plat ligt. Sla `npm run build`
uit stap 3 dus nooit over, en verschuif de `← LIVE`-markering in `CHANGELOG.md` pas als de deploy
geslaagd is.

### Versienummer bepalen

| Type wijziging | Versie |
|---|---|
| Bugfix, hotfix, kleine correctie | PATCH |
| Docs, workflow, CLAUDE.md, CHANGELOG-wijzigingen | PATCH |
| Kleine stijl-/CSS-correctie | PATCH |
| Nieuwe beschrijvingen, content updates | MINOR |
| Nieuwe mix, nieuwe pagina, nieuw component | MINOR |
| Grote stijl-/CSS-herziening (bijv. een hele sectie herontworpen) | MINOR |
| Volledig redesign of framework-migratie | MAJOR |

---

## Scripts (workflow-automatisering)

De lokale kopieën in `scripts/release/` zijn weg: die stappen draaien nu via de **gedeelde skills
van de specialists-plugin**, die één bron hebben in de workshop-repo. Wat per repo verschilt woont
in `scripts/repo-config.ps1` en `scripts/lib/branch-info.ps1`.

- **`new-branch`** — maakt de branch én zijn changelog-entry-bestand in één stap (stap 1–3).
- **`open-pr`** — draait de lint-poort en opent de PR (stap 4). Alleen op verzoek van Dave.
- **`fold-changelog`** — vouwt het entry-bestand in `CHANGELOG.md` (stap 7). **Werkt hier nog
  niet**, zie de waarschuwing bij stap 7.
- **`sync-roster`** — zet ontbrekende repo-lenzen neer als het roster achterloopt op de plugin.

Repo-eigen scripts:

- **`scripts/lint/lint-web.ps1`** — de lint-poort die `open-pr` draait: `tsc --noEmit` over
  `tsconfig.lint.json`. ESLint zit er bewust nog niet in; de reden staat in de header van het script.
- **`scripts/sync/check-script-contract.ps1`** (uit de plugin) — bewaakt dat `repo-config.ps1` en
  `branch-info.ps1` de functies leveren die de gedeelde scripts verwachten.
- `scripts/add-mix.js` (`npm run mix:add`) en `scripts/convert-to-webp.js` (`npm run images:webp`).

Er is (nog) geen `cut-release.ps1`-script voor de Release Workflow hierboven — die stappen
gebeuren nog handmatig.

---

## Repo-hygiëne

- Alles gaat via een `feature/` / `fix/` / `data/` / `content/` / `style/` / `docs/` / `config/`
  branch + Pull Request, nooit direct op `main` — met de twee uitzonderingen hierboven (de
  fold-commit, en de release-branch die bewust zonder PR mergt).
- PR's worden **nooit zelfstandig geopend** (stap 4). Dave geeft het startsein; dat sein dekt dan
  meteen openen, mergen en folden. `.github/pull_request_template.md` levert de body.
- **Nooit "final" in een branchnaam.** Gebruik `-v2`, `-v3` etc. voor een tweede poging.
- Na een merge: de branch is al opgeruimd via `gh pr merge --delete-branch` (stap 6).
- Releases & versienummering: zie `releases/README.md` en de Release Workflow hierboven. Elke
  live-push verwerkt `CHANGELOG.md`'s `[Unreleased]`-blok, verhoogt een SemVer-versie, voegt een
  release note toe, en krijgt een annotated tag `vX.Y.Z`.
