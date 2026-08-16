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
 * BESCHRIJVINGEN (AUTOMATISCH GEGENEREERD, TWEE TALEN)
 * -----------------------------------------------------
 * Claude genereert description_nl en description_en op basis van de tracklist.
 * Je krijgt beide te zien, met per taal of ze de spec halen, en kiest dan:
 *   j      — gebruik deze beschrijvingen
 *   n      — sla ze over (velden blijven leeg)
 *   edit   — typ zelf een vervangende tekst per taal
 *
 * De spec staat in src/data/mixes/README.md en wordt hier opgelegd: 120-160
 * tekens, geen streepje, geen artiestnamen. tests/mix-data.test.ts toetst
 * precies dat, dus een entry die hier wordt afgekeurd haalt de poort niet.
 *
 * Vereist: ANTHROPIC_API_KEY als omgevingsvariabele.
 * Stel in via: $env:ANTHROPIC_API_KEY="sk-ant-..."  (PowerShell)
 *           of: set ANTHROPIC_API_KEY=sk-ant-...     (cmd)
 *
 * WAT AUTOMATISCH WORDT GEGENEREERD
 * ----------------------------------
 *   - id             YYYYMMDD uit datum
 *   - id_spotify     mmc_{genre}_128bpm_light_m_yellow_YYYYMMDD
 *   - title          "Subgenre · Color Power (f) Mix · Vol. N"
 *   - title_spotify  "EDM 128BPM 🟡 Yellow Light (m) 🟡 Vol. N"
 *   - jaar/maand/dag uit datum
 *   - permalink      luister/mix/color-power-f-Genre-BPMbpm-YYYYMMDD.html
 *   - audioSrc       R2-URL naar het mp3 bestand op Cloudflare (zie hieronder)
 *   - image paden    /images/power/color/wide|square/... (altijd .webp)
 *   - tracks         aantal items in de tracklist
 *   - volume_spotify volgnummer binnen kleur+power+frequentie+bpm (los van subgenre)
 *
 * Het genre werkt door in id_spotify en title_spotify: een Drum & Bass-mix
 * krijgt dnb/DNB in plaats van edm/EDM. Tot 2026-08-15 stond edm daar hard
 * ingebakken, waardoor elke DnB-mix zichzelf als EDM aankondigde.
 *
 * NA HET SCRIPT
 * -------------
 *   1. Voeg de afbeeldingen toe in public/images/{power}/{color}/
 *      Bestandsnamen volgen het patroon in de gegenereerde image-paden:
 *        wide/image_{power}_{color}_wide_{YYYYMMDD}_{small|large}.webp
 *        square/image_{power}_{color}_square_{YYYYMMDD}.webp
 *   2. Als je .jpg aanlevert: npm run images:webp
 *   3. Controleer de JSON in de editor.
 *   4. Commit + push live via de cyclus in workflow-davekjohn/CONTRIBUTING.md.
 *
 * AUDIO BESTANDSNAAM OP R2
 * ------------------------
 * Het script zet een BEGINWAARDE neer volgens dit patroon:
 *   {Color}_{Power}_{freq}_{Genre}_{BPM}BPM_{YYYYMMDD}_Audio_V1 (Vol. N).mp3
 * Voorbeeld: Red_Light_m_EDM_128BPM_20260615_Audio_V1 (Vol. 6).mp3
 *
 * Dat is een gok en geen afleiding: de objecten op R2 volgen geen conventie
 * die te reproduceren valt (V1/V2/V3/V4 en v1 door elkaar, "Vol 1" zonder
 * punt, een spatie waar een underscore hoort, een kleur met kleine letter).
 * Het script doet daarom na afloop een HEAD-request op de URL en meldt het
 * als het object er niet is. R2 is bovendien hoofdlettergevoelig.
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

// Marker per kleur in title_spotify. Cyan gebruikt een ruit omdat Unicode geen
// cyaan cirkel kent; voor Magenta is nog geen teken vastgesteld (er is nog geen
// Magenta-mix) — het script waarschuwt in dat geval in plaats van te gokken.
const COLOR_EMOJI = {
  Red: '🔴',
  Orange: '🟠',
  Yellow: '🟡',
  Green: '🟢',
  Cyan: '💠',
  Blue: '🔵',
  Purple: '🟣',
};

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

