import '../CSS/VistaUsuario.css';
import NavBar from './NavBar'; 

const VistaUsuario = () => {
  return (
    <>
      <NavBar />
      <div className="vistaUsuario">
        <h1>Vista Usuario</h1>
        <p className="body-text">
          Bienvenido a la vista del usuario
        </p>
      </div>
    </>
  );
};

export default VistaUsuario;
