"use client";

import Link from "next/link";
import Image from "next/image";
import MobileContent from "@/components/ui/MobileContent";

export default function Nav() {

    const HamburgerIcon = (
        <svg
            width="28"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="2" y1="3" x2="22" y2="3"></line>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <line x1="2" y1="21" x2="22" y2="21"></line>
        </svg>
    );

    return (
        <nav className="row WoB">
            <div className="column" id="nav_logo">
                <Link href="/">
                    <Image
                        src="/images/djcylow_logo.webp"
                        width={160} height={100}
                        alt="Logo" priority
                        style={{ height: 'auto' }}
                    />
                </Link>
            </div>

            <div className="column" id="nav_menu">

                <MobileContent
                    id="nav_menu_content"
                    trigger={(toggle) => (

                        <button id="nav_menu_mobile_button" className="btn" onClick={toggle} aria-label="Menu openen">
                            {HamburgerIcon}
                        </button>

                    )}
                >

                    <div className="row flex anchor-wrapper">                     
                        <Link className="btn anchor" href="/luister">Luister</Link>
                        <Link className="btn anchor" href="/musicmoodcolours">Music Mood Colours</Link>
                    </div>
                </MobileContent>

            </div>

            <div className="column" id="nav_cta">
                <Link className="btn cta boek-nu-btn" href="/diensten">
                    <span>Boek nu!</span>
                </Link>
            </div>
        </nav>
    );
}