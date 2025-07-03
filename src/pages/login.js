import React, { useEffect, useState } from "react";

import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Divider,
  Spinner,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from "../context/auth-context";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const [isAutoLoggingIn, setIsAutoLoggingIn] = useState(true);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        navigate("/list");
      } else {
        setError("Неверное имя пользователя или пароль");
      }
    } catch (err) {
      setError("Произошла ошибка при входе");
    } finally {
      setIsLoading(false);
    }
  };

  const usernames = localStorage.getItem("username");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const u = urlParams.get("u");
    const p = urlParams.get("p");
    setUsername(u);
    setPassword(p);

    if (usernames) {
      setIsAutoLoggingIn(true);
    } else {
      setIsAutoLoggingIn(false);
    }
  }, [usernames]);

  if (isAutoLoggingIn === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-col items-center gap-2 pb-0">
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full">
              <Icon icon="lucide:car" width={24} className="text-white" />
            </div>
            <h1 className="text-xl font-semibold">
              Система мониторинга транспорта
            </h1>
            <p className="text-default-500 text-center text-sm">
              Войдите, чтобы получить доступ к мониторингу вашего автопарка
            </p>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Имя пользователя"
                placeholder="Введите имя пользователя"
                value={username}
                onValueChange={setUsername}
                startContent={
                  <Icon icon="lucide:user" className="text-default-400" />
                }
              />
              <Input
                label="Пароль"
                placeholder="Введите пароль"
                type="password"
                value={password}
                onValueChange={setPassword}
                startContent={
                  <Icon icon="lucide:lock" className="text-default-400" />
                }
              />

              {error && <p className="text-danger text-sm">{error}</p>}

              <Button
                type="submit"
                color="primary"
                className="w-full"
                isLoading={isLoading}
              >
                Войти
              </Button>

              <Divider className="my-4" />

              <p className="text-center text-default-500 text-xs">
                © 2025 Все права защищены.
              </p>
            </form>
          </CardBody>
        </Card>
      </div>
    );
  }
  return (
    <div className="flex justify-center items-center h-64">
      <Spinner size="lg" />
    </div>
  );
};
