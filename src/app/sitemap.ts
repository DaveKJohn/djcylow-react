import { MetadataRoute } from 'next';

// De vijftien JSON-bestanden en de slug-afleiding komen uit `@/data/mixes/all`. Dit bestand had ze
// tot 2026-08-15 zelf overgeschreven -- inclusief een eigen kopie van de drie bewerkingen die de
// slug maken. Twee kopieën van dezelfde afleiding kunnen uit elkaar lopen, en dan wijst de sitemap
// Google naar pagina's die niet bestaan zonder dat er iets rood wordt.
import { liveMixes, mixSlug } from '@/data/mixes/all';

export const dynamic = 'force-static';

const BASE_URL = 'https://www.djcylow.com';

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

    // `liveMixes` filtert de preview-entries er al uit; de permalink-check blijft staan omdat een
    // lege waarde hier een lege URL zou opleveren in plaats van geen URL.
    const mixPages: MetadataRoute.Sitemap = liveMixes
        .filter((mix) => !!mix.permalink)
        .map((mix) => ({
            url: `${BASE_URL}/luister/mix/${mixSlug(mix)}`,
            lastModified: mix.date ? new Date(mix.date) : new Date(),
            changeFrequency: 'yearly' as const,
            priority: 0.8,
        }));

    return [...staticPages, ...mixPages];
}
