// Overview.jsx
import React, { useEffect, useState } from "react";
import "../../CSS/Overview.css";
import carIcon from "../../assets/icons/Iconcar.svg";

const PAGE_SIZE = 12;
const TARIFA_POR_MINUTO = 50;

const Overview = () => {
  const [parkingSlots, setParkingSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [selected, setSelected] = useState(null);
  const [totalPagar, setTotalPagar] = useState(null);
  const [cobrando, setCobrando] = useState(false);

  const [pagoCliente, setPagoCliente] = useState("");
  const [vuelto, setVuelto] = useState(null);
  const [monedas, setMonedas] = useState(null);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://miestaciona-backend2.onrender.com/plazas");
      const data = await res.json();

      const baseSlots = data.map(p => ({
        id: p.codigo,
        ocupado: p.ocupado,
        vehiculo: null
      }));

      const historialRes = await fetch("https://miestaciona-backend2.onrender.com/historial");
      const historial = await historialRes.json();

      historial.forEach(v => {
        const idx = baseSlots.findIndex(s => s.id === v.posicion);
        const vehiculoInfo = {
          patente: v.patente,
          conductor: v.conductor,
          entrada: v.entrada,
        };
        if (idx !== -1) {
          baseSlots[idx] = { ...baseSlots[idx], vehiculo: vehiculoInfo };
        } else {
          baseSlots.push({ id: v.posicion, ocupado: true, vehiculo: vehiculoInfo });
        }
      });

      setParkingSlots(baseSlots);
      setCurrentPage(prev => prev >= Math.ceil(baseSlots.length / PAGE_SIZE) ? 0 : prev);
    } catch (err) {
      console.error("Error al cargar plazas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const abrirCobro = slot => {
    setSelected(slot);
    setTotalPagar(null);
    setPagoCliente("");
    setVuelto(null);
    setMonedas(null);
  };

  const cobrar = async () => {
    if (!selected) return;
    try {
      setCobrando(true);
      const res = await fetch(`https://miestaciona-backend2.onrender.com/vehiculo/${selected.vehiculo.patente}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error de API");
      setTotalPagar(data.total_pagar);
    } catch (err) {
      alert("Error al cobrar: " + err.message);
      setSelected(null);
    } finally {
      setCobrando(false);
    }
  };

  const cobrarEfectivo = async () => {
    const pago = parseInt(pagoCliente);
    if (!selected || isNaN(pago)) return;

    try {
      setCobrando(true);
      const res = await fetch(`https://miestaciona-backend2.onrender.com/vehiculo/cobrar_efectivo/${selected.vehiculo.patente}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pago })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error de API");

      setTotalPagar(data.total_pagar);
      setVuelto(data.vuelto);
      setMonedas(data.monedas);
    } catch (err) {
      alert("Error al cobrar efectivo: " + err.message);
      setSelected(null);
    } finally {
      setCobrando(false);
    }
  };

  const finalizar = () => {
    setParkingSlots(prev =>
      prev.map(s =>
        s.id === selected.id ? { ...s, ocupado: false, vehiculo: null } : s
      )
    );
    setSelected(null);
  };

  const pageCount = Math.ceil(parkingSlots.length / PAGE_SIZE);
  const sliceStart = currentPage * PAGE_SIZE;
  const visibleSlots = parkingSlots.slice(sliceStart, sliceStart + PAGE_SIZE);

  const usados = parkingSlots.filter(s => s.ocupado).length;
  const disponibles = parkingSlots.filter(s => !s.ocupado).length;

  return (
    <div className="overview-container">
      <div className="status-summary">
        {loading ? (
          <p>Cargando…</p>
        ) : (
          <>
            <p>
              Estacionamientos usados: <strong>{usados}</strong>
            </p>
            <p>
              Estacionamientos disponibles: <strong>{disponibles}</strong>
            </p>
          </>
        )}
      </div>

      <div className="carousel-nav">
        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 0))} disabled={currentPage === 0}>←</button>
        <span>{currentPage + 1}/{pageCount}</span>
        <button onClick={() => setCurrentPage(p => Math.min(p + 1, pageCount - 1))} disabled={currentPage === pageCount - 1}>→</button>
      </div>

      <div className="parking-grid">
        {visibleSlots.map(slot => (
          <button
            key={slot.id}
            className={`parking-slot ${slot.ocupado ? "ocupado" : "libre"}`}
            onClick={() => slot.ocupado && abrirCobro(slot)}
          >
            <span className="slot-id">{slot.id}</span>
            {slot.ocupado && (
              <>
                <img src={carIcon} alt="Carro" className="car-icon" />
                <div className="slot-info">
                  <span className="slot-patente">{slot.vehiculo.patente}</span>
                  <span className="slot-conductor">{slot.vehiculo.conductor}</span>
                </div>
              </>
            )}
          </button>
        ))}
      </div>

      {selected && (
        <div className="cobro-modal" onClick={() => setSelected(null)}>
          <div className="cobro-card" onClick={e => e.stopPropagation()}>
            <h3>Plaza {selected.id}</h3>
            <p>
              <strong>Patente:</strong> {selected.vehiculo.patente}<br />
              <strong>Conductor:</strong> {selected.vehiculo.conductor}
            </p>

            {totalPagar === null ? (
              <>
                <button className="btn-finalizar" onClick={cobrar} disabled={cobrando}>
                  {cobrando ? "Calculando…" : "Cobrar"}
                </button>

                <div className="efectivo-section">
                  <input
                    type="number"
                    placeholder="Pago en efectivo"
                    value={pagoCliente}
                    onChange={e => setPagoCliente(e.target.value)}
                  />
                  <button
                    className="btn-finalizar"
                    onClick={cobrarEfectivo}
                    disabled={cobrando || !pagoCliente}
                  >
                    {cobrando ? "Calculando…" : "Cobrar efectivo"}
                  </button>
                </div>

                {!cobrando && (
                  <button className="btn-cancelar" onClick={() => setSelected(null)}>
                    Cancelar
                  </button>
                )}
              </>
            ) : (
              <>
                <p className="m-2">
                  <strong>Total a pagar:</strong> ${totalPagar}
                </p>

                {vuelto !== null && (
                  <div className="resultado-vuelto">
                    <p><strong>Vuelto:</strong> ${vuelto}</p>
                    <ul>
                      {monedas && Object.entries(monedas).map(([den, cant]) => (
                        <li key={den}>{cant} × ${den}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button className="btn-finalizar" onClick={finalizar}>
                  Finalizar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
