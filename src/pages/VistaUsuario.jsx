import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";   // ajusta la ruta si es necesario
import "../CSS/VistaUsuario.css";
import NavBar from "./NavBar";

const VistaUsuario = () => {
  const { user } = useContext(AuthContext);
  const tipo = user?.tipo_usuario;

  // ⚠️ Si no existe usuario o su tipo ≠ 'usuario', lo echamos al Home
  if (!user || tipo !== "usuario") return <Navigate to="/" replace />;

  return (
    <>
      <NavBar />
      <div className="vistaUsuario">
        <h1>Vista Usuario</h1>
        <p className="body-text">Bienvenido a la vista del usuario</p>
      </div>
    </>
  );
};

export default VistaUsuario;
