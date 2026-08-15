/**
 * De eerste testsuite van deze repo, en hij bewaakt de mix-data.
 *
 * WAAROM DEZE EERST
 * -----------------
 * `src/data/mixes/README.md` is de veldspec en beschrijft tientallen regels; tot nu toe hield niets
 * daarvan iets tegen. Het waren afspraken in proza, en een fout erin haalt de build gewoon (JSON is
 * geldig, TypeScript is tevreden) om vervolgens op `djcylow.com` zichtbaar te worden. Dat is precies
 * het gat dat `CLAUDE.md` bedoelt met "de poort bewijst dat het bouwt, niet dat het gedrag gelijk
 * bleef".
 *
 * DE OPZET: GEMETEN, NIET OVERGESCHREVEN
 * --------------------------------------
 * De spec heeft een sectie "Known Inconsistencies in Legacy Data", dus de regels hard afdwingen
 * levert een suite die op dag één rood staat -- en een suite die altijd rood staat, bewaakt niets.
 * Daarom is de data eerst gemeten en daarna zijn de regels gesplitst:
 *
 *   - 23 regels haalt de data NU al volledig. Die staan hieronder als harde assertie. Ze kunnen
 *     alleen nog stukgaan door nieuw werk, en dat is exact wat een testsuite hoort te doen.
 *   - 7 regels haalt de data niet. Die staan als RATCHET: het gemeten aantal van vandaag is het
 *     plafond. Een nieuwe overtreding faalt, en een opgeloste overtreding faalt OOK -- met de
 *     melding dat het plafond omlaag moet. Zo blijft de achterstand zichtbaar en loopt hij niet
 *     stil weer op.
 *
 * Preview-entries (`ignore: true`) doen aan bijna niets mee: de spec zegt dat hun velden leeg zijn
 * en dat je ze niet aanraakt. Waar een regel wel voor ze geldt, staat dat erbij.
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const MIX_DIR = 'src/data/mixes';
const MAANDEN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ACTIEVE_BUCKET = 'https://pub-4fa4c2c1f9a644c4878cba29a7926443.r2.dev/';

/**
 * De subgenre-families uit de veldspec. `genre` moet de familie van `subgenre` zijn -- dit is de
 * waarde waar de Filter-component op de Luister-pagina op matcht, dus een mismatch laat een mix uit
 * zijn eigen filter vallen.
 */
const FAMILIES: Record<string, readonly string[]> = {
	House: ['House', 'Tech House', 'Deep House', 'Progressive House', 'Organic House', 'Afro House', 'Melodic House'],
	Techno: ['Melodic Techno', 'Hard Techno'],
	'Nu-Disco': ['Nu-Disco'],
	'Drum & Bass': ['Liquid Drum & Bass', 'Dancefloor Drum & Bass', 'Neurofunk', 'Jump Up', 'Vocal DnB', 'Techstep'],
};

/**
 * DE ACHTERSTAND, GEMETEN OP 2026-08-13. Elk getal is het aantal overtredingen dat er vandaag staat.
 * Los je er een op, dan faalt de bijbehorende test met de vraag dit getal te verlagen -- dat is de
 * bedoeling en niet een storing. Zet er nooit een hoger getal in om een test groen te maken.
 */
const ACHTERSTAND = {
	/** Beschrijvingen langer dan 160 tekens: 3, alle drie in `full-red.json`. */
	descriptionNlTeLang: 3,
	/** `description_nl` met een streepje erin, wat de spec verbiedt omdat het AI-gegenereerd oogt. */
	descriptionNlMetDash: 13,
	/** Idem voor `description_en`. */
	descriptionEnMetDash: 15,
	/**
	 * Tracklist-tijden die geen `HH:MM:SS` zijn (legacy `MM:SS` en `H:MM:SS`), geteld PER TRACK.
	 * Verdeeld over 73 van de 85 entries, op 2667 tracks in totaal.
	 */
	trackTijdenNietHHMMSS: 2444,
	/** Tracks zonder ` - ` tussen artiest en titel, geteld PER TRACK. Verdeeld over 33 entries. */
	tracksZonderScheiding: 70,
	/** Live mixen die nog op de legacy R2-bucket staan. */
	liveOpLegacyBucket: 25,
	/**
	 * Het aantal live mixen. Geen achterstand maar een ondergrens-in-ratchetvorm: verdwijnt er stil
	 * een mix, dan valt hij hier op. Groeit de collectie, dan vraagt de ratchet dit getal te
	 * verhogen -- dat hoort bij het toevoegen van een mix.
	 */
	liveMixen: 77,
} as const;

