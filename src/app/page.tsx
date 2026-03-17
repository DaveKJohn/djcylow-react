import { Metadata } from "next";
import { homeContent } from "@/content/home";
import ContactForm from "@/components/sections/ContactForm";


import styles from '@/styles/modules/home.module.scss';



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
        <main className={styles.pageWrapper}>
            <section className="slideshow">
                <Hero />
                <Promo />
                <ContactForm />
            </section>
        </main>
    );
}