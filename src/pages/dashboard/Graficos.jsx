import React, { useEffect, useState, useContext } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { AuthContext } from "../AuthContext";
import "../../CSS/Graficos.css";

const COLORS = ["#FF4C4C", "#4CAF50", "#007bff", "#8884d8"];
const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const mesesNombre = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const formatearDiasDesdeInicio = (data, inicioFechaStr) => {
  const dias = [];

  const [year, month, day] = inicioFechaStr.split("-").map(Number);
  const inicio = new Date(year, month - 1, day);

  const fechasSemana = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(inicio.getTime());
    d.setDate(d.getDate() + i);
    const fechaStr = d.toISOString().split("T")[0];
    fechasSemana.push(fechaStr);
  }

  const mapa = {};
  data.forEach(item => {
    if (fechasSemana.includes(item.periodo)) {
      mapa[item.periodo] = item.cantidad;
    }
  });

  for (let i = 0; i < 7; i++) {
    const d = new Date(inicio.getTime());
    d.setDate(d.getDate() + i);

    const fechaStr = d.toISOString().split("T")[0];
    const nombreDia = diasSemana[d.getDay()];
    dias.push({
      periodo: nombreDia,
      cantidad: mapa[fechaStr] || 0,
    });
  }

  return dias;
};

const formatearDiasSemana = (data) => {
  const hoy = new Date();
  const diasPrevios = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(hoy.getDate() - i);
    diasPrevios.push({
      clave: d.toISOString().split("T")[0],
      nombre: diasSemana[d.getDay()],
    });
  }

  const mapaDatos = {};
  data.forEach(item => {
    mapaDatos[item.periodo] = item.cantidad;
  });

  return diasPrevios.map(dia => ({
    periodo: dia.nombre,
    cantidad: mapaDatos[dia.clave] || 0,
  }));
};

const agruparSemanasMes = (data, mes, anio) => {
  if (mes == null) return [];

  const diasEnMes = new Date(anio, mes + 1, 0).getDate();
  const numSemanas = Math.ceil(diasEnMes / 7);

  const semanas = Array.from({ length: numSemanas }, () => []);

  // Organiza datos en semanas
  data.forEach(item => {
    const fecha = new Date(item.periodo);
    if (fecha.getMonth() !== mes || fecha.getFullYear() !== anio) return;

    const dia = fecha.getDate();
    let semanaIndex = Math.floor((dia - 1) / 7);
    semanas[semanaIndex].push({
      fecha,
      cantidad: item.cantidad,
    });
  });

  const result = semanas.map((semana, i) => {
    const inicioDia = i * 7 + 1;
    let finDia = Math.min((i + 1) * 7, diasEnMes);

    const rango = `${inicioDia}-${finDia} ${mesesNombre[mes].slice(0,3)}`;
    const cantidad = semana.reduce((acc, s) => acc + s.cantidad, 0);

    return {
      semana: `Semana ${i + 1}`,
      rango,
      cantidad,
    };
  });

  return result;
};


const formatearMesesCompletos = (data, anioBuscado) => {
  const mapa = {};
  data.forEach(item => {
    const [anio, mes] = item.periodo.split("-");
    if (parseInt(anio) === anioBuscado) {
      mapa[parseInt(mes) - 1] = item.cantidad;
    }
  });

  return mesesNombre.map((nombre, index) => ({
    periodo: nombre,
    cantidad: mapa[index] || 0,
  }));
};


