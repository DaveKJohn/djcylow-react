import React from 'react';
import { homeContent } from "@/content/home";
import Link from "next/link";

// HIER STOND `import '@/styles/components/home/diensten.scss'`, EN DAT BESTAND BESTAAT NIET.
// Het heeft ook nooit bestaan: `src/styles/components/home/` bevat alleen hero, meetTheDJ, promo,
// referenties en verzoeknummers. Wat er wél is, is `src/styles/pages/_diensten.scss`, maar dat is de
// styling van de /diensten-ROUTE en wordt al via `main.scss` geladen.
//
// Dat het niet opviel komt doordat deze component nergens gerenderd wordt en de bundler dode modules
// niet compileert. Zet iemand `<Diensten />` terug in `page.tsx`, dan faalt `npm run build` met
// "Module not found" -- in een repo zonder staging, waar de build de laatste wacht vóór live is. Dat
// is een tijdbom die niets kost om nu te ontmantelen.
//
// De import is weggehaald en niet vervangen: deze component heeft nooit eigen styling gehad, en hij
// leunt op de generieke layout-klassen (`column`, `constrainer`, `text-wrapper`) die overal gelden.
// Komt hij terug en blijkt hij eigen styling nodig te hebben, dan maakt wie hem terugzet dat bestand
// aan -- met een import die dan wél ergens naar wijst.

const Diensten = () => {
    return (
        <section className="column spacing-9xl WoB" id="hero">
            <div className="column center WoB" id="diensten">
                <div className="column constrainer">
                    <div className="column text-wrapper spacing-4xl center">
                        <div className="column text-wrapper spacing-4xl header center">
                            <h2 dangerouslySetInnerHTML={{ __html: homeContent.diensten_h3 || "" }} />
                            <p className="subheader">Kies één van de onderstaande opties die het meest aansluit op jou wens.</p>
                        </div>

                        <div className="row spacing-3xl wrap buttons">
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