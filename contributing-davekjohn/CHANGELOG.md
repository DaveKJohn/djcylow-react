# Changelog

De geschiedenis van de DJ Cylow-website: elke gemergde branch met zijn pull request, nieuwste
bovenaan, onder één `## [Unreleased]`-kop — **elke `###`-kop daaronder is één wijziging**, en dat is
wat de gedeelde workflow-scripts lezen. Het mechanisme (het entry-bestand
`development-cycle.md`, folden, een release knippen) staat in [`CLAUDE.md`](../CLAUDE.md).

> Tot 2026-08-27 stond hier geen `## [Unreleased]`-kop en droeg elke wijziging zelf een `##`-kop, één
> niveau hoger. Plugin v4.20.0 (25-26 augustus 2026) voerde de kop in en verdiepte elk niveau in een
> entry met één: de entry-kop werd `###`, de zes genoemde secties erin `####`, en de tier-subkoppen
> `#####`. Oudere entries elders in de repo-geschiedenis (in `releases/changelog/`, tot 2026-08-27 `releases/development/` op de repo-root) zijn niet
> herschreven — dat is een record, geen vertaling.

**`origin/main` is de live site.** Netlify bouwt en publiceert bij elke push naar `main`, en een
PR-merge schrijft daar rechtstreeks in. Alles hieronder staat dus al op `djcylow.com` — live, maar
nog zonder versienummer. Een release is een label op wat al draait.

**De uitgebrachte versies staan niet hier maar in
[`contributing-davekjohn/releases/README.md`](releases/README.md)**, met
datum, type en een samenvattende regel per versie. Dit bestand houdt alleen wat nog géén
versienummer heeft; een release-cut haalt die entries eruit en laat deze intro achter.

> Tot 2026-07-26 stond hier het omgekeerde, met een `← LIVE`-markering die zou aanwijzen welke versie
> draaide. Dat model was onjuist en de markering stond maandenlang fout — op v2.20.1, terwijl
> v2.20.2, v2.21.0 en vijf PR's al live waren. De markering is vervallen: de bovenste uitgebrachte
> versie draait per definitie al.

## [Unreleased]

### DEPLOY: `docs/plugin-4-22-en-scriptpaden-v1` · 20260828-211330

Plugin 4.22.0 hernoemde het branch-eigen document van `development-cycle.md` naar `development.md`, en
de gedeelde scripts schrijven sindsdien alleen die nieuwe naam. Deze branch laat de repo-documentatie dat
volgen: 25 verwijzingen in `../CLAUDE.md`, `CONTRIBUTING.md`, de `fold-changelog`-skill, beide
README's en een comment in `../scripts/repo-config.ps1`, plus de drie ankers naar stap 3, die met de
hernoemde kop meeschoven. De zes voorkomens in `releases/` en `CHANGELOG.md` blijven staan -- dat is
historie, en een record wordt niet herschreven.

Twee dingen die geen zoek-vervang zijn. **De PR-template kreeg de canonieke placeholder** in plaats van
een vervangen pad: `open-pr` matcht die regel als hele regel tegen een vaste lijst, en de plain-body
variant bestaat voor `development.md` niet -- een plat zoek-vervang had de regel dus buiten de lijst
geduwd en elke PR-body stil leeg gelaten, precies faalmodus #573. De nieuwe regel is getoetst tegen
`Get-PrTemplateCanonicalPlaceholder` en is er byte-identiek aan. Daarmee wordt de bewering in stap 4 van
`CONTRIBUTING.md` -- dat de template de canonieke placeholder draagt -- ook voor het eerst waar; tot nu toe
droeg hij een variant die alleen *geaccepteerd* was. **En het versieblok in `../CLAUDE.md`** noemt nu
4.22.0 in plaats van 4.20.0, met de update-route erbij: vanuit de consumer en met `--scope project`, want
de default van `claude plugin update` is `--scope user` en die zet een tweede record naast het bestaande.

Drie correcties die bij het nalopen bovenkwamen. `../CLAUDE.md` noemde `workflow-davekjohn/4.18.0` een
niet-opgeruimd restant; nagemeten is dat het *actieve* install-record van de bron-repo. Twee scriptpaden
in de `new-branch`-bullet werden als repo-paden gepresenteerd terwijl ze in de plugin wonen -- wie ze hier
in `scripts/` zocht, vond niets. En `../README.md` beschreef een root-`releases/` die sinds 2026-08-27
niet meer bestaat.

**Score:** 3

#### What makes this deploy extra special

N/A. Dit raakt geen enkele pagina op `djcylow.com` en geen enkel proces dat de opdrachtgever ziet: het is
interne workflow-documentatie plus een PR-template. De build levert dezelfde pagina's.

**Score:** N/A

#### Pull Request

De repo-docs volgen plugin 4.22.0: het branch-document heet development.md

[PR #166](https://github.com/DaveKJohn/djcylow-react/pull/166)

---

### DEPLOY: `docs/github-body-is-gegenereerd-v1` · 20260827-151641

De Release Workflow droeg op om een document te schrijven dat het script zelf al had neergezet. Wie stap 5
volgde deed dubbel werk of overschreef de `## What landed`-lijst -- en die is na de cut niet meer te
reconstrueren, want `CHANGELOG.md` is dan geleegd. De aankondiging in `github/` staat nu op alle vijf de
plekken als gegenereerd, met de reden waarom het niet later kan, en stap 5 is omgekeerd naar nalezen voor
de publicatie: het enige moment waarop iemand die body ziet voordat hij publiek is. Onderweg bleek de
kostenraming onder de v2.24.0-tabel dezelfde fout te dragen -- vijf zesde van de tijd werd toegeschreven
aan "stap 4 en 5", terwijl stap 5 in die run nul seconden kostte.

**Score:** 3

#### What makes this deploy extra special

N/A -- dit is de interne routebeschrijving van een release. De opdrachtgever leest de release-documenten,
niet de instructie waarmee ze worden gemaakt, en aan die documenten verandert niets.

**Score:** N/A

#### Pull Request

CLAUDE.md noemt het github/-aankondigingsdocument gegenereerd in plaats van handwerk

[PR #165](https://github.com/DaveKJohn/djcylow-react/pull/165)

---

### DEPLOY: `docs/derde-directe-main-uitzondering-v1` · 20260827-150513

De grondwet kent de derde directe-`main`-uitzondering nu wél: het committen van het handgeschreven
release-document tijdens een cut, mét de begrenzing die hem veilig maakt. Wie een cut draait leest zijn
eigen twee commits niet meer als een overtreding, en wie er een inplant leest een kostenraming die op
de laatste run is gemeten in plaats van op de vorige: 5m 15s bij v2.25.0 tegen 35m 40s bij v2.24.0,
met de PR-leg die dat verschil structureel maakt. De v2.24.0-tabel blijft staan als het record van die
run — er is niets vervangen, er is een meting naast gezet.

**Score:** 4

#### What makes this deploy extra special

Raakt de website, de levering of de opdrachtgever niet: dit is de interne werkwijze van de repo.

**Score:** N/A

#### Pull Request

CLAUDE.md kent de derde directe-main-uitzondering en de gemeten kosten van v2.25.0

[PR #164](https://github.com/DaveKJohn/djcylow-react/pull/164)

---

