import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Paden configureren
const MIXES_DIRECTORY = path.join(process.cwd(), 'content', 'mixes');
const OUTPUT_DIR = path.join(process.cwd(), 'src', 'data', 'mixes'); // Submap voor de 14 bestanden

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

function convert() {
  // Zorg dat de specifieke output map bestaat (en leeg is of overschreven wordt)
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const allFiles = getAllFiles(MIXES_DIRECTORY);

  // 1. Eerst alle data inlezen zoals je al deed
  const allMixes = allFiles
    .filter(file => file.endsWith('.md'))
    .map(filePath => {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent);

      const toBool = (val) => val === true || val === 'true' || val === 'yes';

      return {
        id: data.id?.toString() || (data.date ? data.date.toString().replace(/-/g, '') : Math.random().toString(36).substr(2, 9)),
        featured: toBool(data.featured),
        ignore: toBool(data.ignore),
        color: data.color?.toLowerCase() || 'blue',
        genre: data.genre?.toLowerCase() || 'edm',
        power: data.power?.toLowerCase() || 'light',
        title: data.album || data.title || 'Naamloze Mix',
        frequency: data.frequency || '',
        volume: data.volume || '',
        maand: data.maand || '',
        dag: data.dag?.toString().padStart(2, '0') || '',
        jaar: data.jaar?.toString() || '',
        permalink: data.permalink || '',
        audioSrc: data.public_development_URL || '',
        image: data.image_wide_480px?.replace('/images/', '/images/') || '',
        image_square: data.image_square?.replace('/images/', '/images/') || '',
        tracklist: data.tracklist || []
      };
    })
    .sort((a, b) => b.id.localeCompare(a.id));

  // 2. Groeperen en opslaan per bestand
  const groups = {};

  allMixes.forEach(mix => {
    // We maken een key zoals "light-blue" of "full-red"
    const key = `${mix.power}-${mix.color}`;
    
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(mix);
  });

  // 3. Elk bestand wegschrijven
  Object.keys(groups).forEach(key => {
    const fileName = `${key}.json`;
    const filePath = path.join(OUTPUT_DIR, fileName);
    fs.writeFileSync(filePath, JSON.stringify(groups[key], null, 2));
  });

  console.log(`✅ Succes! ${Object.keys(groups).length} JSON bestanden aangemaakt in ${OUTPUT_DIR}`);
}

convert();