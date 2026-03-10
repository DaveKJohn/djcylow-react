'use client';

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
        <div className="column wrapper spacing-lg black-90-bg in-push-6xl">
            {/* Header Deel */}
            <div className="column text-wrapper spacing-lg show_border_bottom">
                <div className="column text-wrapper spacing-lg">
                    <h2>Filter</h2>
                </div>
                <div className="column text-wrapper spacing-lg center">
                    <p className="size-base">Kies hieronder één van de 8 music moods.</p>
                </div>
            </div>

            {/* Content Deel */}
            <div className="column text-wrapper spacing-lg h-push-5xl">

                {/* MOOD SECTIE */}
                <div className="column wrapper spacing-lg">
                    <div className="column text-wrapper spacing-lg header">
                        <h3>Mood</h3>
                    </div>
                    <div className="row wrapper spacing-lg center wrap show_border_bottom" id="filter_mood">
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
                                // VOEG DIT TOE:
                                data-filter-color={color}
                                className={`btn passive select ${activeColor === color ? 'is-active' : ''}`}
                                onClick={() => setActiveColor(color)}
                                aria-pressed={activeColor === color ? 'true' : 'false'}
                            >
                                {color.charAt(0).toUpperCase() + color.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* MOOD OUTPUT - Nu met dynamische display: none/flex */}
                <div
                    className="column wrapper spacing-lg center show_border_bottom"
                    id="filter_mood_output"
                    style={{ display: activeColor === 'all' ? 'none' : 'flex' }}
                >
                    {activeColor !== 'all' && (
                        <div className="row text-wrapper spacing-lg color-wrapper center flex">
                            <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style={{ width: '15px', height: '15px' }}>
                                <circle cx="10" cy="10" r="9" fill={`var(${MOOD_DATA[activeColor].colorVar})`}></circle>
                            </svg>
                            <p className="output">{MOOD_DATA[activeColor].text}</p>
                        </div>
                    )}
                </div>

                {/* GENRE SECTIE */}
                <div className="column wrapper spacing-lg center show_border_bottom">
                    <div className="column text-wrapper spacing-lg header">
                        <h3>Genre</h3>
                    </div>
                    <div className="wrapper spacing-lg row center wrap" id="filter_genre">
                        {['all', 'edm', 'drum & bass'].map((genre) => (
                            <button
                                key={genre}
                                className={`btn passive select ${activeGenre === genre ? 'is-active' : ''}`}
                                onClick={() => setActiveGenre(genre)}
                                aria-pressed={activeGenre === genre ? 'true' : 'false'}
                            >
                                {genre === 'all' ? 'Alles' : genre === 'edm' ? 'EDM' : 'Drum&Bass'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* INTENSITEIT SECTIE */}
                <div className="column wrapper spacing-lg center">
                    <div className="column text-wrapper spacing-lg header">
                        <h3>Intensiteit</h3>
                    </div>
                    <div className="row wrapper spacing-lg center wrap" id="filter_power">
                        {['all', 'full', 'light'].map((power) => (
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
        </div>
    );
}