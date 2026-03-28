import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <span className={styles.logo}>🤝 SplitDeal</span>
          <p>Compartí ofertas, ahorrá juntos.</p>
        </div>
        <div className={styles.links}>
          <a href="#">Sobre nosotros</a>
          <a href="#">Contacto</a>
          <a href="#">Términos</a>
        </div>
        <p className={styles.copy}>© 2026 SplitDeal. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
