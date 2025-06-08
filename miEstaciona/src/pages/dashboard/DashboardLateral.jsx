import { NavLink, Outlet } from "react-router-dom";
import "../../CSS/DashboardLateral.css";

import {
  MdLocalParking,
  MdCarRental,
  MdGroups,
  MdBarChart
} from "react-icons/md";

const DashboardLateral = () => {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div>
          <h2>MiEstaciona</h2>
          <nav>
            <NavLink to="/dashboard/overview" className="nav-link">
              <MdLocalParking className="icon-nav" />
              Estacionamiento
            </NavLink>
            <NavLink to="/dashboard/RegistroAutos" className="nav-link">
              <MdCarRental className="icon-nav" />
              Registro de Autos
            </NavLink>
            <NavLink to="/dashboard/usuarios-actuales" className="nav-link">
              <MdGroups className="icon-nav" />
              Usuarios Actuales
            </NavLink>
            <NavLink to="/dashboard/graficos" className="nav-link">
              <MdBarChart className="icon-nav" />
              Gráficos
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
