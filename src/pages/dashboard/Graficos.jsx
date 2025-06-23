import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import "../../CSS/Graficos.css";

const API = "https://miestaciona-backend2.onrender.com";
const COLORS = ["#FF4C4C", "#4CAF50", "#007bff", "#8884d8"];

const Graficos = () => {
  const [stats, setStats] = useState(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch(`${API}/estadisticas`)
      .then(res => res.json())
      .then(setStats)
      .catch(err => console.error("Error al cargar estadísticas:", err));
  }, []);

  if (!stats) return <div className="graficos-container">Cargando estadísticas...</div>;

  const graficos = [
    {
      titulo: "Ocupación General",
      render: () => (
        <PieChart>
          <Pie
            data={[
              { name: "Ocupadas", value: stats.ocupadas },
              { name: "Libres", value: stats.libres },
            ]}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            <Cell fill={COLORS[0]} />
            <Cell fill={COLORS[1]} />
          </Pie>
          <Tooltip />
        </PieChart>
      ),
    },
    {
      titulo: "Ocupación por Fila",
      render: () => (
        <BarChart data={stats.por_fila}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fila" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="cantidad" fill={COLORS[2]} />
        </BarChart>
      ),
    },
    {
      titulo: "Usuarios por Tipo",
      render: () => (
        <BarChart
          data={Object.entries(stats.usuarios).map(([tipo, cantidad]) => ({
            tipo,
            cantidad,
          }))}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="tipo" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="cantidad" fill={COLORS[3]} />
        </BarChart>
      ),
    },
  ];

  const siguiente = () => setIndex((prev) => (prev + 1) % graficos.length);
  const anterior = () => setIndex((prev) => (prev - 1 + graficos.length) % graficos.length);

  return (
    <div className="graficos-container">
      <h2 className="text-center mb-4">{graficos[index].titulo}</h2>

      <div className="grafico-box">
        <ResponsiveContainer width="100%" height={300}>
          {graficos[index].render()}
        </ResponsiveContainer>
      </div>

      <div className="carrusel-buttons d-flex justify-content-center gap-3 mt-3">
        <button className="btn btn-outline-primary" onClick={anterior}>← Anterior</button>
        <button className="btn btn-outline-primary" onClick={siguiente}>Siguiente →</button>
      </div>
    </div>
  );
};

export default Graficos;
