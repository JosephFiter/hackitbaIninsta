import { Link } from 'react-router-dom';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.text}>
          <h1 className={styles.title}>
            Precios mayoristas,
            <br />
            <span className={styles.highlight}>cantidades normales</span>
          </h1>
          <p className={styles.subtitle}>
            Sumáte a una compra grupal y accedé a precios de supermercado mayorista sin tener que comprar en grandes cantidades.
          </p>
          <div className={styles.actions}>
            <Link to="/ofertas" className="btn btn-primary">
              Ver compras disponibles
            </Link>
          </div>
        </div>
        <div className={styles.visual}>
          <div className={styles.card}>
            <span className={styles.cardEmoji}>🛒</span>
            <span className={styles.cardLabel}>Mayorista</span>
          </div>
          <div className={styles.arrow}>➡️</div>
          <div className={styles.people}>
            <div className={styles.person}>
              <span>🙋‍♀️</span>
              <span className={styles.personLabel}>Vos</span>
            </div>
            <div className={styles.plus}>+</div>
            <div className={styles.person}>
              <span>🙋</span>
              <span className={styles.personLabel}>Otros</span>
            </div>
          </div>
          <div className={styles.arrow}>= 💰</div>
          <div className={styles.savingsText}>¡Precio mayorista!</div>
        </div>
      </div>
    </section>
  );
}
