import { Metadata } from "next";
import { setRequestLocale } from 'next-intl/server';
import { getDienstenContent } from "@/content/diensten";
import { localeAlternates, ogLocale, ogAlternateLocale } from '@/lib/metadata';
import ContactForm from "@/components/sections/ContactForm";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const content = getDienstenContent(locale);
    return {
        title: content.title,
        description: content.description,
        alternates: localeAlternates(locale, '/diensten'),
        openGraph: {
            type: "website",
            title: content.title,
            description: content.description,
            locale: ogLocale(locale),
            alternateLocale: ogAlternateLocale(locale),
        },
    };
}

export default async function DienstenPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const content = getDienstenContent(locale);

    return (
        <main>
            <div className="stack banner WoB" id="luister_banner">
                <div className="column layer feather sides"></div>
                <div className="column layer feather bottom"></div>
                <div className="column layer spacing-4xl constrainer center title">
                    <h1>{content.title}</h1>
                </div>
            </div>
            <ContactForm />
        </main>
    );
}
