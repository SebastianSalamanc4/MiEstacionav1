import React from "react";
import { Link } from "react-router-dom";
import '../CSS/Register.css';

const Register = () => {
  return (
    <div className="register">
      <h1>REGISTER</h1>
      <p className="body-text">
        Bienvenido al Register
      </p>

      {/* Enlace a la página de registro */}
      <p className="body-text">
        ¿tienes una cuenta?{" "}
        <Link to="/login" className="link">
          Inicia sesion aquí
        </Link>
      </p>
    </div>
  );
};

export default Register;
