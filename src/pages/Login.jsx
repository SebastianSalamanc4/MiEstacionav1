import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./AuthContext"; // Ruta al archivo AuthContext
import ImgLateral from '../assets/ImgLateralLogin.png';
import '../CSS/Login.css';
import Navbar from "./NavBar.jsx";

const Login = () => {
  const { API } = useContext(AuthContext);
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Obtienes login desde el contexto
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo, contraseña }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login exitoso:', data);
        // Llamas a login del contexto para guardar el estado global
        login(data.id, data.tipo_usuario);  // <-- aquí pasas el id, el tipo de usuario ecibido del backend
        navigate('/dashboard');
      } else {
        setError(data.error || 'Error en el login');
      }
    } catch (err) {
      setError('Error de conexión al servidor');
    }
  };

  return (
    <>
    <Navbar />
    <div className="login-container">
      <div className="login-left">
        <img src={ImgLateral} alt="Testimonio" />
        <div className="login-quote"></div>
      </div>
      <div className="login-right">
        <h2>Welcome back to MiEstaciona</h2>
        <p>Accede a la plataforma para administrar tu estacionamiento.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />
          <a href="#">Forgot password?</a>

          {error && <p style={{color: 'red'}}>{error}</p>}

          <button className="btn-login" type="submit">Log in</button>

          <div className="divider"><span>OR</span></div>

          <button className="btn-google" type="button">Continua con google</button>
        </form>

        <p className="register-link">No tienes una cuenta? <Link to="/Register">Registrate</Link></p>
      </div>
    </div>
    </>
  );
};

export default Login;
