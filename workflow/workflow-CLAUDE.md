# DJ Cylow website — werkwijze voor Claude

> **Blijf in sync met [`workflow-HUMAN.md`](workflow-HUMAN.md).** Dat bestand beschrijft
> **exact dezelfde workflow**, maar dan uitgelegd zodat Dave de stappen ook zelf handmatig kan
> uitvoeren zonder Claude. Elke wijziging aan de workflow hier moet daar ook doorgevoerd worden,
> en andersom.

`main` is de **productie-branch**, direct gedeployed naar Netlify via Netlify's auto-deploy.
Nooit direct op `main` committen.

---

## Nooit zonder expliciete toestemming van de gebruiker

- Mergen van een Pull Request naar `main` — altijd wachten op expliciete goedkeuring per merge.
  Een PR **openen** (inclusief het pushen van de feature branch die daarvoor nodig is) mag wel
  zelfstandig, zodra stap 3 is afgerond — dat ship niets naar productie, het maakt de wijziging
  alleen zichtbaar en beoordeelbaar op GitHub.
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

De enige toegestane **directe commits op `main`** zijn de twee uitzonderingen hieronder:
1. De **fold-commit** (na een merge, zie stap "Na de merge"): scope beperkt tot `CHANGELOG.md` +
   het verwijderde entry-bestand.
2. De **release-commit** (na een live-push, zie Release Workflow): scope beperkt tot
   `CHANGELOG.md`, `releases/development/<X.Y>/<X.Y.Z>.md`, `releases/highlights/<X.Y>/<X.Y.Z>.md`
   (alleen Minor/Major) en `releases/README.md`.

Alle overige wijzigingen gaan via een branch.

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
sessie een changelog entry-bestand:

```bash
.\scripts\release\new-changelog-entry.ps1 -Title "Korte sterke titel van de wijziging"
```

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

### 4. Push de branch en open een Pull Request

Zodra de branch klaar is (commits + het changelog entry-bestand):

```bash
git push origin [branch] -u
gh pr create --title "[branch-type]: korte titel" --fill --head [branch] --base main --repo DaveKJohn/djcylow-react
```

Deze repo heeft zowel een `origin`- als een `upstream`-remote die naar dezelfde GitHub-URL wijzen
— dat verwart `gh pr create`'s automatische branch-detectie ("you must first push the current
branch to a remote"). De expliciete `--head`/`--base`/`--repo` flags omzeilen dit betrouwbaar.

