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
| **MAJOR** | `1.x` → `2.0.0` | Ingrijpende verbouwing of redesign (bijv. volledige nieuwe layout of framework-migratie) |
| **MINOR** | `1.0` → `1.1.0` | Nieuwe feature, backwards-compatible (nieuwe pagina, nieuw component, nieuwe mix-categorie) |
| **PATCH** | `1.1.0` → `1.1.1` | Bugfix, hotfix of kleine stijlcorrectie op de laatste release |

We starten op **1.0.0** (de baseline op de eerste livegang). `MAJOR` blijft voorlopig op `1`;
`2.0.0` reserveren we voor een toekomstig volledig redesign.

## Git tags & rollback

### Wat een tag is

Een git tag is een **vaste, vernoemde verwijzing naar één specifieke commit** — een
naamplaatje dat je op een commit plakt. Het verschil met een branch is wat het bruikbaar
maakt als release-anker:

- Een **branch** (zoals `main`) **beweegt mee**: elke nieuwe commit schuift `main` vooruit.
- Een **tag** (zoals `v1.3.0`) **staat stil**: hij wijst voor altijd naar dezelfde commit,
  wat er daarna ook gebeurt. `v1.3.0` blijft dus exact de staat die destijds live ging,
  ook al is `main` intussen tientallen commits verder.

```
commits:   A --- B --- C --- D --- E   ← main (beweegt mee naar rechts)
                 ↑           ↑
              v1.1.0      v1.3.0        (blijven staan waar ze staan)
```

### Annotated tags (wat wij gebruiken)

Er zijn twee soorten: *lightweight* (alleen een naam) en *annotated* (een object met auteur,
datum en bericht). Voor releases gebruiken we altijd **annotated** — je wilt weten wanneer en
waarom een versie is gezet:

```sh
git tag -a v1.3.0 <commit> -m "v1.3.0 - UX MODUS (donker/licht mode)"
```

> Bij het pushen zie je een annotated tag tweemaal in de remote-lijst, bv. `v1.3.0` en
> `v1.3.0^{}`. Dat is geen dubbeling: de eerste is het tag-object (met het bericht), de
> tweede (`^{}`) is de commit waar die tag uiteindelijk naar verwijst.

### Werken met tags

```sh
git tag -n1                # lijst alle tags mét hun bericht
git show v1.3.0            # bekijk de tag + de wijzigingen van die commit
git checkout v1.3.0        # zet de werkmap exact op die release (rollback / inspectie)
git checkout main          # weer terug naar het heden
```

`git checkout v1.3.0` zet je in "detached HEAD" — je kijkt naar het verleden zonder op een
branch te zitten. Prima om te inspecteren of een hotfix-branch vanaf dat punt te starten; ga
daarna terug met `git checkout main`.

**Let op:** een gewone `git push` neemt tags **niet** mee. Push een release-tag apart:

```sh
git push origin v1.3.0     # één tag
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
gh release create v1.3.0 --title "v1.3.0 - UX MODUS (donker/licht mode)" \
  --notes-file release-notes/1.3.0.md --verify-tag
```

## Nieuwe release aanmaken — stap voor stap

1. Zorg dat `main` up-to-date is en de wijzigingen live staan op Netlify.
2. Bepaal het versienummer (zie tabel hierboven).
3. Maak het release-note bestand aan: `release-notes/<versie>.md`.
4. Voeg de versie toe aan de overzichtstabel onderaan in deze README.
5. Zet de annotated tag op de juiste commit en push:
   ```sh
   git tag -a v<versie> <commit-hash> -m "v<versie> - <korte titel>"
   git push origin v<versie>
   ```
6. Maak optioneel een GitHub Release aan via `gh release create` (zie hierboven).

## Overzicht

| Versie | Datum | Type | Titel |
|--------|-------|------|-------|
| [1.16.0](1.16.0.md) | 2026-06-25 | Minor | Volledig tweetalig (EN/NL) via next-intl |
| [1.15.0](1.15.0.md) | 2026-06-25 | Minor | Mix detail verbeteringen + domein en taal gecorrigeerd |
| [1.14.4](1.14.4.md) | 2026-06-25 | Patch | add-mix script: automatische afbeelding controle en conversie |
| [1.14.3](1.14.3.md) | 2026-06-25 | Patch | add-mix script: AI beschrijving + tracklist plakken |
| [1.14.2](1.14.2.md) | 2026-06-25 | Patch | Script: nieuwe mix toevoegen |
| [1.14.1](1.14.1.md) | 2026-06-25 | Patch | Alle afbeeldingen geconverteerd naar WebP |
| [1.14.0](1.14.0.md) | 2026-06-25 | Content | Mix beschrijvingen alle kleuren + Red image update |
| [1.13.0](1.13.0.md) | 2026-06-18 | Refactor | Code structuur & JSON tracklist verbeterd |
| [1.12.0](1.12.0.md) | 2026-06-16 | Feature | Nieuwe mix: Red Light EDM (Vol. 6) |
| [1.11.1](1.11.1.md) | 2026-05-10 | Patch | BackButton navigatie via Link |
| [1.11.0](1.11.0.md) | 2026-05-08 | Feature | Nieuwe mix: Orange Drum & Bass (Vol. 9) + responsive |
| [1.10.0](1.10.0.md) | 2026-05-05 | Feature | UX kleuren uitgebreid + layout responsive |
| [1.9.0](1.9.0.md) | 2026-05-01 | Feature | UX MODUS — donker/licht mode |
| [1.8.0](1.8.0.md) | 2026-04-20 | Feature | Reviews verborgen + responsive breakpoints |
| [1.7.0](1.7.0.md) | 2026-04-13 | Feature | Referenties component + Mobile Content 2.0 |
| [1.6.0](1.6.0.md) | 2026-04-11 | Feature | Filter 2.0 + Luister pagina 2.0 |
| [1.5.0](1.5.0.md) | 2026-04-10 | Feature | Nieuwe mix + mix detail refactor |
| [1.4.0](1.4.0.md) | 2026-03-20 | Feature | Nieuwe mix: Yellow EDM (Full) |
| [1.3.0](1.3.0.md) | 2026-03-19 | Feature | BasiskleurenCarousel + Promo sectie + Navigatie |
| [1.2.0](1.2.0.md) | 2026-03-13 | Feature | Hero Banner |
| [1.1.0](1.1.0.md) | 2026-03-11 | Feature | AudioPlayer + Light Yellow mixes |
| [1.0.1](1.0.1.md) | 2026-03-08 | Patch | Succes message contactformulier |
| [1.0.0](1.0.0.md) | 2026-03-07 | Baseline | Eerste livegang op Netlify |
