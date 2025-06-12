import React, { createContext, useState, useEffect } from "react";

// 🧠 Creamos un contexto llamado AuthContext que se usará para compartir datos de autenticación
export const AuthContext = createContext();

// 🔒 Componente que provee el contexto de autenticación a toda la aplicación
export const AuthProvider = ({ children }) => {
  // 📦 Estado que indica si el usuario está logeado
  // Se inicializa comprobando si existe 'usuarioId' en el localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("usuarioId"));

  // ✅ Función para iniciar sesión
  // Guarda el ID del usuario en localStorage y actualiza el estado
  const login = (id) => {
    localStorage.setItem("usuarioId", id); // guarda el ID en el navegador
    setIsLoggedIn(true); // actualiza el estado a "logeado"
  };

  // 🔓 Función para cerrar sesión
  // Elimina el ID del usuario del localStorage y actualiza el estado
  const logout = () => {
    localStorage.removeItem("usuarioId"); // elimina el ID del navegador
    setIsLoggedIn(false); // actualiza el estado a "no logeado"
  };

  // 🔁 useEffect se ejecuta al montar el componente
  // Vuelve a verificar si el usuario está logeado al recargar la página
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("usuarioId"));
  }, []); // solo se ejecuta una vez

  // 🎁 Devolvemos el proveedor del contexto
  // Esto envuelve a los componentes hijos y les da acceso a `isLoggedIn`, `login` y `logout`
  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
