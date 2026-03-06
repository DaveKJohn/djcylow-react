'use client';
import { useRouter } from 'next/navigation';

export default function BackButton() {
    const router = useRouter();
    return (
        <button
            className="btn passive terug-btn"
            type="button"
            onClick={() => router.back()}
            aria-label="Terug naar overzicht"
        >
            <span className="size-xs">Terug naar overzicht</span>
        </button>
    );
}