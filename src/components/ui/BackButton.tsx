'use client';
import { useRouter } from 'next/navigation';

export default function back-button() {
    const router = useRouter();
    return (
        <button
            className="btn passive terug-btn"
            type="button"
            onClick={() => router.back()}
            aria-label="Terug naar overzicht"
        >
            <span className="">Terug naar overzicht</span>
        </button>
    );
}