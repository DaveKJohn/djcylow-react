# CLAUDE.md — DJ Cylow Website

Project instructions for Claude Code. Read this before every task.

## Git Workflow — Branch Protection

`main` is the **production branch**, directly deployed to Netlify. Never commit to it directly.

### At the start of every task

**Before touching any file:** check the branch and create one if on `main`. Never write, create, or modify files before this step — not even a script or a config file.

1. Run `git status` and `git branch` to check the current state.
2. If on `main`: run `git checkout -b [branch-name]` first, then make changes.
3. If already on a feature branch: continue on that branch.

### Branch naming

| Type of work | Branch name |
|---|---|
| New feature or page | `feature/[short-description]` |
| Bug fix | `fix/[short-description]` |
| Mix data (JSON) | `data/[color-or-description]` |
| Text/content updates | `content/[short-description]` |
| Styling/CSS | `style/[short-description]` |
| Docs/README | `docs/[short-description]` |
| Config changes | `config/[short-description]` |

**Examples:** `data/light-red-descriptions`, `feature/mix-bpm-filter`, `fix/audio-player-volume`

### Creating a branch

```bash
git checkout -b [branch-name]
```

### After completing a task

- Commit changes on the feature branch with a clear message.
- **Update `[Unreleased]` in `CHANGELOG.md`** — voeg toe wat er veranderd is. Dit is de werkende notitie die bij een release wordt omgezet naar een release note.
- Tell the user what changed and ask whether to merge into `main` or open a PR.
- **Never merge or push to `main` without explicit user approval.**

### CHANGELOG.md — twee formaten

**Op een branch** is de changelog minimaal. Alleen een korte intro + `[Unreleased]` met de wijzigingen van die branch. Geen "Hoe dit werkt"-sectie, geen versiegeschiedenis:

```markdown
# Changelog
Wijzigingen op deze branch ([branch-naam]). Bij merge naar main schuiven deze regels
onder ## [Unreleased] in de hoofd-CHANGELOG. Zie de werkwijze in CLAUDE.md.

## [Unreleased]
[beschrijving van de wijzigingen op deze branch]
```

**Op `main`** is de changelog volledig: "Hoe dit werkt"-sectie, levenscyclus-uitleg, `[Unreleased]` met alles wat gemergd is maar nog niet live, en de volledige versiegeschiedenis met `← LIVE` op de meest recente versie.

---

## Safety Rules

### Never do without explicit user confirmation

- `git push --force` (any branch)
- `git reset --hard`
- `git rebase` on a shared branch
- Delete files from `public/images/` (images are referenced by path in JSON)
- Modify `next.config.ts` (static export config — breaks the Netlify build if wrong)
- Modify `netlify.toml`

### Before writing JSON data files

- Verify the result is valid JSON (parseable, no trailing commas)
- Keep array sorted **newest first** (highest `id` date at top)
- Never modify entries with `"ignore": true` (preview entries)
- Never overwrite a non-empty `description` field unless asked

### Before committing

- Run `npm run lint` to catch TypeScript/ESLint errors
- Check that image paths referenced in JSON actually exist in `public/images/`

---

## Project Quick Reference

### Key commands

```bash
npm run dev      # dev server → http://localhost:3000
npm run build    # static export → .next/
npm run lint     # ESLint + TypeScript check
```

### Hulpscripts

| Commando | Script | Wat het doet |
|---|---|---|
| `npm run mix:add` | `scripts/add-mix.js` | Voeg interactief een nieuwe mix toe aan het juiste JSON bestand |
| `npm run images:webp` | `scripts/convert-to-webp.js` | Converteer alle `.jpg` in `public/images/` naar `.webp` en verwijder de originelen |
| `npm run images:webp:dry` | `scripts/convert-to-webp.js --dry-run` | Preview: laat zien welke bestanden geconverteerd zouden worden |

**Workflow nieuwe mix toevoegen:**
1. `npm run mix:add` — vul alle gegevens in, script genereert afgeleide velden automatisch
2. Afbeeldingen neerzetten in `public/images/{power}/{color}/`
3. `npm run images:webp` — als je `.jpg` afbeeldingen hebt aangeleverd
4. Controleer het JSON bestand in de editor
5. Commit + push via de release workflow (zie verderop)

### Critical constraints

