'use client';

import { useEffect } from 'react';

interface MixAnalyticsProps {
    id: string;
    title: string;
    power: string;
    color: string;
    genre: string;
    subgenre: string;
    volume: string;
}

declare global {
    interface Window {
        dataLayer: Record<string, unknown>[];
    }
}

export default function MixAnalytics({ id, title, power, color, genre, subgenre, volume }: MixAnalyticsProps) {
    useEffect(() => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'view_mix',
            mix_id: id,
            mix_title: title,
            mix_power: power,
            mix_color: color,
            mix_genre: genre,
            mix_subgenre: subgenre,
            mix_volume: volume,
        });
    }, [id, title, power, color, genre, subgenre, volume]);

    return null;
}
