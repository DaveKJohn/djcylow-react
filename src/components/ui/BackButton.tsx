'use client';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function BackButton() {
    const t = useTranslations('common');
    return (
        <Link
            href="/luister"
            className="btn passive terug-btn"
            aria-label={t('backToOverview')}
        >
            <span>{t('backToOverview')}</span>
        </Link>
    );
}