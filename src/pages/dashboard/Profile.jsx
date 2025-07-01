import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import "../../CSS/Profile.css";

export const Profile = () => {
  const { API } = useContext(AuthContext);
  const { user, logout } = useContext(AuthContext);   // user.id y tipo_usuario
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [msg, setMsg]        = useState("");

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    tipo_usuario: "",
    nueva_contraseña: "",
    contraseña_actual: "",
  });

  /* ─── Cargar datos ───────────────────────────────────────────────────────── */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res  = await fetch(`${API}/usuario/${user.id}`);
        const data = await res.json();
        setForm(f => ({
          ...f,
          nombre: data.nombre,
          correo: data.correo,
          tipo_usuario: data.tipo_usuario,
        }));
      } catch {
        setMsg("Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [user.id]);

  /* ─── Handlers ───────────────────────────────────────────────────────────── */
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");

    if (!form.contraseña_actual) {
      return setMsg("⚠️ Debes confirmar la contraseña actual.");
    }

    try {
      const res  = await fetch(`${API}/usuario/${user.id}`, {
        method : "PUT",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) return setMsg(`❌ ${data.error || "Error al actualizar"}`);

      setMsg("✅ Datos actualizados correctamente");
      setForm(f => ({ ...f, nueva_contraseña: "", contraseña_actual: "" }));
    } catch {
      setMsg("❌ Error de conexión con el servidor");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  /* ─── UI ─────────────────────────────────────────────────────────────────── */
  if (loading) return <p className="profile-loading">Cargando…</p>;

  return (
    <section className="profile-container">
      <h1>Mi perfil</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="correo">Correo</label>
          <input
            id="correo"
            type="email"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Tipo de usuario</label>
          <input value={form.tipo_usuario} disabled readOnly />
        </div>

        <div className="form-group">
          <label htmlFor="nueva">Nueva contraseña</label>
          <input
            id="nueva"
            type="password"
            name="nueva_contraseña"
            value={form.nueva_contraseña}
            onChange={handleChange}
            placeholder="(opcional)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="actual">
            Confirma con tu contraseña actual <span className="req">*</span>
          </label>
          <input
            id="actual"
            type="password"
            name="contraseña_actual"
            value={form.contraseña_actual}
            onChange={handleChange}
            required
          />
        </div>

        {msg && <p className="profile-msg">{msg}</p>}

        <div className="form-buttons">
          <button type="submit" className="btn-save">
            Guardar cambios
          </button>
          <button type="button" className="btn-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </form>
    </section>
  );
};
