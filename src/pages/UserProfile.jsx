import { useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "../CSS/UserProfile.css";
import Navbar from "./NavBar.jsx";

const API = "http://localhost:5000";

const UserProfile = () => {
  const { user, logout } = useContext(AuthContext);   // ← tienes id y tipo_usuario
  const navigate         = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  // Form state
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    nueva_contraseña: "",
    tipo_usuario: "",
    contraseña_actual: "",
  });

  /* ──────────────────────────────── Cargar datos ─────────────────────────────── */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res  = await fetch(`${API}/usuario/${user.id}`);   // ➜ nuevo endpoint
        const data = await res.json();
        setForm(f => ({ ...f, nombre: data.nombre, correo: data.correo, tipo_usuario: data.tipo_usuario }));
      } catch {
        setMensaje("Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [user.id]);

  /* ──────────────────────────────── Handlers ─────────────────────────────────── */
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMensaje("");

    if (!form.contraseña_actual) {
      return setMensaje("⚠️ Debes confirmar tu contraseña actual.");
    }

    try {
      const res = await fetch(`${API}/usuario/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        return setMensaje(`❌ ${data.error || "Error al actualizar"}`);
      }

      setMensaje("✅ Datos actualizados correctamente");
      setForm(f => ({ ...f, nueva_contraseña: "", contraseña_actual: "" }));
    } catch {
      setMensaje("❌ Error de conexión con el servidor");
    }
  };

  /* ──────────────────────────────── UI ───────────────────────────────────────── */
  if (loading) return <p className="userProfile">Cargando…</p>;

  return (
    <div><Navbar /> {/* Aquí agregas la navbar al inicio */}
    <div className="userProfile">
      <h2>Mi perfil</h2>

      <form onSubmit={handleSubmit} className="profile-form">
        <label>Nombre
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </label>

        <label>Correo
          <input
            type="email"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            required
          />
        </label>

        <label>Tipo de usuario
          <input
            value={form.tipo_usuario}
            disabled
            readOnly
          />
        </label>

        <label>Nueva contraseña
          <input
            type="password"
            name="nueva_contraseña"
            value={form.nueva_contraseña}
            onChange={handleChange}
            placeholder="Dejar en blanco si no deseas cambiarla"
          />
        </label>

        <label>Confirma con tu contraseña actual
          <input
            type="password"
            name="contraseña_actual"
            value={form.contraseña_actual}
            onChange={handleChange}
            required
          />
        </label>

        {mensaje && <p className="mensaje">{mensaje}</p>}

        <div className="actions">
          <button type="submit" className="btn-save">Guardar cambios</button>
          <button type="button" className="btn-logout" onClick={() => { logout(); navigate("/"); }}>
            Cerrar sesión
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default UserProfile;