const Graficos = () => {
  const { API } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [salidasSemana, setSalidasSemana] = useState([]);
  const [salidasMes, setSalidasMes] = useState([]);
  const [salidasAnio, setSalidasAnio] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [datosSemanaPers, setDatosSemanaPers] = useState([]);
  const [datosMesPers, setDatosMesPers] = useState([]);
  const [datosAnioPers, setDatosAnioPers] = useState([]);
  const [index, setIndex] = useState(0);
  const [mesSeleccionado, setMesSeleccionado] = useState(null);
  const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());


  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res1 = await fetch(`${API}/estadisticas`);
        const statsData = await res1.json();
        setStats(statsData);

        const [r2, r3, r4] = await Promise.all([
          fetch(`${API}/estadisticas/salidas?modo=semana`),
          fetch(`${API}/estadisticas/salidas?modo=mes`),
          fetch(`${API}/estadisticas/salidas?modo=anio`),
        ]);

        const semana = await r2.json();
        const mes = await r3.json();
        const anio = await r4.json();

        setSalidasSemana(semana);
        setSalidasMes(mes);
        setSalidasAnio(anio);
      } catch (err) {
        console.error("Error al cargar estadísticas:", err);
      }
    };

    cargarDatos();
  }, [API]);

  useEffect(() => {
  if (!fechaInicio) return;
  const cargar = async () => {
    try {
      const [r1, r2, r3] = await Promise.all([
        fetch(`${API}/estadisticas/salidas?modo=semana&inicio=${fechaInicio}`),
        fetch(`${API}/estadisticas/salidas?modo=mes&inicio=${fechaInicio}`),
        fetch(`${API}/estadisticas/salidas?modo=anio&inicio=${fechaInicio}`),
      ]);

      const data1 = await r1.json();
      const data2 = await r2.json();
      const data3 = await r3.json();

      // ✅ Limpia datos previos antes de setear nuevos
      setDatosSemanaPers([]);
      setDatosMesPers([]);
      setDatosAnioPers([]);

      // Luego asigna nuevos si vienen datos
      if (Array.isArray(data1)) setDatosSemanaPers(data1);
      if (Array.isArray(data2)) setDatosMesPers(data2);
      if (Array.isArray(data3)) setDatosAnioPers(data3);
    } catch (err) {
      console.error("❌ Error cargando personalizados:", err);
    }
  };

  cargar();
}, [fechaInicio, API]);

useEffect(() => {
  if (mesSeleccionado === null) return;

  const inicio = new Date(anioSeleccionado, mesSeleccionado, 1);
  const inicioStr = inicio.toISOString().split("T")[0];

  const cargarDatosMes = async () => {
    try {
      const res = await fetch(
        `${API}/estadisticas/salidas?modo=mes&inicio=${inicioStr}`
      );
      const data = await res.json();
      setDatosMesPers(data);
    } catch (e) {
      console.error("Error cargando datos mes:", e);
    }
  };

  cargarDatosMes();
}, [mesSeleccionado, anioSeleccionado, API]);

