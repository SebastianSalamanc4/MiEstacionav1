import React, { useEffect, useState } from "react";
import "../../CSS/Overview.css";
import carIcon from "../../assets/icons/Iconcar.svg";

const TOTAL_SLOTS = 10;          // A01 – A10 (coincide con el backend)

const Overview = () => {
  const [parkingSlots, setParkingSlots] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res   = await fetch("http://localhost:5000/historial");
        const data  = await res.json();           // ← El backend ya devuelve SOLO los vehículos que siguen dentro

        // Crea los 10 boxes “vacíos” A01…A10
        const slots = Array.from({ length: TOTAL_SLOTS }, (_, i) => {
          const num = String(i + 1).padStart(2, "0");
          return { id: `A${num}`, ocupado: false, vehiculo: null };
        });

        // Marca ocupados usando la lista que vino del backend
        data.forEach(v => {
          const idx = slots.findIndex(s => s.id === v.posicion);
          if (idx !== -1) {
            slots[idx] = {
              ...slots[idx],
              ocupado: true,
              vehiculo: {
                patente:   v.patente,
                conductor: v.conductor
              }
            };
          } else {
            // Si la posición es “MANUAL” (o cualquier otra no mapeada),
            // añádela aparte para no perder la referencia.
            slots.push({
              id:        v.posicion,
              ocupado:   true,
              vehiculo: {
                patente:   v.patente,
                conductor: v.conductor
              }
            });
          }
        });

        setParkingSlots(slots);
      } catch (err) {
        console.error("Error al obtener historial:", err);
      }
    };

    cargarDatos();
  }, []);

  const usados       = parkingSlots.filter(s => s.ocupado).length;
  const disponibles  = parkingSlots.filter(s => !s.ocupado).length;

  return (
    <div className="overview-container">
      <div className="status-summary">
        <p>Estacionamientos usados:      <strong>{usados}</strong></p>
        <p>Estacionamientos disponibles: <strong>{disponibles}</strong></p>
      </div>

      <div className="parking-grid">
        {parkingSlots.map(slot => (
          <div
            key={slot.id}
            className={`parking-slot ${slot.ocupado ? "ocupado" : "libre"}`}
          >
            <div className="slot-content">
              <span className="slot-id">{slot.id}</span>

              {slot.ocupado && (
                <>
                  <img src={carIcon} alt="Carro" className="car-icon" />
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
