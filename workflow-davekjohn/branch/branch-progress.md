## `docs/contributing-twee-lagen` progress

### Steps

#### PLAN

- [x] Gemeten wat de bron werkelijk doet: twee lagen sinds `627f030` (14 aug), root 1,6 KB +
      map ~14 KB. life-hub heeft alleen de maplaag, djcylow alleen de root.
- [x] Dave's keuze opgehaald: het bron-model overnemen.

#### CREATE

- [x] `git mv CONTRIBUTING.md workflow-davekjohn/CONTRIBUTING.md` — inhoud ongewijzigd.
- [x] Alle 33 relatieve linkdoelen in die pagina een niveau verschoven (root-relatief →
      map-relatief), in drie fasen met een tijdelijke marker zodat `workflow-davekjohn/releases/`
      niet als `../releases/` eindigde.
- [x] Intro van de verhuisde pagina herschreven: hij ligt bovenop de root en wint bij conflict.
- [x] Nieuwe dunne root-`CONTRIBUTING.md` geschreven: de drie standaardregels, de deploy-waarschuwing,
      de doorverwijzing naar de pluginlaag.
- [x] `workflow-davekjohn/README.md`: de alinea *"There is no CONTRIBUTING.md in this folder,
      deliberately"* verwijderd, het bestand aan de tabel toegevoegd, "Two ways" → "One way".
- [x] Twaalf verwijzingen in `CLAUDE.md` bijgewerkt, plus een noot die de twee lagen uitlegt en de
      tabelregel omgedraaid.
- [x] `SPECIALISTS.md`, Chris' lens, de skills `open-pr` en `fold-changelog`, `README.md`,
      `branch-info.ps1`, `repo-config.ps1` (3 comments) en `add-mix.js` meegenomen.
- [~] `CLAUDE.md` regel 107 en de historische noot over 15 augustus niet aangeraakt — die eerste dekt
      beide pagina's al, de tweede beschrijft wat er tóen gepland was en is dus historie.

#### TEST

- [x] Link- en anker-checker geschreven en gedraaid over alle 106 markdown-bestanden: eerst 17
      meldingen, waarvan 1 false positive (een code-span als illustratie in `branch/README.md`) —
      checker daarop aangepast. Na de reparaties: 0 dode paden, 0 dode ankers.
- [x] De 14 dode `development/`-links in `workflow-davekjohn/releases/README.md` hersteld, en
      geverifieerd dat ze op regel 734-767 staan — ruim onder de verbatim-streep op 336, dus geen
      drift in het gespiegelde deel.
- [x] De ene wijziging bóven die streep (regel 262) nagelopen tegen de bron: die gebruikt zelf
      `../CONTRIBUTING.md` vanuit deze map, dus de wijziging volgt de bron in plaats van ervan af te
      wijken.
- [x] De poort (`scripts/lint/lint-web.ps1`) en de testsuite draaien via `open-pr`.

### Where I left off

Twee dingen die buiten deze branch vallen en niet vergeten mogen worden:

1. **Inbound-issue voor de bron.** `adopt-workflow-folder/SKILL.md` regel 52-54 zegt dat in de bron
   *"only its branch dossier lives in the folder there"*. Achterhaald: er staan nu ook
   `CONTRIBUTING.md`, `prompts/` en de halve `releases/`-boom in. Die zin staat ongewijzigd in de
   bron-checkout, dus hij komt niet vanzelf mee met de volgende release — en het is precies de zin
   die hier de indruk wekte dat de bron geen maplaag heeft.
2. **`workflow-davekjohn/releases/README.md` is uit de pas met de bron.** De verbatim-streep staat
   hier op regel 336 en in de bron op regel 21: de bron-pagina is sinds de kopie van 2026-08-13
   grondig herzien. Dat is een aparte vraag — opnieuw spiegelen of de spiegel-afspraak herzien — en
   hij is hier bewust niet beantwoord.