type Track = { time: string; track: string };
type Mix = {
	id: string;
	id_spotify: string;
	title: string;
	title_spotify: string;
	description_nl: string;
	description_en: string;
	genre: string;
	subgenre: string;
	bpm: number;
	color: string;
	power: string;
	frequency: string;
	volume: string;
	volume_spotify: number;
	date: string;
	jaar: string;
	maand: string;
	dag: string;
	audioSrc: string;
	permalink: string;
	image_wide_small: string;
	image_wide_large: string;
	image_square: string;
	featured: boolean;
	ignore: boolean;
	tracks: number;
	tracklist: Track[];
};
type Entry = { file: string; mix: Mix };

const bestanden = readdirSync(MIX_DIR)
	.filter((f) => f.endsWith('.json'))
	.sort();

const alle: Entry[] = bestanden.flatMap((file) => {
	const ruw = readFileSync(join(MIX_DIR, file), 'utf8');
	const arr = JSON.parse(ruw) as Mix[];
	return arr.map((mix) => ({ file, mix }));
});
const live = alle.filter((e) => !e.mix.ignore);

/** `light-red.json` -> `{ power: 'light', color: 'red' }` */
const uitBestandsnaam = (file: string) => {
	const [power, color] = file.replace(/\.json$/, '').split('-');
	return { power, color };
};

const label = (e: Entry) => `${e.file}:${e.mix.id}`;

/**
 * De ratchet. Faalt bij MEER overtredingen (regressie) én bij MINDER (het plafond is achterhaald),
 * zodat `ACHTERSTAND` niet stil uit de pas kan lopen met de werkelijkheid.
 */
const verwachtAchterstand = (overtreders: string[], plafond: number, wat: string) => {
	if (overtreders.length > plafond) {
		throw new Error(
			`${wat}: ${overtreders.length} overtredingen, plafond is ${plafond}. Nieuwe overtreding(en):\n  ` +
				overtreders.join('\n  '),
		);
	}
	if (overtreders.length < plafond) {
		throw new Error(
			`${wat}: nog maar ${overtreders.length} overtredingen (plafond ${plafond}). ` +
				`Er is iets opgelost -- verlaag ACHTERSTAND in deze suite naar ${overtreders.length}.`,
		);
	}
	expect(overtreders.length).toBe(plafond);
};

describe('mix-data: structuur', () => {
	it('vindt de vijftien kleurbestanden met geldige JSON', () => {
		expect(bestanden).toHaveLength(15);
		expect(alle.length).toBeGreaterThan(0);
	});

	it('heeft voor elke entry een array-vorm met een tracklist', () => {
		const kapot = alle.filter((e) => !Array.isArray(e.mix.tracklist)).map(label);
		expect(kapot).toEqual([]);
	});

	it('houdt `tracks` gelijk aan `tracklist.length`', () => {
		const fout = alle.filter((e) => e.mix.tracks !== e.mix.tracklist.length).map(label);
		expect(fout).toEqual([]);
	});

	it('heeft een unieke `id` over alle bestanden samen', () => {
		const ids = alle.map((e) => e.mix.id);
		const dubbel = ids.filter((id, i) => ids.indexOf(id) !== i);
		expect(dubbel).toEqual([]);
	});

	/**
	 * Het aantal live mixen lag nergens vast. De dekking die er toevallig was, kwam van de ratchets:
	 * van de 77 live mixen raakt er precies één geen enkele ratchet, dus voor de andere 76 zou
	 * verdwijnen een plafond onderuit duwen. Dat is toevallige dekking die verdampt naarmate de
	 * achterstand wordt opgelost -- en ze dekt de nieuwste, schoonste mixen het slechtst, want die
	 * zitten juist in geen enkele achterstand.
	 */
	it('heeft het verwachte aantal live mixen [ratchet]', () => {
		verwachtAchterstand(live.map(label), ACHTERSTAND.liveMixen, 'live mixen');
	});

	it('sorteert elk bestand nieuwste eerst', () => {
		const fout = bestanden.filter((file) => {
			const dated = alle
				.filter((e) => e.file === file && !e.mix.ignore && /^\d{8}$/.test(e.mix.id))
				.map((e) => Number(e.mix.id));
			return dated.some((id, i) => i > 0 && id > dated[i - 1]);
		});
		expect(fout).toEqual([]);
	});
});

