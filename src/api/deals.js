import { api } from './client';

export const dealsApi = {
  // GET /compras → [ ...compras con datos del producto ]
  getAll: () => api.get('/compras'),

  // GET /compras/:id → compra con datos del producto
  getById: (id) => api.get(`/compras/${id}`),

  // POST /compras/:id/unirse → { cantidad } → unirse a la compra grupal (requiere auth)
  join: (id, cantidad) => api.post(`/compras/${id}/unirse`, { cantidad }),

  // POST /compras → crear compra grupal (admin, requiere auth)
  create: (compra) => api.post('/compras', compra),
};
