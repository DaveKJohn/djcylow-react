"use client";

import Link from "next/link";
import Image from "next/image";
import MobileContent from "@/components/ui/MobileContent";

export default function Nav() {
    return (
        <nav className="row WoB">
            <div className="column logo-wrapper">
                <Link href="/">
                    <Image 
                        src="/images/djcylow_logo.webp" 
                        width={160} height={100} 
                        alt="Logo" priority 
                        style={{ height: 'auto' }} 
                    />
                </Link>
            </div>

            <MobileContent 
                trigger={(toggle) => (
                    <div className="hidden-wrapper">
                        <button className="btn nav hamburger-btn" onClick={toggle} aria-label="Menu openen">
                            ☰
                        </button>
                    </div>
                )}
            >
                <Link className="btn nav menu" href="/luister">Luister</Link>
                <Link className="btn nav menu" href="/musicmoodcolours">Music Mood Colours</Link>
            </MobileContent>

            <div className="cta-wrapper">
                <Link className="btn cta boek-nu-btn" href="/diensten">
                    <span>Boek nu!</span>
                </Link>
            </div>
        </nav>
    );
}