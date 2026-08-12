import Link from "next/link";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>◈</span>
          KI-System-Check
        </Link>
        <nav className={styles.nav}>
          <Link href="/">Übersicht</Link>
          <Link href="/systems/new">Neues System</Link>
        </nav>
      </div>
    </header>
  );
}
