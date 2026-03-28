import { useState, useMemo } from 'react';
import { useDeals } from '../../data/DealsContext';
import { getCategories } from '../../data/deals';
import DealCard from '../../components/DealCard/DealCard';
import styles from './DealsPage.module.css';

export default function DealsPage() {
  const { deals, loading, error } = useDeals();
  const categories = useMemo(() => getCategories(deals), [deals]);
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [estado, setEstado] = useState('todos');

  const filtered = useMemo(() => {
    return deals.filter((deal) => {
      const matchSearch = deal.nombre?.toLowerCase().includes(search.toLowerCase());
      const matchCategoria = categoria === 'Todas' || deal.categoria === categoria;
      const matchEstado = estado === 'todos' || deal.estado === estado;
      return matchSearch && matchCategoria && matchEstado;
    });
  }, [deals, search, categoria, estado]);

  if (loading) {
    return (
      <div className="container">
        <div className={styles.page}>
          <h1 className={styles.title}>Compras en grupo</h1>
          <p>Cargando compras...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className={styles.page}>
          <h1 className={styles.title}>Compras en grupo</h1>
          <p>Error al cargar las compras: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.page}>
        <h1 className={styles.title}>Compras en grupo</h1>

        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.search}
          />
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className={styles.select}
          >
            <option value="Todas">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className={styles.select}
          >
            <option value="todos">Todos</option>
            <option value="abierta">Abiertas</option>
            <option value="completa">Completas</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🔍</span>
            <p>No se encontraron compras con esos filtros.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
