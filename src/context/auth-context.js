import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SERVERS = ["gps.itqt.ru", "gps2.itqt.ru", "gps3.itqt.ru", "trns63.ru"];

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
  const [reportList, setReportList] = useState();
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();

  const login = async (username, password, specificServer = null) => {
    const serversToTry = specificServer ? [specificServer] : SERVERS;

    for (let s of serversToTry) {
      try {
        const res = await fetch(`https://cars-project-back.onrender.com/api`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            a: "login",
            u: username,
            p: password,
            srv: `${s}`,
          }),
        });

        const text = await res.text();

        const sidMatch = text.match(/Set-Cookie:\s*sid=([^;]+);/i);
        if (sidMatch) {
          const sid = sidMatch[1];
          localStorage.setItem("sid", sid);
        } else {
        }

        const jsonStartIndex = text.indexOf("\r\n\r\n");

        if (jsonStartIndex === -1) {
          console.warn(
            `Разделитель заголовков и тела не найден на сервере ${s}, пробуем следующий.`
          );
          continue;
        }

        const jsonText = text.substring(jsonStartIndex + 4);

        let data;
        try {
          data = JSON.parse(jsonText);
        } catch (parseError) {
          continue;
        }

        setReportList(data.reports);
        setDataCar(data);

        if (data.code !== "ERROR") {
          setIsAuthenticated(true);
          setUser(username);
          setServer(s);
          navigate("/list");
          setLoad(true);

          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("username", username);
          localStorage.setItem("password", password);
          localStorage.setItem("server", s);

          return true;
        }

        console.warn(`Сервер ${s} вернул ошибку:`, data);
      } catch (e) {
        console.warn(`Ошибка при запросе к серверу ${s}:`, e);
      }
    }

    setIsAuthenticated(false);
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setServer(null);
    setDataCar(null);
    setIdCar(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    localStorage.removeItem("server");
    localStorage.removeItem("sid");
  };

  const setCar = (data) => {
    setIdCar(data);
  };

  // Автоматический логин при монтировании
  useEffect(() => {
    const tryAutoLogin = async () => {
      const username = localStorage.getItem("username");
      const password = localStorage.getItem("password");
      const server = localStorage.getItem("server");

      if (username && password && server) {
        const success = await login(username, password, server);
        if (!success) {
          // Очистим данные если автологин не удался
          logout();
        }
      }
      if (!username || !password || !server) {
        logout();
      }
    };

    tryAutoLogin();
    // eslint-disable-next-line
  }, []);

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
        reportList,
        load,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
