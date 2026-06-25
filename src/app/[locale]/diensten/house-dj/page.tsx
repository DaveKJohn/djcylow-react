import { Metadata } from "next";
import { setRequestLocale } from 'next-intl/server';
import ContactForm from "@/components/sections/ContactForm";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: "Boek DJ Cylow voor jouw evenement!",
        description: "De DJ die iedereen op de dansvloer krijgt.",
        alternates: { canonical: `https://www.djcylow.com/${locale}/diensten/house-dj` },
        openGraph: {
            title: "Boek DJ Cylow voor jouw evenement!",
            description: "De DJ die iedereen op de dansvloer krijgt.",
            images: [{ url: "/images/diensten.jpg" }],
        },
    };
}

export default async function HouseDJPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <main className="diensten">
            <section className="column stack pattern WoB" id="banner_index">
                <div className="column overlay stack spacing-3xl feather">
                    <div className="column overlay spacing-3xl bottom"></div>
                </div>
                <div className="column overlay constrainer spacing-3xl header">
                    <div className="column banner-wrapper v-push-9xl center">
                        <div className="column text-wrapper spacing-3xl center">
                            <h1>Boek DJ Cylow voor jouw evenement!</h1>
                        </div>
                    </div>
                </div>
            </section>
            <ContactForm />
        </main>
    );
}
