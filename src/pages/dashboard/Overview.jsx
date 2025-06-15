import React, { useEffect, useState } from "react";
import "../../CSS/Overview.css";
import carIcon from "../../assets/icons/Iconcar.svg";

const Overview = () => {
  const [parkingSlots, setParkingSlots] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/historial")
      .then(res => res.json())
      .then(data => {
        const allSlots = Array.from({ length: 12 }, (_, i) => {
          const num = String(i + 1).padStart(2, '0');
          return { id: `A${num}`, ocupado: false, vehiculo: null };
        });

        const activos = data.filter(v => v.salida === null);

        const actualizados = allSlots.map(slot => {
          const vehiculo = activos.find(v => v.posicion === slot.id);
          if (vehiculo) {
            return {
              ...slot,
              ocupado: true,
              vehiculo: {
                patente: vehiculo.patente,
                conductor: vehiculo.conductor
              }
            };
          }
          return slot;
        });

        setParkingSlots(actualizados);
      });
  }, []);

  const usados = parkingSlots.filter((slot) => slot.ocupado).length;
  const disponibles = parkingSlots.length - usados;

  return (
    <div className="overview-container">
      <div className="status-summary">
        <p>Estacionamientos usados: <strong>{usados}</strong></p>
        <p>Estacionamientos disponibles: <strong>{disponibles}</strong></p>
      </div>

      <div className="parking-grid">
        {parkingSlots.map((slot) => (
          <div
            key={slot.id}
            className={`parking-slot ${slot.ocupado ? "ocupado" : "libre"}`}
          >
            <div className="slot-content">
              <span className="slot-id">{slot.id}</span>
              {slot.ocupado && (
                <>
                  <img src={carIcon} alt="car" className="car-icon" />
                  <div className="slot-info">
                    <span className="slot-patente">{slot.vehiculo.patente}</span>
                    <span className="slot-conductor">{slot.vehiculo.conductor}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;
