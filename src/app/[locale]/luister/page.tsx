import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import LuisterPageContent from '@/components/luister/LuisterPageContent';
import { localeAlternates, ogLocale, ogAlternateLocale } from '@/lib/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'luister' });
    const title = `${t('title')} | DJ Cylow`;
    const description = locale === 'nl'
        ? 'Luister naar de beste House en Drum & Bass mixen van DJ Cylow. Filter op kleur, genre en energie.'
        : 'Listen to the best House and Drum & Bass mixes by DJ Cylow. Filter by colour, genre and energy.';

    return {
        title,
        description,
        alternates: localeAlternates(locale, '/luister'),
        openGraph: {
            type: 'website',
            title,
            description,
            locale: ogLocale(locale),
            alternateLocale: ogAlternateLocale(locale),
        },
    };
}

export default async function LuisterPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <LuisterPageContent />;
}
