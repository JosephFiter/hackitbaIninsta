import { createContext, useContext, useState, useEffect } from 'react';
import { dealsApi } from '../api/deals';

const DealsContext = createContext();

export function DealsProvider({ children }) {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dealsApi
      .getAll()
      .then(setDeals)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Actualiza una compra en el estado local (ej: después de unirse)
  function updateCompra(updated) {
    setDeals((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  }

  return (
    <DealsContext.Provider value={{ deals, loading, error, updateCompra }}>
      {children}
    </DealsContext.Provider>
  );
}

export function useDeals() {
  const context = useContext(DealsContext);
  if (!context) throw new Error('useDeals must be used within a DealsProvider');
  return context;
}
