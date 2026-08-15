## `data/audio-mismatch` progress

### Steps

- [x] Het naampatroon afgeleid uit de 77 bestaande `audioSrc`-waarden
- [x] Kandidaten getoetst met HEAD-requests tegen beide R2-buckets — beide gevonden
- [x] Geverifieerd dat de lengte bij de tracklist past (1.40 en 1.42 MB/min, band 1.28–1.47)
- [x] `20210412` in `full-purple.json` gecorrigeerd
- [x] `20210329` in `light-purple.json` gecorrigeerd, zonder de entry te raken die dezelfde URL
      terecht droeg
- [x] Test toegevoegd: `audioSrc` uniek per live mix
- [x] Bewezen dat die test blokkeert, met een opzettelijk duplicaat; tree daarna hersteld
- [x] JSON geldig, 72 tests groen

### Where I left off

Klaar voor PR, maar **dit is site-werk en wacht op Dave**. Te controleren op de deploy preview:
open de twee mixpagina's en luister of het geluid bij de tracklist past.

- `/luister/mix/purple-full-f-edm-176bpm-20210412`
- `/luister/mix/purple-light-f-edm-dnb-20210329`

De eerste hoort Liquid Drum & Bass op 176 BPM te zijn en niet de Blue-mix; de tweede idem en niet
een Progressive House-set op 128 BPM.

Wat dit issue blootlegde en openblijft: de objectnamen op R2 volgen geen reproduceerbare conventie
(`V1`/`V2`/`V3`/`V4` en `v1` door elkaar, `Vol 1` zonder punt, een spatie waar een underscore
hoort). Daardoor is zo'n naam niet af te leiden maar alleen op te zoeken. `mix:add` waarschuwt daar
sinds `fix/mix-add-schema` voor met een HEAD-check, maar de namen zelf zijn niet opgeschoond.
