import Link from 'next/link';

import { liveMixes, mixSlug } from '@/data/mixes/all';
import '@/styles/components/luister/playlist.scss';

/**
 * De server-gerenderde mixlijst, gebruikt als Suspense-fallback op /luister.
 *
 * Dit bestand bestaat om issue #43 op te lossen. `/luister` is één client component die
 * `useSearchParams()` gebruikt, en bij `output: 'export'` bailt Next zo'n subtree uit de
 * prerender. De Suspense-grens had geen fallback, dus wat er in `out/luister.html` belandde was
 * letterlijk `<div hidden><!--$--><!--/$--></div>`: geen `<main>`, geen `<h1>`, en geen enkele
 * link naar de 77 mixpagina's die `sitemap.ts` wél op priority 0.8 aanmeldt.
 *
 * Een fallback wordt wél in de statische HTML gezet. Bezoekers met JavaScript zien hem alleen
 * tijdens de hydratie; crawlers zonder JS-rendering, link-previews en no-JS-bezoekers zien hier
 * de volledige lijst in plaats van een lege pagina.
 *
 * Bewust zonder AudioPlayer: die is client-only en zou de subtree opnieuw uit de prerender halen.
 * De kaart toont dezelfde afbeelding, titel en datum.
 */
export default function PlaylistFallback() {
    return (
        <div className="column w-fill AMC P30 spacing-xl " id="luister_content_playlist">
            <div className="column w-fill AMC P35 spacing-xl">
                <div className="row wrap w-fill AMC P40-xl spacing-xl fill-90">
                    {liveMixes.map((mix) => (
                        <div key={mix.id} className="column w-hug AML P45 spacing-xl card">
                            {/* eslint-disable-next-line @next/next/no-img-element -- next/image doet
                                bij unoptimized: true geen resizing en geen formaatconversie, en voegt
                                lazy loading toe. Dezelfde afweging als in Hero. */}
                            <img
                                src={mix.image_wide_small}
                                alt={`${mix.color} ${mix.subgenre} Mix · ${mix.volume}`}
                                width={320}
                                height={180}
                            />
                            <div className="column w-hug AML ">
                                <div className="column w-hug AML spacing-xs">
                                    <Link className="size-sm" href={`/luister/mix/${mixSlug(mix)}`}>
                                        {mix.color} {mix.subgenre} Mix · {mix.volume}
                                    </Link>
                                    <p className="size-xs">{mix.maand} {mix.dag}, {mix.jaar}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
