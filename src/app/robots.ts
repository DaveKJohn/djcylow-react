import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [{ userAgent: '*', allow: '/' }],
        sitemap: 'https://www.djcylow.com/sitemap.xml',
        host: 'https://www.djcylow.com',
    };
}
