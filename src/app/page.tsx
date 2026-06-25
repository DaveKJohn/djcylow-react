import Link from 'next/link';

export default function RootPage() {
    return (
        <main id="locale-picker" className="WoB column w-fill AMC">
            <div className="column locale-picker__header">
                <h1 className="uppercase">DJ Cylow</h1>
            </div>
            <div className="row locale-picker__buttons">
                <Link href="/en" className="btn cta center locale-picker__btn">
                    English
                </Link>
                <Link href="/nl" className="btn passive center locale-picker__btn">
                    Nederlands
                </Link>
            </div>
        </main>
    );
}
