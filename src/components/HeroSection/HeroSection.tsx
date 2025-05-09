import styles from './HeroSection.module.css';
import Image from 'next/image';
import heroImage from '../assets/miningcat.png';

const HeroSection = () => {
  return (
    <section className={styles.hero}>
      <h2 className={styles.title}>💰 Криптовалютные калькуляторы онлайн</h2>
      <p className={styles.subtitle}>Быстрые и точные расчёты доходности</p>
      
      <div className={styles.content}>
        {/* Описание */}
        <div className={styles.description}>
          
          <p>
            Здесь вы можете легко и удобно рассчитать прибыльность различных способов получения дохода от криптовалют —
            будь то <span>майнинг</span>, <span>стейкинг</span> или <span>инвестиции в криптовалюту</span>.
          </p>

          
          <p>Сервис предоставляет возможность:</p>
          <ul>
            <li>Рассчитать <strong>доходность майнинга</strong> с учётом текущей сложности сети, курса монеты и затрат;</li>
            <li>Оценить <strong>эффективность стейкинга</strong>, принимая во внимание годовую процентную ставку (APY), блокировки токенов и комиссий;</li>
            <li>Проанализировать <strong>окупаемость инвестиций (ROI)</strong> в различных временных рамках;</li>
            <li>Сравнить несколько криптовалют между собой по уровню доходности и рисков.</li>
          </ul>

          <p>
            Будьте в курсе вашей потенциальной прибыли, <strong>принимайте обоснованные решения</strong> и управляйте своими цифровыми активами более эффективно!
          </p>
        </div>

        {/* Картинка */}
        <div className={styles.imageWrapper}>
          <Image
            src={heroImage}
            alt="Crypto calculator"
            className={styles.image}
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
