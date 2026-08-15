'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

import Filter from '@/components/luister/Filter';
import Playlist from '@/components/luister/Playlist';
import MobileContent from '@/components/ui/MobileContent';

/**
 * Het deel van /luister dat van de URL afhangt: de playlist met zijn filters.
 *
 * Dit zat tot 2026-08-15 samen met de banner en de `<h1>` in één client component, waardoor de
 * hele pagina uit de statische prerender viel (issue #43). Alles wat niet van `searchParams`
 * afhangt staat nu in `src/app/luister/page.tsx`, buiten de Suspense-grens.
 */

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

export default function LuisterFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Genormaliseerd op één plek. De kleur komt rechtstreeks uit de URL en die kan alles zijn:
    // `?color=Red` met een hoofdletter is een reeel geval, want de mixpagina's linken zo terug.
    const activeColor = (searchParams.get('color') ?? 'all').toLowerCase();
    const activeGenre = searchParams.get('genre') ?? 'all';
    const activePower = searchParams.get('power') ?? 'all';

    const setFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === 'all') {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    };

    return (
        <>
            <Playlist
                activeColor={activeColor}
                activeGenre={activeGenre}
                activePower={activePower}
            />

            <div className="column w-fix AMC P30 spacing-xl " id="luister_content_filter">
                <div className="column w-fill AMC P35 spacing-xl">
                    <div className="column w-fill AMC P40 spacing-xl fill-90">
                        <div className="column w-fill AMC P45 spacing-xl">

                            {/* RECHTS: De filters (op desktop locked in de kolom, op mobiel een knop) */}
                            <MobileContent
                                title="Filters"
                                id="luister_content_filter_drawer"
                                icon={FilterIcon}
                                trigger={(toggle) => (
                                    <div
                                        id="luister_content_filter_mobile_button"
                                        className="column w-fill AMC P50 btn"
                                        onClick={toggle}
                                        role="button"
                                        tabIndex={0}
                                        aria-label="Filter openen"
                                    >
                                        <div className="row w-fill AMC P55 spacing-xl">
                                            {FilterIcon}
                                            <span>Filters</span>
                                        </div>
                                    </div>
                                )}
                            >
                                {() => (
                                    <div className="column w-fill AML P60 break-s spacing-2xl">
                                        <Filter
                                            activeColor={activeColor}
                                            setActiveColor={(v: string) => setFilter('color', v)}
                                            activeGenre={activeGenre}
                                            setActiveGenre={(v: string) => setFilter('genre', v)}
                                            activePower={activePower}
                                            setActivePower={(v: string) => setFilter('power', v)}
                                        />
                                    </div>
                                )}
                            </MobileContent>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
