import React, { useState } from "react";
import "../../CSS/RegistroAutos.css";

const RegistroAutos = () => {
  const [formulario, setFormulario] = useState({
    patente: "",
    conductor: "",
    correo: "",
    hora_entrada: "",
  });

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/registrar_vehiculo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formulario),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Vehículo registrado con éxito ✅");
        setFormulario({
          patente: "",
          conductor: "",
          correo: "",
          hora_entrada: "",
        });
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="registro-autos-page">
      <h1>Registro de Autos</h1>
      <p>Registra los vehículos que ingresan al estacionamiento.</p>

      <form className="registro-form" onSubmit={handleSubmit}>
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
      </form>
    </div>
  );
};

export default RegistroAutos;
