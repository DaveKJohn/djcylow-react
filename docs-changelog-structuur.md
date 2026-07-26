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

**Meegenomen in de docs**, zodat beschrijving en praktijk niet opnieuw uit elkaar lopen:
`workflow/workflow-CLAUDE.md` (entry-formaat in stap 3, de fold in stap 7, Release Workflow stap 5
t/m 7, de Scripts-lijst en Repo-hygiëne), `CLAUDE.md` (de contenttabel) en `releases/README.md` (het
release-note-formaat). De waarschuwing dat `fold-changelog` hier niet werkt is vervallen. De
historische release-notes onder `releases/development/` zijn niet aangeraakt: die beschrijven de
situatie van toen.