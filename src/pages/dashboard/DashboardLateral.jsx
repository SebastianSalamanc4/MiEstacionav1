// DashboardLateral.jsx
import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";      // ajusta la ruta si es necesario
import "../../CSS/DashboardLateral.css";
import {
  MdArrowBack,
  MdLocalParking,
  MdCarRental,
  MdGroups,
  MdBarChart,
  MdAttachMoney,
  MdManageAccounts,
  MdPerson,
  MdSettings,
} from "react-icons/md";

const DashboardLateral = () => {
  const { user } = useContext(AuthContext);
  const tipo = user?.tipo_usuario;
  console.log("TIPO DE USUARIO:", tipo);

  /* ------------------------------------------
     • Solo “admin” o “trabajador” pueden entrar
     ------------------------------------------ */
  const accesoPermitido = tipo === "admin" || tipo === "trabajador";
  if (!accesoPermitido) return <Navigate to="/" replace />;

  const esTrabajador = tipo === "trabajador";
  const esAdmin = tipo === "admin";

  /* Utilidad: genera la clase activa para los <NavLink> */
  const navClass = ({ isActive }) => `nav-link${isActive ? " active" : ""}`;

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        {/* ---------- PARTE SUPERIOR ---------- */}
        <div className="sidebar-top">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link back-button${isActive ? " active" : ""}`
            }
          >
            <MdArrowBack className="icon-nav" />
            Back
          </NavLink>

          <h2>MiEstaciona</h2>

          <nav className="nav-section">
            <NavLink to="/dashboard/overview" className={navClass}>
              <MdLocalParking className="icon-nav" />
              Estacionamiento
            </NavLink>

            <NavLink to="/dashboard/RegistroAutos" className={navClass}>
              <MdCarRental className="icon-nav" />
              Registro de Autos
            </NavLink>

            <NavLink to="/dashboard/UserAct" className={navClass}>
              <MdGroups className="icon-nav" />
              Usuarios Actuales
            </NavLink>

            {/* Gráficos: visible solo si NO es trabajador */}
            {!esTrabajador && (
              <NavLink to="/dashboard/Graficos" className={navClass}>
                <MdBarChart className="icon-nav" />
                Gráficos
              </NavLink>
            )}

            {/* Cuadratura: visible solo SI es trabajador */}
            {esTrabajador && (
              <NavLink to="/dashboard/Cuadratura" className={navClass}>
                <MdAttachMoney className="icon-nav" />
                Cuadratura
              </NavLink>
            )}
          </nav>
        </div>

        {/* ---------- PARTE INFERIOR ---------- */}
        <nav className="nav-bottom">
          {/* Gestión de usuarios: solo admin */}
          {esAdmin && (
            <NavLink to="/dashboard/GestionUsuarios" className={navClass}>
              <MdManageAccounts className="icon-nav" />
              Gestión Usuario
            </NavLink>
          )}

          {/* Visibles para todos */}
          <NavLink to="/dashboard/Profile" className={navClass}>
            <MdPerson className="icon-nav" />
            Perfil
          </NavLink>

          {!esTrabajador && (
              <NavLink to="/dashboard/Configuracion" className={navClass}>
            <MdSettings className="icon-nav" />
            Configuración
          </NavLink>
            )}
        </nav>
      </aside>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLateral;
