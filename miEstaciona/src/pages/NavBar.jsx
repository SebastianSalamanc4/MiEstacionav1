import React, { useContext } from 'react';
import Logo from '../assets/Parking.jpg';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS/NavBar.css';
import { AuthContext } from './AuthContext';

const NavBar = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-left">
        <img className="logo" src={Logo} alt="Logo de la empresa" />
      </div>
      <div className="navbar-right">
        <Link to="/">Home</Link>
        {!isLoggedIn ? (
          <Link to="/login">Iniciar Sesión</Link>
        ) : (
          <button onClick={handleLogout} className="logout-button">
            Cerrar Sesión
          </button>
        )}
        <Link to="/ControlPanel">
          <button className="primary-button">ControlPanel</button>
        </Link>
        <Link to="/Statistics">Estadistica</Link>
      </div>
    </nav>
  );
};

export default NavBar;
