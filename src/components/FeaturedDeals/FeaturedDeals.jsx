import { Link } from 'react-router-dom';
import { useDeals } from '../../data/DealsContext';
import { getFeaturedDeals } from '../../data/deals';
import DealCard from '../DealCard/DealCard';
import styles from './FeaturedDeals.module.css';

export default function FeaturedDeals() {
  const { deals } = useDeals();
  const featured = getFeaturedDeals(deals);

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Ofertas destacadas</h2>
          <Link to="/ofertas" className="btn btn-outline">
            Ver todas
          </Link>
        </div>
        <div className={styles.grid}>
          {featured.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </div>
    </section>
  );
}
