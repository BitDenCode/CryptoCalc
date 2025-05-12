import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container mx-auto px-4 text-center">      
      
        <div className="space-x-4">
          
          <Link
            href="https://memebit.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-green transition"
          >
            GitHub
          </Link>
          <Link
            href="https://memebit.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-green transition"
          >
            Telegram
          </Link>
          <Link
            href="https://memebit.vercel.app/"
            className="hover:text-accent-green transition"
          >
            Email
          </Link>
        </div>

        <div className="text-sm mb-4">
          <span>&copy; 2025 CryptoCalc.</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
