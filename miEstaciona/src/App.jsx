import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ControlPanel from "./pages/ControlPanel";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NavBar from "./pages/NavBar";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import DashboardLateral from "./pages/dashboard/DashboardLateral";
import Overview from "./pages/dashboard/Overview";
import RegistroAutos from "./pages/dashboard/RegistroAutos";
import UserAct from "./pages/dashboard/UserAct";
import Graficos from "./pages/dashboard/Graficos";
import { Cuadratura } from "./pages/dashboard/Cuadratura";
import { GestionUsuarios } from "./pages/dashboard/GestionUsuarios";
import { Profile } from "./pages/dashboard/Profile";
import { Configuracion } from "./pages/dashboard/configuracion";



function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas normales */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/UserProfile" element={<UserProfile />} />
        <Route path="/ControlPanel" element={<ControlPanel />} />


        {/* Ruta del Dashboard */}
        <Route path="/dashboard" element={<DashboardLateral />}>
          <Route index element={<Overview />} /> {/* Dashboard base */}
          <Route path="overview" element={<Overview />} />
          <Route path="/dashboard/RegistroAutos" element={<RegistroAutos />} />
          <Route path="/dashboard/UserAct" element={<UserAct />} />
          <Route path="/dashboard/Graficos" element={<Graficos/>} />
          <Route path="/dashboard/Cuadratura" element={<Cuadratura/>} />
          <Route path="/dashboard/GestionUsuarios" element={<GestionUsuarios/>} />  
          <Route path="/dashboard/Profile" element={<Profile/>} />    
         <Route path="/dashboard/Configuracion" element={<Configuracion/>} />    
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
