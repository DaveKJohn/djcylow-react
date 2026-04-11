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
        <div className="column spacing-3xl">

            {/* MOOD SECTIE */}
            <div className="column spacing-xs show_border_bottom center">
                <div className="column center spacing-2xl  header">
                    <p className="bold">Mood</p>
                </div>

                <div className="column spacing-3xl center">

                    <div className="row wrap center extra spacing-lg" id="filter_mood">
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
                    <div
                        className="column center spacing-xl" id="filter_mood_output" style={{ display: activeColor === 'all' ? 'none' : 'flex' }}
                    >
                        {activeColor !== 'all' && (
                            <div className="column spacing-lg color-wrapper center">
                                <svg className="column extra spacing-2xl" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style={{ width: '15px', height: '15px' }}>
                                    <circle cx="10" cy="10" r="9" fill={`var(${MOOD_DATA[activeColor].colorVar})`}></circle>
                                </svg>
                                <p className="size-sm balanced">{MOOD_DATA[activeColor].text}</p>
                            </div>
                        )}
                    </div>

                </div>

            </div>



            {/* GENRE SECTIE */}
            <div className="column spacing-xs center show_border_bottom">
                <div className="column spacing-2xl header">
                    <p className="bold">Genre</p>
                </div>
                <div className="row center wrap full-w spacing-xl" id="filter_genre">
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

            {/* INTENSITEIT SECTIE */}
            <div className="column spacing-xs center">
                <div className="column spacing-2xl header">
                    <p className="bold">Intensiteit</p>
                </div>
                <div className="row center wrap full-w spacing-xl" id="filter_power">
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