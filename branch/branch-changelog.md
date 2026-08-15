## `data/audio-mismatch` changelog

### Branch title

Twee mixen spelen weer hun eigen audio

### Branch ID

20260815-141837

### Branch type

data

### What does the change on this branch bring to main?

Twee live mixpagina's speelden de audio van een andere mix af. Titel, tracklist, beschrijving en
cover waren van de ene mix, het geluid van een andere — de bezoeker hoorde dus iets anders dan
waarop hij klikte, met een tracklist die niet meeliep.

| entry | speelde | speelt nu |
|---|---|---|
| `20210412` — Purple Full (f), 176 BPM | het **Blue Full**-bestand van 2024-04-08 | `Purple_Full_f_EDM_DNB_20210412_Audio_V1 (Vol. 1)` |
| `20210329` — Purple Light (f), 176 BPM | een **Progressive House 128 BPM**-bestand uit 2023 | `Purple_Light_f_EDM_DNB_20210329_Audio_V2 (Vol. 1)` |

**Het projectbord noemde dit geblokkeerd op informatie, en dat is het niet gebleken.** De juiste
objectnamen zijn niet afgeleid maar **opgezocht**: uit de 77 bestaande `audioSrc`-waarden volgt per
kleur en power een vaste vorm (`Purple_Full_f_..._V1`, `Purple_Light_f_..._V2`), en de kandidaten
daaruit zijn met een HEAD-request tegen R2 getoetst. Beide bestanden bestaan gewoon — het waren
copy-paste-fouten in de data, geen ontbrekende uploads. De ene staat op de legacy-bucket, de andere
op de actieve; dat is per bestand overgenomen zoals het werkelijk is en niet gelijkgetrokken (dat
is issue #68).

**En de naam alleen was niet genoeg bewijs**, want een naam die klopt kan nog steeds naar het
verkeerde object wijzen. De lengte is daarom tegen de tracklist gelegd: beide nieuwe bestanden
komen uit op **1.40 en 1.42 MB per minuut**, precies in de band van de elf andere purple-mixen
(1.28–1.47). De duur past dus bij de tracklist die op de pagina staat.

**Er ligt nu een wacht op**, zoals het issue voorstelde: `audioSrc` moet uniek zijn over alle
bestanden. Dat die poort echt sluit is niet aangenomen maar getoetst — met een opzettelijk
duplicaat in de tree gaf de suite een rode test met de naam erbij, waarna de tree is hersteld.
Beide oorspronkelijke fouten waren de **oudste** entry in hun bestand, wat past bij een copy-paste
die nooit is afgemaakt.

Sluit #45.

### Significance

#### Tier 0

De uniciteit van `audioSrc` is nu afgedwongen in plaats van verondersteld, en die poort is
aantoonbaar sluitend.

**Score:** 2

#### Tier 1

Twee van de 77 mixpagina's lieten de bezoeker iets anders horen dan waarop hij klikte. Op een site
die om het luisteren draait is dat het ergste wat een pagina kan doen zonder stuk te gaan.

**Score:** 4

### Pull Request

