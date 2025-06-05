import React from "react";
import { Link } from "react-router-dom";
import '../CSS/Login.css';

const Login = () => {
  return (
    <div className="login">
      <h1>LOGIN</h1>
      <p className="body-text">
        Bienvenido al Login
      </p>

      {/* Enlace a la página de registro */}
      <p className="body-text">
        ¿No tienes una cuenta?{" "}
        <Link to="/register" className="link">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
};

export default Login;
