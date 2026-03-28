import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../data/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate('/');
  }

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.inner}`}>
        <NavLink to="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
          <span className={styles.logoIcon}>🤝</span>
          SplitDeal
        </NavLink>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <span className={menuOpen ? styles.barOpen : styles.bar}></span>
          <span className={menuOpen ? styles.barOpen : styles.bar}></span>
          <span className={menuOpen ? styles.barOpen : styles.bar}></span>
        </button>

        <ul className={`${styles.links} ${menuOpen ? styles.linksOpen : ''}`}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => isActive ? styles.active : ''}
              onClick={() => setMenuOpen(false)}
              end
            >
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/ofertas"
              className={({ isActive }) => isActive ? styles.active : ''}
              onClick={() => setMenuOpen(false)}
            >
              Ofertas
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/publicar"
              className={`btn btn-primary ${styles.ctaBtn}`}
              onClick={() => setMenuOpen(false)}
            >
              Publicar oferta
            </NavLink>
          </li>
          {user ? (
            <li className={styles.userArea}>
              <span className={styles.userName}>Hola, {user.name.split(' ')[0]}</span>
              <button
                className={`btn btn-outline ${styles.ctaBtn}`}
                onClick={handleLogout}
              >
                Salir
              </button>
            </li>
          ) : (
            <li>
              <NavLink
                to="/login"
                className={`btn btn-outline ${styles.ctaBtn}`}
                onClick={() => setMenuOpen(false)}
              >
                Ingresar
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
