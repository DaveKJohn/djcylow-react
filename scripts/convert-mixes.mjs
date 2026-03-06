import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Paden configureren
const MIXES_DIRECTORY = path.join(process.cwd(), 'content', 'mixes');
const OUTPUT_DIR = path.join(process.cwd(), 'src', 'data');
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'mixes.json');

// Hulpfunctie om alle bestanden in submappen te vinden
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
  // Controleer of de output map bestaat
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const allFiles = getAllFiles(MIXES_DIRECTORY);

  const allMixes = allFiles
    .filter(file => file.endsWith('.md'))
    .map(filePath => {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent);

      // Helper om te zorgen dat we altijd een boolean (true/false) krijgen
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

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(allMixes, null, 2));
  console.log(`✅ Succes! ${allMixes.length} mixen gevonden en omgezet naar mixes.json`);
}

convert();