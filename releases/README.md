# Release notes — DJ Cylow website (djcylow-react)

Dit is de officiële release-historie van de live website op **djcylow.com**, gedeployed via
**Netlify** vanuit de `main`-branch op GitHub.

## Wat is een release?

**Een release is een versienummer op wat al live staat — geen publicatiemoment.** Netlify bouwt en
publiceert bij elke push naar `main`, en een PR-merge schrijft daar rechtstreeks in; een wijziging
staat dus al op de site zodra de PR gemerged is. Het cutten van een release bundelt die wijzigingen
onder één SemVer-nummer, legt ze vast in een release-note en zet er een git-tag op.

> Dit stond hier tot 2026-07-26 als "één release = één deployment". Dat suggereerde dat een release
> de code naar buiten brengt, terwijl dat bij de merge al gebeurd was. Het model in regel 3 hierboven
> ("gedeployed via Netlify vanuit de `main`-branch") was wel altijd correct.

Dev-werk, feature-branches en experimenten die nooit gemerged zijn, staan hier niet in — die horen in
de git history. Deze map bevat alleen wat bezoekers daadwerkelijk te zien hebben gekregen.

## Drie roots — elke root noemt zijn lezer

Onder `releases/` staan drie mappen, en de indeling is er één van **lezer**, niet van vorm. De submap
daarbinnen (`2.22/`) komt van `Get-ReleaseNotesGrouping` in
[`scripts/repo-config.ps1`](../scripts/repo-config.ps1) en is hier **per minor** — de bron zelf groepeert
per major (`2.x/`), dus dat is een eigen antwoord van deze repo en geen afwijking die gerepareerd hoort.

| | `development/<X.Y>/<X.Y.Z>.md` | `audience/<X.Y>/<X.Y.Z>.md` | `github/<X.Y>/<X.Y.Z>.md` |
|---|---|---|---|
| **Voor wie** | de developers van deze repo | de opdrachtgever — wie beslist wat het werk waard is | wie de GitHub Releases-pagina opent |
| **Inhoud** | het volledige per-PR record: elke entry ongewijzigd, met branch-namen, merge-datums en branch-types | wat de release waard is, en wat er op dat moment nog open stond | een korte aankondiging met een verwijzing naar de bijlagen |
| **Wanneer** | elke release — Patch, Minor en Major | alleen Minor en Major | elke release |
| **Lengte** | zo lang als de release was | een pagina | een paar alinea's |
| **Rol bij de GitHub Release** | bijlage | bijlage (bij Minor/Major) | **de body** |

**Alle drie zijn hier handwerk.** In de bron genereert `cut-release.ps1` `development/` en `github/` en
draft het `audience/`; dat script is **niet bruikbaar in deze repo** — het leest
`.claude-plugin/marketplace.json` als bron van waarheid en bumpt elke `plugin.json` in lockstep, en geen
van beide bestaat hier. De gedeelde `cut-release`-**skill** is dan ook uitdrukkelijk een checklist die
niets uitvoert. Wat deze repo van de bron overneemt is dus de **indeling**, niet de generator: Rendall 🎬
schrijft de drie documenten, en de mappen zeggen voor wie elk ervan is.

**Waarom `development/` niet de body is:** de `--notes-file` van `gh` kent een harde grens van 125.000
tekens, en een volledig record kan daar langs. Daarom is dat een bijlage en heeft de aankondiging zijn
eigen root — een korte tekst die je in de Release zelf leest, met de twee bijlagen voor wie doorklikt.

> **`audience/` heette `highlights/` tot 2026-08-13.** Die naam zei hoe het document geschreven was, niet voor wie
> — precies de fout die de bron een dag eerder bij zijn eigen `notes/` repareerde. De 23 bestaande
> documenten zijn met `git mv` verplaatst en **niet herschreven**: noemt de tekst van een oudere note nog
> `releases/highlights/`, dan is dat wat er stond op de dag dat hij uitging. Een gepubliceerd record
> beweegt niet mee.

