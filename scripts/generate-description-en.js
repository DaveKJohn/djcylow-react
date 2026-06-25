#!/usr/bin/env node
/**
 * generate-description-en.js — Adds English (description_en) to all mix entries
 * ================================================================================
 * Usage: node scripts/generate-description-en.js [--dry-run]
 *
 * Generates description_en for every entry that:
 *   - is not ignored (ignore: false)
 *   - does not yet have a non-empty description_en field
 *
 * No API key required — descriptions are generated from a template using
 * genre, subgenre, power, and top artists from the tracklist.
 */

const fs   = require('fs');
const path = require('path');

const MIXES_DIR = path.join(__dirname, '..', 'src', 'data', 'mixes');
const DRY_RUN   = process.argv.includes('--dry-run');

const POWER_TEXT = {
  Full:  'explosive energy and full-force intensity',
  Light: 'smooth, easygoing vibes and warm grooves',
};

function getTopArtists(tracklist, limit = 4) {
  if (!Array.isArray(tracklist) || tracklist.length === 0) return '';
  const artists = tracklist.map(t => {
    const parts = (t.track || '').split(' - ')[0];
    return parts.split(/[&,]/)[0].trim();
  });
  const unique = [...new Set(artists)].filter(Boolean);
  return unique.slice(0, limit).join(', ');
}

function generateDescriptionEn(entry) {
  const label    = entry.subgenre || entry.genre || 'DJ';
  const power    = entry.power    || 'Full';
  const powerTxt = POWER_TEXT[power] || 'energetic vibes';
  const artists  = getTopArtists(entry.tracklist);

  let desc;
  if (artists) {
    desc = `${label} mix by DJ Cylow — ${powerTxt}. Featuring ${artists} and more.`;
  } else {
    desc = `${label} mix by DJ Cylow — ${powerTxt}. A non-stop set by DJ Cylow.`;
  }

  // Truncate to ~160 chars if needed (rare edge case)
  if (desc.length > 165) {
    desc = desc.slice(0, 162).trimEnd() + '...';
  }
  return desc;
}

const files = fs.readdirSync(MIXES_DIR).filter(f => f.endsWith('.json'));

let totalAdded   = 0;
let totalSkipped = 0;

for (const filename of files) {
  const filePath = path.join(MIXES_DIR, filename);
  const mixes    = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let changed    = false;

  for (const entry of mixes) {
    if (entry.ignore) {
      totalSkipped++;
      continue;
    }
    if (entry.description_en && entry.description_en.trim()) {
      totalSkipped++;
      continue;
    }

    const generated = generateDescriptionEn(entry);
    entry.description_en = generated;
    changed = true;
    totalAdded++;

    if (DRY_RUN) {
      console.log(`[${filename}] ${entry.id}`);
      console.log(`  → ${generated}`);
      console.log(`  (${generated.length} chars)`);
    }
  }

  if (changed && !DRY_RUN) {
    fs.writeFileSync(filePath, JSON.stringify(mixes, null, 2) + '\n', 'utf8');
    console.log(`✓ ${filename} — updated`);
  } else if (!changed) {
    console.log(`– ${filename} — no changes needed`);
  }
}

console.log(`\nDone. Added: ${totalAdded}, Skipped: ${totalSkipped}${DRY_RUN ? ' (DRY RUN — no files written)' : ''}`);
