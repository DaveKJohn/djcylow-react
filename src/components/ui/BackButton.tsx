'use client';
import { Link } from '@/i18n/navigation';

export default function BackButton() {
    return (
        <Link 
            href="/luister" 
            className="btn passive terug-btn"
            aria-label="Terug naar overzicht"
        >
            <span className="">Terug naar overzicht</span>
        </Link>
    );
}