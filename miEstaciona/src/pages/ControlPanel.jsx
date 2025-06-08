import '../CSS/ControlPanel.css';
import NavBar from './NavBar';
const ControlPanel = () => {
  return (
    <div className="controlPanel">
      <NavBar />
      <h1>PANEL DE CONTROL</h1>
      <p className="body-text">
        Bienvenido al ControlPanel
      </p>
    </div>
  );
};

export default ControlPanel;
