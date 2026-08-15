## `config/webp-veiligheid-en-ignore` progress

### Steps

- [x] `convert-to-webp.js`: preview als default, verwijderen achter `--apply` (#61)
- [x] Bestaande `.webp` wordt overgeslagen i.p.v. overschreven; `--force` doet het alsnog (#61)
- [x] Exitcode volgt het resultaat; `main()` heeft een `.catch()` (#61)
- [x] Alle vier gedragingen getoetst op een wegwerpbestand, inclusief exit 1 bij falen
- [x] `npm run images:webp:dry` vervangen door `images:webp:apply`
- [x] `ask`-regels voor de vier beschermde bestanden in `.claude/settings.json` (#62)
- [x] Refspec-vorm `git push origin +HEAD:main` toegevoegd aan de denylist (#63, deelfix)
- [x] `.claude/settings.local.json` in `.gitignore`, met verantwoording (#64)
- [x] `CLAUDE.md` bijgewerkt: hulpscript-tabel, workflowstap 3, en de safety-invulling
- [~] Allowlist snoeien (#63): bewust niet gedaan — zie hieronder
- [x] Lint-poort groen, 71 tests, testmap opgeruimd

### Where I left off

Klaar voor PR. Dit is machinerie en docs, dus het loopt door tot en met de fold — er verandert
niets aan `djcylow.com`.

**Eén ding blijft bewust open: #63, het snoeien van `.claude/settings.local.json`.** Dat bestand is
machine-lokaal en staat vanaf deze branch in `.gitignore`, dus zo'n wijziging zou in geen enkele
diff zichtbaar zijn terwijl hij wel verandert wat er dagelijks zonder prompt draait. Dat hoort niet
ongezien te gebeuren. Het issue blijft open met het volledige voorstel, en de volgordewaarschuwing
die daar staat geldt onverkort: de uitvoerregel voor de plugin-cache geeft `cut-release` vrije
doorgang naar `origin/main`, dus die mag er alleen bij als de push-regels tegelijk dichtgaan.

Let op bij het testen van de `ask`-regels: die gelden vanaf de volgende sessie. In deze sessie is de
wijziging wel geschreven maar nog niet actief.
