import { Metadata } from "next";
import { setRequestLocale } from 'next-intl/server';
import { homeContent } from "@/content/home";
import ContactForm from "@/components/sections/ContactForm";
import styles from '@/styles/modules/home.module.scss';
import Hero from "@/components/home/Hero";
import Promo from "@/components/home/Promo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const url = `https://www.djcylow.com/${locale}`;
    return {
        title: homeContent.title,
        description: homeContent.description,
        alternates: { canonical: url },
        openGraph: {
            type: "website",
            url,
            title: homeContent.title,
            description: homeContent.description,
        },
    };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

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