// volume_spotify loopt per kleur+power+frequentie+bpm en niet per subgenre. Kleur en
// power staan al vast door het bestand, dus binnen dit bestand volstaat frequentie+bpm.
function nextSpotifyVolume(mixes, frequency, bpm) {
  const nums = mixes
    .filter(m => m.frequency === frequency && m.bpm === bpm && !m.ignore)
    .map(m => m.volume_spotify || 0);
  return nums.length ? Math.max(...nums) + 1 : 1;
}

function parseDate(dateStr) {
  const [year, month, day] = dateStr.split('-');
  return { year, month: MONTHS[parseInt(month, 10) - 1], day };
}

function buildTitle(subgenre, color, power, freq, vol) {
  return `${subgenre} · ${color} ${power} ${freq} Mix · Vol. ${vol}`;
}

// Eén bron voor de genre-afkorting. Stond tot 2026-08-15 drie keer los in dit bestand
// (audioSrc en permalink leidden hem af, id_spotify en title_spotify hardcodeerden 'edm'),
// waardoor een Drum & Bass-mix zijn Spotify-metadata als EDM kreeg.
function genreSlug(genre) {
  return genre === 'Drum & Bass' ? 'DnB' : genre;
}

function buildSpotifyId(color, power, freq, genre, bpm, dateCompact) {
  const freqClean = freq.replace(/[()]/g, '').toLowerCase();
  const g = genreSlug(genre).toLowerCase();
  return `mmc_${g}_${bpm}bpm_${power.toLowerCase()}_${freqClean}_${color.toLowerCase()}_${dateCompact}`;
}

// `vol` is de volume_spotify, niet het site-volume: dat laatste loopt per subgenre en
// telt binnen één kleur+power+frequentie dus niet netjes door. De titel sluit af met dat
// volgnummer; het id stond er tot 2026-08-11 achter, maar hoort niet in een publieke titel.
function buildSpotifyTitle(color, power, freq, genre, bpm, vol) {
  const emoji = COLOR_EMOJI[color];
  if (!emoji) {
    console.warn(`\n! Geen emoji vastgesteld voor kleur ${color}. Vul title_spotify handmatig aan.`);
    return '';
  }
  return `${genreSlug(genre).toUpperCase()} ${bpm}BPM ${emoji} ${color} ${power} ${freq} ${emoji} Vol. ${vol}`;
}

// Patroon zoals de bestanden werkelijk op schijf staan:
//   wide/image_{power}_{color}_wide_{YYYYMMDD}_{small|large}.webp
//   square/image_{power}_{color}_square_{YYYYMMDD}.webp
// Het script schreef hier tot 2026-08-15 de datum vóór het formaat en gebruikte een
// koppelteken in plaats van een underscore. Geen enkel gegenereerd pad bestond daardoor:
// checkAndConvertImages meldde altijd "Ontbreekt" en de 25 dode image_square-paden in de
// data (issue #66) zijn precies wat dat opleverde.
function buildImagePaths(power, color, dateCompact) {
  const p = power.toLowerCase();
  const c = color.toLowerCase();
  const base = `/images/${p}/${c}`;
  return {
    wide_small: `${base}/wide/image_${p}_${c}_wide_${dateCompact}_small.webp`,
    wide_large: `${base}/wide/image_${p}_${c}_wide_${dateCompact}_large.webp`,
    square:     `${base}/square/image_${p}_${c}_square_${dateCompact}.webp`,
  };
}

// Dit is een BEGINWAARDE, geen afleiding. De objectnamen op R2 volgen geen conventie die
// te reproduceren valt: er staan V1/V2/V3/V4 en v1 door elkaar, "Vol 1" zonder punt, een
// spatie waar een underscore hoort en een enkele kleur met een kleine letter. De entry
// krijgt daarom de meest voorkomende vorm en verifyAudioSrc controleert hem daarna echt.
function buildAudioSrc(color, power, freq, genre, bpm, dateCompact, vol) {
  const freqClean = freq.replace(/[()]/g, '');
  const filename = `${color}_${power}_${freqClean}_${genreSlug(genre)}_${bpm}BPM_${dateCompact}_Audio_V1%20(Vol.%20${vol}).mp3`;
  return `${R2_BASE}${color.toLowerCase()}/${filename}`;
}

