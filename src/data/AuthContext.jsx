import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('splitdeal_user');
    return saved ? JSON.parse(saved) : null;
  });

  function getUsers() {
    const saved = localStorage.getItem('splitdeal_users');
    return saved ? JSON.parse(saved) : [];
  }

  function saveUsers(users) {
    localStorage.setItem('splitdeal_users', JSON.stringify(users));
  }

  function setAndPersistUser(userData) {
    setUser(userData);
    if (userData) {
      localStorage.setItem('splitdeal_user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('splitdeal_user');
    }
  }

  function login(email, password) {
    const users = getUsers();
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) {
      return { success: false, error: 'Email o contraseña incorrectos' };
    }
    setAndPersistUser({ name: found.name, email: found.email });
    return { success: true };
  }

  function register(name, email, password) {
    const users = getUsers();
    if (users.find((u) => u.email === email)) {
      return { success: false, error: 'Ya existe una cuenta con ese email' };
    }
    const newUser = { name, email, password };
    saveUsers([...users, newUser]);
    setAndPersistUser({ name, email });
    return { success: true };
  }

  function loginWithGoogle() {
    setAndPersistUser({ name: 'Usuario Google', email: 'usuario@gmail.com' });
  }

  function logout() {
    setAndPersistUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
