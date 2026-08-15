## `docs/readme-en-ruleset-kloppend` progress

### Steps

- [x] Alle zeven punten van #86 tegen de tree gecontroleerd in plaats van overgenomen. **Punt 3 bleek
      al gerepareerd**: de README noemt `tailwind.config` niet meer als bestaand pad, alleen nog in een
      historische noot over de verwijdering
- [x] De zes resterende punten gecorrigeerd: het bestandsaantal, de genre-indeling, de homepage-
      secties, het slugformaat, de `X-Frame-Options`-waarde en de ontbrekende Facebook-link
- [x] Bij de genre-correctie de herkomst van `EDM` erbij gezet — die waarde leeft nog in oudere
      `permalink`-bestandsnamen, dus zonder die uitleg lijkt de correctie zelf fout zodra iemand een
      permalink openslaat
- [x] Het slugformaat herschreven van "constructie" naar "afleiding", met de echte bewerking uit
      `mixSlug()` en een verwijzing naar de tests die het sinds PR #111 afdwingen
- [x] `X-Frame-Options` naar de config bewogen en niet andersom, mét de reden: `netlify.toml` is
      beschermd, en een live security-header aanscherpen is geen documentatiereparatie
- [x] De ruleset zelf opgehaald via de API (`gh api .../rulesets/20818953`) om #91 punt 1 te
      verifiëren: `bypass_mode: "always"` op RepositoryRole 4 en 5, drie regeltypes,
      `strict_required_status_checks_policy: false` — het issue klopt
- [x] De onjuiste bewering op alle **vier** de plekken gecorrigeerd: driemaal in `CLAUDE.md` en in
      `lenses/01-01-extension.md`. Die laatste weegt het zwaarst omdat hij automatisch meelaadt
- [~] #91 punt 1 als **settingswijziging** (een tweede ruleset zonder bypass) — niet gedaan. Het issue
      biedt twee wegen en dit is de goedkope, eerlijke: de bewering corrigeren. De andere weg raakt
      repo-settings en is Dave's beslissing
- [~] #91 punt 2 (`strict_required_status_checks_policy: true`) — settingswijziging, dus Dave's
      beslissing. Wel benoemd in `CLAUDE.md` zodat de afweging vindbaar is
- [~] De taalkwestie uit #86 (`README:505` zegt "the site is in Dutch", `CLAUDE.md` zegt Engels) —
      niet aangeraakt. Dat hangt aan #50, dat de SEO raakt en daarmee sowieso Dave's beslissing is;
      welke kant die valt, bepaalt wat hier moet staan

### Where I left off

Af. Raakt `README.md`, `CLAUDE.md` en de lens — geen site-werk, dus de keten loopt door tot en met de
fold.

Sluit **#86** volledig. **#91 blijft open** voor de twee settingswijzigingen, die allebei op Dave's
woord wachten; punt 1 is in documentatievorm wel afgehandeld.
