import '../CSS/Home.css';
import NavBar from './NavBar';
import Ilustracion from '../assets/ImgParkingPeople.png'; // asegúrate que exista en esa ruta

const Home = () => {
  return (
    <div className="home">
      <div className="contenedor-principal">
        <NavBar />
        <div className="contenido-home">
          <div className="texto-home">
            <h1>MiEstaciona</h1>
            <p>Simplifica la administración de estacionamientos con tecnología eficiente, intuitiva y accesible.</p>
            <button className="boton-home">¿Quieres saber sobre nosotros?</button>
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
