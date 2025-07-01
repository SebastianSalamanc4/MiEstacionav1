import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import "../../CSS/Configuracion.css";

const Configuracion = () => {
  const { API } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const [config, setConfig] = useState({
    nombre: "",
    apertura: "",
    cierre: "",
    tarifa: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState(""); // "exito" o "error"

  useEffect(() => {
    fetch(`${API}/configuracion`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setConfig(data);
        }
      });
  }, []);

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const guardarCambios = async () => {
    // Validación de campos
    if (
      !config.nombre.trim() ||
      !config.apertura ||
      !config.cierre ||
      config.tarifa === ""
    ) {
      setMensaje("Por favor, completa todos los campos.");
      setTipoMensaje("error");
      return;
    }

    // Validación numérica
    if (isNaN(config.tarifa) || Number(config.tarifa) <= 0) {
      setMensaje("La tarifa debe ser un número mayor a cero.");
      setTipoMensaje("error");
      return;
    }

    try {
      const res = await fetch(`${API}/configuracion`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje("Configuración actualizada correctamente.");
        setTipoMensaje("exito");
        setConfig({ nombre: "", apertura: "", cierre: "", tarifa: "" });
      } else {
        setMensaje(data.error || "Error al actualizar la configuración.");
        setTipoMensaje("error");
      }
    } catch (err) {
      setMensaje("Error de conexión con el servidor.");
      setTipoMensaje("error");
    }
  };

  if (user?.tipo_usuario !== "admin") return <p>Acceso denegado</p>;

  return (
    <div className="contenedor-configuracion">
      <h2>Configuración del sistema</h2>

      {mensaje && (
        <div className={`mensaje ${tipoMensaje}`}>{mensaje}</div>
      )}

      <label>Nombre del Estacionamiento</label>
      <input
        name="nombre"
        value={config.nombre}
        onChange={handleChange}
        required
      />

      <label>Hora de Apertura</label>
      <input
        type="time"
        name="apertura"
        value={config.apertura}
        onChange={handleChange}
        required
      />

      <label>Hora de Cierre</label>
      <input
        type="time"
        name="cierre"
        value={config.cierre}
        onChange={handleChange}
        required
      />

      <label>Tarifa por minuto</label>
      <input
        type="number"
        name="tarifa"
        value={config.tarifa}
        onChange={handleChange}
        required
      />

      <button onClick={guardarCambios}>Guardar Cambios</button>
    </div>
  );
};

export default Configuracion;
