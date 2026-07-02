# DJ Cylow website — werkwijze voor mensen (workflow-HUMAN)

Dit is de **mens-vriendelijke** versie van [`workflow-CLAUDE.md`](workflow-CLAUDE.md). Het volgt
**exact dezelfde workflow**, maar dan zo uitgelegd dat je de handelingen ook zelf kan uitvoeren
zonder Claude erbij te halen. Waar in de Claude-versie staat "Claude doet X", staat hier "jij doet X".

`main` is de productie-branch — wat daar staat, staat automatisch live op djcylow.com via Netlify.
Werk daarom nooit direct op `main`.

---

## De basisregel

Elke wijziging — hoe klein ook — gaat via een branch. Nooit direct op `main` committen, met twee
uitzonderingen die verderop aan bod komen (het "vouwen" van een changelog-entry na een merge, en
de release-commit na een live-push).

---

## Stap 1 — Check waar je zit

Voor je iets aanpast:

```bash
git status
git branch
```

- Sta je op `main`? Maak dan eerst een branch.
- Sta je al op een branch? Ga daar gewoon verder.

## Stap 2 — Bedenk een branchnaam

| Type werk | Branchnaam |
|---|---|
| Nieuwe feature of pagina | `feature/korte-omschrijving` |
| Bugfix | `fix/korte-omschrijving` |
| Mix data (JSON) | `data/kleur-of-omschrijving` |
| Tekst/content | `content/korte-omschrijving` |
| Styling/CSS | `style/korte-omschrijving` |
| Docs/README | `docs/korte-omschrijving` |
| Config, scripts, workflow-tooling | `config/korte-omschrijving` |

Nooit "final" in de naam — gebruik `-v2`, `-v3` als je het opnieuw moet doen.

```bash
git checkout -b feature/mix-bpm-filter
```

## Stap 3 — Werk op de branch, houd bij wat je deed

Maak je wijzigingen, commit zoals je gewend bent. Maak daarnaast één keer per branch een
changelog-entry aan — dit is het bestandje dat straks in `CHANGELOG.md` terechtkomt.

Makkelijkste manier — laat het script het scaffolden:

```powershell
.\scripts\release\new-changelog-entry.ps1 -Title "Korte sterke titel van de wijziging"
```

Dit zet een bestand `feature-mix-bpm-filter.md` (jouw branchnaam met `/` vervangen door `-`) in
de root van de repo, met branch-naam, datum en type al ingevuld. Open het bestand en vul de
beschrijving aan:

```markdown
### Korte sterke titel van de wijziging
**Branch naam** feature/mix-bpm-filter
**Datum merge op main** 2026-07-02
**Branch type** Feature

Korte beschrijving van wat er veranderd is op deze branch.
```

**Waarom niet gewoon in `CHANGELOG.md` zelf schrijven, zoals vroeger?** Als twee branches
tegelijk open staan en allebei hetzelfde stuk van `CHANGELOG.md` bewerken, krijg je bij het
mergen een merge-conflict. Met een eigen bestandje per branch kan dat niet meer gebeuren — jouw
bestand botst met niemand anders.

Vergeet dit bestandje niet — zonder entry-bestand mag een branch niet gemerged worden, ook niet
bij kleine of puur documentatie-wijzigingen.

## Stap 4 — Push de branch en open een Pull Request

```bash
git push origin feature/mix-bpm-filter -u
gh pr create --title "feature: korte titel" --fill
```

`--fill` gebruikt je laatste commit als titel/omschrijving, en `gh` pakt automatisch
`.github/pull_request_template.md` als checklist — loop 'm na voor je de PR aanmaakt (of vul 'm
aan erna). Titel-prefix volgt je branch-type: `feature:`, `fix:`, `data:`, `content:`, `style:`,
`docs:`, `config:`.

Een PR openen mag altijd zelf — dat verandert niets aan de live site, het maakt je wijziging
alleen zichtbaar en beoordeelbaar op GitHub.

## Stap 5 — Mergen (na review/goedkeuring) en opruimen

Als de PR goed is:

```bash
gh pr merge feature/mix-bpm-filter --merge --delete-branch
```

`--merge` maakt een merge-commit (geen squash) en `--delete-branch` ruimt de branch meteen op,
zowel remote als lokaal. Synchroniseer daarna je lokale `main`:

```bash
git checkout main
git pull --ff-only
```

## Stap 6 — Vouw je changelog-entry in

```powershell
.\scripts\release\fold-changelog-entry.ps1 -Branch feature/mix-bpm-filter
```

Dit plakt de inhoud van je entry-bestand onder `## [Unreleased]` in `CHANGELOG.md`, en verwijdert
het entry-bestandje zelf. Commit dat resultaat direct op `main`:

```bash
git add CHANGELOG.md feature-mix-bpm-filter.md
git commit -m "docs: fold changelog entry feature/mix-bpm-filter"
```

(Stonden er meerdere entry-bestanden klaar, van meerdere branches? Laat `-Branch` dan gewoon weg
— dan vouwt het script ze allemaal in één keer.)

`main` verzamelt zo een `[Unreleased]`-blok van alles wat gemerged is maar nog niet live staat.
Dat mag rustig dagen of weken opstapelen tot de volgende release.

**Let op:** dit commit je lokaal op `main`. Pushen naar `origin/main` doe je pas als je zelf
besluit dat het moment daar is (zie hieronder) — niet automatisch na elke merge.

---

## Een release maken en live pushen

Dit initiatief ligt altijd bij jou. Zeg tegen Claude "commit en push live" of "maak een nieuwe
release en push live", of doorloop de stappen zelf — ze staan volledig uitgeschreven in
[`workflow-CLAUDE.md`](workflow-CLAUDE.md) → "Release Workflow". Kort samengevat:

1. Bepaal het versienummer (PATCH/MINOR/MAJOR — zie `releases/README.md`).
2. Maak de release-note aan in `releases/development/<major.minor>/<versie>.md` op basis van
   `[Unreleased]` in `CHANGELOG.md`.
3. Bij Minor/Major: maak ook een leesbare `releases/highlights/<major.minor>/<versie>.md` aan
   (zonder jargon, zonder branch-metadata).
4. Werk `CHANGELOG.md` en `releases/README.md` bij.
5. Merge, tag, en push naar `origin` — pas hier gaat het écht live.
6. Maak een GitHub Release aan met `gh release create`.

Netlify deployt automatisch zodra `main` op GitHub verandert.

---

## Scripts — wat kun je zelf automatiseren

| Commando | Wat het doet |
|---|---|
| `scripts/release/new-changelog-entry.ps1 -Title "..."` | Maakt het entry-bestand van je huidige branch aan (stap 3) |
| `scripts/release/fold-changelog-entry.ps1 [-Branch naam]` | Vouwt een (of alle) entry-bestand(en) in `CHANGELOG.md` (stap 6) |

Beide scripts zijn PowerShell — draai ze vanuit de repo-root.

---

## Veiligheidsregels — altijd eerst overleggen

Nooit zonder overleg:
- Een Pull Request mergen naar `main` (een PR *openen* mag wel altijd zelf, stap 4)
- Pushen naar `origin/main` specifiek
- Een release/live-push starten
- `git push --force`, `git reset --hard`, `git rebase` op een gedeelde branch
- Bestanden verwijderen uit `public/images/`
- `next.config.ts` of `netlify.toml` aanpassen
