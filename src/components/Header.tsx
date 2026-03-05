import Link from 'next/link';

export default function Header() {
  return (
    <header className="main-navigation">
      <nav>
        <div className="logo">
          <Link href="/">DJ CYLOW</Link>
        </div>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/diensten">Diensten</Link>
          </li>
          <li>
            <Link href="/luister">Luister</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}