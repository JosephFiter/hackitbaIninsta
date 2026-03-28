import { Link } from 'react-router-dom';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.text}>
          <h1 className={styles.title}>
            Dividí el costo,
            <br />
            <span className={styles.highlight}>llevate lo que querés</span>
          </h1>
          <p className={styles.subtitle}>
            ¿Viste una promo 2x1 pero solo necesitás uno? Encontrá a alguien para compartir la oferta y ahorrar juntos.
          </p>
          <div className={styles.actions}>
            <Link to="/ofertas" className="btn btn-primary">
              Ver ofertas disponibles
            </Link>
            <Link to="/publicar" className="btn btn-outline">
              Publicar una oferta
            </Link>
          </div>
        </div>
        <div className={styles.visual}>
          <div className={styles.card}>
            <span className={styles.cardEmoji}>👟</span>
            <span className={styles.cardLabel}>2x1</span>
          </div>
          <div className={styles.arrow}>➡️</div>
          <div className={styles.people}>
            <div className={styles.person}>
              <span>🙋‍♀️</span>
              <span className={styles.personLabel}>Vos</span>
            </div>
            <div className={styles.plus}>+</div>
            <div className={styles.person}>
              <span>🙋‍♂️</span>
              <span className={styles.personLabel}>Alguien</span>
            </div>
          </div>
          <div className={styles.arrow}>= 💰</div>
          <div className={styles.savingsText}>¡Ahorro para ambos!</div>
        </div>
      </div>
    </section>
  );
}
