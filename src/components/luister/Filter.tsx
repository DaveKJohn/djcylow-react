'use client';

import '@/styles/components/luister/filter.scss';

// De acht kleuren van Music Mood Colours. Magenta ontbrak hier tot 2026-08-15, terwijl de
// mix-data hem wél kent en er een preview klaarligt in light-magenta.json -- `?color=magenta`
// liet de pagina daardoor omvallen.
const MOOD_DATA: Record<string, { colorVar: string; text: string }> = {
    yellow: { colorVar: '--yellow-default', text: 'avontuur · passie · ambitie · gretig' },
    cyan: { colorVar: '--cyan-default', text: 'vrolijk · feestelijk · gezellig · blij · sfeervol' },
    green: { colorVar: '--green-default', text: 'romantisch · vredig · euforisch · warm · trots' },
    orange: { colorVar: '--orange-default', text: 'inspirerend · episch · resoluut · heldhaftig' },
    red: { colorVar: '--red-default', text: 'eng · duister · luguber · beklemmend · vies' },
    magenta: { colorVar: '--magenta-default', text: 'geïrriteerd · gespannen · rusteloos · fel' },
    purple: { colorVar: '--purple-default', text: 'verdriet · pijn · verlies · rouw · schaamte' },
    blue: { colorVar: '--blue-default', text: 'neutraal · nuchter · stabiel · tevreden · serene' },
};

interface FilterProps {
    activeColor: string;
    setActiveColor: (color: string) => void;
    activeGenre: string;
    setActiveGenre: (genre: string) => void;
    activePower: string;
    setActivePower: (power: string) => void;
}

export default function Filter({ activeColor, setActiveColor, activeGenre, setActiveGenre, activePower, setActivePower }: FilterProps) {
    // Opzoeken in plaats van blind dereferencen. `activeColor` komt uit de URL en kan elke waarde
    // hebben; tot 2026-08-15 ging die rechtstreeks in MOOD_DATA[activeColor].colorVar, en elke
    // onbekende waarde gaf een TypeError tijdens de client-render. Er is geen error.tsx, dus dat
    // was een witte pagina.
    const mood = MOOD_DATA[activeColor];

    return (


        <div className="column w-fill AMC P65 spacing-3xl">
            {/* MOOD SECTIE */}
            <div className="column w-fill AMC spacing-xs">
                <div className="column w-fill AMC">
                    <p className="">Mood</p>
                </div>

                <div className="column w-fill AMC spacing-base">

                    <div className="row wrap w-fill AMC extra spacing-lg" id="filter_mood">
                        <button
                            key="all"
                            data-filter-color="all"
                            className={`btn passive select ${activeColor === 'all' ? 'is-active' : ''}`}
                            onClick={() => setActiveColor('all')}
                            aria-pressed={activeColor === 'all' ? 'true' : 'false'}
                        >
                            Alles
                        </button>
                        {Object.keys(MOOD_DATA).map(color => (
                            <button
                                key={color}
                                data-filter-color={color}
                                className={`btn passive select ${activeColor === color ? 'is-active' : ''}`}
                                onClick={() => setActiveColor(color)}
                                aria-pressed={activeColor === color ? 'true' : 'false'}
                            >
                                {color.charAt(0).toUpperCase() + color.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* MOOD OUTPUT - Nu met dynamische display: none/flex */}
                    <div className="column w-fill AMC extra spacing-xl" id="filter_mood_output" style={{ display: mood ? 'flex' : 'none' }}                   >
                        {mood && (
                            <div className="column w-fill AMC spacing-lg color-wrapper">
                                {/* De maat stond hier als inline style; op een SVG horen `width` en `height`
                                    gewoon als attribuut, en dan valt het buiten de inline-style-regel. */}
                                <svg className="column extra spacing-2xl" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" width="15" height="15">
                                    <circle cx="10" cy="10" r="9" fill={`var(${mood.colorVar})`}></circle>
                                </svg>
                                <p className="size-sm balanced">{mood.text}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="splitter "></div>

            {/* GENRE SECTIE */}
            <div className="column w-fill AMC spacing-xs">
                <div className="column spacing-2xl header">
                    <p className="">Genre</p>
                </div>
                <div className="row wrap w-fill AMC extra spacing-lg" id="filter_genre">
                    {['all', 'House', 'Techno', 'Drum & Bass', 'Nu-Disco'].map((genre) => {
                        const displayLabel = {
                            'all': 'Alles',
                            'House': 'House',
                            'Drum & Bass': 'Drum & Bass',
                            'Techno': 'Techno',
                            'Nu-Disco': 'Nu-Disco'
                        }[genre] || genre;

                        return (
                            <button
                                key={genre}
                                className={`btn passive select ${activeGenre === genre ? 'is-active' : ''}`}
                                onClick={() => setActiveGenre(genre)}
                                aria-pressed={activeGenre === genre ? 'true' : 'false'}
                            >
                                {displayLabel}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="splitter"></div>

            {/* INTENSITEIT SECTIE */}
            <div className="column w-fill AMC spacing-xs">
                <div className="column spacing-2xl header">
                    <p className="">Intensiteit</p>
                </div>
                <div className="row wrap w-fill AMC extra spacing-lg" id="filter_power">
                    {['all', 'Full', 'Light'].map((power) => (
                        <button
                            key={power}
                            className={`btn passive select ${activePower === power ? 'is-active' : ''}`}
                            onClick={() => setActivePower(power)}
                            aria-pressed={activePower === power ? 'true' : 'false'}
                        >
                            {power === 'all' ? 'Alles' : power.charAt(0).toUpperCase() + power.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

        </div>

    );
}