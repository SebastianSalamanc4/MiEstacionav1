// Overview.jsx
import React, { useEffect, useState, useContext } from "react";
import "../../CSS/Overview.css";
import carIcon from "../../assets/icons/Iconcar.svg";
import { AuthContext } from "../AuthContext";

const PAGE_SIZE = 12;
const calcularTotalVuelto = (desglose) => {
  return Object.entries(desglose).reduce((sum, [den, cant]) => sum + (parseInt(den) * cant), 0);
};

const Overview = () => {
  const [parkingSlots, setParkingSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const [selected, setSelected] = useState(null);
  const [totalPagar, setTotalPagar] = useState(null);
  const [cobrando, setCobrando] = useState(false);

  const [mostrarEfectivo, setMostrarEfectivo] = useState(false);
  const [recibido, setRecibido] = useState(0);
  const [vuelto, setVuelto] = useState(null);

  const { API } = useContext(AuthContext);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/plazas`);
      const data = await res.json();

      const baseSlots = data.map(p => ({
        id: p.codigo,
        ocupado: p.ocupado,
        vehiculo: null
      }));

      const historialRes = await fetch(`${API}/historial`);
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

  const abrirCobro = slot => {
    setSelected(slot);
    setTotalPagar(null);
    setMostrarEfectivo(false);
    setRecibido(0);
    setVuelto(null);
  };

  const cobrar = async () => {
    if (!selected) return;
    try {
      setCobrando(true);
      const res = await fetch(`${API}/vehiculo/${selected.vehiculo.patente}`, {
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

  const finalizar = () => {
    setParkingSlots(prev =>
      prev.map(s =>
        s.id === selected.id ? { ...s, ocupado: false, vehiculo: null } : s
      )
    );
    setSelected(null);
  };

  const calcularVuelto = (tarifa, recibido) => {
    let vuelto = recibido - tarifa;
    if (vuelto < 0) return null;
    const denominaciones = [20000, 10000, 5000, 2000, 1000, 500, 100, 50, 10];
    const desglose = {};
    for (const valor of denominaciones) {
      const cantidad = Math.floor(vuelto / valor);
      if (cantidad > 0) {
        desglose[valor] = cantidad;
        vuelto -= cantidad * valor;
      }
    }
    return desglose;
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
              <strong>Patente:</strong> {selected.vehiculo.patente}
              <br />
              <strong>Conductor:</strong> {selected.vehiculo.conductor}
            </p>

            {totalPagar === null ? (
              <>
                <button
                  className="btn-transbank"
                  onClick={() => {
                    cobrar();
                  }}
                  disabled={cobrando}
                >
                  {cobrando ? "Calculando…" : "Cobrar Transbank"}
                </button>

                <button
                  className="btn-efectivo"
                  onClick={async () => {
                    await cobrar();
                    setMostrarEfectivo(true);
                  }}
                >
                  Cobrar efectivo
                </button>

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
                <button className="btn-finalizar" onClick={finalizar}>
                  Finalizar
                </button>
              </>
            )}

            {mostrarEfectivo && (
              <div className="efectivo-box">
                <p><strong>Total a pagar:</strong> ${totalPagar ?? "Calculando..."}</p>
                <input
                  type="number"
                  placeholder="Monto recibido"
                  value={recibido}
                  onChange={(e) => setRecibido(Number(e.target.value))}
                />
                <button className="btn-vuelto" onClick={() => {
                  if (!totalPagar) return;
                  const resultado = calcularVuelto(totalPagar, recibido);
                  setVuelto(resultado);
                }}>
                  Calcular vuelto
                </button>

                {vuelto && (
                  <div className="vuelto-box">
                    <p><strong>Vuelto:</strong></p>
                    <ul>
                      {Object.entries(vuelto).map(([den, cant]) => (
                        <li key={den}>${den}: {cant} unidad(es)</li>

                      ))}
                    </ul>
                    <p><strong>Total vuelto:</strong> ${calcularTotalVuelto(vuelto)}</p>
                  </div>
                )}

                <button className="btn-cancelar" onClick={() => setMostrarEfectivo(false)}>
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
