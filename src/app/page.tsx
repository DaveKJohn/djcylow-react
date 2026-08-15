import { Metadata } from "next";
import { homeContent } from "@/content/home";
import ContactForm from "@/components/sections/ContactForm";




import Hero from "@/components/home/Hero";
import Promo from "@/components/home/Promo";




export const metadata: Metadata = {
    title: homeContent.title,
    description: homeContent.description,
    alternates: {
        canonical: "https://www.djcylow.com/",
    },
    openGraph: {
        type: "website",
        url: "https://www.djcylow.com/",
        title: homeContent.title,
        description: homeContent.description,
    },
};

export default function HomePage() {
    return (
        <main>
            {/* Hier stonden tot 2026-08-15 twee uitgecommentarieerde secties, <Referenties /> en
                <GoogleReviews />. Die componenten zijn verwijderd samen met drie andere slapers
                (Diensten, MeetTheDJ, Verzoeknummers) en hun stylesheets — ze werden nergens
                gerenderd, en de referentiedata bestond uit vier plaatsvullers die één uncomment
                verwijderd waren van publicatie op een boekingssite.

                Het werk is niet weg: het staat in de git-historie tot en met commit van deze branch,
                en is met `git show` terug te halen. Wat wél weg is, is de suggestie dat het klaarstaat
                om aan te zetten. */}
            <section className="slideshow">
                <Hero />
                <Promo />
                <ContactForm />
            </section>
        </main>
    );
}