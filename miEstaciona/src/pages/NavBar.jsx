import { Link, useNavigate } from 'react-router-dom';
import '../CSS/NavBar.css';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

const NavBar = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
        <nav className="navbar-home navbar-register">
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            {!isLoggedIn ? (
              <li><Link to="/login">Iniciar Sesión</Link></li>
            ) : (
              <li><button onClick={handleLogout} className="logout-button">Cerrar Sesión</button></li>
            )}
            <li><Link to="/ControlPanel"><span className="btn-navbar">ControlPanel</span></Link></li>
            <li><Link to="/Statistics">Estadística</Link></li>
            <li><Link to="/Register">Register </Link> </li>
          </ul>
        </nav>

  );
};

export default NavBar;
