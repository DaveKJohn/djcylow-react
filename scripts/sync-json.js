const fs = require('fs');
const path = require('path');

const TARGET_DIR = 'D:\\DJ CYLOW\\Website\\djcylow-react\\src\\data\\mixes';
const BLUEPRINT_FILE = 'light-red.json';

const blueprintPath = path.join(TARGET_DIR, BLUEPRINT_FILE);

if (!fs.existsSync(blueprintPath)) {
  console.error(`Blauwdrukbestand niet gevonden: ${blueprintPath}`);
  process.exit(1);
}

const blueprintArray = JSON.parse(fs.readFileSync(blueprintPath, 'utf8'));

if (!Array.isArray(blueprintArray) || blueprintArray.length === 0) {
  console.error(`Blauwdrukbestand ${BLUEPRINT_FILE} moet een Array met objecten bevatten.`);
  process.exit(1);
}

const blueprintObj = blueprintArray[0];

function getEmptyValue(value) {
  if (Array.isArray(value)) return [];
  if (value !== null && typeof value === 'object') return {};
  if (typeof value === 'string') return "";
  if (typeof value === 'number') return 0;
  if (typeof value === 'boolean') return false;
  return null;
}

function syncStructure(blueprint, target, fallbackId) {
  const synced = {};

  for (const key in blueprint) {
    if (Object.prototype.hasOwnProperty.call(blueprint, key)) {
      if (target && Object.prototype.hasOwnProperty.call(target, key)) {
        if (blueprint[key] !== null && typeof blueprint[key] === 'object' && !Array.isArray(blueprint[key])) {
          synced[key] = syncStructure(blueprint[key], target[key], fallbackId);
        } else {
          synced[key] = target[key];
        }
      } else {
        if (blueprint[key] !== null && typeof blueprint[key] === 'object' && !Array.isArray(blueprint[key])) {
          synced[key] = syncStructure(blueprint[key], {}, fallbackId);
        } else {
          synced[key] = getEmptyValue(blueprint[key]);
        }
      }
    }
  }

  if (!synced.id || synced.id === "") {
    synced.id = fallbackId;
  }

  return synced;
}

fs.readdir(TARGET_DIR, (err, files) => {
  if (err) {
    return console.error(`Kan map niet lezen: ${err}`);
  }

  files.forEach(file => {
    if (path.extname(file).toLowerCase() !== '.json' || file === BLUEPRINT_FILE) {
      return;
    }

    const filePath = path.join(TARGET_DIR, file);
    const baseName = path.basename(file, '.json');

    try {
      let fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      if (!Array.isArray(fileData)) {
        fileData = [fileData];
      }

      const updatedData = fileData.map((mix, index) => {
        const fallbackId = `${baseName}_fallback_${index}`;
        return syncStructure(blueprintObj, mix, fallbackId);
      });

      fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf8');
      console.log(`Hersteld met unieke keys: ${file}`);
    } catch (error) {
      console.error(`Fout bij verwerken van ${file}:`, error.message);
    }
  });
});