"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Nav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();

    // We gebruiken 1080px omdat je SCSS "screen-size-medium" noemt bij de @include
    useEffect(() => {
        const checkSize = () => {
            const mobile = window.innerWidth <= 1080;
            setIsMobile(mobile);
            if (!mobile) {
                setIsMenuOpen(false);
                setActiveSubmenu(null);
            }
        };

        checkSize();
        window.addEventListener("resize", checkSize);
        return () => window.removeEventListener("resize", checkSize);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
        setActiveSubmenu(null);
    }, [pathname]);

    const handleSubmenuClick = (e: React.MouseEvent, menuId: string) => {
        if (!isMobile) return;
        if (activeSubmenu !== menuId) {
            e.preventDefault();
            setActiveSubmenu(menuId);
        } else {
            setIsMenuOpen(false);
        }
    };

    return (
        <nav className="column nav-wrapper WoB v-center black-100-bg">
            <div className="row">

                <div className="column logo-wrapper">
                    <Link href="/">
                        <Image
                            src="/images/djcylow_logo.webp"
                            width={160}
                            height={100}
                            alt="Logo"
                            style={{ height: 'auto' }} // Voeg dit toe
                        />
                    </Link>
                </div>

                {/* HIER GEBEURT HET: menu-wrapper krijgt 'mobile' en 'active' classes voor de SCSS */}
                <div
                    className={`row menu-wrapper ${isMobile ? "mobile" : "desktop"} ${isMenuOpen ? "active" : ""}`}
                    id="nav_menuWrapper"
                >
                    <div className="mobileMenuHeader-border">
                        <div className="row mobileMenuHeader-wrapper">
                            <button
                                className="btn nav previousBtn"
                                id="nav_mobileMenuHeader_previousBtn"
                                onClick={() => setActiveSubmenu(null)}
                                style={{ display: activeSubmenu ? 'flex' : 'none' }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path fill="currentColor" fillRule="evenodd" d="M5.293 8.793a1 1 0 0 1 1.414 0L12 14.086l5.293-5.293a1 1 0 1 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 0-1.414" clipRule="evenodd"></path>
                                </svg>
                            </button>
                            <button
                                className="btn nav close-btn"
                                id="nav_mobileMenuHeader_closeBtn"
                                onClick={() => setIsMenuOpen(false)}
                            >✕</button>
                        </div>
                    </div>

                    <div className={`view-wrapper ${activeSubmenu ? 'subList-view' : ''}`} id="nav_menuWrapper_viewWrapper">
                        <div className="row mainList-wrapper">
                          

                            {/* Luister */}
                            <ul className="btn mainList">
                                <li className=" row text-wrapper btn subList-wrapper">
                                    <Link className="btn has-subList" href="/luister">Luister</Link>
                                </li>
                            </ul>

                            {/* Music Mood Colours (Heeft geen submenu, dus geen extra classes nodig) */}
                            <ul className=" btn mainList">
                                <li className=" row text-wrapper btn subList-wrapper">
                                    <Link className="btn has-subList" href="/musicmoodcolours">Music Mood Colours</Link>
                                </li>
                            </ul>

                        </div>
                    </div>
                </div>

                <div className=" cta-wrapper">
                    <Link className="btn cta boek-nu-btn" href="/diensten">
                        <span>Boek nu!</span>
                    </Link>
                </div>

                <div className=" hidden-wrapper">
                    <button
                        className="btn nav hamburger-btn"
                        id="nav_hiddenWrapper_hamburgerBtn"
                        onClick={() => setIsMenuOpen(true)}
                    >☰</button>
                </div>

            </div>


        </nav>
    );
}