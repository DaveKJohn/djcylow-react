## `docs/ruleset-strict-aan` changelog

### Branch title

De ruleset eist nu een PR die bij is met main

### Branch ID

20260815-193142

### Branch type

docs

### What does the change on this branch bring to main?

`strict_required_status_checks_policy` op de ruleset `main-ci-gate` staat sinds 2026-08-15 op `true`,
op Dave's verzoek. Deze branch legt dat vast in `CLAUDE.md`, want die beschreef nog de oude stand.

**Wat het oplost.** Met `false` konden twee PR's die los groen zijn na elkaar mergen zonder dat `poort`
de combinatie ooit had gezien. De klasse fout die dat oplevert — een import die na de eerste merge niet
meer bestaat, een route die dubbel raakt — is precies wat de build zou vangen als hij tegen de juiste
basis had gedraaid. In deze repo staat het resultaat daarvan binnen minuten live, want er is geen
staging.

**Wat het kost, en dat hoort erbij te staan.** Een PR moet nu bij zijn met `main` vóór de merge. Hier
schuift `main` bij élke fold op, dus een PR die even blijft liggen wordt "out of date" en vraagt een
`Update branch` vóór hij te mergen is. Bij een reeks wachtende branches is dat één update-ronde per
branch.

**Hoe de wijziging is gedaan.** Een `PUT` op de ruleset met de volledige definitie terug en daarin
exact één gewijzigd veld. Dat is geverifieerd door de opgehaalde ruleset vóór en ná te diffen: precies
één verschil, en `bypass_actors`, `enforcement`, de drie regeltypes en de required check `poort` zijn
alle vier ongemoeid. De backup van de oude definitie stond klaar vóór de call.

**Het eerste voorstel uit #91 is bewust niet uitgevoerd.** Dat vraagt een tweede ruleset zónder bypass
voor `deletion` en `non_fast_forward`, en die zou `cut-release`'s eigen push naar `main` blokkeren —
precies waarom die bypass er staat. De bewering die daarover onjuist was, is al gecorrigeerd in PR #115.

### Significance

#### Tier 0

De poort kan niet langer groen staan op een combinatie die hij nooit heeft gezien. Dat kost een
update-ronde per PR, en die afweging staat er nu bij zodat de volgende lezer weet waarom die stap er is.

**Score:** 3

#### Tier 1

Voorkomt een storing die de bezoeker zou merken — twee losse groene PR's die samen breken — maar er is
vandaag niets mis en de site verandert niet.

**Score:** 2

### Pull Request

