import React from "react";
import { Link } from "react-router-dom";
import '../CSS/Login.css';
import ImgLateral from '../assets/ImgLateralLogin.png';
import Navbar from "./NavBar.jsx"; // Asegúrate que esté bien escrito y exista

const Login = () => {
  return (
    <div className="login-container">
      {/* Lado izquierdo con imagen y cita */}
      <div className="login-left">
        <img src={ImgLateral} alt="Testimonio" />
        <div className="login-quote">
          {/* <p>“Estaciona con seguridad, administra con confianza.”</p>*/}
        </div>
      </div>

      {/* Lado derecho con formulario */}
      <div className="login-right">
        <Navbar /> 
        <h2>Welcome back to MiEstaciona</h2>
        <p>Accede a la plataforma para administrar tu estacionamiento.</p>

        <form>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <a href="#">Forgot password?</a>

          <div className="remember">
          </div>

          <button className="btn-login">Log in</button>

          <div className="divider"><span>OR</span></div>

          <button className="btn-google">Continua con google</button>
        </form>

        <p className="register-link">No tienes una cuenta? <a href="#">Sign up</a></p>
      </div>
    </div>
  );
};

export default Login;