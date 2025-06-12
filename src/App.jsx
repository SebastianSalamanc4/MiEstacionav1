import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import VistaUsuario from "./pages/VistaUsuario";
import DashboardLateral from "./pages/dashboard/DashboardLateral";
import Overview from "./pages/dashboard/Overview";
import RegistroAutos from "./pages/dashboard/RegistroAutos";
import UserAct from "./pages/dashboard/UserAct";
import Graficos from "./pages/dashboard/Graficos";
import { Cuadratura } from "./pages/dashboard/Cuadratura";
import { GestionUsuarios } from "./pages/dashboard/GestionUsuarios";
import { Profile } from "./pages/dashboard/Profile";
import { Configuracion } from "./pages/dashboard/Configuracion";



function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas normales */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/UserProfile" element={<UserProfile />} />
        <Route path="/VistaUsuario" element={<VistaUsuario />} />

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
