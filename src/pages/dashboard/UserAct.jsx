// UserAct.jsx
import React, { useEffect, useState, useContext } from "react";
import "../../CSS/UserAct.css";
import { Trash2 } from "lucide-react";

const API = "http://localhost:5000";
const PAGE_SIZE = 8;

const UserAct = () => {

  const [vehiculos, setVehiculos] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const [selected, setSelected] = useState(null);
  const [totalPagar, setTotalPagar] = useState(null);
  const [cobrando, setCobrando] = useState(false);

  const cargarVehiculos = async () => {
    try {
      const res = await fetch(`${API}/historial`);
      const data = await res.json();
      setVehiculos(data);
    } catch {
      alert("Error al cargar los vehículos estacionados.");
    }
  };

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const filteredVehiculos = vehiculos.filter(v =>
    v.patente.toLowerCase().includes(search.toLowerCase()) ||
    v.conductor.toLowerCase().includes(search.toLowerCase())
  );

  const pageCount = Math.ceil(filteredVehiculos.length / PAGE_SIZE);
  const pageVehiculos = filteredVehiculos.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  const abrirCobro = vehiculo => {
    setSelected(vehiculo);
    setTotalPagar(null);
  };

  const cobrar = async () => {
    if (!selected) return;
    try {
      setCobrando(true);
      const res = await fetch(`${API}/vehiculo/${selected.patente}`, {
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
    setVehiculos(prev => prev.filter(v => v.patente !== selected.patente));
    setSelected(null);
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Vehículos estacionados</h5>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Buscar por patente o conductor"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <div className="table-responsive">
            <table className="table table-sm align-middle">
              <thead className="table-light">
                <tr>
                  <th>Patente</th>
                  <th>Conductor</th>
                  <th>Correo</th>
                  <th>Hora Entrada</th>
                  <th>Plaza</th>
                  <th className="acciones">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pageVehiculos.map(v => (
                  <tr key={v.patente}>
                    <td>{v.patente}</td>
                    <td>{v.conductor}</td>
                    <td>{v.correo || "—"}</td>
                    <td>{v.entrada.replace("T", " ")}</td>
                    <td>{v.posicion}</td>
                    <td>
                      <div className="action-icon">
                        <button
                          className="btn btn-link text-danger p-0"
                          onClick={() => abrirCobro(v)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pageVehiculos.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      Sin resultados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {pageCount > 1 && (
            <nav className="gsn-pagination mt-3 d-flex justify-content-center align-items-center gap-2">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => setCurrentPage(p => Math.max(p - 1, 0))}
                disabled={currentPage === 0}
              >
                ←
              </button>
              {Array.from({ length: pageCount }).map((_, idx) => (
                <button
                  key={idx}
                  className={`gsn-page-dot ${idx === currentPage ? "active" : ""}`}
                  onClick={() => setCurrentPage(idx)}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => setCurrentPage(p => Math.min(p + 1, pageCount - 1))}
                disabled={currentPage === pageCount - 1}
              >
                →
              </button>
            </nav>
          )}
        </div>
      </div>

      {selected && (
        <div className="cobro-modal" onClick={() => setSelected(null)}>
          <div className="cobro-card" onClick={e => e.stopPropagation()}>
            <h3>Plaza {selected.posicion}</h3>
            <p>
              <strong>Patente:</strong> {selected.patente}<br />
              <strong>Conductor:</strong> {selected.conductor}<br />
              {selected.correo && (<><strong>Correo:</strong> {selected.correo}<br /></>)}
            </p>

            {totalPagar === null ? (
              <>
                <button className="btn-finalizar" onClick={cobrar} disabled={cobrando}>
                  {cobrando ? "Calculando…" : "Cobrar"}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAct;
