import { Metadata } from "next";
import { homeContent } from "@/content/home";
import ContactForm from "@/components/sections/ContactForm";


import styles from '@/styles/modules/home.module.scss';



import Hero from "@/components/home/Hero";
import Promo from "@/components/home/Promo";
// Referenties en GoogleReviews staan hieronder uitgeschakeld in de JSX; hun imports zijn daarom
// weggehaald in plaats van ongebruikt te blijven staan. Zet je een van de twee terug, dan komt de
// import er in dezelfde handeling weer bij -- de uitgecommentarieerde regel draagt de bedoeling.




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
        <main className={styles.pageWrapper}>
            <section className="slideshow">
                <Hero />
                {/* <Referenties /> */}
                {/* <GoogleReviews /> */}
                 <Promo /> 

                <ContactForm />
            </section>
        </main>
    );
}