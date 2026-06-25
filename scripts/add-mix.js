#!/usr/bin/env node
/**
 * add-mix.js — Interactief script voor het toevoegen van een nieuwe mix
 * =====================================================================
 * Gebruik: npm run mix:add
 *
 * WAT HET DOET
 * ------------
 * Dit script vraagt stap voor stap de gegevens van een nieuwe mix op en
 * voegt het resultaat bovenaan het juiste JSON bestand in (nieuwste eerst).
 *
 * WAT JE ZELF INVULT
 * ------------------
 *   - Kleur + power + frequentie + genre  (keuzelijst)
 *   - Datum          YYYY-MM-DD           bijv. 2026-06-25
 *   - Subgenre       vrije tekst          bijv. Tech House
 *   - BPM            getal                bijv. 128
 *   - Volume         getal of Enter       script stelt het volgende voor
 *   - Tracklist      tijdcode HH:MM:SS + naam per track
 *
 * BESCHRIJVING (AUTOMATISCH GEGENEREERD)
 * ---------------------------------------
 * Claude genereert de beschrijving automatisch op basis van de tracklist.
 * Je krijgt de gegenereerde tekst te zien en kiest dan:
 *   j      — gebruik deze beschrijving
 *   n      — sla beschrijving over (veld blijft leeg)
 *   edit   — typ zelf een vervangende tekst
 *
 * Vereist: ANTHROPIC_API_KEY als omgevingsvariabele.
 * Stel in via: $env:ANTHROPIC_API_KEY="sk-ant-..."  (PowerShell)
 *           of: set ANTHROPIC_API_KEY=sk-ant-...     (cmd)
 *
 * WAT AUTOMATISCH WORDT GEGENEREERD
 * ----------------------------------
 *   - id             YYYYMMDD uit datum
 *   - title          "Subgenre · Color Power (f) Mix · Vol. N"
 *   - jaar/maand/dag uit datum
 *   - permalink      luister/mix/color-power-f-Genre-BPMbpm-YYYYMMDD.html
 *   - audioSrc       R2-URL naar het mp3 bestand op Cloudflare
 *   - image paden    /images/power/color/wide|square/... (altijd .webp)
 *
 * NA HET SCRIPT
 * -------------
 *   1. Voeg de afbeeldingen toe in public/images/{power}/{color}/
 *      Bestandsnamen volgen het patroon in de gegenereerde image-paden.
 *   2. Als je .jpg aanlevert: npm run images:webp
 *   3. Controleer de JSON in de editor.
 *   4. Commit + push live via de normale release workflow.
 *
 * AUDIO BESTANDSNAAM OP R2
 * ------------------------
 * Het script genereert de audioSrc op basis van dit patroon:
 *   {Color}_{Power}_{freq}_{Genre}_{BPM}BPM_{YYYYMMDD}_Audio_V1 (Vol. N).mp3
 * Voorbeeld: Red_Light_m_EDM_128BPM_20260615_Audio_V1 (Vol. 6).mp3
 * Controleer altijd of de bestandsnaam op R2 exact overeenkomt — R2 is
 * hoofdlettergevoelig. Pas audioSrc handmatig aan als de naam afwijkt.
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

// Laad .env uit de projectroot zodat ANTHROPIC_API_KEY beschikbaar is
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .forEach(line => {
      const [key, ...rest] = line.split('=');
      if (key && rest.length && !process.env[key.trim()]) {
        process.env[key.trim()] = rest.join('=').trim();
      }
    });
}

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

function parseTracklistText(text) {
  // Parses pasted tracklist lines: "HH:MM:SS Artiest - Titel" or "MM:SS Artiest - Titel"
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => /^\d{1,2}:\d{2}(:\d{2})?/.test(line))
    .map(line => {
      const spaceIdx = line.indexOf(' ');
      let time = line.slice(0, spaceIdx).trim();
      const track = line.slice(spaceIdx + 1).trim();
      // Normalize MM:SS → HH:MM:SS
      if (/^\d{2}:\d{2}$/.test(time)) time = `00:${time}`;
      return { time, track };
    })
    .filter(t => t.track.length > 0);
}

async function askTracklist() {
  console.log('\nTracklist plakken (HH:MM:SS Artiest - Titel per regel).');
  console.log('Typ daarna END en druk Enter:\n');

  return new Promise((resolve) => {
    const lines = [];

    const onLine = (line) => {
      if (line.trim().toUpperCase() === 'END') {
        rl.removeListener('line', onLine);
        const tracks = parseTracklistText(lines.join('\n'));
        if (tracks.length > 0) {
          console.log(`\n✓ ${tracks.length} tracks ingelezen.`);
        } else {
          console.log('\nGeen tracks herkend — tracklist blijft leeg.');
        }
        resolve(tracks);
      } else {
        lines.push(line);
      }
    };

    rl.on('line', onLine);
  });
}

async function generateDescriptions(subgenre, genre, color, power, tracklist) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('\n⚠ ANTHROPIC_API_KEY niet ingesteld — beschrijvingen overgeslagen.');
    return { nl: '', en: '' };
  }
  if (tracklist.length === 0) {
    console.log('\n⚠ Geen tracklist — beschrijvingen kunnen niet worden gegenereerd.');
    return { nl: '', en: '' };
  }

  const client = new Anthropic();
  const trackLines = tracklist.map(t => `${t.time} — ${t.track}`).join('\n');
  const mixInfo = `Subgenre: ${subgenre}\nGenre: ${genre}\nColor/vibe: ${color} ${power}`;

  process.stdout.write('\nBeschrijvingen genereren (NL + EN)...');

  const [msgNl, msgEn] = await Promise.all([
    client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `Schrijf een beschrijving voor een DJ mix. Geef ALLEEN de beschrijvingstekst terug, geen uitleg of aanhalingstekens.

Mix info:
${mixInfo}

Tracklist:
${trackLines}

Regels:
- Exact 120–160 tekens
- Nederlands
- Noem het subgenre
- Noem 2–4 artiesten uit de tracklist
- Beschrijf de vibe (bijv. "warm en gedreven", "strak en energiek")
- Formaat: "${subgenre} mix van DJ Cylow — [vibe]. Met [artiesten]."`,
      }],
    }),
    client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `Write a description for a DJ mix. Return ONLY the description text, no explanation or quotation marks.

Mix info:
${mixInfo}

Tracklist:
${trackLines}

Rules:
- Exactly 120–160 characters
- English
- Mention the subgenre
- Mention 2–4 notable artists from the tracklist
- Describe the vibe (e.g. "warm and driving", "tight and energetic")
- Format: "${subgenre} mix by DJ Cylow — [vibe]. Featuring [artists]."`,
      }],
    }),
  ]);

  process.stdout.write(' klaar.\n');
  return {
    nl: msgNl.content[0].text.trim(),
    en: msgEn.content[0].text.trim(),
  };
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

  // Tracklist
  const tracklist = await askTracklist();

  // Beschrijvingen — automatisch genereren via Claude (NL + EN)
  const generated = await generateDescriptions(subgenre, genre, color, power, tracklist);
  let description = '';
  let descriptionEn = '';

  if (generated.nl || generated.en) {
    if (generated.nl) {
      console.log(`\nGegenereerde NL beschrijving (${generated.nl.length} tekens):`);
      console.log(`  "${generated.nl}"`);
      const keuzeNl = (await ask('Gebruiken? (j = ja / n = overslaan / edit = zelf typen): ')).trim().toLowerCase();
      if (keuzeNl === 'j') description = generated.nl;
      else if (keuzeNl === 'edit') description = (await ask('NL beschrijving: ')).trim();
    }
    if (generated.en) {
      console.log(`\nGegenereerde EN beschrijving (${generated.en.length} tekens):`);
      console.log(`  "${generated.en}"`);
      const keuzeEn = (await ask('Gebruiken? (j = ja / n = overslaan / edit = zelf typen): ')).trim().toLowerCase();
      if (keuzeEn === 'j') descriptionEn = generated.en;
      else if (keuzeEn === 'edit') descriptionEn = (await ask('EN description: ')).trim();
    }
  } else {
    const handmatig = (await ask('\nBeschrijvingen handmatig invoeren? (j/n): ')).trim().toLowerCase();
    if (handmatig === 'j') {
      description = (await ask('NL beschrijving: ')).trim();
      descriptionEn = (await ask('EN description: ')).trim();
    }
  }

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
    description_en: descriptionEn,
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

  // Controleer en converteer afbeeldingen
  await checkAndConvertImages(entry);

  rl.close();
}

async function checkAndConvertImages(entry) {
  const PUBLIC = path.join(__dirname, '..', 'public');
  const imagePaths = [entry.image_wide_small, entry.image_wide_large, entry.image_square];

  console.log('\nAfbeeldingen controleren...');

  for (const imgPath of imagePaths) {
    const webpAbs = path.join(PUBLIC, imgPath);
    const jpgAbs  = webpAbs.replace(/\.webp$/, '.jpg');

    if (fs.existsSync(webpAbs)) {
      console.log(`  ✓ ${path.basename(webpAbs)}`);
    } else if (fs.existsSync(jpgAbs)) {
      process.stdout.write(`  ↻ ${path.basename(jpgAbs)} → webp...`);
      const sharp = require('sharp');
      await sharp(jpgAbs).webp({ quality: 85 }).toFile(webpAbs);
      fs.unlinkSync(jpgAbs);
      process.stdout.write(' klaar.\n');
    } else {
      console.log(`  ⚠ Ontbreekt: ${imgPath}`);
      console.log(`    Voeg toe in: public${path.dirname(imgPath)}/`);
    }
  }
}

main().catch(err => {
  console.error(err);
  rl.close();
  process.exit(1);
});
