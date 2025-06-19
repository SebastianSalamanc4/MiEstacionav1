// RegistroAutos.jsx
import React, { useEffect, useState } from "react";
import "../../CSS/RegistroAutos.css";

const API = "http://localhost:5000";

const RegistroAutos = () => {
  /* ------------------------- Estado principal ------------------------- */
  const [formulario, setFormulario] = useState({
    patente: "",
    conductor: "",
    correo: "",
    hora_entrada: "",
  });

  /* Estacionamientos disponibles (null = cargando) */
  const [disponibles, setDisponibles] = useState(null);

  /* Mensaje de feedback (éxito / error) */
  const [mensaje, setMensaje] = useState("");

  /* ------------------ Cargar espacios al iniciar ------------------ */
  const fetchDisponibles = async () => {
    try {
      const res  = await fetch(`${API}/espacios_disponibles`);   // ajusta el endpoint
      const data = await res.json();                             // { disponibles: 12 }
      setDisponibles(data.disponibles);
    } catch {
      setDisponibles(0);   // asume sin lugares si falla
      setMensaje("⚠️ No se pudo comprobar la disponibilidad.");
    }
  };

  useEffect(() => {
    fetchDisponibles();
  }, []);

  /* ------------------------ Handlers ------------------------ */
  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Evita registrar si no hay cupos
    if (disponibles === 0) {
      setMensaje("❌ No hay estacionamientos disponibles.");
      return;
    }

    try {
      const res = await fetch(`${API}/registrar_vehiculo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formulario),
      });

      const data = await res.json();   // { numero_estacionamiento: X } o { error: ... }

      if (res.ok) {
        setMensaje(
          `✅ Vehículo registrado. Nº de estacionamiento asignado: ${data.numero_estacionamiento}`
        );
        setFormulario({
          patente: "",
          conductor: "",
          correo: "",
          hora_entrada: "",
        });
        /* Vuelve a consultar espacios restantes */
        fetchDisponibles();
      } else {
        setMensaje(`❌ Error: ${data.error}`);
      }
    } catch {
      setMensaje("❌ Error al conectar con el servidor.");
    }
  };

  /* ------------------------ UI ------------------------ */
  return (
    <div className="registro-autos-page">
      <h1>Registro de Autos</h1>

      {/* Estado de disponibilidad */}
      {disponibles === null ? (
        <p>Comprobando disponibilidad…</p>
      ) : disponibles === 0 ? (
        <p className="text-danger fw-bold">
          No hay estacionamientos disponibles.
        </p>
      ) : (
        <p>
          Espacios disponibles: <strong>{disponibles}</strong>
        </p>
      )}

      {/* Mensajes de feedback */}
      {mensaje && (
        <div
          className={`alert ${
            mensaje.startsWith("✅") ? "alert-success" : "alert-danger"
          }`}
        >
          {mensaje}
        </div>
      )}

      {/* Formulario (deshabilitado si no hay cupos) */}
      <form className="registro-form" onSubmit={handleSubmit}>
        <fieldset disabled={disponibles === 0}>
          <label htmlFor="patente">Patente:</label>
          <input
            type="text"
            id="patente"
            name="patente"
            value={formulario.patente}
            onChange={handleChange}
            required
          />

          <label htmlFor="conductor">Conductor:</label>
          <input
            type="text"
            id="conductor"
            name="conductor"
            value={formulario.conductor}
            onChange={handleChange}
            required
          />

          <label htmlFor="correo">Correo (opcional):</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formulario.correo}
            onChange={handleChange}
          />

          <label htmlFor="hora_entrada">Hora de Entrada:</label>
          <input
            type="datetime-local"
            id="hora_entrada"
            name="hora_entrada"
            value={formulario.hora_entrada}
            onChange={handleChange}
            required
          />

          <button type="submit">Registrar Vehículo</button>
        </fieldset>
      </form>
    </div>
  );
};

export default RegistroAutos;
