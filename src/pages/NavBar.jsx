import { Link, useNavigate, useLocation, NavLink } from 'react-router-dom';
import '../CSS/NavBar.css';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

const NavBar = () => {
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Ruta actual
  const path = location.pathname;
  const isHome = path === '/';
  const isLoginOrRegister = path === "/Login" || path === "/Register" || path === "/VistaUsuario";

  // Estilos condicionales
  let navbarClass = 'navbar';
  let navLinksClass = 'nav-links';
  let btnClass = 'btn-navbar';
  let logoutClass = 'logout-button';

  if (isHome) {
    navbarClass += ' navbar-home';
    navLinksClass += ' navbar-home';
    btnClass += ' navbar-home';
    logoutClass += ' navbar-home';
  } else if (isLoginOrRegister) {
    navbarClass += ' navbar-login-register';
    navLinksClass += ' navbar-login-register';
    btnClass += ' navbar-login-register';
    logoutClass += ' navbar-login-register';
  }

  // Tipo de usuario actual
  const tipoUsuario = user?.tipo_usuario;

  return (
    <nav className={navbarClass}>
      <ul className={navLinksClass}>
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
            Home
          </NavLink>
        </li>

        {!isLoggedIn ? (
          <>
            <li>
              <NavLink to="/Login" className={({ isActive }) => (isActive ? 'active' : '')}>
                Iniciar Sesión
              </NavLink>
            </li>
            <li>
              <NavLink to="/Register" className={({ isActive }) => (isActive ? 'active' : '')}>
                Register
              </NavLink>
            </li>
          </>
        ) : (
          <>
            {/* Vista Usuario */}
            {tipoUsuario === 'usuario' && (
              <li>
                <NavLink to="/VistaUsuario" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Conocenos mas 
                </NavLink>
              </li>
            )}

            {/* Dashboard solo para admin o trabajador */}
            {(tipoUsuario === 'admin' || tipoUsuario === 'trabajador') && (
              <li>
                <Link to="/dashboard" className={btnClass}>
                  Dashboard
                </Link>
              </li>
            )}

            {/* Cerrar Sesión */}
            <li>
              <button onClick={handleLogout} className="buttoncerrarsesion">
                Cerrar Sesión
              </button>
            </li>

          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
