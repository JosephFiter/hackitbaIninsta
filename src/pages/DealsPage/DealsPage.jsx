import { useState, useMemo } from 'react';
import { useDeals } from '../../data/DealsContext';
import { getCategories } from '../../data/deals';
import DealCard from '../../components/DealCard/DealCard';
import styles from './DealsPage.module.css';

export default function DealsPage() {
  const { deals } = useDeals();
  const categories = useMemo(() => getCategories(deals), [deals]);
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [estado, setEstado] = useState('todos');

  const filtered = useMemo(() => {
    return deals.filter((deal) => {
      const matchSearch =
        deal.titulo.toLowerCase().includes(search.toLowerCase()) ||
        deal.tienda.toLowerCase().includes(search.toLowerCase());
      const matchCategoria = categoria === 'Todas' || deal.categoria === categoria;
      const matchEstado = estado === 'todos' || deal.estado === estado;
      return matchSearch && matchCategoria && matchEstado;
    });
  }, [deals, search, categoria, estado]);

  return (
    <div className="container">
      <div className={styles.page}>
        <h1 className={styles.title}>Ofertas disponibles</h1>

        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Buscar producto o tienda..."
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
            <option value="todos">Todos los estados</option>
            <option value="buscando">Buscando compañero</option>
            <option value="completo">Completos</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🔍</span>
            <p>No se encontraron ofertas con esos filtros.</p>
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
