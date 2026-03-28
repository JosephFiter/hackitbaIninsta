import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeals } from '../../data/DealsContext';
import DealForm from '../../components/DealForm/DealForm';
import styles from './CreateDealPage.module.css';

export default function CreateDealPage() {
  const { addDeal } = useDeals();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(dealData) {
    setError('');
    setLoading(true);
    try {
      await addDeal(dealData);
      setSubmitted(true);
      setTimeout(() => navigate('/ofertas'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="container">
        <div className={styles.success}>
          <span className={styles.successIcon}>🎉</span>
          <h2>¡Oferta publicada!</h2>
          <p>Tu oferta ya está visible. Redirigiendo a las ofertas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Publicar una oferta</h1>
          <p className={styles.subtitle}>
            ¿Encontraste una promo 2x1 y necesitás alguien para compartirla? Publicala acá y encontrá tu compañero de compra.
          </p>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.formWrapper}>
          <DealForm onSubmit={handleSubmit} disabled={loading} />
        </div>
      </div>
    </div>
  );
}
