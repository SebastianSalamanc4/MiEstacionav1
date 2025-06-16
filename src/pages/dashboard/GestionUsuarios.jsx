import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import "../../CSS/GestionUsuarios.css";

const API = "http://localhost:5000";

const GestionUsuarios = () => {

  // Datos y formulario ----------------------------------------------------------------
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
    tipo_usuario: "trabajador",
  });
  const [editingId, setEditingId] = useState(null);

  // Buscador --------------------------------------------------------------------------
  const [searchField, setSearchField] = useState("nombre");     // columna a buscar
  const [searchValue, setSearchValue] = useState("");           // valor de búsqueda

  // Helpers REST ----------------------------------------------------------------------
  const fetchUsuarios = async () => {
    try {
      const res  = await fetch(`${API}/usuarios`);
      const data = await res.json();
      setUsuarios(data);
    } catch {
      alert("Error al cargar usuarios.");
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Form CRUD -------------------------------------------------------------------------
  const resetForm = () => {
    setForm({ nombre: "", correo: "", contraseña: "", tipo_usuario: "trabajador" });
    setEditingId(null);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const opts = {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    };
    const url = editingId ? `${API}/usuario/${editingId}` : `${API}/registro`;

    try {
      const res = await fetch(url, opts);
      if (!res.ok) throw new Error();
      await fetchUsuarios();
      resetForm();
    } catch {
      alert("Error al guardar usuario/trabajador.");
    }
  };

  const editarUsuario = u => {
    setForm({ nombre: u.nombre, correo: u.correo, contraseña: "", tipo_usuario: u.tipo_usuario });
    setEditingId(u.id);
  };

  const eliminarUsuario = async id => {
    if (!window.confirm("¿Eliminar este usuario/trabajador?")) return;
    try {
      await fetch(`${API}/usuario/${id}`, { method: "DELETE" });
      await fetchUsuarios();
    } catch {
      alert("Error al eliminar.");
    }
  };

  // Filtrado según buscador -----------------------------------------------------------
  const filteredUsuarios = usuarios.filter(u => {
    if (searchField === "tipo_usuario") {
      return searchValue ? u.tipo_usuario === searchValue : true;
    }
    return searchValue
      ? u[searchField].toLowerCase().startsWith(searchValue.toLowerCase())
      : true;
  });

  // ‑‑‑ Encima de GestionUsuarios (o dentro del componente) ‑‑‑
  const PAGE_SIZE = 8;              // 👉 cuántas filas quieres por “carrusel”

  // ‑‑‑ Dentro de GestionUsuarios  ----------------------------------------------------
  const [currentPage, setCurrentPage] = useState(0);           // 0‑based

  // Cuando cambia el filtro o los datos, vuelve a la primera página
  useEffect(() => setCurrentPage(0), [searchField, searchValue, usuarios]);

  // --------------- Segmento de la página actual ------------
  const pageCount      = Math.ceil(filteredUsuarios.length / PAGE_SIZE);
  const sliceStart     = currentPage * PAGE_SIZE;
  const pageUsuarios   = filteredUsuarios.slice(sliceStart, sliceStart + PAGE_SIZE);

  const goPrev  = () => setCurrentPage(p => Math.max(p - 1, 0));
  const goNext  = () => setCurrentPage(p => Math.min(p + 1, pageCount - 1));
  const goPage  = idx => setCurrentPage(idx);


  // UI --------------------------------------------------------------------------------
  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* -------------------------------- Formulario -------------------------------- */}
        <div className="col-12 col-xl-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">
                {editingId
                  ? `Actualizar ${form.tipo_usuario.charAt(0).toUpperCase() + form.tipo_usuario.slice(1)}`
                  : "Crear Trabajador"}
              </h5>

              <form onSubmit={handleSubmit} className="vstack gap-3">
                <input
                  className="form-control"
                  name="nombre"
                  placeholder="Nombre completo"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  className="form-control"
                  name="correo"
                  placeholder="Correo"
                  value={form.correo}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  className="form-control"
                  name="contraseña"
                  placeholder="Contraseña"
                  value={form.contraseña}
                  onChange={handleChange}
                  required={!editingId}
                />
                <select
                  className="form-select"
                  name="tipo_usuario"
                  value={form.tipo_usuario}
                  onChange={handleChange}
                  disabled={!editingId}                // deshabilitado en modo Crear
                 >
                  {editingId ? (                      // ──── Modo ACTUALIZAR ────
                  <>
                    <option value="trabajador">Trabajador</option>
                    <option value="usuario">Usuario</option>
                  </>
                  ) : (                               // ──── Modo CREAR ────
                    <option value="trabajador">Trabajador</option>
                  )}
                </select>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary flex-grow-1">
                    {editingId ? "Actualizar" : "Crear"}
                  </button>
                  {editingId && (
                    <button type="button" className="btn btn-secondary flex-grow-1" onClick={resetForm}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* -------------------------------- Tabla ------------------------------------- */}
        <div className="col-12 col-xl-6">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Usuarios / Trabajadores registrados</h5>

              {/* ------- Buscador ------- */}
              <div className="row g-2 align-items-end mb-3">
                <div className="col-auto">
                  <select
                    className="form-select"
                    value={searchField}
                    onChange={e => {
                      setSearchField(e.target.value);
                      setSearchValue("");
                    }}
                  >
                    <option value="nombre">Nombre</option>
                    <option value="correo">Correo</option>
                    <option value="tipo_usuario">Tipo</option>
                  </select>
                </div>

                <div className="col">
                  {searchField === "tipo_usuario" ? (
                    <select
                      className="form-select"
                      value={searchValue}
                      onChange={e => setSearchValue(e.target.value)}
                    >
                      <option value="">— Todos —</option>
                      <option value="trabajador">Trabajador</option>
                      <option value="usuario">Usuario</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      className="form-control"
                      placeholder={`Buscar por ${searchField === "nombre" ? "nombre" : "correo"}`}
                      value={searchValue}
                      onChange={e => setSearchValue(e.target.value)}
                    />
                  )}
                </div>
              </div>

              {/* ------- Tabla ------- */}
              <div className="table-responsive flex-grow-1">
                <table className="table table-sm align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Tipo</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageUsuarios.map(u => (
                      <tr key={u.id}>
                        <td>{u.nombre}</td>
                        <td>{u.correo}</td>
                        <td className="text-capitalize">{u.tipo_usuario}</td>
                        <td className="text-end">
                          <button className="btn btn-link p-0 me-2" onClick={() => editarUsuario(u)}>
                            <Pencil size={16} />
                          </button>
                          <button className="btn btn-link text-danger p-0" onClick={() => eliminarUsuario(u.id)}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {pageUsuarios.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center text-muted">
                          Sin resultados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {/* ------ Navegación (carrusel) ------ */}
                {pageCount > 1 && (
                  <nav className="gsn-pagination mt-3 d-flex justify-content-center align-items-center gap-2">
                    <button className="btn btn-sm btn-outline-primary"
                    onClick={goPrev} disabled={currentPage === 0}>
                      ←
                    </button>
                    
                    {/* Dots / números */}
                    {Array.from({ length: pageCount }).map((_, idx) => (
                      <button
                        key={idx}
                        className={`gsn-page-dot ${idx === currentPage ? "active" : ""}`}
                        onClick={() => goPage(idx)}
                      >
                        {idx + 1}
                      </button>
                      ))}
                      <button className="btn btn-sm btn-outline-primary"
                      onClick={goNext} disabled={currentPage === pageCount - 1}>
                        →
                      </button>
                  </nav>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { GestionUsuarios };