useEffect(() => {
  if (!anioSeleccionado) return;

  const inicio = new Date(anioSeleccionado, 0, 1);
  const inicioStr = inicio.toISOString().split("T")[0];

  const cargarDatosAnio = async () => {
    try {
      const res = await fetch(
        `${API}/estadisticas/salidas?modo=anio&inicio=${inicioStr}`
      );
      const data = await res.json();
      setDatosAnioPers(data);
    } catch (e) {
      console.error("Error cargando datos año:", e);
    }
  };

  cargarDatosAnio();
}, [anioSeleccionado, API]);

  if (!stats) return <div className="graficos-container">Cargando estadísticas...</div>;


  const CustomTickSemana = ({ x, y, payload }) => {
  const { value, payload: p } = payload;
  const rango = p?.rango || "";

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fill="#333"
        style={{ fontSize: "14px", fontWeight: "bold" }}
      >
        {value}
      </text>
      <text
        x={0}
        y={18}
        dy={16}
        textAnchor="middle"
        fill="#666"
        style={{ fontSize: "10px" }}
      >
        {rango}
      </text>
    </g>
  );
};

  const graficos = [
    {
      titulo: "Ocupación General",
      render: () => (
        <ResponsiveContainer width="100%" height={300}>
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
        </ResponsiveContainer>
      ),
    },
    {
      titulo: "Ocupación por Fila",
      render: () => (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.por_fila}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fila" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad" fill={COLORS[2]} />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      titulo: "Usuarios por Tipo",
      render: () => (
        <ResponsiveContainer width="100%" height={300}>
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
        </ResponsiveContainer>
      ),
    },
    {
      titulo: "Análisis del Uso Semanal del Estacionamiento",
      render: () => (
        <>
          <div className="d-flex gap-2 mb-3 justify-content-center align-items-end flex-wrap">
            <div>
              <label>Inicio:<br />
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="form-control"
                />
              </label>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={
                fechaInicio
                  ? formatearDiasDesdeInicio(datosSemanaPers, fechaInicio)
                  : formatearDiasSemana(salidasSemana)
              }
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="periodo" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cantidad" fill="#FF9800" />
            </BarChart>
          </ResponsiveContainer>
        </>
      ),
    },
    {
  titulo: "Análisis del Uso Mensual del Estacionamiento",
  render: () => (
    <>
      <div className="d-flex flex-wrap gap-2 mb-3 justify-content-center">
        <select
          value={mesSeleccionado !== null ? mesSeleccionado : ""}
          onChange={(e) => setMesSeleccionado(e.target.value !== "" ? Number(e.target.value) : null)}
          className="form-select"
        >
          <option value="">Seleccionar mes</option>
          {mesesNombre.map((nombre, idx) => (
            <option key={idx} value={idx}>
              {nombre}
            </option>
          ))}
        </select>

        <select
          value={anioSeleccionado}
          onChange={(e) => setAnioSeleccionado(Number(e.target.value))}
          className="form-select"
        >
          {Array.from({ length: 3 }).map((_, i) => {
            const anio = new Date().getFullYear() - i;
            return <option key={anio} value={anio}>{anio}</option>;
          })}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={
            mesSeleccionado !== null
              ? agruparSemanasMes(datosMesPers, mesSeleccionado, anioSeleccionado)
              : agruparSemanasMes(salidasMes, new Date().getMonth(), new Date().getFullYear())
          }
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
  dataKey="semana"
  tick={CustomTickSemana}
  interval={0}
/>
          <YAxis />
          <Tooltip
            formatter={(value) => [`${value}`, "Cantidad"]}
            labelFormatter={(label, payload) => {
              const rango = payload?.[0]?.payload?.rango || "";
              return `${label} (${rango})`;
            }}
          />
          <Legend />
          <Bar dataKey="cantidad" fill="#9C27B0" />
        </BarChart>
      </ResponsiveContainer>
    </>
  ),
},

    {
  titulo: "Análisis del Uso Anual del Estacionamiento",
  render: () => (
    <>
      <div className="d-flex flex-wrap gap-2 mb-3 justify-content-center">
        <select
          value={anioSeleccionado}
          onChange={(e) => setAnioSeleccionado(Number(e.target.value))}
          className="form-select"
        >
          {Array.from({ length: 3 }).map((_, i) => {
            const anio = new Date().getFullYear() - i;
            return (
              <option key={anio} value={anio}>
                {anio}
              </option>
            );
          })}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={formatearMesesCompletos(
            datosAnioPers.length ? datosAnioPers : salidasAnio,
            anioSeleccionado
          )}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="periodo" angle={-45} textAnchor="end" height={60} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="cantidad" fill="#3F51B5" />
        </BarChart>
      </ResponsiveContainer>
    </>
  ),
},

  ];

  const siguiente = () => setIndex((prev) => (prev + 1) % graficos.length);
  const anterior = () => setIndex((prev) => (prev - 1 + graficos.length) % graficos.length);

  return (
    <div className="graficos-container">
      <h2 className="text-center mb-4">{graficos[index].titulo}</h2>
      <div className="grafico-box">
        {graficos[index].render()}
      </div>
      <div className="carrusel-buttons d-flex justify-content-center gap-3 mt-3">
        <button className="btn btn-outline-primary" onClick={anterior}>← Anterior</button>
        <button className="btn btn-outline-primary" onClick={siguiente}>Siguiente →</button>
      </div>
    </div>
  );
};

export default Graficos;
