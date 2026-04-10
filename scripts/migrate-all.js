const fs = require('fs');
const path = require('path');

// Navigeer van D:\DJ CYLOW\Website\djcylow-react\scripts 
// naar D:\DJ CYLOW\Website\djcylow-react\src\data\mixes\old_json
const inputFolder = path.join(__dirname, '..', 'src', 'data', 'mixes', 'old_json');
const outputFolder = path.join(__dirname, '..', 'src', 'data', 'mixes');

// Maak de output map aan als deze nog niet bestaat
if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
}

fs.readdir(inputFolder, (err, files) => {
    if (err) {
        console.error("Fout: Kan de map niet vinden op dit pad:");
        console.error(inputFolder);
        return;
    }

    const jsonFiles = files.filter(file => path.extname(file) === '.json');

    if (jsonFiles.length === 0) {
        console.log("Geen .json bestanden gevonden in: " + inputFolder);
        return;
    }

    jsonFiles.forEach(file => {
        const filePath = path.join(inputFolder, file);
        
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) return console.error(`Fout bij lezen: ${file}`, err);

            try {
                const oldContent = JSON.parse(data);
                const mixesArray = Array.isArray(oldContent) ? oldContent : [oldContent];

                const transformedMixes = mixesArray.map(mix => {
                    return {
                        id: mix.id,
                        featured: mix.featured,
                        ignore: mix.ignore,
                        color: mix.color,
                        genre: mix.genre,
                        power: mix.power,
                        title: mix.title,
                        frequency: mix.frequency,
                        volume: mix.volume,
                        maand: mix.maand,
                        dag: mix.dag,
                        jaar: mix.jaar,
                        permalink: mix.permalink,
                        audioSrc: mix.audioSrc,
                        // Nieuwe structuur, oude waardes
                        image_wide_small: mix.image || mix.image_wide_small || "",
                        image_wide_large: mix.image_wide_large || "",
                        image_square: mix.image_square || "",
                        tracklist: mix.tracklist
                    };
                });

                const outputPath = path.join(outputFolder, file);
                fs.writeFile(outputPath, JSON.stringify(transformedMixes, null, 2), (err) => {
                    if (err) console.error(`Fout bij schrijven: ${file}`, err);
                    else console.log(`✅ Omgezet: ${file}`);
                });

            } catch (parseErr) {
                console.error(`Fout in JSON structuur van ${file}:`, parseErr.message);
            }
        });
    });
});