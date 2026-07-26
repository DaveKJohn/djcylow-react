### CHANGELOG en de workflow-docs op de gedeelde Pull Requests/Releases-structuur · Docs · 2026-07-26

`CHANGELOG.md` gebruikte een eigen Keep-a-Changelog-variant met `## [Unreleased]` en een
metadata-blok van drie regels onder elke kop, terwijl `life-hub` en `davekjohns-workshop` allebei
`## Pull Requests` + `## Releases` gebruiken met de metadata in de kop. Die afwijking was niet
alleen cosmetisch: de gedeelde `fold-changelog`-skill zoekt hardcoded naar een
`## Pull Requests`-kop, dus die werkte hier niet en het vouwen ging met de hand.

**De structuur.** De kop is teruggebracht tot een korte intro die naar `workflow-CLAUDE.md` wijst;
de secties "Hoe dit werkt" en "Levenscyclus van een regel" zijn vervallen omdat het mechanisme daar
al beschreven staat. Daaronder `## Pull Requests` met de gemergde-maar-niet-uitgebrachte entries, en
`## Releases` met de 36 versieblokken, van `##` naar `###` gedegradeerd zodat ze onder hun sectie
hangen.

**De entries.** De drie openstaande entries zijn omgezet van een kop met een metadata-blok van drie
regels (`**Branch naam**`, `**Datum merge op main**`, `**Branch type**`) naar
`### #17 · Titel · Data · 2026-07-26` met een `[PR #17](...)`-regel onderaan. De teksten zijn
letterlijk overgenomen; alleen de koppen zijn herschreven.

**Wat bewust anders blijft dan bij de andere twee.** De `← LIVE`-markering blijft staan. Deze repo
is de enige met een live site zonder staging en kent daardoor drie toestanden waar de andere twee er
twee hebben: gemergd, gecut, en daadwerkelijk live. Die markering wijst aan welke uitgebrachte
versie op dit moment draait, en die informatie is hier niet weg te laten. De intro legt dat verschil
expliciet uit.

**Getest.** Het gedeelde `fold-changelog`-script is met `-RepoRoot` op een wegwerp-kopie van de
nieuwe `CHANGELOG.md` gedraaid: het vindt de kop, voegt de entry na de intro-alinea maar boven de
bestaande entries in, en ruimt het entry-bestand op. Het handmatige vouwen is daarmee verleden tijd.

**Meegenomen in de docs**, zodat beschrijving en praktijk niet opnieuw uit elkaar lopen: het
entry-formaat, de fold-stap, Release Workflow stap 5 t/m 7, de Scripts-lijst en de contenttabel — nu
allemaal in `CLAUDE.md` — plus `releases/README.md` (het release-note-formaat). De waarschuwing dat
`fold-changelog` hier niet werkt is vervallen. De historische release-notes onder
`releases/development/` zijn niet aangeraakt: die beschrijven de situatie van toen.

### De `workflow/`-map is opgeheven

In dezelfde beweging is `workflow/workflow-CLAUDE.md` opgegaan in `CLAUDE.md`, zodat deze repo net
als `life-hub` en `davekjohns-workshop` **één CLAUDE-bestand** heeft. De reden om te consolideren is
dezelfde als hierboven: twee documenten over dezelfde werkwijze lopen onvermijdelijk uit elkaar, en
de `@workflow/workflow-CLAUDE.md`-import maakte het onderscheid voor Claude toch al onzichtbaar.

`CLAUDE.md` volgt nu ook de kopindeling van die twee repo's: `## De Claude Specialists` →
`## Safety rules` → `## Algemene werkwijze` (met de ontwikkelworkflow stap 1 t/m 7) →
`## Eigen aan deze repo (djcylow-react)` met daarin taal, roster, structuur/conventies, de Release
Workflow, de scripts, de safety-invulling en het `hóé vs. wát`-slot. Alle regels uit beide bestanden
zijn overgenomen; geen enkele safety-regel is vervallen.

Twee verwijzingen naar het verdwenen pad zijn meegetrokken: de intro van `CHANGELOG.md` en de
kopcommentaar van `scripts/lib/branch-info.ps1`. Die laatste beweerde bovendien dat de
branch-taxonomie uit de git-historie was afgeleid — precies de fout waardoor `style/` er eerder in
ontbrak; dat is nu rechtgezet naar de tabel in `CLAUDE.md` als canonieke bron.