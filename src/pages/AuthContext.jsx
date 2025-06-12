import React, { createContext, useState, useEffect } from "react";

// Contexto
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Estado de sesión
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // usuario completo

  // Función login: guarda ID y tipo_usuario
  const login = (id, tipo_usuario) => {
    const userData = { id, tipo_usuario };
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);
  };

  // Función logout
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
  };

  // Al cargar la app, verificar si hay sesión guardada
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
