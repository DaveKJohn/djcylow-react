## `chore/npm-audit-ronde` progress

### Steps

- [x] `npm audit` uitlezen: acht meldingen, per stuk kijken of er een non-breaking fix is
- [x] `npm audit fix` — zeven weg, alleen `package-lock.json` geraakt
- [x] Meten of we op de nodemailer-CVE kwetsbaar wáren (`raw`/`attachments`/`path` in de functie)
- [x] Nodemailer 8 → 9, en de major toetsen met een echte smoke-test via `jsonTransport`
- [x] De Next-minor toetsen: alle 86 HTML-bestanden voor en na gehasht
- [x] Poort en testsuite

### Where I left off

`npm audit` staat op 0/0/0/0. Poort groen, 207 tests groen.

Wat na de merge nog kan: `npm audit` periodiek terug laten komen. Hij staat nu niet in de poort en
ook niet in CI — bewust niet, want een nieuwe advisory op een ongewijzigde tree zou dan een PR
blokkeren die er niets mee te maken heeft. Een eigen wekelijkse workflow is de betere plek; dat is
werk voor een aparte branch.
