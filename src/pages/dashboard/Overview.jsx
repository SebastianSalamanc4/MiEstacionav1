// Overview.jsx
import React, { useEffect, useState } from "react";
import "../../CSS/Overview.css";
import carIcon from "../../assets/icons/Iconcar.svg";

const PAGE_SIZE          = 12;   // 👉 solo se muestran 12 plazas por “vista”
const TARIFA_POR_MINUTO  = 50;   // debe coincidir con app.config["TARIFA_POR_MINUTO"]

const Overview = () => {
  /* ------------------- estado principal ------------------- */
  const [parkingSlots, setParkingSlots] = useState([]);
  const [loading, setLoading]           = useState(true);

  /* paginación tipo carrusel */
  const [currentPage, setCurrentPage]   = useState(0);

  /* modal de cobro */
  const [selected, setSelected]         = useState(null);
  const [totalPagar, setTotalPagar]     = useState(null);   // null → aún no cobrado
  const [cobrando, setCobrando]         = useState(false);

  /* ------------------- cargar datos ------------------- */
  const cargarDatos = async () => {
  try {
    setLoading(true);
    const res = await fetch("http://localhost:5000/plazas");
    const data = await res.json();

    // Construye el estado base con las plazas
    const baseSlots = data.map(p => ({
      id: p.codigo,
      ocupado: p.ocupado,
      vehiculo: null  // se completará luego si está ocupado
    }));

    // Si deseas mantener la info del historial (patente/conductor):
    const historialRes = await fetch("http://localhost:5000/historial");
    const historial    = await historialRes.json();

    historial.forEach(v => {
      const idx = baseSlots.findIndex(s => s.id === v.posicion);
      const vehiculoInfo = {
        patente:   v.patente,
        conductor: v.conductor,
        entrada:   v.entrada,
      };
      if (idx !== -1) {
        baseSlots[idx] = { ...baseSlots[idx], vehiculo: vehiculoInfo };
      } else {
        baseSlots.push({ id: v.posicion, ocupado: true, vehiculo: vehiculoInfo });
      }
    });

    setParkingSlots(baseSlots);
    setCurrentPage(prev =>
      prev >= Math.ceil(baseSlots.length / PAGE_SIZE) ? 0 : prev
    );
  } catch (err) {
    console.error("Error al cargar plazas:", err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    cargarDatos();
  }, []);

  /* ------------------- helpers de cobro ------------------- */
  const abrirCobro = slot => {
    setSelected(slot);
    setTotalPagar(null); // aún no se cobra
  };

  const cobrar = async () => {
    if (!selected) return;
    try {
      setCobrando(true);
      const res   = await fetch(`http://localhost:5000/vehiculo/${selected.vehiculo.patente}`, {
        method: "DELETE",
      });
      const data  = await res.json();
      if (!res.ok) throw new Error(data.error || "Error de API");
      setTotalPagar(data.total_pagar);
    } catch (err) {
      alert("Error al cobrar: " + err.message);
      setSelected(null);
    } finally {
      setCobrando(false);
    }
  };

  const finalizar = () => {
    /* libera la plaza localmente y cierra modal */
    setParkingSlots(prev =>
      prev.map(s =>
        s.id === selected.id ? { ...s, ocupado: false, vehiculo: null } : s
      )
    );
    setSelected(null);
  };

  /* ------------------- cálculos de UI ------------------- */
  const pageCount      = Math.ceil(parkingSlots.length / PAGE_SIZE);
  const sliceStart     = currentPage * PAGE_SIZE;
  const visibleSlots   = parkingSlots.slice(sliceStart, sliceStart + PAGE_SIZE);

  const usados         = parkingSlots.filter(s => s.ocupado).length;
  const disponibles    = parkingSlots.filter(s => !s.ocupado).length;

  /* ------------------- render ------------------- */
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

      {/* ------------ carrusel ------------ */}
      <div className="carousel-nav">
        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 0))}
          disabled={currentPage === 0}
        >
          ←
        </button>
        <span>
          {currentPage + 1}/{pageCount}
        </span>
        <button
          onClick={() => setCurrentPage(p => Math.min(p + 1, pageCount - 1))}
          disabled={currentPage === pageCount - 1}
        >
          →
        </button>
      </div>

      {/* ------------ grid de plazas ------------ */}
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

      {/* ------------ modal de cobro ------------ */}
      {selected && (
  <div className="cobro-modal" onClick={() => setSelected(null)}>
    <div className="cobro-card" onClick={e => e.stopPropagation()}>
      <h3>Plaza {selected.id}</h3>
      <p>
        <strong>Patente:</strong> {selected.vehiculo.patente}
        <br />
        <strong>Conductor:</strong> {selected.vehiculo.conductor}
      </p>

      {totalPagar === null ? (
        <>
          <button
            className="btn-finalizar"
            onClick={cobrar}
            disabled={cobrando}
          >
            {cobrando ? "Calculando…" : "Cobrar"}
          </button>

          {/* Mostrar "Cancelar" solo si aún no se está cobrando */}
          {!cobrando && (
            <button
              className="btn-cancelar"
              onClick={() => setSelected(null)}
            >
              Cancelar
            </button>
          )}
        </>
      ) : (
        <>
          <p className="m-2">
            <strong>Total a pagar:</strong> ${totalPagar}
          </p>
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
