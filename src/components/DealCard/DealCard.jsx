import { Link } from 'react-router-dom';
import { formatPrice, getProgreso, getAhorroPorc } from '../../data/deals';
import styles from './DealCard.module.css';

export default function DealCard({ deal }) {
  const progreso = getProgreso(deal);
  const ahorroPorc = getAhorroPorc(deal);
  const completa = deal.estado === 'completa';

  return (
    <Link to={`/ofertas/${deal.id}`} className={`${styles.card} ${completa ? styles.cardCompleta : ''}`}>
      <div className={styles.imageArea}>
        <span className={styles.emoji}>{deal.imageEmoji ?? '🛍️'}</span>
        <span className={`${styles.badge} ${completa ? styles.badgeComplete : styles.badgeActive}`}>
          {completa ? '✅ Completa' : '🟢 Abierta'}
        </span>
        {ahorroPorc > 0 && (
          <span className={styles.offerBadge}>-{ahorroPorc}%</span>
        )}
      </div>

      <div className={styles.content}>
        {deal.categoria && <p className={styles.store}>{deal.categoria}</p>}
        <h3 className={styles.title}>{deal.nombre}</h3>

        <div className={styles.prices}>
          <span className={styles.splitPrice}>
            {formatPrice(deal.precioParticipante)}
            <small>/{deal.unidad ?? 'u'}</small>
          </span>
          {deal.precioMinorista > 0 && (
            <span className={styles.originalPrice}>{formatPrice(deal.precioMinorista)}</span>
          )}
        </div>

        <div className={styles.progresoWrap}>
          <div className={styles.progresoBar}>
            <div className={styles.progresoFill} style={{ width: `${progreso}%` }} />
          </div>
          <p className={styles.savings}>
            {deal.cantidadActual} de {deal.cantidadObjetivo} {deal.unidad ?? 'u'} comprometidas
          </p>
        </div>
      </div>
    </Link>
  );
}
