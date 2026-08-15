## `style/dode-componenten-weg` changelog

### Branch title

De vijf slapende componenten en hun stylesheets zijn opgeruimd

### Branch ID

20260815-212111

### Branch type

style

De vijf componenten die nergens gerenderd werden zijn weg: `Diensten`, `MeetTheDJ`, `Verzoeknummers`,
`Referenties` en `GoogleReviews`, samen met hun drie stylesheets en `src/content/referenties.ts`. In
`page.tsx` stonden twee ervan uitgecommentarieerd, en zulke regels lezen als "staat klaar om aan te
zetten" — terwijl de referentiedata uit vier plaatsvullers bestond die één uncomment verwijderd waren
van publicatie op een boekingssite.

**Dat maakt ook `react-google-reviews` los**, de dependency die in PR #114 nog moest blijven omdat
`GoogleReviews.tsx` er als enige naar verwees. `dependencies` telt nu zes pakketten, en alle zes
worden gebruikt.

**De teksten in `src/content/home.ts` blijven wél staan**, en dat is bewust een ander oordeel dan bij
de code. De velden die alleen die componenten lazen — `intro_story_*`, `verzoeknummers_story_*`, de
vier `*_h3`-koppen — zijn geschreven tekst: een bio, een uitleg over verzoeknummers. Code die niets
doet is schuld; een alinea die nog nergens staat is voorraad. Er staat nu bovenaan dat bestand welke
velden gerenderd worden en welke klaarliggen.

**De test die deze slapers bewaakte is omgedraaid in plaats van weggegooid.** Hij controleerde of hun
imports ergens naartoe wezen; nu controleert hij of **elke** component in `src/components/home/` ook
daadwerkelijk gerenderd wordt — dus of er geen nieuwe slapers ontstaan. Dat is dezelfde regel die de
vijf destijds had gevangen, alleen een stap eerder. Plus een test dat er geen uitgecommentarieerde
JSX-secties achterblijven.

**Twee bestaande tests moesten mee, en één daarvan is er beter van geworden.** De alt-tekst-test las
een vaste lijst bestanden waaronder `Verzoeknummers.tsx`; die viel na het verwijderen op een
ontbrekend bestand in plaats van op een slechte alt-tekst. Hij loopt nu over de hele boom en dekt
daarmee ook nieuwe componenten.

### Significance

#### Tier 0

Negen bestanden en een dependency minder, en de regel die slapers vangt staat nu vóór ze ontstaan in
plaats van erna. Wat weg is staat in de git-historie; wat blijft is tekst, geen code.

**Score:** 3

#### Tier 1

De site levert exact dezelfde pagina's — 89, ongewijzigd. Het risico dat verdwijnt is dat iemand met
één uncomment vier verzonnen klantcitaten publiceert.

**Score:** 2

### Pull Request

