import Link from "next/link";
import { Metadata } from "next";

/**
 * De 404-pagina.
 *
 * Tot 2026-08-15 bestond dit bestand niet, en dan levert Next zijn eigen standaardpagina:
 * `<title>404: This page could not be found.</title>`, in het Engels en zonder enige styling van
 * deze site. Die pagina kreeg bovendien de fallback-description uit `layout.tsx` mee, die toen ook
 * nog Engels was — `out/404.html` droeg hem letterlijk.
 *
 * `robots: noindex` omdat een foutpagina niet in de zoekresultaten hoort. `follow` blijft aan, zodat
 * de links hiervandaan wel gevolgd worden.
 */
export const metadata: Metadata = {
    title: "Pagina niet gevonden | DJ Cylow",
    description: "Deze pagina bestaat niet of is verplaatst. Ga terug naar de homepage of bekijk de mixen.",
    robots: { index: false, follow: true },
};

export default function NotFound() {
    return (
        <main className="column w-fill AMC P15 v-push-7xl spacing-4xl">
            <div className="column AMC constrainer spacing-3xl">
                <div className="column w-fill AMC P35 spacing-2xl">
                    <h1>Pagina niet gevonden</h1>
                    <p className="size-base center balanced">
                        Deze pagina bestaat niet of is verplaatst. Misschien vind je wat je zoekt
                        tussen de mixen.
                    </p>
                </div>

                <div className="row wrap w-hug AMC P40 spacing-2xl">
                    <Link href="/" className="btn cta">
                        <span>Naar de homepage</span>
                    </Link>
                    <Link href="/luister" className="btn passive">
                        Bekijk de mixen
                    </Link>
                </div>
            </div>
        </main>
    );
}
