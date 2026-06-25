const BASE = 'https://www.djcylow.com';

export function localeAlternates(locale: string, path: string) {
    return {
        canonical: `${BASE}/${locale}${path}`,
        languages: {
            'en': `${BASE}/en${path}`,
            'nl': `${BASE}/nl${path}`,
            'x-default': `${BASE}/`,
        }
    };
}

export function ogLocale(locale: string): string {
    return locale === 'nl' ? 'nl_NL' : 'en_US';
}

export function ogAlternateLocale(locale: string): string[] {
    return [locale === 'nl' ? 'en_US' : 'nl_NL'];
}
