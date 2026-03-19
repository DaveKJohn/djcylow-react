"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Nav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false); // Nieuw: check of component geladen is
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true); // Component is nu veilig geladen op de client
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

    // Toggle functie die betrouwbaarder is
    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    // Voorkom renderen totdat de client-side code klaar is
    if (!mounted) return null;

    return (
        <nav className="row WoB">
            <div className="column logo-wrapper">
                <Link href="/">
                    <Image
                        src="/images/djcylow_logo.webp"
                        width={160}
                        height={100}
                        alt="Logo"
                        style={{ height: 'auto' }}
                        priority // Logo in nav mag priority hebben voor LCP
                    />
                </Link>
            </div>

            {/* Menu Wrapper */}
            <div className={`menu-wrapper ${isMobile ? "mobile" : "desktop"} ${isMenuOpen ? "active" : ""}`} id="nav_menuWrapper">
                <div className="column mobileMenuHeader-border">
                    <div className="row mobileMenuHeader-wrapper">
                        {activeSubmenu && (
                            <button
                                className="btn nav previousBtn"
                                onClick={() => setActiveSubmenu(null)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path fill="currentColor" fillRule="evenodd" d="M5.293 8.793a1 1 0 0 1 1.414 0L12 14.086l5.293-5.293a1 1 0 1 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 0-1.414" clipRule="evenodd"></path>
                                </svg>
                            </button>
                        )}
                        <button
                            className="btn nav close-btn"
                            onClick={() => setIsMenuOpen(false)}
                        >✕</button>
                    </div>
                </div>

                <div className="mainList-wrapper">
                    <Link className="btn" href="/luister">Luister</Link>
                    <Link className="btn" href="/musicmoodcolours">Music Mood Colours</Link>
                </div>
            </div>

            <div className="cta-wrapper">
                <Link className="btn cta boek-nu-btn" href="/diensten">
                    <span>Boek nu!</span>
                </Link>
            </div>

            {/* Hamburger Button: Gebruik toggleMenu */}
            <div className="hidden-wrapper">
                <button
                    className="btn nav hamburger-btn"
                    onClick={(e) => {
                        e.preventDefault();
                        toggleMenu();
                    }}
                    aria-label="Menu openen"
                >☰</button>
            </div>
        </nav>
    );
}