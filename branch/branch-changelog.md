## `chore/npm-audit-ronde` changelog

### Branch title

De acht kwetsbaarheden uit npm audit zijn weg, inclusief die in Next zelf

### Branch ID

20260815-214204

### Branch type

chore

### What does the change on this branch bring to main?

`npm audit` meldde acht kwetsbaarheden: zeven high (`brace-expansion`, `immutable`, `js-yaml`,
`next`, `nodemailer`, `postcss`, `sharp`) en één low (`@babel/core`). Na deze branch zijn het er
**nul** (issue #94).

Zeven ervan gingen weg met `npm audit fix` — een wijziging in `package-lock.json` en verder niets.
Next zelf schoof daarbij van 16.2.4 naar 16.3.1.

**Nodemailer was de enige die een major vroeg** (8 → 9), en dat is de beslissing in deze branch. Er
zijn twee vragen beantwoord voordat hij is genomen.

**Waren we kwetsbaar?** Nee. De CVE gaat over de `raw`-optie, die `disableFileAccess` en
`disableUrlAccess` omzeilt en zo willekeurige bestanden leesbaar maakt. `netlify/functions/send-email.js`
gebruikt `raw` niet, gebruikt geen `attachments` en geen `path`, en bouwt zijn `mailOptions` volledig
hardcoded op — de gebruikersinvoer landt uitsluitend als string in `text`, `html`, `replyTo` en
`subject`. Een aanvaller kan er dus geen `raw` in krijgen. De upgrade is daarmee hygiëne en geen
reparatie, en dat is precies waarom hij hier kon zonder haast.

**Is de major veilig?** Gemeten, niet aangenomen. `engines` staat op `>=6.0.0` en deze functie
gebruikt nodemailer op de meest basale manier die er is: `createTransport` plus één `sendMail`. De
testsuite bewijst dat níét — die mockt `createTransport` en zou een kapotte nodemailer niet zien.
Daarom is er los een smoke-test tegen de echte 9.0.5 gedraaid met `jsonTransport`, met exact onze
`mailOptions`: `from`, `to`, `replyTo`, `subject`, `text` en `html` komen alle zes correct opgebouwd
terug.

**En de Next-minor is op de output getoetst.** Voor en na de upgrade is de hele statische export
gehasht — alle 86 HTML-bestanden, met de scripts en de asset-hashes eruit gestript. Ze zijn
**identiek**. De poort staat groen op 0 errors, 0 warnings en 89 pagina's, en 207 tests slagen.

### Significance

#### Tier 0

`npm audit` is alleen bruikbaar als de teller op 0 staat: in een lijst van acht bekende meldingen valt
een nieuwe negende niet op. Dat is dezelfde reden waarom de ESLint-teller op 0/0 staat, en hij gold
tot nu toe niet voor de dependencies.

**Score:** 3

#### Tier 1

Voor een bezoeker verandert er niets — de gerenderde site is aantoonbaar identiek. Wat het waard is,
is dat het contactformulier op een nodemailer draait waar geen openstaande high meer op zit.

**Score:** 1

### Pull Request

