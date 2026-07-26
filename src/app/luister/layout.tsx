import type { Metadata } from "next";

// De pagina zelf is een client component ('use client', vanwege de filters en de URL-sync) en kan
// daarom geen metadata exporteren. Deze layout is een server component en doet dat in haar plaats.
// De mix-detailpagina eronder heeft een eigen generateMetadata en overschrijft dit gewoon.
export const metadata: Metadata = {
    title: "Luister alle mixen van DJ Cylow",
    description:
        "Alle mixen van DJ Cylow op één plek. Filter op muziekstemming, genre en energie, en vind precies de sfeer die bij jouw moment past.",
    alternates: {
        canonical: "https://www.djcylow.com/luister",
    },
    openGraph: {
        type: "website",
        url: "https://www.djcylow.com/luister",
        title: "Luister alle mixen van DJ Cylow",
        description:
            "Alle mixen van DJ Cylow op één plek. Filter op muziekstemming, genre en energie, en vind precies de sfeer die bij jouw moment past.",
    },
};

export default function LuisterLayout({ children }: { children: React.ReactNode }) {
    return children;
}
