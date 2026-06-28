import { MetadataRoute } from 'next';

import lightBlue from '@/data/mixes/light-blue.json';
import lightCyan from '@/data/mixes/light-cyan.json';
import lightGreen from '@/data/mixes/light-green.json';
import lightMagenta from '@/data/mixes/light-magenta.json';
import lightOrange from '@/data/mixes/light-orange.json';
import lightPurple from '@/data/mixes/light-purple.json';
import lightRed from '@/data/mixes/light-red.json';
import lightYellow from '@/data/mixes/light-yellow.json';
import fullBlue from '@/data/mixes/full-blue.json';
import fullCyan from '@/data/mixes/full-cyan.json';
import fullGreen from '@/data/mixes/full-green.json';
import fullOrange from '@/data/mixes/full-orange.json';
import fullPurple from '@/data/mixes/full-purple.json';
import fullRed from '@/data/mixes/full-red.json';
import fullYellow from '@/data/mixes/full-yellow.json';

export const dynamic = 'force-static';

const BASE_URL = 'https://www.djcylow.com';

type MixEntry = {
    ignore?: boolean;
    permalink?: string;
    date?: string;
};

const allMixes: MixEntry[] = [
    ...lightBlue, ...lightCyan, ...lightGreen, ...lightYellow, ...lightOrange, ...lightRed, ...lightMagenta, ...lightPurple,
    ...fullBlue, ...fullCyan, ...fullGreen, ...fullYellow, ...fullOrange, ...fullRed, ...fullPurple,
] as MixEntry[];

export default function sitemap(): MetadataRoute.Sitemap {
    const staticPages: MetadataRoute.Sitemap = [
        { url: BASE_URL, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
        { url: `${BASE_URL}/luister`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${BASE_URL}/musicmoodcolours`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/diensten`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/diensten/bedrijfsfeest-dj`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
        { url: `${BASE_URL}/diensten/bruiloft-dj`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
        { url: `${BASE_URL}/diensten/house-dj`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    ];

    const mixPages: MetadataRoute.Sitemap = allMixes
        .filter((mix): mix is Required<MixEntry> => !!mix?.permalink && !mix.ignore)
        .map((mix) => {
            const filename = mix.permalink.split('/').pop() || '';
            const slug = filename.split('.html')[0].toLowerCase().trim();
            return {
                url: `${BASE_URL}/luister/mix/${slug}`,
                lastModified: mix.date ? new Date(mix.date) : new Date(),
                changeFrequency: 'yearly' as const,
                priority: 0.8,
            };
        });

    return [...staticPages, ...mixPages];
}
