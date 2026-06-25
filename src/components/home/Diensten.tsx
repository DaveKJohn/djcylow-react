import React from 'react';
import { getLocale } from 'next-intl/server';
import { getHomeContent } from "@/content/home";
import { Link } from "@/i18n/navigation";

// @ts-ignore
import '@/styles/components/home/diensten.scss';

const Diensten = async () => {
    const locale = await getLocale();
    const content = getHomeContent(locale);

    return (
        <section className="column spacing-9xl WoB" id="hero">
            <div className="column center WoB" id="diensten">
                <div className="column constrainer">
                    <div className="column text-wrapper spacing-4xl center flex">
                        <div className="column text-wrapper spacing-4xl header center">
                            <h2 dangerouslySetInnerHTML={{ __html: content.diensten_h3 || "" }} />
                            <p className="subheader">{content.servicesSubheader}</p>
                        </div>

                        <div className="row spacing-3xl wrap flex buttons">
                            <Link className="btn passive diensten-btn" href="/diensten/bruiloft-dj">{content.weddingDJLabel}</Link>
                            <Link className="btn passive diensten-btn" href="/diensten/bedrijfsfeest-dj">{content.corporateDJLabel}</Link>
                            <Link className="btn passive diensten-btn" href="/diensten/house-dj">{content.houseDJLabel}</Link>
                            <Link className="btn passive diensten-btn" href="/diensten">{content.somethingElseLabel}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Diensten;
