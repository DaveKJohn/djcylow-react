import { Metadata } from "next";
import { setRequestLocale, getTranslations } from 'next-intl/server';
import ContactForm from "@/components/sections/ContactForm";
import { localeAlternates, ogLocale, ogAlternateLocale } from '@/lib/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'diensten' });
    return {
        title: t('corporateTitle'),
        description: t('description'),
        alternates: localeAlternates(locale, '/diensten/bedrijfsfeest-dj'),
        openGraph: {
            title: t('corporateTitle'),
            description: t('description'),
            images: [{ url: "/images/diensten.jpg" }],
            locale: ogLocale(locale),
            alternateLocale: ogAlternateLocale(locale),
        },
    };
}

export default async function BedrijfsfeestDJ({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('diensten');

    return (
        <main className="diensten">
            <section className="column stack pattern WoB" id="banner_index">
                <div className="column overlay stack spacing-3xl feather">
                    <div className="column overlay spacing-3xl bottom"></div>
                </div>
                <div className="column overlay constrainer spacing-3xl header">
                    <div className="column banner-wrapper v-push-9xl center">
                        <div className="column text-wrapper spacing-3xl center">
                            <h1>{t('corporateTitle')}</h1>
                        </div>
                    </div>
                </div>
            </section>
            <ContactForm />
        </main>
    );
}
