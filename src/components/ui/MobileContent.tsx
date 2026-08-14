'use client';

import { useState, useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { BREAKPOINTS } from '@/constants/design';

// Matcht EXACT met de SCSS map ($breakpoints small: 811px).
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
    // bijwerken -- precies waar effects voor bedoeld zijn.
    useEffect(() => {
        if (isMobile && isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isOpen, isMobile]);

    const toggle = () => setIsOpen(prev => !prev);

    return (
        <>
            {/* 1. Eerst de drawer (nav_menu_content) */}
            {mounted && (
                <>
                    {isMobile && (
                        <div
                            className={`drawer-overlay ${isOpen ? "active" : ""}`}
                            onClick={() => setIsOpen(false)}
                        />
                    )}

                    <div
                        id={id}
                        className={`row-c break-s ATC P50 drawer ${isMobile ? "ready" : "locked"} ${isOpen ? "open" : "closed"} ${wrapperClass}`}
                    >
                        {isMobile && (
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
                </>
            )}

            {/* 2. Daarna pas de trigger (de button) */}
            {trigger(toggle)}
        </>
    );
}