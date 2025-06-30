import React, { useState, useEffect } from 'react';

export const Cuadratura = () => {
  const denominaciones = [
    { label: 'Billetes de $20.000', valor: 20000 },
    { label: 'Billetes de $10.000', valor: 10000 },
    { label: 'Billetes de $5.000',  valor: 5000 },
    { label: 'Billetes de $2.000',  valor: 2000 },
    { label: 'Billetes de $1.000',  valor: 1000 },
    { label: 'Monedas de $500',     valor: 500 },
    { label: 'Monedas de $100',     valor: 100 },
    { label: 'Monedas de $50',      valor: 50 },
    { label: 'Monedas de $10',      valor: 10 }
  ];

  const [cantidades, setCantidades] = useState(
    denominaciones.reduce((acc, d) => ({ ...acc, [d.valor]: 0 }), {})
  );

  const [total, setTotal] = useState(0);
  const [trabajadores, setTrabajadores] = useState([]);
  const [trabajadorId, setTrabajadorId] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    fetch("https://miestaciona-backend2.onrender.com/usuarios")
      .then(res => res.json())
      .then(data => {
        const soloTrabajadores = data.filter(u => u.tipo_usuario === "trabajador");
        setTrabajadores(soloTrabajadores);
      })
      .catch(err => {
        console.error("Error al cargar trabajadores:", err);
      });
  }, []);

  const handleChange = (valor, nuevaCantidad) => {
    const nuevaCantidadInt = parseInt(nuevaCantidad) || 0;
    setCantidades(prev => ({
      ...prev,
      [valor]: nuevaCantidadInt
    }));
  };

  const calcularTotal = () => {
    const suma = Object.entries(cantidades).reduce(
      (acc, [valor, cantidad]) => acc + parseInt(valor) * cantidad,
      0
    );
    setTotal(suma);
  };

  const enviarCajaBase = async () => {
    if (!trabajadorId || !password || total <= 0) {
      setMensaje("Debes completar todos los campos y calcular el total.");
      return;
    }

    try {
      const res = await fetch("https://miestaciona-backend2.onrender.com/caja_base", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trabajador_id: trabajadorId,
          password: password,
          total: total
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje("✅ Caja base registrada correctamente.");
        // Limpieza opcional
        setCantidades(denominaciones.reduce((acc, d) => ({ ...acc, [d.valor]: 0 }), {}));
        setTrabajadorId('');
        setPassword('');
        setTotal(0);
      } else {
        setMensaje("❌ " + (data.error || "Error al registrar caja base"));
      }
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error de conexión con el servidor.");
    }
  };

  return (
    <div className="cuadratura-container">
      <h2>Registrar dinero en caja (inicio del día)</h2>

      <div className="denominaciones-lista">
        {denominaciones.map(d => (
          <div key={d.valor} className="denominacion">
            <label>{d.label}</label>
            <input
              type="number"
              min="0"
              value={cantidades[d.valor]}
              onChange={(e) => handleChange(d.valor, e.target.value)}
            />
          </div>
        ))}
      </div>

      <button className="btn-calcular" onClick={calcularTotal}>
        Calcular total
      </button>

      <h3>Total en caja: ${total.toLocaleString('es-CL')}</h3>

      <hr />

      <h4>Asignar trabajador responsable</h4>
      <select value={trabajadorId} onChange={(e) => setTrabajadorId(e.target.value)}>
        <option value="">Selecciona un trabajador</option>
        {trabajadores.map(t => (
          <option key={t.id} value={t.id}>{t.nombre}</option>
        ))}
      </select>

      <input
        type="password"
        placeholder="Contraseña del trabajador"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="btn-enviar" onClick={enviarCajaBase}>
        Enviar caja base
      </button>

      {mensaje && <p style={{ marginTop: "1rem" }}>{mensaje}</p>}
    </div>
  );
};
