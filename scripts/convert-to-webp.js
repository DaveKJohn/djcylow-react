// Converteert alle .jpg in public/images/ naar .webp.
//
// Usage: node scripts/convert-to-webp.js            (preview -- verandert niets)
//        node scripts/convert-to-webp.js --apply    (converteert en verwijdert de originelen)
//
// Opties:
//   --apply        voer de conversie werkelijk uit
//   --force        overschrijf een bestaande .webp (anders wordt die overgeslagen)
//   --keep         verwijder het .jpg-origineel niet
//   --dry-run      geaccepteerd en genegeerd; preview is sinds 2026-08-15 de default
//
// WAAROM PREVIEW DE DEFAULT IS
// ----------------------------
// CLAUDE.md noemt "bestanden verwijderen uit public/images/" onder *Nooit zonder expliciete
// toestemming van Dave*, omdat een pad in de mix-JSON stil breekt als een bestand verdwijnt. Dit
// script deed precies dat: het liep recursief door public/images/, converteerde, en unlinkte het
// origineel -- zonder bevestiging, en zonder dat --dry-run de default was. Omdat `npm run *` als
// prefixregel op de allowlist stond, kon dat zelfs zonder permissieprompt draaien. De safety-rule
// bestond dus in proza en nergens in de machinerie.
//
// Nu moet het verwijderen expliciet gevraagd worden met --apply. Dat is de bevestiging: wie het
// per ongeluk aanroept krijgt een lijst te zien en verliest niets.

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const APPLY = process.argv.includes('--apply');
const FORCE = process.argv.includes('--force');
const KEEP = process.argv.includes('--keep');
const IMAGE_DIR = path.join(__dirname, '..', 'public', 'images');

function findJpgs(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findJpgs(full));
    } else if (entry.isFile() && /\.jpe?g$/i.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

async function main() {
  if (!fs.existsSync(IMAGE_DIR)) {
    console.error(`Map niet gevonden: ${IMAGE_DIR}`);
    process.exitCode = 1;
    return;
  }

  const jpgs = findJpgs(IMAGE_DIR);

  if (jpgs.length === 0) {
    console.log('Geen .jpg bestanden gevonden.');
    return;
  }

  console.log(`${APPLY ? '' : '[PREVIEW] '}${jpgs.length} .jpg bestand(en) gevonden.\n`);

  let converted = 0;
  let failed = 0;
  let skipped = 0;

  for (const jpgPath of jpgs) {
    const webpPath = jpgPath.replace(/\.jpe?g$/i, '.webp');
    const rel = path.relative(IMAGE_DIR, jpgPath);
    const bestaatAl = fs.existsSync(webpPath);

    // Een bestaande .webp werd stil overschreven en het origineel daarna verwijderd -- twee
    // bestanden weg voor de prijs van een naamconflict. Nu is dat een bewuste keuze (--force).
    if (bestaatAl && !FORCE) {
      console.log(`  overgeslagen (webp bestaat al): ${rel}`);
      skipped++;
      continue;
    }

    if (!APPLY) {
      console.log(`  ${rel}  ->  ${path.basename(webpPath)}${KEEP ? '' : '  (jpg wordt verwijderd)'}`);
      continue;
    }

    try {
      await sharp(jpgPath).webp({ quality: 85 }).toFile(webpPath);
      if (!KEEP) fs.unlinkSync(jpgPath);
      console.log(`OK ${rel}`);
      converted++;
    } catch (err) {
      console.error(`XX ${rel}: ${err.message}`);
      failed++;
    }
  }

  if (!APPLY) {
    console.log(`\nEr is niets gewijzigd. Draai opnieuw met --apply om dit uit te voeren.`);
    if (skipped) console.log(`${skipped} overgeslagen omdat de .webp al bestaat; --force overschrijft die.`);
    return;
  }

  console.log(`\nKlaar: ${converted} geconverteerd, ${failed} mislukt, ${skipped} overgeslagen.`);

  // De exitcode volgde het resultaat niet: het script gaf 0 terwijl elke conversie faalde. Als dit
  // ooit in een poort belandt, is dat een poort die niets tegenhoudt.
  if (failed > 0) process.exitCode = 1;
}

// main() liep zonder .catch(): een afwijzing buiten de try werd een unhandled rejection, wat in
// oudere Node stil was en in nieuwe Node een exitcode geeft die niemand kan verklaren.
main().catch((err) => {
  console.error(`Onverwachte fout: ${err.stack || err.message}`);
  process.exitCode = 1;
});
