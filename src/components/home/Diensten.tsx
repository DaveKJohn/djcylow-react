import React from 'react';
import Image from 'next/image'; // Gaat uit van Next.js gezien de Image component
import ReadMore from "@/components/ui/ReadMore";
import Link from "next/link";
import { homeContent } from "@/content/home";

const Diensten = () => {
    return (
        <section className="column wrapper spacing-9xl WoB" id="hero">
            <div className="column wrapper center WoB" id="diensten">
                <div className="column constrainer">
                    <div className="column text-wrapper spacing-4xl center flex">
                        <div className="column text-wrapper spacing-4xl header center">
                            <h2 dangerouslySetInnerHTML={{ __html: homeContent.diensten_h3 || "" }} />
                            <p className="subheader">Kies één van de onderstaande opties die het meest aansluit op jou wens.</p>
                        </div>

                        <div className="row wrapper spacing-3xl wrap flex buttons">
                            <Link className="btn passive diensten-btn" href="/diensten/bruiloft-dj">Bruiloft DJ</Link>
                            <Link className="btn passive diensten-btn" href="/diensten/bedrijfsfeest-dj">Bedrijfsfeest DJ</Link>
                            <Link className="btn passive diensten-btn" href="/diensten/house-dj">House DJ</Link>
                            <Link className="btn passive diensten-btn" href="/diensten">Iets anders!</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Diensten;