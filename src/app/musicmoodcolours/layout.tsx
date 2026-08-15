import type { Metadata } from "next";
import { SITE_URL } from "../../constants/site";

// De pagina zelf is een client component ('use client', vanwege de audiofragmenten en de carousels)
// en kan daarom geen metadata exporteren. Deze layout is een server component en doet dat in haar
// plaats.
export const metadata: Metadata = {
    title: "Music Mood Colours — muziek indelen op stemming",
    description:
        "Ontdek hoe DJ Cylow muziek indeelt op stemming in plaats van genre. Acht basiskleuren, van ingetogen paars tot uitbundig geel, met luisterfragmenten.",
    alternates: {
        canonical: `${SITE_URL}/musicmoodcolours`,
    },
    openGraph: {
        type: "article",
        url: `${SITE_URL}/musicmoodcolours`,
        title: "Music Mood Colours — muziek indelen op stemming",
        description:
            "Ontdek hoe DJ Cylow muziek indeelt op stemming in plaats van genre. Acht basiskleuren, van ingetogen paars tot uitbundig geel, met luisterfragmenten.",
    },
};

export default function MusicMoodColoursLayout({ children }: { children: React.ReactNode }) {
    return children;
}
