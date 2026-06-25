// Converts all .jpg files in public/images/ to .webp and deletes the originals.
// Usage: node scripts/convert-to-webp.js
// Options: --dry-run  (preview without making changes)

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');
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
  const jpgs = findJpgs(IMAGE_DIR);

  if (jpgs.length === 0) {
    console.log('Geen .jpg bestanden gevonden.');
    return;
  }

  console.log(`${DRY_RUN ? '[DRY RUN] ' : ''}${jpgs.length} .jpg bestanden gevonden.\n`);

  let converted = 0;
  let failed = 0;

  for (const jpgPath of jpgs) {
    const webpPath = jpgPath.replace(/\.jpe?g$/i, '.webp');
    const rel = path.relative(IMAGE_DIR, jpgPath);

    if (DRY_RUN) {
      console.log(`  ${rel}  →  ${path.basename(webpPath)}`);
      continue;
    }

    try {
      await sharp(jpgPath).webp({ quality: 85 }).toFile(webpPath);
      fs.unlinkSync(jpgPath);
      console.log(`✓ ${rel}`);
      converted++;
    } catch (err) {
      console.error(`✗ ${rel}: ${err.message}`);
      failed++;
    }
  }

  if (!DRY_RUN) {
    console.log(`\nKlaar: ${converted} geconverteerd, ${failed} mislukt.`);
  }
}

main();
