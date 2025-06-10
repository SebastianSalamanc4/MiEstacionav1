import { NavLink, Outlet } from "react-router-dom";
import "../../CSS/DashboardLateral.css";

import {
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
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div>
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
            <NavLink to="/dashboard/Graficos" className="nav-link">
              <MdBarChart className="icon-nav" />
              Gráficos
            </NavLink>
            <NavLink to="/dashboard/Cuadratura" className="nav-link">
              <MdAttachMoney className="icon-nav" />
              Cuadratura
            </NavLink>
          </nav>

          {/* SECCIÓN INFERIOR */}
          <nav className="nav-bottom">
            <NavLink to="/dashboard/GestionUsuarios" className="nav-link">
              <MdManageAccounts className="icon-nav" />
              Gestión Usuario
            </NavLink>
            <NavLink to="/dashboard/Profile" className="nav-link">
              <MdPerson className="icon-nav" />
              Perfil
            </NavLink>
            <NavLink to="/dashboard/Configuracion" className="nav-link">
              <MdSettings className="icon-nav" />
              Configuración
            </NavLink>
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