describe('mix-data: uniciteit van de sleutels', () => {
	const uniek = (waarden: string[]) => waarden.filter((v, i) => waarden.indexOf(v) !== i);

	it('heeft een unieke `title` per live mix', () => {
		expect(uniek(live.map((e) => e.mix.title))).toEqual([]);
	});

	it('heeft een unieke `id_spotify` per live mix', () => {
		expect(uniek(live.map((e) => e.mix.id_spotify))).toEqual([]);
	});

	/**
	 * Issue #45: twee mixen droegen de `audioSrc` van een ándere entry, byte-identiek. Titel,
	 * tracklist, beschrijving en cover waren van mix A, het geluid van mix B -- de bezoeker hoorde
	 * dus iets anders dan waarop hij klikte, met een tracklist die niet meeliep.
	 *
	 * Het waren allebei de oudste entry in hun bestand, wat past bij een copy-paste die nooit is
	 * afgemaakt. Niets hield dat tegen; dit is de wacht die daarop staat.
	 */
	it('heeft een unieke `audioSrc` per live mix', () => {
		expect(uniek(live.map((e) => e.mix.audioSrc))).toEqual([]);
	});

	it('heeft een unieke `title_spotify` per live mix -- die uniciteit hangt aan volume_spotify', () => {
		expect(uniek(live.map((e) => e.mix.title_spotify))).toEqual([]);
	});

	it('heeft een unieke `description_nl` per live mix', () => {
		expect(uniek(live.map((e) => e.mix.description_nl))).toEqual([]);
	});

	/**
	 * De veldspec merkt beide beschrijvingen als SEO-kritisch met dezelfde regel "must be unique per
	 * mix", maar alleen de Nederlandse werd bewaakt -- een gekopieerde Engelse beschrijving kwam er
	 * dus doorheen. De site is Engels, dus dat is juist de kant die Google leest. Gemeten: 0
	 * duplicaten, dus dit kan hard.
	 */
	it('heeft een unieke `description_en` per live mix', () => {
		expect(uniek(live.map((e) => e.mix.description_en))).toEqual([]);
	});
});

describe('mix-data: veldwaarden van live mixen', () => {
	it('schrijft `color` met een hoofdletter', () => {
		const fout = live.filter((e) => !/^[A-Z][a-z]+$/.test(e.mix.color)).map((e) => `${label(e)}=${e.mix.color}`);
		expect(fout).toEqual([]);
	});

	it('gebruikt voor `power` alleen Full of Light', () => {
		const fout = live.filter((e) => !['Full', 'Light'].includes(e.mix.power)).map((e) => `${label(e)}=${e.mix.power}`);
		expect(fout).toEqual([]);
	});

	it('gebruikt voor `frequency` alleen (f) of (m), met haakjes', () => {
		const fout = live.filter((e) => !['(f)', '(m)'].includes(e.mix.frequency)).map(label);
		expect(fout).toEqual([]);
	});

	it('laat `color` en `power` de bestandsnaam volgen', () => {
		const fout = live
			.filter((e) => {
				const { power, color } = uitBestandsnaam(e.file);
				return e.mix.color.toLowerCase() !== color || e.mix.power.toLowerCase() !== power;
			})
			.map((e) => `${label(e)}=${e.mix.power}/${e.mix.color}`);
		expect(fout).toEqual([]);
	});

	it('heeft `bpm` als getal, niet als string', () => {
		const fout = live.filter((e) => typeof e.mix.bpm !== 'number').map(label);
		expect(fout).toEqual([]);
	});

	it('geeft Drum & Bass altijd 176 bpm', () => {
		const fout = live
			.filter((e) => e.mix.genre === 'Drum & Bass' && e.mix.bpm !== 176)
			.map((e) => `${label(e)}=${e.mix.bpm}`);
		expect(fout).toEqual([]);
	});
});

describe('mix-data: datums', () => {
	it('heeft `date` in ISO-formaat en niet leeg', () => {
		const fout = live.filter((e) => !/^\d{4}-\d{2}-\d{2}$/.test(e.mix.date)).map((e) => `${label(e)}="${e.mix.date}"`);
		expect(fout).toEqual([]);
	});

	it('houdt `jaar`, `maand` en `dag` gelijk aan `date`', () => {
		const fout = live
			.filter((e) => {
				const [y, mo, d] = e.mix.date.split('-');
				return e.mix.jaar !== y || e.mix.maand !== MAANDEN[Number(mo) - 1] || e.mix.dag !== d;
			})
			.map(label);
		expect(fout).toEqual([]);
	});

	it('houdt `id` gelijk aan `date` zonder streepjes', () => {
		const fout = live.filter((e) => e.mix.id !== e.mix.date.replaceAll('-', '')).map(label);
		expect(fout).toEqual([]);
	});
});

