'use client';

import { useState, useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { BREAKPOINTS } from '@/constants/design';

// Deze query moet EXACT gelijk lopen met `$breakpoints: small` in
// src/styles/abstracts/_config.scss -- dat is de breedte waarop de styling omschakelt, en als de
// twee uit elkaar lopen schakelt de drawer op een andere breedte dan het uiterlijk.
//
// Er stond hier tot 2026-08-15 een comment dat een andere waarde claimde (achthonderdelf) dan de
// twee bronnen: die zeggen allebei 884. Wie dat comment geloofde en de constante "corrigeerde",
// ontkoppelde precies wat het comment beloofde te bewaken. Het getal staat hier bewust voluit
// geschreven en niet als cijfers, want de test hieronder weigert elk pixelgetal in dit bestand dat
// geen echte breakpoint is -- en dat hoort ook voor een historische verwijzing te gelden.
//
// Sinds die datum is het geen afspraak meer maar een test: `tests/breakpoints.test.ts` leest beide
// bestanden en faalt zodra ze verschillen.
const MOBILE_QUERY = `(max-width: ${BREAKPOINTS.SMALL}px)`;

// De viewport is een externe bron, geen state van deze component. Met subscribe + snapshot leest
// React hem rechtstreeks uit, in plaats van hem na te bouwen in state die een effect moet bijwerken.
// De serversnapshot is false: bij de static export is er geen viewport om te meten.
const subscribeToViewport = (onChange: () => void) => {
    const mql = window.matchMedia(MOBILE_QUERY);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
};
const getIsMobile = () => window.matchMedia(MOBILE_QUERY).matches;
const getIsMobileOnServer = () => false;

// Hetzelfde procede voor "draait dit al in de browser?" -- de vraag die de oude mounted-vlag stelde.
// Server zegt nee, client zegt ja, en de waarde verandert daarna nooit meer; vandaar een subscribe
// die niets doet. De gerenderde HTML blijft hierdoor identiek aan die van de mounted-vlag.
const subscribeNever = () => () => { };
const getMountedOnClient = () => true;
const getMountedOnServer = () => false;

/**
 * De scroll-lock op `document.body`, geteld in plaats van geschreven.
 *
 * WAAROM EEN TELLER EN NIET GEWOON EEN TOEWIJZING. Op /luister leven er TWEE instanties van deze
 * component naast elkaar: de nav-drawer en de filter-drawer. Tot 2026-08-15 schreef elke instantie
 * rechtstreeks `document.body.style.overflow`, en het effect gaf geen cleanup terug. Dat gaf twee
 * manieren om de pagina onbruikbaar of onbeschermd achter te laten:
 *
 *   (a) Unmount met de drawer open -- browser-back weg van /luister met het filterpaneel open --
 *       liet `overflow: hidden` staan. De VOLGENDE pagina was dan niet meer scrollbaar.
 *   (b) De nav-instantie hoefde alleen zijn eigen effect opnieuw te draaien (een oriëntatiewissel
 *       klapt `isMobile` voor beide instanties om) om met `isOpen === false` de lock te WISSEN
 *       terwijl de filterdrawer nog openstond.
 *
 * Met een teller kan geen van beide: de lock gaat aan bij de eerste die hem neemt en pas uit bij de
 * laatste die hem teruggeeft. De oorspronkelijke waarde wordt bewaard en hersteld in plaats van
 * hardgecodeerd leeggemaakt, zodat een stylesheet die `body { overflow-y: auto }` zet -- en dat doet
 * `base/_reset.scss` -- niet stilletjes wordt overschreven.
 *
 * Module-scope en niet component-scope: dat is precies het punt. De twee instanties moeten dezelfde
 * teller delen.
 */
let scrollLocks = 0;
let vorigeOverflow: string | null = null;

function lockScroll(): () => void {
    if (scrollLocks === 0) {
        vorigeOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
    }
    scrollLocks += 1;

    let vrijgegeven = false;
    return () => {
        // Guard tegen dubbel vrijgeven: React kan een cleanup in StrictMode twee keer aanroepen, en
        // dan zou de teller onder nul zakken en de lock te vroeg loslaten.
        if (vrijgegeven) return;
        vrijgegeven = true;

        scrollLocks -= 1;
        if (scrollLocks === 0) {
            document.body.style.overflow = vorigeOverflow ?? '';
            vorigeOverflow = null;
        }
    };
}

interface MobileContentProps {
    title?: React.ReactNode;
    icon?: React.ReactNode;
    wrapperClass?: string;
    id?: string;
    trigger: (toggle: () => void) => React.ReactNode;
    children: React.ReactNode | ((toggle: () => void) => React.ReactNode);
}

export default function MobileContent({
    children,
    trigger,
    title,
    wrapperClass = "",
    id,
    icon
}: MobileContentProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const isMobile = useSyncExternalStore(subscribeToViewport, getIsMobile, getIsMobileOnServer);
    const mounted = useSyncExternalStore(subscribeNever, getMountedOnClient, getMountedOnServer);

    // De drawer gaat dicht bij twee gebeurtenissen: naar desktop schalen, en navigeren. Allebei
    // gebeuren ze buiten deze component, en allebei worden ze hier tijdens de render afgehandeld in
    // plaats van in een effect -- dan sluit de drawer nog voor de browser schildert, zonder de
    // zichtbare tussenstap die een effect na de paint oplevert.
    const [prevIsMobile, setPrevIsMobile] = useState(isMobile);
    if (prevIsMobile !== isMobile) {
        setPrevIsMobile(isMobile);
        if (!isMobile) {
            setIsOpen(false);
        }
    }

    const [prevPathname, setPrevPathname] = useState(pathname);
    if (prevPathname !== pathname) {
        setPrevPathname(pathname);
        setIsOpen(false);
    }

    // Dit blijft wel een effect: het schrijft naar document.body, en dat is een extern systeem
    // bijwerken -- precies waar effects voor bedoeld zijn. Wat er WEL bij moest is een cleanup en
    // een teller; zie `lockScroll` hierboven voor waarom.
    useEffect(() => {
        if (!(isMobile && isOpen)) return;
        return lockScroll();
    }, [isOpen, isMobile]);

    const toggle = () => setIsOpen(prev => !prev);

    return (
        <>
            {/* 1. Eerst de drawer (nav_menu_content)

                De `mounted`-poort stond tot 2026-08-15 om dit hele blok heen, inclusief de children.
                De serversnapshot van `mounted` is `false`, dus de inhoud belandde niet in de
                statische HTML: van de navigatie stonden alleen het logo en de hamburger in
                `out/*.html`, en geen enkele pagina bevatte een link naar /luister (issue #43).

                Die poort is nodig tegen een hydratie-mismatch van de *class* -- `ready` of `locked`
                hangt af van de viewport, die de server niet kent -- maar niet van de *inhoud*.
                Daarom hangt hij nu alleen nog aan de mobiel-specifieke onderdelen en aan de
                classnaam. Op de server levert dat de desktopvorm (`locked closed`) met de links
                erin, en dat is precies wat een crawler hoort te zien. */}
            {mounted && isMobile && (
                <div
                    className={`drawer-overlay ${isOpen ? "active" : ""}`}
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div
                id={id}
                className={`row-c break-s ATC P50 drawer ${mounted && isMobile ? "ready" : "locked"} ${isOpen ? "open" : "closed"} ${wrapperClass}`}
            >
                {mounted && isMobile && (
                    <div className="column w-fill AMC P55 drawer-header">
                        <div className="headerTitleGroup">
                            {icon && <div className="headerIcon">{icon}</div>}
                            {title && <p className="headerTitleText">{title}</p>}
                        </div>
                        <button className="btn close" onClick={() => setIsOpen(false)}>✕</button>
                    </div>
                )}

                <div className="splitter mobile"></div>

                <div className="column w-fill ATC P55 drawer-content">
                    {typeof children === 'function' ? children(toggle) : children}
                </div>
            </div>

            {/* 2. Daarna pas de trigger (de button) */}
            {trigger(toggle)}
        </>
    );
}