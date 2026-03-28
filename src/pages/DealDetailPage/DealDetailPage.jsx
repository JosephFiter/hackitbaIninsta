import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { dealsApi } from '../../api/deals';
import { useDeals } from '../../data/DealsContext';
import { useAuth } from '../../data/AuthContext';
import { formatPrice, getProgreso, getAhorroPorc } from '../../data/deals';
import styles from './DealDetailPage.module.css';

export default function DealDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateCompra } = useDeals();

  const [compra, setCompra] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [cantidad, setCantidad] = useState(1);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [joinError, setJoinError] = useState('');

  useEffect(() => {
    dealsApi
      .getById(id)
      .then(setCompra)
      .catch(() => setError('Compra no encontrada'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleJoin(e) {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setJoining(true);
    setJoinError('');
    try {
      const updated = await dealsApi.join(id, cantidad);
      setCompra(updated);
      updateCompra(updated);
      setJoined(true);
    } catch (err) {
      setJoinError(err.message);
    } finally {
      setJoining(false);
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className={styles.notFound}>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (error || !compra) {
    return (
      <div className="container">
        <div className={styles.notFound}>
          <span className={styles.notFoundIcon}>😕</span>
          <h2>Compra no encontrada</h2>
          <Link to="/ofertas" className="btn btn-primary">Volver a compras</Link>
        </div>
      </div>
    );
  }

  const progreso = getProgreso(compra);
  const ahorroPorc = getAhorroPorc(compra);
  const completa = compra.estado === 'completa';

  return (
    <div className="container">
      <div className={styles.page}>
        <Link to="/ofertas" className={styles.back}>← Volver a compras</Link>

        <div className={styles.layout}>
          <div className={styles.imageSection}>
            <div className={styles.imageArea}>
              <span className={styles.emoji}>{compra.imageEmoji ?? '🛍️'}</span>
              {ahorroPorc > 0 && (
                <span className={styles.offerBadge}>-{ahorroPorc}% vs minorista</span>
              )}
            </div>
          </div>

          <div className={styles.info}>
            <div className={styles.statusRow}>
              <span className={`${styles.status} ${completa ? styles.statusComplete : styles.statusActive}`}>
                {completa ? '✅ Completa' : '🟢 Abierta'}
              </span>
              {compra.categoria && <span className={styles.category}>{compra.categoria}</span>}
            </div>

            <h1 className={styles.title}>{compra.nombre}</h1>

            {/* Precios */}
            <div className={styles.priceCard}>
              <div className={styles.priceRow}>
                <div>
                  <p className={styles.priceLabel}>Precio mayorista</p>
                  <p className={styles.splitPrice}>
                    {formatPrice(compra.precioParticipante)}
                    <span className={styles.unidad}>/{compra.unidad ?? 'u'}</span>
                  </p>
                </div>
                {compra.precioMinorista > 0 && (
                  <>
                    <div className={styles.arrow}>vs</div>
                    <div>
                      <p className={styles.priceLabel}>Precio minorista</p>
                      <p className={styles.originalPrice}>{formatPrice(compra.precioMinorista)}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Progreso */}
            <div className={styles.progresoSection}>
              <div className={styles.progresoHeader}>
                <span>Unidades comprometidas</span>
                <span className={styles.progresoNum}>
                  {compra.cantidadActual} / {compra.cantidadObjetivo} {compra.unidad ?? 'u'}
                </span>
              </div>
              <div className={styles.progresoBar}>
                <div
                  className={`${styles.progresoFill} ${completa ? styles.progresoCompleta : ''}`}
                  style={{ width: `${progreso}%` }}
                />
              </div>
              <p className={styles.progresoLabel}>
                {completa
                  ? '¡El pedido está completo! Pronto se procesa la compra.'
                  : `Faltan ${compra.cantidadObjetivo - compra.cantidadActual} ${compra.unidad ?? 'u'} para completar el pedido`}
              </p>
            </div>

            {/* Descripción */}
            {compra.descripcion && (
              <div className={styles.description}>
                <h3>Descripción</h3>
                <p>{compra.descripcion}</p>
              </div>
            )}

            {/* Unirse */}
            {!completa && !joined && (
              <form className={styles.joinForm} onSubmit={handleJoin}>
                <h3>Unirme al pedido</h3>
                <div className={styles.joinRow}>
                  <label htmlFor="cantidad">Cuántas unidades querés</label>
                  <input
                    id="cantidad"
                    type="number"
                    min="1"
                    max={compra.cantidadObjetivo - compra.cantidadActual}
                    value={cantidad}
                    onChange={(e) => setCantidad(Number(e.target.value))}
                    className={styles.cantidadInput}
                  />
                </div>
                <p className={styles.totalEstimado}>
                  Total estimado: <strong>{formatPrice(compra.precioParticipante * cantidad)}</strong>
                </p>
                {joinError && <p className={styles.joinError}>{joinError}</p>}
                <button
                  type="submit"
                  className={`btn btn-primary ${styles.joinBtn}`}
                  disabled={joining}
                >
                  {joining ? 'Procesando...' : user ? '🛒 Unirme al pedido' : 'Iniciá sesión para unirte'}
                </button>
              </form>
            )}

            {joined && (
              <div className={styles.successMsg}>
                <span>🎉</span>
                <p>¡Te sumaste al pedido! Te avisaremos cuando esté completo.</p>
              </div>
            )}

            {completa && (
              <div className={styles.completaMsg}>
                <span>✅</span>
                <p>Este pedido ya está completo. ¡Mirá otras compras abiertas!</p>
                <Link to="/ofertas" className="btn btn-outline">Ver otras compras</Link>
              </div>
            )}

            {compra.fechaLimite && (
              <p className={styles.fechaLimite}>
                ⏰ Fecha límite: {new Date(compra.fechaLimite).toLocaleDateString('es-AR')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
