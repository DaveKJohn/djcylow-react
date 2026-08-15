## Wat doet deze wijziging?
<!-- Filled from branch/branch-changelog.md. Opening a PR by hand? Paste that file's body here. -->

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
- [ ] Changelog entry-bestand aangemaakt en gevuld (`branch/branch-changelog.md`, met een score per tier)
- [ ] Geen zichtbare fouten in de browser console
- [ ] Mobiel/responsive getest (bij UI-wijzigingen)

## Screenshots
<!-- Voeg voor/na screenshots toe bij visuele wijzigingen -->

## Merge — welke helft van de PR-regel?
<!-- Eén van de twee aanvinken. De regel zelf staat in `CLAUDE.md`, onder "Nooit direct op `main`". -->
- [ ] **Zichtbaar resultaat** — raakt `src/`, `public/` of `src/data/mixes/`. Deze PR **wacht op @DaveKJohn**: mergen is hier deployen naar `djcylow.com`, en geen poort kan bewijzen dat iets er góéd uitziet.
- [ ] **Geen zichtbaar resultaat** — raakt dat niet. Deze PR **loopt door** tot en met de fold.