- **Static export**: `output: 'export'` in `next.config.ts` — no server-side rendering, no Next.js API routes. Contact form runs via Netlify Functions.
- **Images unoptimized**: `images: { unoptimized: true }` — required for static export. Do not remove.
- **Bilingual (EN/NL) via next-intl**: the site is fully bilingual. All user-facing strings belong in `messages/en.json` and `messages/nl.json` — never hardcoded in components. Use `useTranslations()` (client) or `getTranslations()` (server). The domain is `djcylow.com`; default locale is `en`.
- **No inline CSS**: do not use `style={{}}` in JSX. All CSS belongs in SCSS files under `src/styles/`. Exception: truly dynamic runtime values (e.g. `backgroundImage: url(${src})`, progress bar width percentages).
- **Tailwind v4 + SCSS**: both are used side by side. SCSS lives in `src/styles/`, Tailwind as utility classes in components.

### Where content lives

| What | Where |
|---|---|
| UI strings (buttons, labels, errors) | `messages/en.json` + `messages/nl.json` |
| Mix metadata & tracklists | `src/data/mixes/[power]-[color].json` |
| Home page text | `src/content/home.ts` |
| Services text | `src/content/diensten.ts` |
| Music Mood Colours text | `src/content/musicmoodcolours.ts` |
| Testimonials | `src/content/referenties.ts` |
| Breakpoints | `src/constants/design.ts` |
| In-progress changes (unreleased) | `CHANGELOG.md` → `[Unreleased]` |

### Audio storage

Active Cloudflare R2 bucket: `https://pub-4fa4c2c1f9a644c4878cba29a7926443.r2.dev/`

---

## Mix JSON Rules (src/data/mixes/)

See `src/data/mixes/README.md` for the full schema spec.

Quick rules:
- `color` field: capitalized (`"Red"`, not `"red"`)
- `date` field: ISO format `"YYYY-MM-DD"` (not empty)
- `description`: unique per mix, 120–160 chars, English, mention subgenre + 2–4 artists
- `tracklist` time format: `"HH:MM:SS"` with leading zeros
- New mixes go at the **top** of the array

---

## Release Workflow

When the user says "commit en push live" or "maak een nieuwe release en push live":

### Stap voor stap

1. **Check de status**: `git status && git branch`
2. **Maak een branch** (nooit direct op `main` committen):
   ```bash
   git checkout -b data/[omschrijving]   # of ander passend prefix
   ```
3. **Run lint**: `npm run lint` — controleer of nieuwe fouten zijn geïntroduceerd (pre-existing errors zijn acceptabel als wij geen .tsx/.ts bestanden wijzigden)
4. **Bepaal versienummer** (zie `release-notes/README.md`):
   - PATCH (`x.y.Z+1`): bugfix, hotfix, kleine correctie
   - MINOR (`x.Y+1.0`): nieuwe content, feature, backwards-compatible
   - MAJOR: ingrijpende verbouwing (zelden)
5. **Maak release note** aan: `release-notes/<versie>.md` — gebruik de `[Unreleased]` sectie uit `CHANGELOG.md` als inhoud
6. **Update `CHANGELOG.md`**: hernoem `[Unreleased]` naar `[v<versie>] - <datum>` met een link naar de nieuwe release note
7. **Voeg versie toe** aan overzichtstabel in `release-notes/README.md` (bovenaan)
8. **Stage en commit** op de feature branch
9. **Merge naar main** (na gebruikersbevestiging):
   ```bash
   git checkout main
   git merge [branch] --no-ff -m "Merge branch '[branch]' — v<versie>"
   ```
10. **Tag en push**:
   ```bash
   git tag -a v<versie> -m "v<versie> - <korte titel>"
   git push origin main
   git push origin v<versie>
   ```
11. **GitHub Release aanmaken**:
    ```bash
    gh release create v<versie> \
      --title "v<versie> - <korte titel>" \
      --notes-file release-notes/<versie>.md \
      --verify-tag
    ```
12. **Verwijder de feature branch** (lokaal + remote):
    ```bash
    git branch -d [branch]
    git push origin --delete [branch]
    ```

Netlify deployt automatisch na de push naar `main`.

### Versienummer bepalen

| Type wijziging | Versie |
|---|---|
| Bugfix, hotfix, kleine correctie | PATCH |
| Nieuwe beschrijvingen, content updates | MINOR |
| Nieuwe mix, nieuwe pagina, nieuw component | MINOR |
| Volledig redesign of framework-migratie | MAJOR |

---

## Deployment

Netlify auto-deploys on every push to `main`. There is no staging environment. This is why branch protection matters — a broken build on `main` means the live site is down.
