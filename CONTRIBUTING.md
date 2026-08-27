# Bijdragen aan djcylow-react

Deze pagina is de **standaardwerkwijze** — wat in deze repo geldt vóór er een workflow-plugin bij komt
kijken, en waar een bijdrager op kan bouwen ook als hij verder niets weet van hoe hier gewerkt wordt:

1. **Nooit rechtstreeks committen op `main`.** Elke wijziging reist op een branch en bereikt `main`
   via een Pull Request. Er zijn precies twee genoemde uitzonderingen, en die staan in
   [de safety-rules](CLAUDE.md#nooit-direct-op-main--via-branch--pr).
2. **CI moet groen zijn vóór de merge.** De ruleset `main-ci-gate` op `main` vereist de status-check
   **`poort`** uit [`.github/workflows/ci.yml`](.github/workflows/ci.yml): `tsc --noEmit`, `eslint .`,
   de build en de testsuite. Een merge die daarvóór wordt geprobeerd komt terug als `BLOCKED`.
3. **Eén wijziging per branch**, beschreven in de PR, en de branch wordt na de merge verwijderd.

> **Een merge is hier een deploy.** `origin/main` ís de live site: Netlify bouwt en publiceert bij
> elke push naar `main`, en er is **geen staging**. Op het moment dat een PR gemerged wordt staat de
> wijziging binnen enkele minuten op `djcylow.com`. Elke PR krijgt wel een deploy preview op
> `deploy-preview-<nummer>--djcylow-react.netlify.app`, dus werk aan de site is vóór de merge te
> bekijken — doe dat ook, want geen enkele poort kan bewijzen dat een pagina er góéd uitziet.

## De laag erbovenop: de workflow-map

Deze repo draait de `contributing-davekjohn`-plugin (`workflow-davekjohn` tot 2026-08-27, toen de
plugin zijn eigen package hernoemde in v4.20.0/#886), en die plugin draagt zijn eigen contributiepagina:

📄 **[`contributing-davekjohn/CONTRIBUTING.md`](contributing-davekjohn/CONTRIBUTING.md)**

**Zolang de plugin geïnstalleerd is geldt die pagina bovenop deze — en waar de twee elkaar
tegenspreken wint de pagina van de plugin.** Hij vervangt de standaardwerkwijze hierboven niet; hij
breidt hem uit met de mechaniek die de plugin bezit (het branch-dossier, de changelog-entry die bij de
merge wordt gefold, het tier-model, de release-cyclus) en met de antwoorden van déze repo op de seams
van die workflow. Een lezer in een repo *zonder* de plugin stopt bij deze pagina; een lezer in een
repo *mét* de plugin leest beide en laat de pluginpagina elk conflict beslechten.

De gelaagdheid is bewust (Dave, 2026-08-16, overgenomen van de bron): deze pagina blijft betekenisvol
op de dag dat de plugin er niet is — een verse checkout, een repo die de workflow afbreekt, of een
bijdrager die niets heeft geïnstalleerd — terwijl alles wat de plugin bezit woont in de map die met
de plugin meereist.

## Waar de rest staat

| wat | waar |
|---|---|
| de grenzen: safety-rules, branch-discipline, de Release Workflow | [`CLAUDE.md`](CLAUDE.md) |
| wie welk soort werk oppakt | [`.claude/specialists/SPECIALISTS.md`](.claude/specialists/SPECIALISTS.md) |
| wat live is maar nog geen versienummer heeft | [`CHANGELOG.md`](contributing-davekjohn/CHANGELOG.md) |
| de uitgebrachte versies | [`contributing-davekjohn/releases/README.md`](contributing-davekjohn/releases/README.md) |
