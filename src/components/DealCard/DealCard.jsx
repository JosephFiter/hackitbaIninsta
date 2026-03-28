import { Link } from 'react-router-dom';
import { formatPrice } from '../../data/deals';
import styles from './DealCard.module.css';

export default function DealCard({ deal }) {
  const ahorro = deal.precioOriginal - deal.precioSplit;

  return (
    <Link to={`/ofertas/${deal.id}`} className={styles.card}>
      <div className={styles.imageArea}>
        <span className={styles.emoji}>{deal.imageEmoji}</span>
        <span className={`${styles.badge} ${deal.estado === 'completo' ? styles.badgeComplete : styles.badgeActive}`}>
          {deal.estado === 'buscando' ? 'Buscando compañero' : 'Completo'}
        </span>
        <span className={styles.offerBadge}>{deal.tipoOferta}</span>
      </div>
      <div className={styles.content}>
        <p className={styles.store}>{deal.tienda}</p>
        <h3 className={styles.title}>{deal.titulo}</h3>
        <div className={styles.prices}>
          <span className={styles.originalPrice}>{formatPrice(deal.precioOriginal)}</span>
          <span className={styles.splitPrice}>{formatPrice(deal.precioSplit)}</span>
          <span className={styles.perPerson}>por persona</span>
        </div>
        <div className={styles.savings}>
          Ahorrás {formatPrice(ahorro)}
        </div>
        <div className={styles.meta}>
          <span>{deal.ubicacion}</span>
          <span>{deal.publicadoPor}</span>
        </div>
      </div>
    </Link>
  );
}
