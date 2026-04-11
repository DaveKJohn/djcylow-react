"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Nav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);   
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false); 
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true); // Component is nu veilig geladen op de client
        const checkSize = () => {
            const mobile = window.innerWidth <= 1080;
            setIsMobile(mobile);
            if (!mobile) {
                setIsMenuOpen(false);                
            }
        };

        checkSize();
        window.addEventListener("resize", checkSize);
        return () => window.removeEventListener("resize", checkSize);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);       
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
                        <button
                            className="btn nav close-btn"
                            onClick={() => setIsMenuOpen(false)}
                        >✕</button>
                    </div>
                </div>

                <div className="mainList-wrapper">
                    <Link className="btn nav menu" href="/luister">Luister</Link>
                    <Link className="btn nav menu" href="/musicmoodcolours">Music Mood Colours</Link>
                </div>
            </div>

            <div className="cta-wrapper">
                <Link className="btn cta boek-nu-btn" href="/diensten">
                    <span>Boek nu!</span>
                </Link>
            </div>

            {/* Hamburger Button: Gebruik toggleMenu */}
            <div className="hidden-wrapper">
                <button className="btn nav hamburger-btn" onClick={(e) => {
                    e.preventDefault();
                    toggleMenu();
                }}
                    aria-label="Menu openen"
                >☰</button>
            </div>
        </nav>
    );
}