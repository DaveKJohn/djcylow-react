import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import MusicMoodColoursContent from '@/components/musicmoodcolours/MusicMoodColoursContent';
import { localeAlternates, ogLocale, ogAlternateLocale } from '@/lib/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const title = 'Music Mood Colours | DJ Cylow';
    const description = locale === 'nl'
        ? 'Ontdek hoe DJ Cylow muziek categoriseert op stemming. Een uniek systeem dat kleur, gevoel en hersenchemie combineert.'
        : 'Discover how DJ Cylow categorises music by mood. A unique system combining colour, feeling and brain chemistry.';

    return {
        title,
        description,
        alternates: localeAlternates(locale, '/musicmoodcolours'),
        openGraph: {
            type: 'website',
            title,
            description,
            locale: ogLocale(locale),
            alternateLocale: ogAlternateLocale(locale),
        },
    };
}

export default async function MusicMoodColoursPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <MusicMoodColoursContent />;
}
