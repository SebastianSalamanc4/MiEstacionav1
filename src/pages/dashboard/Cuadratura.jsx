import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import "../../CSS/Cuadratura.css";

const DENOMINACIONES = [20000, 10000, 5000, 2000, 1000, 500, 100, 50, 10];

const Cuadratura = () => {
  const { API } = useContext(AuthContext);
  const [trabajadores, setTrabajadores] = useState([]);
  const [seleccionado, setSeleccionado] = useState("");
  const [jornada, setJornada] = useState(""); // como fecha
  const [desglose, setDesglose] = useState({});
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const total = DENOMINACIONES.reduce((sum, den) => {
    const cantidad = desglose[den] || 0;
    return sum + den * cantidad;
  }, 0);

  useEffect(() => {
    const cargarTrabajadores = async () => {
      try {
        const res = await fetch(`${API}/usuarios`);
        const data = await res.json();
        const soloTrabajadores = data.filter(u => u.tipo_usuario === "trabajador");
        setTrabajadores(soloTrabajadores);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
      }
    };
    cargarTrabajadores();
  }, [API]);

  const handleCantidadChange = (den, value) => {
    const num = parseInt(value);
    setDesglose(prev => ({
      ...prev,
      [den]: isNaN(num) || num < 0 ? 0 : num,
    }));
  };

  const enviar = async () => {
    setMensaje("");
    setError("");

    if (!seleccionado || !password || !jornada) {
      setError("Completa todos los campos: trabajador, jornada y contraseña.");
      return;
    }

    try {
      const res = await fetch(`${API}/cuadratura`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trabajador_id: seleccionado,
          jornada,
          desglose,
          total,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al registrar caja.");
      }

      setMensaje("✅ Caja base registrada con éxito.");
      setDesglose({});
      setPassword("");
      setSeleccionado("");
      setJornada("");
    } catch (err) {
      setError("❌ " + err.message);
    }
  };

  return (
    <div className="cuadratura-container">
      <h2>Registrar Caja Inicial</h2>

      <label>Trabajador:</label>
      <select value={seleccionado} onChange={e => setSeleccionado(e.target.value)}>
        <option value="">Seleccione...</option>
        {trabajadores.map(t => (
          <option key={t.id} value={t.id}>{t.nombre}</option>
        ))}
      </select>

      <label>Fecha de jornada:</label>
      <input
        type="date"
        value={jornada}
        onChange={e => setJornada(e.target.value)}
      />

      <div className="denominaciones-grid">
        {DENOMINACIONES.map(den => (
          <div key={den} className="den-item">
            <label>${den}:</label>
            <input
              type="number"
              min="0"
              value={desglose[den] || ""}
              onChange={e => handleCantidadChange(den, e.target.value)}
            />
          </div>
        ))}
      </div>

      <p><strong>Total:</strong> ${total}</p>

      <label>Contraseña del trabajador:</label>
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={enviar}>Registrar caja</button>

      {mensaje && <p className="mensaje-ok">{mensaje}</p>}
      {error && <p className="mensaje-error">{error}</p>}
    </div>
  );
};

export default Cuadratura;
