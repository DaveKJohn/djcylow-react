#!/usr/bin/env node
/**
 * Controleert of elke `audioSrc` in `src/data/mixes/` daadwerkelijk bereikbaar is.
 *
 * WAAROM DIT EEN LOS SCRIPT IS EN GEEN TEST. De testsuite in `tests/` draait in de poort en in CI,
 * en die moeten offline en snel zijn. Deze controle doet 85 netwerkverzoeken naar een bucket die
 * buiten deze repo valt: als R2 traag is of even hikt, faalt daarmee een PR die niets met audio te
 * maken heeft. Een poort die om een externe oorzaak rood staat, wordt genegeerd -- en dan bewaakt
 * hij niets meer.
 *
 * Dus is dit een handmatige controle. Draai hem als je de mix-data aanraakt, en na het opruimen of
 * verplaatsen van bestanden op R2.
 *
 *   node scripts/check-audio.js
 *
 * Exitcode 1 zodra er iets niet bereikbaar is, zodat je hem in een keten kunt hangen.
 *
 * AANLEIDING (2026-08-15): `Green Full (m) Vol. 2` gaf 404. Het bestand bestond wel, maar heette op
 * de bucket `_f_` waar de data `_m_` zei. Dat is precies de klasse fout die niemand opmerkt -- de
 * pagina bouwt, de link staat er, en pas wie op play drukt merkt het. Gevonden bij het meten van
 * iets anders, wat de reden is dat die meting nu een commando heeft.
 */

const fs = require('fs');
const path = require('path');

const MIX_DIR = path.join(__dirname, '..', 'src', 'data', 'mixes');
const GELIJKTIJDIG = 10;

function verzamel() {
    const uit = [];
    for (const bestand of fs.readdirSync(MIX_DIR).filter((f) => f.endsWith('.json'))) {
        const entries = JSON.parse(fs.readFileSync(path.join(MIX_DIR, bestand), 'utf8'));
        for (const mix of entries) {
            if (mix.audioSrc) {
                uit.push({ bestand, id: mix.id, ignore: !!mix.ignore, url: mix.audioSrc });
            }
        }
    }
    return uit;
}

async function main() {
    const alle = verzamel();
    console.log(`${alle.length} audioSrc-velden gevonden (${alle.filter((a) => a.ignore).length} met "ignore": true).`);

    const kapot = [];
    for (let i = 0; i < alle.length; i += GELIJKTIJDIG) {
        const groep = alle.slice(i, i + GELIJKTIJDIG);
        const statussen = await Promise.all(
            groep.map((e) => fetch(e.url, { method: 'HEAD' }).then((r) => r.status).catch(() => 0))
        );
        statussen.forEach((status, j) => {
            if (status !== 200) kapot.push({ ...groep[j], status });
        });
        process.stdout.write('.');
    }
    process.stdout.write('\n');

    if (kapot.length === 0) {
        console.log('Alles bereikbaar.');
        return;
    }

    console.log(`\n${kapot.length} niet bereikbaar:`);
    for (const k of kapot) {
        // Status 0 betekent dat het verzoek zelf niet aankwam -- geen netwerk, DNS, of een timeout.
        // Dat zegt iets anders dan een 404 en hoort dus niet als "bestand weg" gelezen te worden.
        const uitleg = k.status === 0 ? 'verzoek mislukt (netwerk?)' : `HTTP ${k.status}`;
        console.log(`  ${uitleg}  ${k.bestand}  id=${k.id}${k.ignore ? '  (ignore)' : ''}`);
        console.log(`    ${decodeURIComponent(k.url)}`);
    }
    process.exitCode = 1;
}

main();
