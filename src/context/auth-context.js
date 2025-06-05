import React, { createContext, useContext, useEffect, useState } from "react";

const SERVERS = ["gps.itqt.ru", "gps2.itqt.ru", "gps3.itqt.ru", "trns63.ru"];
const PORT = 8025;

const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  server: null,
  login: async () => false,
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [server, setServer] = useState(null);
  const [dataCar, setDataCar] = useState();

  const [IdCar, setIdCar] = useState();

  const login = async (username, password) => {
    for (let s of SERVERS) {
      try {
        const res = await fetch(
          `http://${s}:${PORT}/?a=login&u=${username}&p=${password}`
        );
        const data = await res.json();
        console.log(data);
        if (data.code !== "ERROR") {
          setIsAuthenticated(true);
          setUser(username);
          setServer(s);
          setDataCar(data);
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("username", username);
          localStorage.setItem("password", password);
          localStorage.setItem("server", s);
          return true;
        }
      } catch (e) {
        console.warn(`Ошибка при запросе к серверу ${s}`, e);
      }
    }
    setIsAuthenticated(false);
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setServer(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    localStorage.removeItem("server");
  };

  const setCar = (data) => {
    setIdCar(data);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        server,
        dataCar,
        login,
        logout,
        setCar,
        IdCar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
