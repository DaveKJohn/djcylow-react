## Wat doet deze wijziging?
<!-- Filled from the DEPLOY section of contributing-davekjohn/development.md, heading and all. Opening a PR by hand? Paste that whole section here, starting at its '## DEPLOY:' line. -->

## Type wijziging
- [ ] Nieuwe feature/pagina (`feature/`)
- [ ] Bugfix (`fix/`)
- [ ] Mix data (`data/`)
- [ ] Content/tekst (`content/`)
- [ ] Styling/CSS (`style/`)
- [ ] Config/tooling (`config/`)
- [ ] Docs (`docs/`)
- [ ] Opruimwerk (`chore/`)

## Checklist
- [ ] `scripts/lint/lint-web.ps1` groen: **0 errors, 0 warnings** (dit is de poort — `npm run lint` is er maar één van de drie stappen; de typecheck en de build zitten alleen in dat script)
- [ ] `npm test` groen
- [ ] Lokaal getest via `npm run dev`
- [ ] Afbeeldingen aanwezig in `public/images/` (indien van toepassing)
- [ ] `### DEPLOY`-sectie van `contributing-davekjohn/development.md` gevuld (met een score per tier)
- [ ] Geen zichtbare fouten in de browser console
- [ ] Mobiel/responsive getest (bij UI-wijzigingen)

## Screenshots
<!-- Voeg voor/na screenshots toe bij visuele wijzigingen -->

## Merge — welke helft van de PR-regel?
<!-- Eén van de twee aanvinken. De regel zelf staat in `CLAUDE.md`, onder "Nooit direct op `main`". -->
- [ ] **Er valt iets aan de frontend te bekijken** — raakt `src/`, `public/` of `src/data/mixes/`. Deze PR **wacht op @DaveKJohn**: mergen is hier deployen naar `djcylow.com`, en geen poort kan bewijzen dat iets er góéd uitziet. De deploy preview hieronder maakt het kijken goedkoop.
- [ ] **Er valt niets te bekijken** — raakt dat niet. Deze PR **loopt door** tot en met de fold en de push.