describe('mix-data: genre en titel', () => {
	it('laat `genre` de familie van `subgenre` zijn -- anders valt de mix uit zijn eigen filter', () => {
		const fout = live
			.filter((e) => !(FAMILIES[e.mix.genre] ?? []).includes(e.mix.subgenre))
			.map((e) => `${label(e)}=${e.mix.genre}/${e.mix.subgenre}`);
		expect(fout).toEqual([]);
	});

	it('begint de `title` met het subgenre', () => {
		const fout = live.filter((e) => !e.mix.title.startsWith(e.mix.subgenre)).map((e) => `${label(e)}="${e.mix.title}"`);
		expect(fout).toEqual([]);
	});

	it('houdt de `title` onder 60 tekens zodat Google hem niet afkapt', () => {
		const fout = live.filter((e) => e.mix.title.length >= 60).map((e) => `${label(e)}=${e.mix.title.length}`);
		expect(fout).toEqual([]);
	});
});

describe('mix-data: beschrijvingen (SEO-kritisch)', () => {
	it('heeft beide beschrijvingen gevuld', () => {
		const fout = live.filter((e) => !e.mix.description_nl || !e.mix.description_en).map(label);
		expect(fout).toEqual([]);
	});

	it('houdt `description_en` op 120 tot 160 tekens', () => {
		const fout = live
			.filter((e) => e.mix.description_en.length < 120 || e.mix.description_en.length > 160)
			.map((e) => `${label(e)}=${e.mix.description_en.length}`);
		expect(fout).toEqual([]);
	});

	it('houdt `description_nl` op 120 tot 160 tekens [ratchet]', () => {
		const fout = live
			.filter((e) => e.mix.description_nl.length < 120 || e.mix.description_nl.length > 160)
			.map((e) => `${label(e)}=${e.mix.description_nl.length}`);
		verwachtAchterstand(fout, ACHTERSTAND.descriptionNlTeLang, 'description_nl buiten 120-160');
	});

	/**
	 * De dash-regel dekte twee van de drie streepjes: hyphen `-` en em-dash `—`, maar niet de
	 * en-dash `–` (U+2013) -- juist het teken dat tekstverwerkers en AI-uitvoer het vaakst
	 * produceren en dat in een zoekresultaat niet van een em-dash te onderscheiden is. Gemeten: 0
	 * voorkomens vandaag, dus dit is een open deur die dichtgaat en geen achterstand. De plafonds
	 * blijven daarom precies gelijk (13 en 15) -- als ze meebewogen, was dat het bewijs dat er wél
	 * en-dashes stonden.
	 */
	const DASH = /[-–—]/;

	it('gebruikt geen streepje in `description_nl` [ratchet]', () => {
		const fout = live.filter((e) => DASH.test(e.mix.description_nl)).map(label);
		verwachtAchterstand(fout, ACHTERSTAND.descriptionNlMetDash, 'description_nl met dash');
	});

	it('gebruikt geen streepje in `description_en` [ratchet]', () => {
		const fout = live.filter((e) => DASH.test(e.mix.description_en)).map(label);
		verwachtAchterstand(fout, ACHTERSTAND.descriptionEnMetDash, 'description_en met dash');
	});
});

