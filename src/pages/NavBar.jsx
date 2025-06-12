import { Link, useNavigate, useLocation, NavLink } from 'react-router-dom';
import '../CSS/NavBar.css';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

const NavBar = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // lógica para saber en qué página estás
  const path = location.pathname;
  const isHome = path === '/';
  const isLoginOrRegister = path === "/login" || path === "/Register" || path === '/Statistics';

  // clase condicional según la ruta
let navbarClass = 'navbar'; 
let navLinksClass = 'nav-links';
let btnClass = 'btn-navbar';
let logoutClass = 'logout-button';

if (isHome) {
  navbarClass += ' navbar-home';
  navLinksClass += ' navbar-home';
  btnClass += ' navbar-home';
  logoutClass += ' navbar-home';
}  if (isLoginOrRegister) {
  navbarClass += ' navbar-login-register';
  navLinksClass += ' navbar-login-register';
  btnClass += ' navbar-login-register';
  logoutClass += ' navbar-login-register';
} else {
  
}


  return (
        <nav className={navbarClass}>
          <ul className="nav-links">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Home
              </NavLink>
            </li>

            {!isLoggedIn ? (
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  Iniciar Sesión
                </NavLink>
              </li>
            ) : (
              <li>
                <button onClick={handleLogout} className="logout-button">
                  Cerrar Sesión
                </button>
              </li>
            )}

            <li>
              <NavLink
                to="/Register"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Register
              </NavLink>
            </li>
            <li>
            <Link to="/dashboard" className="btn-navbar">
              Dashboard
            </Link>
          </li>

          </ul>
        </nav>
  );
};

export default NavBar;
