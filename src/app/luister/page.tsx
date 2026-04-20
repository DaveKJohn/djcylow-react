'use client';

import { useState } from 'react';
import styles from '@/styles/modules/luister.module.scss';

import Filter from '@/components/luister/Filter';
import Playlist from '@/components/luister/Playlist';
import MobileContent from '@/components/ui/MobileContent';

export default function LuisterPage() {
    const [activeColor, setActiveColor] = useState('all');
    const [activeGenre, setActiveGenre] = useState('all');
    const [activePower, setActivePower] = useState('all');

    const FilterIcon = (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ display: 'block', minWidth: '20px' }}
        >
            <line x1="4" y1="21" x2="4" y2="14"></line>
            <line x1="4" y1="10" x2="4" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12" y2="3"></line>
            <line x1="20" y1="21" x2="20" y2="16"></line>
            <line x1="20" y1="12" x2="20" y2="3"></line>
            <line x1="1" y1="14" x2="7" y2="14"></line>
            <line x1="9" y1="8" x2="15" y2="8"></line>
            <line x1="17" y1="16" x2="23" y2="16"></line>
        </svg>
    );

    return (
        <main className={styles.pageWrapper}>
            {/* Banner bovenaan */}
            <section className="stack banner WoB" id="banner_2">
                <div className="column layer feather sides"></div>
                <div className="column layer feather bottom"></div>
                <div className="column layer spacing-4xl constrainer center title">
                    <h1>Luister</h1>
                </div>
            </section>

            {/* De container die op desktop alles naast elkaar zet */}
            <section className="column constrainer spacing-4xl WoB" id="luister">

                {/* LINKS: De resultaten (neemt de rest van de ruimte in) */}
                <div className="column spacing-4xl" id="luister_playlist">
                    <Playlist
                        activeColor={activeColor}
                        activeGenre={activeGenre}
                        activePower={activePower}
                    />
                </div>

                <div className="column full-w spacing-4xl" id="luister_filter">

                    {/* RECHTS: De filters (op desktop locked in de kolom, op mobiel een knop) */}
                    <MobileContent
                        title={<span style={{ color: 'white' }}>Filters</span>}
                        id="luister_filter_content"
                        icon={<span style={{ color: 'white', display: 'flex' }}>{FilterIcon}</span>}
                        trigger={(toggle) => (
                            /* De knop die alleen op mobiel verschijnt via CSS */
                            <div id="luister_filter_mobile_button" className="column">
                                <button
                                    className="row btn passive mobile-button v-center"
                                    onClick={toggle}
                                    aria-label="Filter openen"
                                >
                                    {FilterIcon}
                                    Filters
                                </button>
                            </div>
                        )}
                    >
                        {(toggle) => (
                            <Filter
                                activeColor={activeColor} setActiveColor={setActiveColor}
                                activeGenre={activeGenre} setActiveGenre={setActiveGenre}
                                activePower={activePower} setActivePower={setActivePower}
                            />
                        )}
                    </MobileContent>
                </div>
            </section>
        </main>
    );
}