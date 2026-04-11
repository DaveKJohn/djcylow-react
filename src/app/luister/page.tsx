'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/modules/luister.module.scss';

import Filter from '@/components/luister/Filter';
import FilterResult from '@/components/luister/FilterResult';
import { usePathname } from "next/navigation";

export default function LuisterPage() {
    const [activeColor, setActiveColor] = useState('all');
    const [activeGenre, setActiveGenre] = useState('all');
    const [activePower, setActivePower] = useState('all');

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
        const checkSize = () => {
            const mobile = window.innerWidth <= 1080;
            setIsMobile(mobile);
            if (!mobile) {
                setIsFilterOpen(false);

            }
        };

        checkSize();
        window.addEventListener("resize", checkSize);
        return () => window.removeEventListener("resize", checkSize);
    }, []);

    useEffect(() => {
        setIsFilterOpen(false);
    }, [pathname]);

    // Toggle functie die betrouwbaarder is
    const toggleFilter = () => {
        setIsFilterOpen((prev) => !prev);
    };

    // Voorkom renderen totdat de client-side code klaar is
    if (!mounted) return null;

    return (
        <main className={styles.pageWrapper}>

            <section className="stack banner WoB" id="banner_2">
                <div className="column layer feather sides"></div>
                <div className="column layer feather bottom"></div>
                <div className="column layer spacing-4xl constrainer center title">
                    <h1>Luister</h1>
                </div>
            </section>


            <section className="column constrainer hidden-wrapper2 WoB" id="luister_mobile_button">
                <button className="btn passive filter-btn" onClick={(e) => {
                    e.preventDefault();
                    toggleFilter();
                }}
                    aria-label="Filter openen"
                >Filter</button>
            </section>


            <section className="row constrainer spacing-6xl WoB" id="luister_row">

                <div className="column spacing-4xl" id="luister_row_filterResult">

                    <FilterResult
                        activeColor={activeColor}
                        activeGenre={activeGenre}
                        activePower={activePower}
                    />

                </div>



                <div className={`column filter-wrapper ${isMobile ? "mobile" : "desktop"} ${isFilterOpen ? "active" : ""}`} id="luister_row_filter">

                    <div className="column mobileFilterHeader-border">
                        <div className="row mobileFilterHeader-wrapper">
                            <button
                                className="btn filter close-btn"
                                onClick={() => setIsFilterOpen(false)}
                            >✕</button>
                        </div>
                    </div>

                    <div className="column spacing-2xl mainList-wrapper">
                        <Filter
                            activeColor={activeColor} setActiveColor={setActiveColor}
                            activeGenre={activeGenre} setActiveGenre={setActiveGenre}
                            activePower={activePower} setActivePower={setActivePower}
                        />
                    </div>
                </div>




            </section>




        </main>
    );
}