function buildPermalink(color, power, freq, genre, bpm, dateCompact) {
  const freqClean = freq.replace(/[()]/g, '');
  return `luister/mix/${color.toLowerCase()}-${power.toLowerCase()}-${freqClean}-${genreSlug(genre)}-${bpm}BPM-${dateCompact}.html`;
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

// De site en de testsuite lezen twee velden, dus er worden er twee gegenereerd.
// De regels komen uit src/data/mixes/README.md en worden hier letterlijk opgelegd:
// 120-160 tekens, geen streepje, en GEEN artiestnamen -- die horen in top_artists.
// De oude prompt vroeg juist om beide (em-dash in het format, "mention 2-4 artists"),
// en dat is precies wat de twee dash-ratchets in tests/mix-data.test.ts nu tellen.
async function generateDescriptions(subgenre, genre, color, power, tracklist) {
  const leeg = { nl: '', en: '' };
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('\n⚠ ANTHROPIC_API_KEY niet ingesteld — beschrijvingen overgeslagen.');
    return leeg;
  }
  if (tracklist.length === 0) {
    console.log('\n⚠ Geen tracklist — beschrijvingen kunnen niet worden gegenereerd.');
    return leeg;
  }

  const client = new Anthropic();
  const trackLines = tracklist.map(t => `${t.time} ${t.track}`).join('\n');

  process.stdout.write('\nBeschrijvingen genereren...');

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    messages: [{
      role: 'user',
      content: `Write two descriptions for a DJ mix: one in Dutch, one in English.

Mix info:
- Subgenre: ${subgenre}
- Genre: ${genre}
- Color/vibe: ${color} ${power}

Tracklist:
${trackLines}

Rules for BOTH descriptions:
- Between 120 and 160 characters
- Mention the subgenre
- Describe the vibe and a fitting listening moment (e.g. "warm and driving", "perfect for a long night drive")
- Do NOT name any artists
- Do NOT use any dash character: no "-", no "--", no em dash. Use separate sentences instead.

Return ONLY this, with no explanation and no quotation marks:
NL: <the Dutch description>
EN: <the English description>`,
    }],
  });

  process.stdout.write(' klaar.\n');

  const text = msg.content[0].text.trim();
  const pick = (tag) => {
    const m = text.match(new RegExp(`^${tag}:\\s*(.+)$`, 'im'));
    return m ? m[1].trim() : '';
  };
  return { nl: pick('NL'), en: pick('EN') };
}

