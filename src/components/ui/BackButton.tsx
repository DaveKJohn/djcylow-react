'use client';
import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function BackButtonContent() {
    const searchParams = useSearchParams();
    const params = new URLSearchParams();
    const color = searchParams.get('color');
    const genre = searchParams.get('genre');
    const power = searchParams.get('power');
    if (color) params.set('color', color);
    if (genre) params.set('genre', genre);
    if (power) params.set('power', power);
    const qs = params.toString();
    const href = qs ? `/luister?${qs}` : '/luister';

    return (
        <Link
            href={href}
            className="btn passive terug-btn"
            aria-label="Terug naar overzicht"
        >
            <span>Terug naar overzicht</span>
        </Link>
    );
}

export default function BackButton() {
    return (
        <Suspense fallback={
            <Link href="/luister" className="btn passive terug-btn" aria-label="Terug naar overzicht">
                <span>Terug naar overzicht</span>
            </Link>
        }>
            <BackButtonContent />
        </Suspense>
    );
}
