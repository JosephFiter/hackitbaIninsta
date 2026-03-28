import { useParams, Link } from 'react-router-dom';
import { useDeals } from '../../data/DealsContext';
import { getDealById, formatPrice } from '../../data/deals';
import styles from './DealDetailPage.module.css';

export default function DealDetailPage() {
  const { id } = useParams();
  const { deals } = useDeals();
  const deal = getDealById(deals, id);

  if (!deal) {
    return (
      <div className="container">
        <div className={styles.notFound}>
          <span className={styles.notFoundIcon}>😕</span>
          <h2>Oferta no encontrada</h2>
          <Link to="/ofertas" className="btn btn-primary">Volver a ofertas</Link>
        </div>
      </div>
    );
  }

  const ahorro = deal.precioOriginal - deal.precioSplit;
  const porcentajeAhorro = Math.round((ahorro / deal.precioOriginal) * 100);

  return (
    <div className="container">
      <div className={styles.page}>
        <Link to="/ofertas" className={styles.back}>← Volver a ofertas</Link>

        <div className={styles.layout}>
          <div className={styles.imageSection}>
            <div className={styles.imageArea}>
              <span className={styles.emoji}>{deal.imageEmoji}</span>
              <span className={styles.offerBadge}>{deal.tipoOferta}</span>
            </div>
          </div>

          <div className={styles.info}>
            <div className={styles.statusRow}>
              <span className={`${styles.status} ${deal.estado === 'completo' ? styles.statusComplete : styles.statusActive}`}>
                {deal.estado === 'buscando' ? '🟢 Buscando compañero' : '✅ Completo'}
              </span>
              <span className={styles.category}>{deal.categoria}</span>
            </div>

            <h1 className={styles.title}>{deal.titulo}</h1>
            <p className={styles.store}>📍 {deal.tienda}</p>

            <div className={styles.priceCard}>
              <div className={styles.priceRow}>
                <div>
                  <p className={styles.priceLabel}>Precio original</p>
                  <p className={styles.originalPrice}>{formatPrice(deal.precioOriginal)}</p>
                </div>
                <div className={styles.arrow}>→</div>
                <div>
                  <p className={styles.priceLabel}>Pagás vos</p>
                  <p className={styles.splitPrice}>{formatPrice(deal.precioSplit)}</p>
                </div>
              </div>
              <div className={styles.savingsBar}>
                <span>💰 Ahorrás {formatPrice(ahorro)}</span>
                <span className={styles.percent}>-{porcentajeAhorro}%</span>
              </div>
            </div>

            <div className={styles.description}>
              <h3>Descripción</h3>
              <p>{deal.descripcion}</p>
            </div>

            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Publicado por</span>
                <span>{deal.publicadoPor}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Ubicación</span>
                <span>{deal.ubicacion}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Fecha</span>
                <span>{deal.fecha}</span>
              </div>
            </div>

            {deal.estado === 'buscando' && (
              <button className={`btn btn-secondary ${styles.joinBtn}`}>
                🤝 Unirme a esta oferta
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
