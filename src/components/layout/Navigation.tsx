"use client";

import { useState, useEffect } from "react";
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
        <nav className="WoB column w-fill AMC P10 fill-100">

            <div className="column w-fill AMC P20">
                <div className="row w-fix AMC constrainer-nav">

                    <div className="column w-hug AML P30" id="nav_logo">
                        <div className="column w-hug AMC P35">
                            <Link className="btn" href="/">
                                <Image
                                    src="/images/djcylow_logo.webp"
                                    width={130} height={51}
                                    alt="Logo" priority
                                    style={{ height: 'auto' }}
                                />
                            </Link>
                        </div>
                    </div>


                    <div className="row-c w-fill constrainer" id="nav_menu">




                        <MobileContent
                            id="nav_menu_content"
                            trigger={(toggle) => (
                                <div id="nav_menu_mobileBtn" className="column w-fill AMC P30" >
                                    <div className="column w-fill AMC P35">
                                        <button className="btn" onClick={toggle} aria-label="Menu openen">
                                            {HamburgerIcon}
                                        </button>
                                    </div>
                                </div>
                            )}
                        >

                            <div className="row-c w-fill AML P40 break-s spacing-2xl anchor-wrapper">

                                <Link className="column w-fill AML P45 btn anchor" href="/luister">
                                    <span className="left">Luister</span>
                                </Link>


                                <div className="splitter mobile"></div>

                                <Link className="column w-fill AML P45 btn anchor" href="/musicmoodcolours">
                                    <span className="left">Music Mood Colours</span>
                                </Link>



                            </div>
                        </MobileContent>


                    </div>


                    <div className="column w-hug AMR P30" id="nav_cta">
                        <div className="column w-hug AMC P35">
                            <Link className="btn cta center boek-nu-btn" href="/diensten">
                                <span>Boek nu!</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}