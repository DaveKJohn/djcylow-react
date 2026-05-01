'use client';

// @ts-ignore
import '@/styles/components/luister/filter.scss';

const MOOD_DATA: Record<string, { colorVar: string; text: string }> = {
    yellow: { colorVar: '--yellow-default', text: 'avontuur · passie · ambitie · gretig' },
    cyan: { colorVar: '--cyan-default', text: 'vrolijk · feestelijk · gezellig · blij · sfeervol' },
    green: { colorVar: '--green-default', text: 'romantisch · vredig · euforisch · warm · trots' },
    orange: { colorVar: '--orange-default', text: 'inspirerend · episch · resoluut · heldhaftig' },
    red: { colorVar: '--red-default', text: 'eng · duister · Luguber · beklemmend · vies' },
    purple: { colorVar: '--purple-default', text: 'verdriet · pijn · verlies · rouw · schaamte' },
    blue: { colorVar: '--blue-default', text: 'neutraal · nuchter · stabiel · tevreden · serene' },
};

export default function Filter({ activeColor, setActiveColor, activeGenre, setActiveGenre, activePower, setActivePower }: any) {
    return (


        <div className="column w-fill AMC P35 spacing-2xl">
            {/* MOOD SECTIE */}
            <div className="column w-fill AMC spacing-xs">
                <div className="column w-fill AMC">
                    <p className="">Mood</p>
                </div>

                <div className="column w-fill AMC spacing-base">

                    <div className="row wrap w-fill AMC extra spacing-lg" id="filter_mood">
                        <button
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
                    <div className="column w-fill AMC extra spacing-xl" id="filter_mood_output" style={{ display: activeColor === 'all' ? 'none' : 'flex' }}                   >
                        {activeColor !== 'all' && (
                            <div className="column w-fill AMC spacing-lg color-wrapper">
                                <svg className="column extra spacing-2xl" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style={{ width: '15px', height: '15px' }}>
                                    <circle cx="10" cy="10" r="9" fill={`var(${MOOD_DATA[activeColor].colorVar})`}></circle>
                                </svg>
                                <p className="size-sm balanced">{MOOD_DATA[activeColor].text}</p>
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
                    {['all', 'EDM', 'Drum & Bass'].map((genre) => (
                        <button
                            key={genre}
                            className={`btn passive select ${activeGenre === genre ? 'is-active' : ''}`}
                            onClick={() => setActiveGenre(genre)}
                            aria-pressed={activeGenre === genre ? 'true' : 'false'}
                        >
                            {genre === 'all' ? 'Alles' : genre === 'EDM' ? 'EDM' : 'DNB'}
                        </button>
                    ))}
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