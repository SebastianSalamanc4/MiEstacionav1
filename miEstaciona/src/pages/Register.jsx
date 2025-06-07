import React from "react";
import { Link } from "react-router-dom";
import '../CSS/Login.css';
import ImgLateral from '../assets/ImgLateralLogin.png';
import Navbar from "./NavBar.jsx"; // ← Asegúrate que el path sea correcto

const Register = () => {
  return (
    <>
      <Navbar /> 
      <div className="login-container">
        {/* Lado izquierdo con imagen */}
        <div className="login-left">
          <img src={ImgLateral} alt="Testimonio" />
          <div className="login-quote"></div>
        </div>

        {/* Lado derecho con formulario */}
        <div className="login-right">
          <h2>Crea tu cuenta</h2>
          <p>Ingresa los datos para registrarte en MiEstaciona.</p>

          <form>
            <input type="text" placeholder="Nombre completo" />
            <input type="email" placeholder="Correo electrónico" />
            <input type="password" placeholder="Contraseña" />
            <input type="text" placeholder="Cargo o rol" />

            <button className="btn-login">Crear cuenta</button>

            <div className="divider"><span>O</span></div>

            <button className="btn-google">Regístrate con Google</button>
          </form>

          <p className="register-link">
            ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