describe('mix-data: tracklist', () => {
	it('houdt de tijden oplopend binnen een mix', () => {
		const fout = live
			.filter((e) => {
				const tijden = e.mix.tracklist.filter((t) => /^\d{2}:\d{2}:\d{2}$/.test(t.time)).map((t) => t.time);
				return tijden.some((t, i) => i > 0 && t < tijden[i - 1]);
			})
			.map(label);
		expect(fout).toEqual([]);
	});

	/**
	 * DEZE TWEE TELLEN TRACKS, NIET ENTRIES -- en dat verschil is de hele reden dat ze bestaan.
	 *
	 * Tot 2026-08-15 telden ze het aantal entries met MINSTENS ÉÉN overtreding: 73 respectievelijk
	 * 33. Daarmee stonden ze in de praktijk uit. 73 van de 85 entries zaten al "in" de ratchet, en
	 * zolang een entry erin zit is de regel voor die entry volledig uitgeschakeld: een track met
	 * tijd "3:07" toevoegen aan zo'n entry liet de teller op 73 staan, en 2443 van de 2444 tijden
	 * repareren óók. Het plafond bewoog alleen als een entry van 0 naar 1 overtreding ging of
	 * andersom -- precies het omgekeerde van wat een ratchet belooft.
	 *
	 * Op trackniveau is de eenheid gelijk aan de eenheid waar de regel over gaat, en wordt elke
	 * losse reparatie zichtbaar. Bij de vijf andere ratchets speelt dit niet: die tellen per mix één
	 * eigenschap, dus daar is entry = overtreding.
	 */
	it('gebruikt `HH:MM:SS` met voorloopnullen [ratchet, per track]', () => {
		const fout = alle.flatMap((e) =>
			e.mix.tracklist.filter((t) => !/^\d{2}:\d{2}:\d{2}$/.test(t.time)).map((t) => `${label(e)} "${t.time}"`),
		);
		verwachtAchterstand(fout, ACHTERSTAND.trackTijdenNietHHMMSS, 'tracklist-tijden zonder HH:MM:SS');
	});

	it('scheidt artiest en titel met ` - ` [ratchet, per track]', () => {
		const fout = alle.flatMap((e) =>
			e.mix.tracklist.filter((t) => !t.track.includes(' - ')).map((t) => `${label(e)} "${t.track}"`),
		);
		verwachtAchterstand(fout, ACHTERSTAND.tracksZonderScheiding, 'tracks zonder " - " tussen artiest en titel');
	});
});

describe('mix-data: audio', () => {
	it('linkt rechtstreeks naar een .mp3', () => {
		const fout = live.filter((e) => !e.mix.audioSrc.endsWith('.mp3')).map(label);
		expect(fout).toEqual([]);
	});

	it('staat op de actieve R2-bucket [ratchet]', () => {
		const fout = live.filter((e) => !e.mix.audioSrc.startsWith(ACTIEVE_BUCKET)).map(label);
		verwachtAchterstand(fout, ACHTERSTAND.liveOpLegacyBucket, 'live mixen op de legacy bucket');
	});
});

describe('mix-data: afbeeldingen', () => {
	const ontbreekt = (pad: string) => pad !== '' && !existsSync(join('public', pad));

	it('heeft elk `image_wide_small`-bestand echt in public/images/', () => {
		const fout = live.filter((e) => ontbreekt(e.mix.image_wide_small)).map((e) => `${label(e)}=${e.mix.image_wide_small}`);
		expect(fout).toEqual([]);
	});

	it('heeft elk `image_wide_large`-bestand echt in public/images/', () => {
		const fout = live.filter((e) => ontbreekt(e.mix.image_wide_large)).map((e) => `${label(e)}=${e.mix.image_wide_large}`);
		expect(fout).toEqual([]);
	});

	/**
	 * Dit was tot 2026-08-15 een ratchet op 25. Die 25 paden wezen naar `square/`-mappen die
	 * grotendeels niet bestaan, in een naamvolgorde die nergens op schijf voorkomt -- ze zijn dus
	 * nooit gegenereerd maar met de hand ingevuld. Ze zijn nu leeggemaakt in plaats van gerepareerd,
	 * want de afbeeldingen zijn niet af te leiden: een bestaande square is GEEN uitsnede van de
	 * bijbehorende wide (gemeten gemiddeld kanaalverschil 87.9 van 255), maar een aparte foto.
	 *
	 * Een leeg veld is daarmee de eerlijke waarde en wordt overgeslagen door `ontbreekt`. Wat een
	 * leeg veld niet mag zijn, is stil: de test hieronder bewaakt dat precies waar het zichtbaar
	 * wordt.
	 */
	it('heeft elk `image_square`-bestand echt in public/images/', () => {
		const fout = live.filter((e) => ontbreekt(e.mix.image_square)).map((e) => `${label(e)}=${e.mix.image_square}`);
		expect(fout).toEqual([]);
	});

	/**
	 * `image_square` wordt uitsluitend gerenderd door BasiskleurenCarousel, Erlenmeyers en
	 * VsKleurenCarousel, en die filteren alle drie op `featured === true`. Een featured entry met
	 * een leeg of ontbrekend square-veld levert daar dus een gebroken cover -- precies wat issue #46
	 * op drie van de acht liet zien. Dit is de wacht die daarop staat, en hij kijkt naar ALLE
	 * entries, want de acht covers zijn preview-entries met `ignore: true`.
	 */
	it('heeft voor elke featured entry een bestaand `image_square`', () => {
		const featured = alle.filter((e) => e.mix.featured);
		expect(featured.length).toBeGreaterThan(0);
		const fout = featured
			.filter((e) => !e.mix.image_square || ontbreekt(e.mix.image_square))
			.map((e) => `${label(e)}=${e.mix.image_square || '(leeg)'}`);
		expect(fout).toEqual([]);
	});
});

