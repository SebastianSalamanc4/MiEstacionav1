import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Home.css";
import NavBar from "./NavBar";
import Ilustracion from "../assets/ImgParkingPeople.png";
import { AuthContext } from "./AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState("");

  const handleClick = () => {
    if (user) {
      navigate("/VistaUsuario");
    } else {
      setMensaje("⚠️ Primero debes iniciar sesión.");
      setTimeout(() => setMensaje(""), 4000); // Limpia el mensaje después de 4 segundos
    }
  };

  return (
    <div className="home">
      <div className="contenedor-principal">
        <NavBar />

        <div className="contenido-home">
          <div className="texto-home">
            <h1>MiEstaciona</h1>
            <p>
              Simplifica la administración de estacionamientos con tecnología
              eficiente, intuitiva y accesible.
            </p>

            {/* Botón que valida sesión antes de redirigir */}
            <button onClick={handleClick} className="boton-home">
              ¿Quieres saber sobre nosotros?
            </button>

            {mensaje && <div className="mensaje-login">{mensaje}</div>}
          </div>

          <div className="imagen-home">
            <img src={Ilustracion} alt="Ilustración de estacionamiento" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
