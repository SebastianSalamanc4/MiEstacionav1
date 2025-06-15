import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";      // ajusta la ruta
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

  // ⚠️ Solo “admin” o “trabajador” pueden entrar
  const accesoPermitido = tipo === "admin" || tipo === "trabajador";
  if (!accesoPermitido) return <Navigate to="/" replace />;

  const esTrabajador = tipo === "trabajador";

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div>
          {/* botón volver */}
          <NavLink to="/" className="nav-link back-button">
            <MdArrowBack className="icon-nav" />
            Back
          </NavLink>

          {/* sección superior */}
          <h2>MiEstaciona</h2>
          <nav className="nav-section">
            <NavLink to="/dashboard/overview" className="nav-link">
              <MdLocalParking className="icon-nav" />
              Estacionamiento
            </NavLink>

            <NavLink to="/dashboard/RegistroAutos" className="nav-link">
              <MdCarRental className="icon-nav" />
              Registro de Autos
            </NavLink>

            <NavLink to="/dashboard/UserAct" className="nav-link">
              <MdGroups className="icon-nav" />
              Usuarios Actuales
            </NavLink>

            {/* Gráficos: visible solo si NO es trabajador */}
            {!esTrabajador && (
              <NavLink to="/dashboard/Graficos" className="nav-link">
                <MdBarChart className="icon-nav" />
                Gráficos
              </NavLink>
            )}

            <NavLink to="/dashboard/Cuadratura" className="nav-link">
              <MdAttachMoney className="icon-nav" />
              Cuadratura
            </NavLink>
          </nav>

          {/* sección inferior */}
          <nav className="nav-bottom">
            <NavLink to="/dashboard/GestionUsuarios" className="nav-link">
              <MdManageAccounts className="icon-nav" />
              Gestión Usuario
            </NavLink>

            <NavLink to="/dashboard/Profile" className="nav-link">
              <MdPerson className="icon-nav" />
              Perfil
            </NavLink>

            {/* Configuración: visible solo si NO es trabajador */}
            {!esTrabajador && (
              <NavLink to="/dashboard/Configuracion" className="nav-link">
                <MdSettings className="icon-nav" />
                Configuración
              </NavLink>
            )}
          </nav>
        </div>
      </aside>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLateral;
