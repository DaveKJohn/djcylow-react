# Release notes — DJ Cylow website (djcylow-react)

Dit is de officiële release-historie van de live website op **djcylow.com**, gedeployed via
**Netlify** vanuit de `main`-branch op GitHub.

## Wat is een release?

**Één release = één deployment naar de live Netlify-omgeving.** Dev-werk, feature-branches en
experimenten die nooit live zijn gegaan, staan hier niet in — die horen in de git history.
Deze map bevat alleen wat bezoekers daadwerkelijk te zien hebben gekregen.

## Versienummers (Semantic Versioning)

We volgen [Semantic Versioning](https://semver.org/lang/nl/): `MAJOR.MINOR.PATCH`.

| Onderdeel | Voorbeeld | Wanneer ophogen |
|-----------|-----------|-----------------|
| **MAJOR** | `2.x` → `3.0.0` | Ingrijpende verbouwing of redesign (bijv. volledige nieuwe layout of framework-migratie) |
| **MINOR** | `2.0` → `2.1.0` | Nieuwe feature, backwards-compatible (nieuwe pagina, nieuw component, nieuwe mix-categorie) |
| **PATCH** | `2.1.0` → `2.1.1` | Bugfix, hotfix of kleine stijlcorrectie op de laatste release |

De React-versie van de website is gestart op **2.0.0** (framework-migratie van de vorige stack). `MAJOR` blijft voorlopig op `2`; `3.0.0` reserveren we voor een toekomstig volledig redesign.

## Git tags & rollback

### Wat een tag is

Een git tag is een **vaste, vernoemde verwijzing naar één specifieke commit** — een
naamplaatje dat je op een commit plakt. Het verschil met een branch is wat het bruikbaar
maakt als release-anker:

- Een **branch** (zoals `main`) **beweegt mee**: elke nieuwe commit schuift `main` vooruit.
- Een **tag** (zoals `v2.3.0`) **staat stil**: hij wijst voor altijd naar dezelfde commit,
  wat er daarna ook gebeurt. `v2.3.0` blijft dus exact de staat die destijds live ging,
  ook al is `main` intussen tientallen commits verder.

```
commits:   A --- B --- C --- D --- E   ← main (beweegt mee naar rechts)
                 ↑           ↑
              v2.1.0      v2.3.0        (blijven staan waar ze staan)
```

### Annotated tags (wat wij gebruiken)

Er zijn twee soorten: *lightweight* (alleen een naam) en *annotated* (een object met auteur,
datum en bericht). Voor releases gebruiken we altijd **annotated** — je wilt weten wanneer en
waarom een versie is gezet:

```sh
git tag -a v2.3.0 <commit> -m "v2.3.0 - UX MODUS (donker/licht mode)"
```

> Bij het pushen zie je een annotated tag tweemaal in de remote-lijst, bv. `v2.3.0` en
> `v2.3.0^{}`. Dat is geen dubbeling: de eerste is het tag-object (met het bericht), de
> tweede (`^{}`) is de commit waar die tag uiteindelijk naar verwijst.

### Werken met tags

```sh
git tag -n1                # lijst alle tags mét hun bericht
git show v2.3.0            # bekijk de tag + de wijzigingen van die commit
git checkout v2.3.0        # zet de werkmap exact op die release (rollback / inspectie)
git checkout main          # weer terug naar het heden
```

`git checkout v2.3.0` zet je in "detached HEAD" — je kijkt naar het verleden zonder op een
branch te zitten. Prima om te inspecteren of een hotfix-branch vanaf dat punt te starten; ga
daarna terug met `git checkout main`.

**Let op:** een gewone `git push` neemt tags **niet** mee. Push een release-tag apart:

```sh
git push origin v2.3.0     # één tag
git push origin --tags     # alle nog niet-gepushte tags
```

## GitHub Releases

Een tag is de technische basis; een **GitHub Release** is een laagje erbovenop. Het koppelt
een tag aan een nette pagina met de release-omschrijving (de bijbehorende `release-notes/`
note) en eventueel bijlagen. De tag is verplicht, de Release is optionele verfraaiing.

Alle releases staan op <https://github.com/DaveKJohn/djcylow-react/releases>. Vanuit
een Release kun je via *Compare* precies zien wat er tussen twee versies veranderde. Een
Release maak je vanuit een bestaande tag zo:

```sh
gh release create v2.3.0 --title "v2.3.0 - UX MODUS (donker/licht mode)" \
  --notes-file release-notes/2.3.0.md --verify-tag
```

## Nieuwe release aanmaken — stap voor stap

De volledige werkwijze staat in `CLAUDE.md` onder **Release Workflow**. Kort samengevat:

1. Bepaal het versienummer (zie semver-tabel hierboven).
2. Maak het release-note bestand aan: `release-notes/<versie>.md` — gebruik de `[Unreleased]` sectie uit `CHANGELOG.md` als basis. Formaat:
   ```markdown
   # v<versie> — <korte titel>
   **Datum:** YYYY-MM-DD
   **Type:** Patch/Minor/Major

   ## Wijzigingen

   <korte samenvatting van alle wijzigingen>

   ### <Titel van wijziging>
   **Branch:** `<branch-naam>` · **Gemergd:** YYYY-MM-DD

   <beschrijving>
   ```
3. Voeg de versie toe aan de overzichtstabel in deze README (bovenaan de tabel).
4. Update `CHANGELOG.md`: hernoem `[Unreleased]` naar `[v<versie>] - YYYY-MM-DD — Patch/Minor/Major`.
5. Tag en push via de stappen in `CLAUDE.md`.

## Overzicht

| Versie | Datum | Type | Titel |
|--------|-------|------|-------|
| [2.16.2](2.16.2.md) | 2026-06-27 | Patch | Changelog & release-notes workflow verfijnd |
| [2.16.1](2.16.1.md) | 2026-06-27 | Patch | Changelog workflow + versienummering |
| [2.16.0](2.16.0.md) | 2026-06-25 | Minor | Mix tags toegevoegd |
| [2.15.0](2.15.0.md) | 2026-06-25 | Minor | Mix detail verbeteringen + domein en taal gecorrigeerd |
| [2.14.4](2.14.4.md) | 2026-06-25 | Patch | add-mix script: automatische afbeelding controle en conversie |
| [2.14.3](2.14.3.md) | 2026-06-25 | Patch | add-mix script: AI beschrijving + tracklist plakken |
| [2.14.2](2.14.2.md) | 2026-06-25 | Patch | Script: nieuwe mix toevoegen |
| [2.14.1](2.14.1.md) | 2026-06-25 | Patch | Alle afbeeldingen geconverteerd naar WebP |
| [2.14.0](2.14.0.md) | 2026-06-25 | Minor | Mix beschrijvingen alle kleuren + Red image update |
| [2.13.0](2.13.0.md) | 2026-06-18 | Minor | Code structuur & JSON tracklist verbeterd |
| [2.12.0](2.12.0.md) | 2026-06-16 | Minor | Nieuwe mix: Red Light EDM (Vol. 6) |
| [2.11.1](2.11.1.md) | 2026-05-10 | Patch | BackButton navigatie via Link |
| [2.11.0](2.11.0.md) | 2026-05-08 | Minor | Nieuwe mix: Orange Drum & Bass (Vol. 9) + responsive |
| [2.10.0](2.10.0.md) | 2026-05-05 | Minor | UX kleuren uitgebreid + layout responsive |
| [2.9.0](2.9.0.md) | 2026-05-01 | Minor | UX MODUS — donker/licht mode |
| [2.8.0](2.8.0.md) | 2026-04-20 | Minor | Reviews verborgen + responsive breakpoints |
| [2.7.0](2.7.0.md) | 2026-04-13 | Minor | Referenties component + Mobile Content 2.0 |
| [2.6.0](2.6.0.md) | 2026-04-11 | Minor | Filter 2.0 + Luister pagina 2.0 |
| [2.5.0](2.5.0.md) | 2026-04-10 | Minor | Nieuwe mix + mix detail refactor |
| [2.4.0](2.4.0.md) | 2026-03-20 | Minor | Nieuwe mix: Yellow EDM (Full) |
| [2.3.0](2.3.0.md) | 2026-03-19 | Minor | BasiskleurenCarousel + Promo sectie + Navigatie |
| [2.2.0](2.2.0.md) | 2026-03-13 | Minor | Hero Banner |
| [2.1.0](2.1.0.md) | 2026-03-11 | Minor | AudioPlayer + Light Yellow mixes |
| [2.0.1](2.0.1.md) | 2026-03-08 | Patch | Succes message contactformulier |
| [2.0.0](2.0.0.md) | 2026-03-07 | Major | Eerste livegang op Netlify |