/**
 * PERMALINK -- HET VELD WAAR DE HELE ROUTING AAN HANGT
 *
 * Vier plekken leiden de URL-slug af uit `permalink`, en tot 2026-08-15 noemde deze suite het veld
 * geen enkele keer. `Playlist.tsx` doet `mix.permalink.split('/')` zonder guard, op data die met
 * `as MixData[]` wordt gecast -- de cast liegt daar namens de JSON, dus TypeScript vangt een
 * ontbrekend veld niet.
 *
 * Wat er zonder deze tests doorheen glipt:
 *   - een nieuwe mix zonder `permalink` -> TypeError bij het renderen van de mixkaart, dus de hele
 *     Luister-pagina valt om. De build merkt het niet: `generateStaticParams` slaat de entry over,
 *     dus de build slaagt met één pagina minder. (Sinds 2026-08-15 vangt de paginadrempel in
 *     `lint-web.ps1` dát laatste wél -- maar die zegt niet welk veld eronder zit.)
 *   - een typefout -> de playlist linkt naar een slug die niet bestaat, of de sitemap noemt een andere
 *   - twee mixen met dezelfde slug -> de tweede wordt onbereikbaar terwijl beide in de sitemap staan
 *
 * De slug wordt hier met dezelfde drie bewerkingen afgeleid als in `src/data/mixes/all.ts`, zodat
 * de test meet wat de code doet en niet wat de spec beweert.
 *
 * Alleen live mixen: de acht preview-entries hebben géén `permalink`, en dat hoort zo -- de spec
 * zegt dat hun velden leeg zijn. Ze leveren ook geen pagina.
 */
describe('mix-data: permalink en de slug die eraan hangt', () => {
	const slugVan = (permalink: string) => (permalink.split('/').pop() || '').split('.html')[0].toLowerCase().trim();

	it('heeft voor elke live mix een niet-lege `permalink`', () => {
		const fout = live.filter((e) => !e.mix.permalink || !e.mix.permalink.trim()).map(label);
		expect(fout).toEqual([]);
	});

	it('laat elke `permalink` op `.html` eindigen', () => {
		const fout = live.filter((e) => !e.mix.permalink.endsWith('.html')).map((e) => `${label(e)}="${e.mix.permalink}"`);
		expect(fout).toEqual([]);
	});

	it('leidt uit elke `permalink` een niet-lege slug af', () => {
		const fout = live.filter((e) => slugVan(e.mix.permalink) === '').map((e) => `${label(e)}="${e.mix.permalink}"`);
		expect(fout).toEqual([]);
	});

	it('houdt de afgeleide slugs uniek -- anders is de tweede mix onbereikbaar', () => {
		const slugs = live.map((e) => slugVan(e.mix.permalink));
		const dubbel = slugs.filter((s, i) => slugs.indexOf(s) !== i);
		expect(dubbel).toEqual([]);
	});

	it('laat de slug alleen url-veilige tekens bevatten', () => {
		const fout = live
			.filter((e) => !/^[a-z0-9-]+$/.test(slugVan(e.mix.permalink)))
			.map((e) => `${label(e)}="${slugVan(e.mix.permalink)}"`);
		expect(fout).toEqual([]);
	});
});

describe('mix-data: preview-entries', () => {
	const previews = alle.filter((e) => e.mix.ignore);

	it('heeft acht preview-entries, elk met een lege tracklist en tracks op 0', () => {
		expect(previews).toHaveLength(8);
		const fout = previews.filter((e) => e.mix.tracklist.length !== 0 || e.mix.tracks !== 0).map(label);
		expect(fout).toEqual([]);
	});

	it('gebruikt voor een preview geen datum-`id`', () => {
		const fout = previews.filter((e) => /^\d{8}$/.test(e.mix.id)).map(label);
		expect(fout).toEqual([]);
	});
});