`gh pr create --fill` gebruikt de laatste commit-titel/-body als PR-titel/-omschrijving en pakt
automatisch `.github/pull_request_template.md` als body-template — loop de checklist daarin na
en vink af wat van toepassing is voordat je de PR aanmaakt (of vul 'm aan na het aanmaken).
Titel-prefix mirrort het branch-type: `feature:`, `fix:`, `data:`, `content:`, `style:`, `docs:`,
`config:`.

Dit mag zelfstandig, zonder aparte toestemming (zie "Nooit zonder expliciete toestemming"
hierboven) — een PR openen ship niets naar productie.

### 5. Vertel de gebruiker wat er is gedaan — stop daar

Rapporteer wat er veranderd is en deel de PR-link. Vraag niet naar mergen, releasen of pushen naar
`main` — dat initiatief ligt altijd bij de gebruiker.

### 6. Na goedkeuring: merge de Pull Request

Pas na expliciete goedkeuring van de gebruiker:

```bash
gh pr merge [branch] --merge --delete-branch
```

`--merge` maakt een merge-commit (geen squash/rebase — behoudt de losse commits, consistent met
de oude `--no-ff`-aanpak). `--delete-branch` ruimt de branch op, zowel remote als lokaal (als je
op een andere branch zit wisselt `gh` je eerst weg). Synchroniseer daarna lokaal:

```bash
git checkout main
git pull --ff-only
```

### 7. Na de merge: vouw de changelog entry

```bash
.\scripts\release\fold-changelog-entry.ps1 -Branch [branch]
```

Dit voegt de entry in bij `## [Unreleased]` in `CHANGELOG.md` en verwijdert het entry-bestand.
Laat je `-Branch` weg om in één keer alle aanwezige entry-bestanden te vouwen (handig als er
meerdere branches geparkeerd stonden). Dit gebeurt zonder aparte toestemming — het hoort bij het
afronden van de zojuist goedgekeurde merge, net als de branch-opruiming in stap 6.

Commit het resultaat direct op `main` — dit is een van de twee toegestane directe main-commits:

```bash
git add CHANGELOG.md [branch-naam-met-koppeltekens].md
git commit -m "docs: fold changelog entry [branch]"
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
3. **Run lint**: `npm run lint` — controleer of nieuwe fouten zijn geïntroduceerd (pre-existing
   errors zijn acceptabel als wij geen `.tsx`/`.ts`-bestanden wijzigden)
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
10. **Merge naar main** (na gebruikersbevestiging):
    ```bash
    git checkout main
    git merge [branch] --no-ff -m "Merge branch '[branch]' — v<versie>"
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

Netlify deployt automatisch na de push naar `main`. Er is geen staging-omgeving — dit is waarom
branch-protection belangrijk is, een kapotte build op `main` betekent dat de live site plat ligt.

### Versienummer bepalen

| Type wijziging | Versie |
|---|---|
| Bugfix, hotfix, kleine correctie | PATCH |
| Docs, workflow, CLAUDE.md, CHANGELOG-wijzigingen | PATCH |
| Nieuwe beschrijvingen, content updates | MINOR |
| Nieuwe mix, nieuwe pagina, nieuw component | MINOR |
| Volledig redesign of framework-migratie | MAJOR |

---

## Scripts (workflow-automatisering)

PowerShell-helpers in `scripts/release/` automatiseren de routinematige changelog-stappen
hierboven (dezelfde set, gedocumenteerd voor een mens in `workflow-HUMAN.md` → "Scripts"):

- `scripts/release/new-changelog-entry.ps1 [-Title <tekst>]` — scaffold het entry-bestand van de
  huidige branch in de repo-root, met bestandsnaam, datum en branch-type al ingevuld op basis van
  het branch-prefix. Draai op de branch tijdens stap 3; vul daarna de beschrijving aan.
- `scripts/release/fold-changelog-entry.ps1 [-Branch <naam>]` — vouw het entry-bestand van een
  gemergde branch in `CHANGELOG.md`'s `[Unreleased]`-blok en verwijder het entry-bestand. Draai op
  `main` na een PR-merge (stap 7). Zonder `-Branch` worden alle aanwezige entry-bestanden in één
  keer gevouwen.

Er is (nog) geen `cut-release.ps1`-script voor de Release Workflow hierboven — die stappen
gebeuren nog handmatig.

---

## Repo-hygiëne

- Alles gaat via een `feature/` / `fix/` / `data/` / `content/` / `style/` / `docs/` / `config/`
  branch + Pull Request, nooit direct op `main` — met de twee toegestane uitzonderingen hierboven.
- PR's mogen zelfstandig geopend worden (stap 4); de merge zelf wacht altijd op expliciete
  goedkeuring (stap 6). `.github/pull_request_template.md` wordt automatisch gebruikt door
  `gh pr create`.
- **Nooit "final" in een branchnaam.** Gebruik `-v2`, `-v3` etc. voor een tweede poging.
- Na een merge: de branch is al opgeruimd via `gh pr merge --delete-branch` (stap 6).
- Releases & versienummering: zie `releases/README.md` en de Release Workflow hierboven. Elke
  live-push verwerkt `CHANGELOG.md`'s `[Unreleased]`-blok, verhoogt een SemVer-versie, voegt een
  release note toe, en krijgt een annotated tag `vX.Y.Z`.
