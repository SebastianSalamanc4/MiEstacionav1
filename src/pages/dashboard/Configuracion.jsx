import React, { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import "../../CSS/Configuracion.css";

const Configuracion = () => {
  const { user } = useContext(AuthContext);
  if (user?.tipo_usuario !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <div>configuracion</div>
  )
}
export default Configuracion;