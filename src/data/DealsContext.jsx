import { createContext, useContext, useState } from 'react';
import { initialDeals } from './deals';

const DealsContext = createContext();

export function DealsProvider({ children }) {
  const [deals, setDeals] = useState(initialDeals);

  function addDeal(newDeal) {
    setDeals((prev) => [
      {
        ...newDeal,
        id: Math.max(...prev.map((d) => d.id)) + 1,
        fecha: new Date().toISOString().split('T')[0],
        estado: 'buscando',
      },
      ...prev,
    ]);
  }

  return (
    <DealsContext.Provider value={{ deals, addDeal }}>
      {children}
    </DealsContext.Provider>
  );
}

export function useDeals() {
  const context = useContext(DealsContext);
  if (!context) {
    throw new Error('useDeals must be used within a DealsProvider');
  }
  return context;
}
