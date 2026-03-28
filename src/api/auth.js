import { api, BASE_URL } from './client';

export const authApi = {
  // POST /auth/login → { token, user: { id, name, email } }
  login: (email, password) => api.post('/auth/login', { email, password }),

  // POST /auth/register → { token, user: { id, name, email } }
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),

  // GET /auth/me → { id, name, email }
  getMe: () => api.get('/auth/me'),

  // Redirige al backend → Supabase → Google OAuth
  // El backend redirige de vuelta a /auth/callback?token=<jwt>
  redirectToGoogle: () => {
    window.location.href = `${BASE_URL}/auth/google`;
  },
};
