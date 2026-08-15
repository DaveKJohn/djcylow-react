import { Suspense } from 'react';
import styles from '@/styles/modules/luister.module.scss';

import LuisterFilters from '@/components/luister/LuisterFilters';
import PlaylistFallback from '@/components/luister/PlaylistFallback';

/**
 * De luisterpagina. Dit bestand is bewust GEEN client component.
 *
 * Tot 2026-08-15 stond hier `'use client'` boven een component die `useSearchParams()` gebruikte
 * en volledig in een `<Suspense>` zonder fallback zat. Bij `output: 'export'` bailt Next zo'n
 * subtree uit de prerender, dus `out/luister.html` bevatte geen `<main>`, geen `<h1>` en geen
 * enkele mixlink -- alleen `<div hidden><!--$--><!--/$--></div>` (issue #43).
 *
 * Nu staat alles wat niet van de URL afhangt buiten de Suspense-grens, en heeft die grens een
 * fallback die de volledige mixlijst server-rendert. Beide belanden in de statische HTML.
 */
export default function LuisterPage() {
    return (
        <main className={styles.pageWrapper}>
            {/* Banner bovenaan */}
            <section className="WoB column w-fill AMC P15 v-push-4xl" id="luister">

                <div className="column w-fill AMC P20 spacing-2xl" id="luister_banner">
                    <div className="column AMC constrainer">
                        <div className="column w-fill AMC P30-banner">
                            <div className="column w-fill AMC P35">
                                <h1>Luister</h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="column w-fill AMC P20 spacing-2xl " id="luister_content">
                    <div className="row-c break-s ATC constrainer">
                        <Suspense fallback={<PlaylistFallback />}>
                            <LuisterFilters />
                        </Suspense>
                    </div>
                </div>
            </section>
        </main>
    );
}
