'use client';

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { BREAKPOINTS } from '@/constants/design';

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
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);

        // Maak een media query die EXACT matcht met je SCSS map ($breakpoints small: 811px)
        const mql = window.matchMedia(`(max-width: ${BREAKPOINTS.SMALL}px)`);

        const checkSize = (e: MediaQueryListEvent | MediaQueryList) => {
            setIsMobile(e.matches);
            if (!e.matches) {
                setIsOpen(false); // Sluit drawer als we naar desktop gaan
            }
        };

        // Voer de check direct uit zodra de component mount
        checkSize(mql);

        // Gebruik de moderne event listener voor media queries
        mql.addEventListener("change", checkSize);

        return () => mql.removeEventListener("change", checkSize);
    }, []);

    useEffect(() => {
        if (isMobile && isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isOpen, isMobile]);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

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
                        className={`row-c break-s w-fill ATC P30 drawer ${isMobile ? "ready" : "locked"} ${isOpen ? "open" : "closed"} ${wrapperClass}`}
                    >
                        {isMobile && (
                            <div className="column w-fill AMC P35 drawer-header">
                                <div className="headerTitleGroup">
                                    {icon && <div className="headerIcon">{icon}</div>}
                                    {title && <p className="headerTitleText">{title}</p>}
                                </div>
                                <button className="btn close" onClick={() => setIsOpen(false)}>✕</button>
                            </div>
                        )}

                        <div className="splitter mobile"></div>

                        <div className="column w-fill ATC P35 drawer-content">
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