// Meldt wat er mis is met een beschrijving, of null als hij voldoet. Zo ziet degene die
// het script draait dezelfde grens als de testpoort, in plaats van hem pas bij de PR.
function keurBeschrijving(tekst) {
  if (!tekst) return 'leeg';
  const klachten = [];
  if (tekst.length < 120 || tekst.length > 160) klachten.push(`${tekst.length} tekens (moet 120-160)`);
  if (/[-—]/.test(tekst)) klachten.push('bevat een streepje');
  return klachten.length ? klachten.join(', ') : null;
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

  // BPM — Drum & Bass is altijd 176, dus die stellen we voor
  const suggestedBpm = genre === 'Drum & Bass' ? 176 : 128;
  let bpm;
  while (true) {
    const bpmInput = (await ask(`BPM (Enter = ${suggestedBpm}): `)).trim();
    bpm = bpmInput ? parseInt(bpmInput, 10) : suggestedBpm;
    if (Number.isInteger(bpm) && bpm > 0) break;
    console.log('Vul een getal in, bijvoorbeeld 128.');
  }

  // Volume — auto-suggest
  const suggestedVol = nextVolume(mixes, freq);
  const volInput = (await ask(`Volume (Enter = Vol. ${suggestedVol}): `)).trim();
  const volNum = volInput ? parseInt(volInput.replace(/\D/g, ''), 10) : suggestedVol;
  const volume = `Vol. ${volNum}`;

  // Tracklist
  const tracklist = await askTracklist();

  // Beschrijvingen — automatisch genereren via Claude, in beide talen
  const generated = await generateDescriptions(subgenre, genre, color, power, tracklist);
  let descriptionNl = '';
  let descriptionEn = '';

  const toon = (taal, tekst) => {
    const klacht = keurBeschrijving(tekst);
    console.log(`\n${taal} (${tekst.length} tekens)${klacht ? ` — ⚠ ${klacht}` : ' — ✓'}:`);
    console.log(`  "${tekst}"`);
  };

  if (generated.nl || generated.en) {
    toon('NL', generated.nl);
    toon('EN', generated.en);
    const keuze = (await ask('\nGebruiken? (j = ja / n = overslaan / edit = zelf typen): ')).trim().toLowerCase();
    if (keuze === 'j') {
      descriptionNl = generated.nl;
      descriptionEn = generated.en;
    } else if (keuze === 'edit') {
      descriptionNl = (await ask('Beschrijving NL: ')).trim();
      descriptionEn = (await ask('Beschrijving EN: ')).trim();
    }
  } else {
    const handmatig = (await ask('\nBeschrijvingen handmatig invoeren? (j/n): ')).trim().toLowerCase();
    if (handmatig === 'j') {
      descriptionNl = (await ask('NL > ')).trim();
      descriptionEn = (await ask('EN > ')).trim();
    }
  }

  for (const [taal, tekst] of [['description_nl', descriptionNl], ['description_en', descriptionEn]]) {
    const klacht = keurBeschrijving(tekst);
    if (klacht) console.warn(`\n⚠ ${taal}: ${klacht}. De testpoort weigert dit — corrigeer het in het JSON-bestand.`);
  }

  // Genereer afgeleide velden
  const title = buildTitle(subgenre, color, power, freq, volNum);
  const imgs = buildImagePaths(power, color, dateCompact);
  const audioSrc = buildAudioSrc(color, power, freq, genre, bpm, dateCompact, volNum);
  const permalink = buildPermalink(color, power, freq, genre, bpm, dateCompact);
  const idSpotify = buildSpotifyId(color, power, freq, genre, bpm, dateCompact);
  const volSpotify = nextSpotifyVolume(mixes, freq, bpm);
  const titleSpotify = buildSpotifyTitle(color, power, freq, genre, bpm, volSpotify);

  const entry = {
    id: dateCompact,
    id_spotify: idSpotify,
    featured: false,
    ignore: false,
    title,
    title_spotify: titleSpotify,
    genre,
    subgenre,
    bpm,
    color,
    power,
    frequency: freq,
    volume,
    volume_spotify: volSpotify,
    date: dateStr,
    jaar: year,
    maand: month,
    dag: day,
    permalink,
    audioSrc,
    image_wide_small: imgs.wide_small,
    image_wide_large: imgs.wide_large,
    image_square:     imgs.square,
    description_nl: descriptionNl,
    description_en: descriptionEn,
    top_artists: [],
    tracks: tracklist.length,
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

  // Controleer de audio echt, in plaats van erop te vertrouwen
  await verifyAudioSrc(entry);

  rl.close();
}

// De audioSrc is een gok (zie buildAudioSrc), dus wordt hij getoetst in plaats van
// aangenomen. Eén HEAD-request kost niets en vangt precies de fout die anders pas
// opvalt als een bezoeker op play drukt en de mix van iemand anders hoort.
async function verifyAudioSrc(entry) {
  process.stdout.write('\nAudio controleren...');
  try {
    const res = await fetch(entry.audioSrc, { method: 'HEAD' });
    if (res.ok) {
      console.log(' ✓ bestand gevonden op R2.');
      return;
    }
    console.log(` ⚠ HTTP ${res.status}.`);
  } catch (err) {
    console.log(` ⚠ niet te bereiken (${err.message}).`);
  }
  console.log(`    ${entry.audioSrc}`);
  console.log('    R2 is hoofdlettergevoelig en de objectnamen volgen daar geen vaste conventie.');
  console.log('    Zoek de exacte naam op in Cloudflare en pas audioSrc handmatig aan.');
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
