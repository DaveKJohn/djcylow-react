## `fix/honeypot-wordt-uitgelezen` changelog

### Branch title

De honeypot van het contactformulier vangt eindelijk iets

### Branch ID

20260815-203842

### Branch type

fix

### What does the change on this branch bring to main?

Het contactformulier zette een honeypot neer — een veld dat met CSS verborgen is, zodat een mens het
leeg laat en een bot het invult — maar `send-email.js` las dat veld **nooit** uit. De val stond er
dus wel en ving niets.

Dat is dezelfde vorm die deze repo vandaag al twee keer heeft gevonden: `EmailDisplay` bestond
terwijl het adres er in platte tekst naast stond, en `cta-hover-effect` bestond terwijl het hover-
effect nergens werd aangeroepen. Het onderdeel is er, de aansluiting ontbreekt, en niets wordt rood.

**Het antwoord is bewust een 200 en geen fout.** Een bot die een foutmelding krijgt, weet dat de val
bestaat en laat het veld de volgende keer leeg; een bot die "verzonden" leest, probeert het niet nog
eens. Er wordt niets verstuurd — de functie stopt daar.

**De check staat vóór álle andere validatie**, en dat is een tweede keuze: zo krijgt een bot ook geen
`vul het volgende in`-antwoord terug, waaruit hij zou kunnen afleiden welke velden er zijn. Hij kost
bovendien geen call naar Google meer.

**Vijf tests**, waarvan er drie het gedrag rond de randen vastleggen: een leeg veld moet gewoon
doorgaan (het formulier stuurt het altijd mee), een veld met alleen spaties ook, en een ingevuld veld
mag zelfs zonder reCAPTCHA-token nog een 200 geven. Negatief getoetst door de conditie uit te
schakelen: twee tests vielen om.

Het veld wordt rechtstreeks gelezen en niet via `leesVeld`, want die toetst op `MAX_LENGTE[naam]` en
die bestaat voor dit veld niet — dan zou de vergelijking tegen `undefined` lopen.

### Significance

#### Tier 0

Een beveiliging die er wel stond maar niets deed, doet nu wat hij belooft. Met tests eromheen, want
dit is precies het soort aansluiting dat stil weer kan verdwijnen.

**Score:** 3

#### Tier 1

Het contactformulier is het enige conversiepad van de site, en de tweede laag botbescherming
functioneerde niet. reCAPTCHA deed zijn werk al wel, dus dit is een verbetering en geen gat dat
openstond.

**Score:** 3

### Pull Request

