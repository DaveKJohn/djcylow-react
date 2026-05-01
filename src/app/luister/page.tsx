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
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
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
            <section className="WoB column w-fill AMC P10 spacing-xl fill-100" id="luister">

                <div className="column w-fill AMC P20 spacing-2xl" id="luister_banner">
                    <div className="column w-fix AMC constrainer">
                        <div className="column w-fill AMC P30-banner">
                            <div className="column w-fill AMC P35">
                                <h1>Luister</h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="column w-hug AMC P20 spacing-2xl" id="luister_content">
                    <div className="row-c break-s w-fix ATC constrainer spacing-5xl">



                        <Playlist
                            activeColor={activeColor}
                            activeGenre={activeGenre}
                            activePower={activePower}
                        />


                        <div className="column w-fill AMC P30 spacing-2xl fill-90 " id="luister_content_filter">

                            {/* RECHTS: De filters (op desktop locked in de kolom, op mobiel een knop) */}
                            <MobileContent
                                title="Filters"
                                id="luister_content_filter_drawer"
                                icon={FilterIcon}
                                trigger={(toggle) => (
                                    <div
                                        id="luister_content_filter_mobile_button"
                                        className="column w-fill AMC P30 btn"
                                        onClick={toggle}
                                        role="button"
                                        tabIndex={0} // Gebruik accolades voor een number
                                        aria-label="Filter openen"
                                    >
                                        <div className="row w-fill AMC P35 spacing-xl">
                                            {FilterIcon}
                                            <span>Filters</span>
                                        </div>
                                    </div>
                                )}
                            >
                                {() => (
                                    <div className="column w-fill AML P40 break-s spacing-2xl">
                                        <Filter
                                            activeColor={activeColor}
                                            setActiveColor={setActiveColor}
                                            activeGenre={activeGenre}
                                            setActiveGenre={setActiveGenre}
                                            activePower={activePower}
                                            setActivePower={setActivePower}
                                        />
                                    </div>
                                )}
                            </MobileContent>
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}