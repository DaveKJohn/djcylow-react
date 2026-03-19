'use client';

import { useState } from 'react';
import styles from '@/styles/modules/luister.module.scss';

import Filter from '@/components/luister/Filter';
import Luister from '@/components/luister/FilterResult';


export default function LuisterPage() {
    const [activeColor, setActiveColor] = useState('all');
    const [activeGenre, setActiveGenre] = useState('all');
    const [activePower, setActivePower] = useState('all');

    return (
        <main className={styles.pageWrapper}>




            {/* 2. Filter & Content Sectie */}
            <section className="center WoB">

                <div className="stack banner WoB" id="banner_2">

                    <div className="column layer feather sides"></div>

                    <div className="column layer feather bottom"></div>

                    <div className="column layer spacing-4xl constrainer center title">
                        <h1>Luister</h1>
                    </div>
                </div>

                <div className="column slideshow spacing-8xl">


                    <div className="column constrainer">
                        <Filter
                            activeColor={activeColor} setActiveColor={setActiveColor}
                            activeGenre={activeGenre} setActiveGenre={setActiveGenre}
                            activePower={activePower} setActivePower={setActivePower}
                        />
                    </div>

                    <div className="column constrainer">
                        <Luister
                            activeColor={activeColor}
                            activeGenre={activeGenre}
                            activePower={activePower}
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}