#!/usr/bin/env node
// Voeg een nieuwe mix toe aan het juiste JSON bestand.
// Gebruik: node scripts/add-mix.js

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const R2_BASE = 'https://pub-4fa4c2c1f9a644c4878cba29a7926443.r2.dev/';
const MIXES_DIR = path.join(__dirname, '..', 'src', 'data', 'mixes');
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const COLORS = ['Blue', 'Cyan', 'Green', 'Orange', 'Purple', 'Red', 'Yellow', 'Magenta'];
const POWERS = ['Full', 'Light'];
const FREQS = ['(f)', '(m)'];
const GENRES = ['EDM', 'Drum & Bass'];

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(resolve => rl.question(q, resolve));

function jsonFile(power, color) {
  return path.join(MIXES_DIR, `${power.toLowerCase()}-${color.toLowerCase()}.json`);
}

function readMixes(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function nextVolume(mixes, frequency) {
  const nums = mixes
    .filter(m => m.frequency === frequency && !m.ignore)
    .map(m => parseInt((m.volume || '').replace('Vol. ', '')) || 0)
    .filter(n => n > 0);
  return nums.length ? Math.max(...nums) + 1 : 1;
}

function parseDate(dateStr) {
  const [year, month, day] = dateStr.split('-');
  return { year, month: MONTHS[parseInt(month, 10) - 1], day };
}

function buildTitle(subgenre, color, power, freq, vol) {
  return `${subgenre} · ${color} ${power} ${freq} Mix · Vol. ${vol}`;
}

function buildImagePaths(power, color, dateCompact) {
  const p = power.toLowerCase();
  const c = color.toLowerCase();
  const base = `/images/${p}/${c}`;
  return {
    wide_small: `${base}/wide/image_${p}_${c}_${dateCompact}_wide-small.webp`,
    wide_large: `${base}/wide/image_${p}_${c}_${dateCompact}_wide-large.webp`,
    square:     `${base}/square/image_${p}_${c}_${dateCompact}_square.webp`,
  };
}

function buildAudioSrc(color, power, freq, genre, bpm, dateCompact, vol) {
  const freqClean = freq.replace(/[()]/g, '');
  const genreSlug = genre === 'Drum & Bass' ? 'DnB' : genre;
  const filename = `${color}_${power}_${freqClean}_${genreSlug}_${bpm}BPM_${dateCompact}_Audio_V1%20(Vol.%20${vol}).mp3`;
  return `${R2_BASE}${color.toLowerCase()}/${filename}`;
}

function buildPermalink(color, power, freq, genre, bpm, dateCompact) {
  const freqClean = freq.replace(/[()]/g, '');
  const genreSlug = genre === 'Drum & Bass' ? 'DnB' : genre;
  return `luister/mix/${color.toLowerCase()}-${power.toLowerCase()}-${freqClean}-${genreSlug}-${bpm}BPM-${dateCompact}.html`;
}

async function pickFromList(prompt, options) {
  console.log(`\n${prompt}`);
  options.forEach((o, i) => console.log(`  ${i + 1}. ${o}`));
  while (true) {
    const input = await ask(`Keuze (1-${options.length}): `);
    const n = parseInt(input, 10);
    if (n >= 1 && n <= options.length) return options[n - 1];
    console.log('Ongeldige keuze, probeer opnieuw.');
  }
}

async function askTracklist() {
  const tracks = [];
  console.log('\nTracklist invoeren (leeg laten om te stoppen):');
  while (true) {
    const time = await ask(`  Track ${tracks.length + 1} tijd (HH:MM:SS): `);
    if (!time.trim()) break;
    const track = await ask(`  Track ${tracks.length + 1} naam (Artiest - Titel): `);
    if (!track.trim()) break;
    tracks.push({ time: time.trim(), track: track.trim() });
  }
  return tracks;
}

async function main() {
  console.log('\n=== Nieuwe mix toevoegen ===\n');

  // Kies kleur en power
  const color = await pickFromList('Kleur:', COLORS);
  const power = await pickFromList('Power:', POWERS);

  // Controleer of het bestand bestaat
  const file = jsonFile(power, color);
  if (!fs.existsSync(file)) {
    console.error(`\nBestand niet gevonden: ${file}`);
    rl.close();
    process.exit(1);
  }
  const mixes = readMixes(file);

  const freq = await pickFromList('Frequentie:', FREQS);
  const genre = await pickFromList('Genre:', GENRES);

  // Datum
  let dateStr;
  while (true) {
    dateStr = (await ask('\nDatum (YYYY-MM-DD): ')).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) break;
    console.log('Gebruik het formaat YYYY-MM-DD');
  }
  const dateCompact = dateStr.replace(/-/g, '');
  const { year, month, day } = parseDate(dateStr);

  // Controleer uniek id
  if (mixes.some(m => m.id === dateCompact)) {
    console.error(`\nId ${dateCompact} bestaat al in ${path.basename(file)}. Kies een andere datum.`);
    rl.close();
    process.exit(1);
  }

  // Subgenre
  const subgenre = (await ask('\nSubgenre (bijv. Tech House, Progressive House, Neurofunk): ')).trim();

  // BPM
  const bpm = (await ask('BPM (bijv. 128): ')).trim();

  // Volume — auto-suggest
  const suggestedVol = nextVolume(mixes, freq);
  const volInput = (await ask(`Volume (Enter = Vol. ${suggestedVol}): `)).trim();
  const volNum = volInput ? parseInt(volInput.replace(/\D/g, ''), 10) : suggestedVol;
  const volume = `Vol. ${volNum}`;

  // Beschrijving
  let description;
  while (true) {
    description = (await ask('\nBeschrijving (120-160 tekens, NL, subgenre + 2-4 artiesten):\n> ')).trim();
    if (description.length >= 100) break;
    console.log(`Te kort (${description.length} tekens). Minimaal 100 tekens.`);
  }

  // Tracklist
  const doTracklist = (await ask('\nTracklist nu invoeren? (j/n): ')).trim().toLowerCase();
  const tracklist = doTracklist === 'j' ? await askTracklist() : [];

  // Genereer afgeleide velden
  const title = buildTitle(subgenre, color, power, freq, volNum);
  const imgs = buildImagePaths(power, color, dateCompact);
  const audioSrc = buildAudioSrc(color, power, freq, genre, bpm, dateCompact, volNum);
  const permalink = buildPermalink(color, power, freq, genre, bpm, dateCompact);

  const entry = {
    id: dateCompact,
    featured: false,
    ignore: false,
    title,
    genre,
    subgenre,
    color,
    power,
    frequency: freq,
    volume,
    date: dateStr,
    jaar: year,
    maand: month,
    dag: day,
    permalink,
    audioSrc,
    image_wide_small: imgs.wide_small,
    image_wide_large: imgs.wide_large,
    image_square:     imgs.square,
    description,
    tracklist,
  };

  // Preview
  console.log('\n--- Preview ---');
  console.log(JSON.stringify(entry, null, 2));
  console.log('---------------\n');

  const confirm = (await ask('Toevoegen aan ' + path.basename(file) + '? (j/n): ')).trim().toLowerCase();
  if (confirm !== 'j') {
    console.log('Geannuleerd.');
    rl.close();
    return;
  }

  // Schrijf naar JSON (nieuwste bovenaan)
  mixes.unshift(entry);
  fs.writeFileSync(file, JSON.stringify(mixes, null, 2) + '\n', 'utf8');
  console.log(`\n✓ Mix toegevoegd aan ${path.basename(file)}`);
  console.log(`  Vergeet niet de afbeeldingen toe te voegen in public/images/${power.toLowerCase()}/${color.toLowerCase()}/`);
  console.log(`  en daarna: npm run images:webp (als je .jpg aanlevert)`);

  rl.close();
}

main().catch(err => {
  console.error(err);
  rl.close();
  process.exit(1);
});
