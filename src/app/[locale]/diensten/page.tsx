import { Metadata } from "next";
import { setRequestLocale } from 'next-intl/server';
import { dienstenContent } from "@/content/diensten";
import ContactForm from "@/components/sections/ContactForm";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const url = `https://www.djcylow.com/${locale}/diensten`;
    return {
        title: dienstenContent.title,
        description: dienstenContent.description,
        alternates: { canonical: url },
        openGraph: { type: "website", url, title: dienstenContent.title, description: dienstenContent.description },
    };
}

export default async function DienstenPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <main>
            <div className="stack banner WoB" id="luister_banner">
                <div className="column layer feather sides"></div>
                <div className="column layer feather bottom"></div>
                <div className="column layer spacing-4xl constrainer center title">
                    <h1>{dienstenContent.title}</h1>
                </div>
            </div>
            <ContactForm />
        </main>
    );
}
