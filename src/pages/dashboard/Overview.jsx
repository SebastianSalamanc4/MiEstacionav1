import React from "react";
import "../../CSS/Overview.css";
import carIcon from "../../assets/icons/Iconcar.svg";

const parkingSlots = [
  { id: "A01", ocupado: false },
  { id: "A02", ocupado: true },
  { id: "A03", ocupado: false },
  { id: "A04", ocupado: false },
  { id: "A05", ocupado: false },
  { id: "A06", ocupado: false },
  { id: "A07", ocupado: false },
  { id: "A08", ocupado: false },
  { id: "A09", ocupado: false },
  { id: "A10", ocupado: false },
  { id: "A11", ocupado: true },
  { id: "A12", ocupado: false },
];

const Overview = () => {
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
            <span className="slot-id">{slot.id}</span>
            {slot.ocupado && (
              <img src={carIcon} alt="car" className="car-icon" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;
