import React, { useEffect, useState, useContext } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import "../CSS/VistaUsuario.css";
import Navbar from "./NavBar.jsx";
import { AuthContext } from "./AuthContext";

const VistaUsuario = () => {
  const { API } = useContext(AuthContext);
  const [capacidadTotal, setCapacidadTotal] = useState(0);
  const [ocupadas, setOcupadas] = useState(0);
  const [libres, setLibres] = useState(0);
  const [config, setConfig] = useState({
    nombre: "",
    apertura: "",
    cierre: "",
    tarifa: ""
  });

  // Cargar plazas
  useEffect(() => {
    fetch(`${API}/plazas`)
      .then(response => response.json())
      .then(data => {
        const totalPlazas = data.length;
        const plazasOcupadas = data.filter(plaza => plaza.ocupado).length;
        const plazasLibres = totalPlazas - plazasOcupadas;

        setCapacidadTotal(totalPlazas);
        setOcupadas(plazasOcupadas);
        setLibres(plazasLibres);
      })
      .catch(error => console.error('Error fetching plazas:', error));
  }, []);

  // Cargar configuración general (nombre, horario, tarifa)
  useEffect(() => {
    fetch(`${API}/configuracion`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setConfig(data);
        }
      })
      .catch(error => console.error('Error fetching config:', error));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>{config.nombre || "Estacionamiento"}</h1>
        <p>"Nuestra página web está diseñada para proporcionar toda la información clave sobre tu estacionamiento: ubicación, horarios y capacidad actual, asegurando que tanto los clientes como los administradores tengan acceso fácil y rápido a los detalles más importantes."</p>

        <div className="grid">
          {/* Recuadro 1 - Ubicación */}
          <div className="card">
            <div className="icon">
              <i className="fa fa-map-marker" aria-hidden="true"></i>
            </div>
            <h2>Ubicación</h2>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1556.806608419368!2d-72.55070252874134!3d-38.70372799750443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2scl!4v1750372858570!5m2!1ses!2scl"
              width="100%"
              height="300"
              style={{border: '0'}}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Recuadro 2 - Sobre la Web */}
          <div className="card">
            <div className="icon">
              <i className="fa fa-comment" aria-hidden="true"></i>
            </div>
            <h2>Hablar sobre la Web</h2>
            <p>En nuestra plataforma, puedes obtener toda la información necesaria, desde tarifas hasta horarios y disponibilidad. ¡Contáctanos si tienes preguntas!</p>
          </div>

          {/* Recuadro 3 - Horarios y tarifa */}
          <div className="card">
            <div className="icon">
              <i className="fa fa-calendar" aria-hidden="true"></i>
            </div>
            <h2>Horario de atención</h2>
            <p>Abierto desde las <strong>{config.apertura || "--:--"}</strong> hasta las <strong>{config.cierre || "--:--"}</strong>.</p>
            <p>Precio por minuto: <strong>${config.tarifa || "--"}</strong></p>
          </div>

          {/* Recuadro 4 - Capacidad */}
          <div className="card">
            <div className="icon">
              <i className="fa fa-car" aria-hidden="true"></i>
            </div>
            <h2>Capacidad actual</h2>
            <p>{`Total de plazas: ${capacidadTotal}`}</p>
            <p>{`Plazas ocupadas: ${ocupadas}`}</p>
            <p>{`Plazas libres: ${libres}`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VistaUsuario;
