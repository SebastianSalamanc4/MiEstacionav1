import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./AuthContext"; // Ajusta la ruta
import "../CSS/Login.css";
import ImgLateral from "../assets/ImgLateralLogin.png";
import Navbar from "./NavBar.jsx";

const Register = () => {
  const { API } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
    tipo_usuario: "admin", // valor por defecto
  });

  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  // Contexto de autenticación
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje("✅ Usuario registrado correctamente");

        // Opcional: hacer login automático con el id recibido
        if (data.id) {
          login(data.id, data.tipo_usuario);
          navigate('/dashboard'); // redirige tras registro y login
        } else {
          // Si no quieres login automático, puedes limpiar el form o redirigir al login
          setFormData({
            nombre: "",
            correo: "",
            contraseña: "",
            tipo_usuario: "usuario",
          });
          // navigate('/login');
        }

      } else {
        setMensaje(`❌ Error: ${data.error || "Algo salió mal"}`);
      }
    } catch (error) {
      setMensaje("❌ Error de conexión con el servidor");
    }
  };

  return (
    <>
    <Navbar />
    <div className="login-container">
      <div className="login-left">
        <img src={ImgLateral} alt="Testimonio" />
      </div>
      
      <div className="login-right">
        <h2>Crea tu cuenta</h2>
        <p>
          Ingresa los datos para registrarte en MiEstaciona y administra tu
          estacionamiento.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre completo"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            name="contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn-login">
            Crear cuenta
          </button>
        </form>

        {mensaje && <p className="mensaje-registro">{mensaje}</p>}

        <p className="register-link">
          ¿Ya tienes una cuenta? <Link to="/Login">Inicia sesión</Link>
        </p>
      </div>
    </div>
    </>
  );
};

export default Register;
