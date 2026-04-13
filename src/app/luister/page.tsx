'use client';

import { useState } from 'react';
import styles from '@/styles/modules/luister.module.scss';

import Filter from '@/components/luister/Filter';
import FilterResult from '@/components/luister/FilterResult';
import MobileContent from '@/components/ui/MobileContent';

export default function LuisterPage() {
    const [activeColor, setActiveColor] = useState('all');
    const [activeGenre, setActiveGenre] = useState('all');
    const [activePower, setActivePower] = useState('all');

    return (
        <main className={styles.pageWrapper}>
            <section className="stack banner WoB" id="banner_2">
                <div className="column layer feather sides"></div>
                <div className="column layer feather bottom"></div>
                <div className="column layer spacing-4xl constrainer center title">
                    <h1>Luister</h1>
                </div>
            </section>

            {/* 1. De mobiele trigger knop moet BOVEN de rij staan op mobiel */}
            <MobileContent
                title="Filters"
                wrapperClass="filter-wrapper"
                trigger={(toggle) => (
                    <section className="column constrainer hidden-wrapper2 WoB" id="luister_mobile_button">
                        <button
                            className="btn passive filter-btn"
                            onClick={toggle}
                            aria-label="Filter openen"
                        >
                            Filter
                        </button>
                    </section>
                )}
            >
                <Filter
                    activeColor={activeColor} setActiveColor={setActiveColor}
                    activeGenre={activeGenre} setActiveGenre={setActiveGenre}
                    activePower={activePower} setActivePower={setActivePower}
                />
            </MobileContent>

            {/* 2. De rij met resultaten en (op desktop) de zijbalk filters */}
            <section className="row constrainer spacing-6xl WoB" id="luister_row" style={{ alignItems: 'flex-start' }}>
                <div className="column spacing-4xl" id="luister_row_filterResult">
                    <FilterResult
                        activeColor={activeColor}
                        activeGenre={activeGenre}
                        activePower={activePower}
                    />
                </div>
              
            </section>
        </main>
    );
}