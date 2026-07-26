### Build in de PR-poort, en het live-model in de docs gelijk aan de praktijk · Config · 2026-07-26

De documentatie beschreef `main` als integratiebranch waarop een merge niets live zet, met een
aparte live-push als publicatiemoment. **Dat was onjuist.** Netlify bouwt en publiceert bij elke push
naar `main`, en `gh pr merge` schrijft daar server-side rechtstreeks in — dus elke PR-merge is een
deploy. Dave heeft dat bevestigd, en het is verifieerbaar: PR #20 gaf `/luister` een eigen titel en
die staat sinds de merge in het browsertabblad.

## Waarom dit meer dan een tekstfout was

De poort vóór een PR draaide alleen `tsc --noEmit`. Er zat dus **niets** tussen een merge en de live
site dat de bouwbaarheid controleerde: code die typecheckt maar de build breekt, ging ongehinderd
naar `djcylow.com`. De gedocumenteerde bescherming (`npm run build` als "de enige controle vóór de
live-push") draaide bij het releasen, dus ná meerdere deploys.

Het beet vandaag ook echt één keer. PR #20 bevatte de SEO-titels en descriptions voor `/luister` en
`/musicmoodcolours`. Die zijn volgens de eigen regel een beslissing van Dave, en dat is ook zo
gemeld — maar ze stonden live op het moment van mergen, vóór zijn beoordeling. De poortwachter
bestond en is gerespecteerd; hij stond alleen op de verkeerde handeling.

## De poort (het echte risico)

`scripts/lint/lint-web.ps1` draait nu **`tsc --noEmit` én `npm run build`**. Kost ongeveer 6 seconden
extra en meldt het aantal gegenereerde pagina's mee, zodat een build die slaagt maar plots minder
pagina's oplevert ook opvalt.

Getest met een wegwerp-pagina die typecheckt maar omvalt tijdens het genereren: de poort blokkeert met
exitcode 1 en de melding "Error occurred prerendering page". Daarna verwijderd en opnieuw groen
bevonden. De stderr van de build wordt bewust **niet** met `2>&1` opgevangen: PowerShell 5.1 wikkelt
die dan in `NativeCommandError`-records, waardoor de echte buildfout onder ruis verdwijnt.

`-SkipBuild` is toegevoegd om lokaal te itereren zonder elke keer te wachten; de poort zelf hoort hem
niet te gebruiken en waarschuwt als hij gezet is.

## De docs gelijkgetrokken

- **`CLAUDE.md`** — de safety-rule "een merge naar `main` zet niets live" is omgedraaid naar een
  blockquote die zegt dat mergen deployen is, met de historische aantekening waarom het eerst anders
  stond. Ook bijgewerkt: het `origin/main`-punt (dat gaat in de praktijk alleen nog over de
  fold-commit), de safety-invulling, de poortbeschrijving, de contenttabel, en stap 3, 7 en 11 van de
  Release Workflow. Stap 11 zet niets nieuws live; hij brengt de release-documentatie en de tag naar
  `origin`.
- **`CHANGELOG.md`** — de intro zegt nu dat `origin/main` de live site is en dat alles onder
  `## Pull Requests` al draait maar nog geen versienummer heeft.
- **`releases/README.md`** — "één release = één deployment" is vervangen door "een versienummer op wat
  al live staat". Opvallend: regel 3 van dat bestand had het model altijd al correct.

## De `← LIVE`-markering is vervallen

Die zou aanwijzen welke versie draait. Onder het werkelijke model onderscheidt dat niets — de bovenste
uitgebrachte versie draait per definitie al. En hij stond fout: op v2.20.1 van 2 juli, terwijl
v2.20.2, v2.21.0 en vijf PR's van vandaag allemaal live waren. Ook de twee blockquotes die v2.20.2 en
v2.21.0 als "gecut, nog niet live" aanmerkten zijn weg, want dat waren ze niet.

Dat draait een keuze terug die in PR #18 nog bewust is gemaakt: de markering blijven gebruiken omdat
deze repo drie toestanden zou kennen (gemergd, gecut, live). Die derde toestand bestaat niet — er zijn
er twee: live, en live met een versienummer. De entry van #18 blijft staan zoals hij is; samen met deze
laat hij zien hoe de correctie is verlopen.

## De les

Twee keer op één dag dezelfde soort fout: een document dat iets beweert wat de code of de
infrastructuur niet doet. Bij v2.21.0 ging het over een veld dat niet gerenderd werd, hier over een
deploy die al gebeurd was. **Verifieer een bewering over gedrag aan het gedrag zelf** — bij een deploy
betekent dat: kijk op de site.