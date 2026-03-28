import { createContext, useContext, useState } from 'react';
import { authApi } from '../api/auth';

const AuthContext = createContext();

function getStoredUser() {
  const saved = localStorage.getItem('splitdeal_user');
  return saved ? JSON.parse(saved) : null;
}

function persistSession(token, user) {
  localStorage.setItem('splitdeal_token', token);
  localStorage.setItem('splitdeal_user', JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem('splitdeal_token');
  localStorage.removeItem('splitdeal_user');
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  // Lanza excepción si el backend responde con error
  async function login(email, password) {
    const { token, user: userData } = await authApi.login(email, password);
    persistSession(token, userData);
    setUser(userData);
  }

  // Lanza excepción si el backend responde con error
  async function register(name, email, password) {
    const { token, user: userData } = await authApi.register(name, email, password);
    persistSession(token, userData);
    setUser(userData);
  }

  // Redirige al backend para el flujo OAuth de Google.
  // El backend debe redirigir de vuelta a /auth/callback?token=<jwt>
  // Agregar esa ruta en App.jsx para capturar el token al volver.
  function loginWithGoogle() {
    authApi.redirectToGoogle();
  }

  function logout() {
    clearSession();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