> **`github/` is nog leeg, en dat is juist.** De map is nieuw sinds 2026-08-13 en de eerste aankondiging
> hoort bij de eerstvolgende release; oude releases krijgen er met terugwerkende kracht géén, want een
> aankondiging voor een moment dat al voorbij is verzinnen we niet. Tot die tijd blijft de body van een
> bestaande Release wat hij was.
>
> Dit pad staat **hardcoded** in de `cut-release.ps1` van de bron (regel 792) en niet in een seam — een
> nieuwe root hoeft geen bestaande plaatsing te accommoderen. Er is hier dus niets te declareren, en de
> naam staat vast op het moment dat deze repo ooit wél een generator krijgt.

**Wat het handgeschreven document hier wél en niet heeft.** `Get-ReleaseAudienceTier` staat op **1**, dus
er komt géén sectie *voor consumenten* in: dat is tier 2, en bezoekers van djcylow.com lezen geen release
notes. Wat overblijft zijn de twee organisatie-secties — *wat het waard is* en *wat er bij deze release nog
open stond*. Schrijf die tweede in de verleden tijd: het document wordt als bijlage gepubliceerd en een
zin in de tegenwoordige tijd is binnen een dag achterhaald.

> **De 23 bestaande `audience/`-documenten volgen nog het oude model:** één register, leesbaar Nederlands
> zonder jargon, zonder secties per lezer. De mapstructuur loopt sinds 2026-08-13 gelijk met de bron; het
> documentmodel nog niet. Die herziening staat open als eigen werk.

## Versienummers (Semantic Versioning)

