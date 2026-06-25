import Link from 'next/link';

export default function RootPage() {
    return (
        <main className="WoB column w-fill AMC" style={{ minHeight: '100vh', justifyContent: 'center', alignItems: 'center', gap: '3rem' }}>
            <div className="column" style={{ alignItems: 'center', gap: '1rem' }}>
                <h1 className="uppercase" style={{ letterSpacing: '0.1em' }}>DJ Cylow</h1>
            </div>
            <div className="row" style={{ gap: '1.5rem' }}>
                <Link href="/en" className="btn cta center" style={{ minWidth: '8rem', justifyContent: 'center' }}>
                    English
                </Link>
                <Link href="/nl" className="btn passive center" style={{ minWidth: '8rem', justifyContent: 'center' }}>
                    Nederlands
                </Link>
            </div>
        </main>
    );
}
