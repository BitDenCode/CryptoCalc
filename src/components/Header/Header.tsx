import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';

const Header = () => (
  <header className={styles.header}>
    <div className={styles.headerLeft}>
      <Link href="/" className={styles.logoLink}>
        <Image
          src="/logo1.svg"
          alt="CryptoCalc Logo"
          width={50}
          height={50}
          className={styles.logo}
        />
      </Link>

      <Link href="/" className={styles.titleLink}>
        <h1 className={styles.headerTitle}>CryptoCalc</h1>
      </Link>
    </div>

    <nav className={styles.navLinks}>
      <a href="#mining">Майнинг</a>
      <a href="#staking">Стейкинг</a>
      <a href="#roi">ROI</a>
    </nav>
  </header>
);

export default Header;