We volgen [Semantic Versioning](https://semver.org/lang/nl/): `MAJOR.MINOR.PATCH`.

| Onderdeel | Voorbeeld | Wanneer ophogen |
|-----------|-----------|-----------------|
| **MAJOR** | `2.x` → `3.0.0` | Ingrijpende verbouwing of redesign (bijv. volledige nieuwe layout of framework-migratie) |
| **MINOR** | `2.0` → `2.1.0` | Nieuwe feature, backwards-compatible (nieuwe pagina, nieuw component, nieuwe mix-categorie) |
| **PATCH** | `2.1.0` → `2.1.1` | Bugfix, Docs, hotfix of kleine stijlcorrectie op de laatste release |

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

Een tag is de technische basis; een **GitHub Release** is een laagje erbovenop. Het koppelt een tag aan
een nette pagina met een omschrijving en bijlagen. De tag is verplicht, de Release is optionele
verfraaiing.

De drie roots verdelen zich zo over die pagina: **`github/` is de body**, en `development/` en — bij
Minor/Major — `audience/` gaan als **bijlage** mee. De body was tot 2026-08-13 de `development/`-note;
die is nu bijlage, om de tekenlimiet hierboven.

Alle releases staan op <https://github.com/DaveKJohn/djcylow-react/releases>. Vanuit
een Release kun je via *Compare* precies zien wat er tussen twee versies veranderde. Een
Release maak je vanuit een bestaande tag zo:

```sh
# De gegenereerde aankondiging als body (altijd):
gh release create v2.3.0 --title "v2.3.0 - UX MODUS (donker/licht mode)" \
  --notes-file releases/github/2.3/2.3.0.md --verify-tag

# De bijlagen — onder unieke namen, zie hieronder:
cp releases/development/2.3/2.3.0.md v2.3.0-development-notes.md
cp releases/audience/2.3/2.3.0.md    v2.3.0-release-note.md
gh release upload v2.3.0 v2.3.0-development-notes.md v2.3.0-release-note.md
rm v2.3.0-development-notes.md v2.3.0-release-note.md
```

> **Upload de bijlagen onder unieke bestandsnamen.** Alle drie de documenten van een release heten
> `<X.Y.Z>.md`, dus twee ervan rechtstreeks uit `releases/` uploaden botst: de tweede upload komt terug
> met `HTTP 404`. De `file#label`-syntax van `gh` lost dit niet op — die zet het label, niet de naam.
> Kopieer ze dus eerst, zoals hierboven.

## Nieuwe release aanmaken — stap voor stap

De volledige werkwijze staat in [`CLAUDE.md`](../CLAUDE.md) onder **Release Workflow**. Kort
samengevat:

1. Bepaal het versienummer (zie semver-tabel hierboven).
2. Maak de development-versie aan (altijd): `releases/development/<major.minor>/<versie>.md` — gebruik de entries uit `CHANGELOG.md` als basis (elke `##`-kop daar is één wijziging). Formaat:
   ```markdown
   # v<versie> — <korte titel>
   **Datum:** YYYY-MM-DD
   **Type:** Patch/Minor/Major

   ## Wijzigingen

   <korte samenvatting van alle wijzigingen>

   ### Korte sterke titel van de wijziging · Docs

   <beschrijving>

   [PR #NN](https://github.com/DaveKJohn/djcylow-react/pull/NN) · merged YYYY-MM-DD
   ```
   **De kop bouw je zelf**, uit `### Branch title` en `### Branch type` van de entry. Neem de kop uit
   `CHANGELOG.md` niet letterlijk over: die noemt de branch (``## `docs/mijn-branch` changelog``), niet
   de wijziging. Het PR-nummer en de merge-datum staan op de slotregel van de entry en gaan ongewijzigd
   mee. Entries van vóór 2026-08-11 dragen hun titel, type en datum nog wél in de kop
   (`### #NN · Titel · Docs · YYYY-MM-DD`) — die neem je over zoals ze zijn.
3. Maak bij Minor/Major het handgeschreven document aan: `releases/audience/<major.minor>/<versie>.md` — leesbaar Nederlands zonder jargon, zonder PR-nummers, merge-datums of branch-types. Twee secties, want deze repo staat op tier 1: **wat het waard is** en **wat er bij deze release nog open stond** (verleden tijd — zie hierboven).
4. Schrijf de aankondiging: `releases/github/<major.minor>/<versie>.md` — een paar alinea's die de body van de GitHub Release worden. Wat er nieuw is en voor wie, en een regel die naar de twee bijlagen wijst. Dit is niet de plek voor de per-PR details; die staan in `development/`.
5. Voeg de versie toe aan de overzichtstabel in deze README (bovenaan de tabel), linkend naar de development-versie. **Dit is de enige plek waar de uitgebrachte versies worden bijgehouden.**
6. Update `CHANGELOG.md`: haal de gefolde entries eruit — ze staan nu in de release-note — zodat alleen de intro overblijft. Er komt géén versieblok voor terug; `CHANGELOG.md` houdt alleen wat nog geen versienummer heeft.
7. Tag en push via de stappen in [`CLAUDE.md`](../CLAUDE.md).

## Overzicht

| Versie | Datum | Type | Titel |
|--------|-------|------|-------|
| [2.22.0](development/2.22/2.22.0.md) | 2026-07-26 | Minor | Spotify-velden, datums hersteld, en de documentatie gelijk aan de praktijk |
| [2.21.0](development/2.21/2.21.0.md) | 2026-07-25 | Minor | Alle mixtitels naar één uniek formaat, plus workflow- en toolingherstel |
| [2.20.2](development/2.20/2.20.2.md) | 2026-07-25 | Patch | Mix-titels met hoofdletter, genrefilter-fix en workflow-aanscherpingen |
| [2.20.1](development/2.20/2.20.1.md) | 2026-07-02 | Patch | Workflow-herstructurering: PR's, per-branch changelog, releases/development+highlights |
| [2.20.0](development/2.20/2.20.0.md) | 2026-07-02 | Minor | Luister-genrefilters uitgebreid, URL-sync en changelog opgeschoond |
| [2.19.2](development/2.19/2.19.2.md) | 2026-06-28 | Patch | Orange Full (m) subgenre gecorrigeerd |
| [2.19.1](development/2.19/2.19.1.md) | 2026-06-28 | Patch | robots.txt en sitemap.xml static export fix |
| [2.19.0](development/2.19/2.19.0.md) | 2026-06-28 | Minor | NL/EN descriptions, image rename, mix-detailpagina verbeteringen |
| [2.18.0](development/2.18/2.18.0.md) | 2026-06-27 | Minor | SEO/GEO verbeteringen, top_artists & subgenre backfill |
| [2.17.0](development/2.17/2.17.0.md) | 2026-06-27 | Minor | GA4 + GTM analytics — view_mix dataLayer event |
| [2.16.4](development/2.16/2.16.4.md) | 2026-06-27 | Patch | Entry-formaat en branch-naamgeving vastgelegd |
| [2.16.3](development/2.16/2.16.3.md) | 2026-06-27 | Patch | Changelog workflow en mapstructuur verfijnd |
| [2.16.2](development/2.16/2.16.2.md) | 2026-06-27 | Patch | Changelog & release-notes workflow verfijnd |
| [2.16.1](development/2.16/2.16.1.md) | 2026-06-27 | Patch | Changelog workflow + versienummering |
| [2.16.0](development/2.16/2.16.0.md) | 2026-06-25 | Minor | Mix tags toegevoegd |
| [2.15.0](development/2.15/2.15.0.md) | 2026-06-25 | Minor | Mix detail verbeteringen + domein en taal gecorrigeerd |
| [2.14.4](development/2.14/2.14.4.md) | 2026-06-25 | Patch | add-mix script: automatische afbeelding controle en conversie |
| [2.14.3](development/2.14/2.14.3.md) | 2026-06-25 | Patch | add-mix script: AI beschrijving + tracklist plakken |
| [2.14.2](development/2.14/2.14.2.md) | 2026-06-25 | Patch | Script: nieuwe mix toevoegen |
| [2.14.1](development/2.14/2.14.1.md) | 2026-06-25 | Patch | Alle afbeeldingen geconverteerd naar WebP |
| [2.14.0](development/2.14/2.14.0.md) | 2026-06-25 | Minor | Mix beschrijvingen alle kleuren + Red image update |
| [2.13.0](development/2.13/2.13.0.md) | 2026-06-18 | Minor | Code structuur & JSON tracklist verbeterd |
| [2.12.0](development/2.12/2.12.0.md) | 2026-06-16 | Minor | Nieuwe mix: Red Light EDM (Vol. 6) |
| [2.11.1](development/2.11/2.11.1.md) | 2026-05-10 | Patch | BackButton navigatie via Link |
| [2.11.0](development/2.11/2.11.0.md) | 2026-05-08 | Minor | Nieuwe mix: Orange Drum & Bass (Vol. 9) + responsive |
| [2.10.0](development/2.10/2.10.0.md) | 2026-05-05 | Minor | UX kleuren uitgebreid + layout responsive |
| [2.9.0](development/2.9/2.9.0.md) | 2026-05-01 | Minor | UX MODUS — donker/licht mode |
| [2.8.0](development/2.8/2.8.0.md) | 2026-04-20 | Minor | Reviews verborgen + responsive breakpoints |
| [2.7.0](development/2.7/2.7.0.md) | 2026-04-13 | Minor | Referenties component + Mobile Content 2.0 |
| [2.6.0](development/2.6/2.6.0.md) | 2026-04-11 | Minor | Filter 2.0 + Luister pagina 2.0 |
| [2.5.0](development/2.5/2.5.0.md) | 2026-04-10 | Minor | Nieuwe mix + mix detail refactor |
| [2.4.0](development/2.4/2.4.0.md) | 2026-03-20 | Minor | Nieuwe mix: Yellow EDM (Full) |
| [2.3.0](development/2.3/2.3.0.md) | 2026-03-19 | Minor | BasiskleurenCarousel + Promo sectie + Navigatie |
| [2.2.0](development/2.2/2.2.0.md) | 2026-03-13 | Minor | Hero Banner |
| [2.1.0](development/2.1/2.1.0.md) | 2026-03-11 | Minor | AudioPlayer + Light Yellow mixes |
| [2.0.1](development/2.0/2.0.1.md) | 2026-03-08 | Patch | Succes message contactformulier |
| [2.0.0](development/2.0/2.0.0.md) | 2026-03-07 | Major | Eerste livegang op Netlify |
