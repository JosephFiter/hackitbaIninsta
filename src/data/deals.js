export function formatPrice(price) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function getProgreso(compra) {
  return Math.min(Math.round((compra.cantidadActual / compra.cantidadObjetivo) * 100), 100);
}

export function getAhorroPorc(compra) {
  if (!compra.precioMinorista || compra.precioMinorista <= 0) return null;
  return Math.round(((compra.precioMinorista - compra.precioParticipante) / compra.precioMinorista) * 100);
}

export function getFeaturedDeals(deals) {
  return deals.filter((d) => d.estado === 'abierta').slice(0, 4);
}

export function getCategories(deals) {
  return [...new Set(deals.map((d) => d.categoria).filter(Boolean))];
}

