import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Spinner,
  Alert,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { VehicleMap } from "../components/vehicle-map";
import { ParameterTable } from "../components/parameter-table";
import { VehicleStatusBadge } from "../components/vehicle-status-badge";
import { useAuth } from "../context/auth-context.js";

export const VehicleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [alertBool, setAlertBool] = useState(false);

  const { IdCar } = useAuth();

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));

        setVehicle(IdCar);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicle();
    // eslint-disable-next-line
  }, [id]);

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      setIsGeneratingReport(false);
      navigate("/reports", { state: { selectedVehicleId: id } });
    }, 800);
  };

  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return "Неизвестно";

    const date = new Date(timestamp * 1000); // Преобразуем в миллисекунды

    if (isNaN(date.getTime())) return "Неверная дата";

    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-md p-4 flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!IdCar) {
    return (
      <div className="container mx-auto max-w-md p-4 pb-24">
        <Card>
          <CardBody className="flex flex-col items-center justify-center py-8">
            <Icon
              icon="lucide:alert-circle"
              width={48}
              className="text-danger mb-2"
            />
            <p className="text-default-700 font-medium">
              Транспортное средство не найдено
            </p>
            <Button
              color="primary"
              variant="light"
              onPress={() => navigate("/list")}
              className="mt-4"
            >
              Вернуться к списку
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  const getTimeStatus = (timestamp) => {
    const now = Date.now() / 1000;
    const diffHours = (now - timestamp) / 3600;

    if (diffHours <= 6) return "green-time";
    if (diffHours <= 12) return "yellow-time";
    return "red-time";
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(vehicle.pos.x + "," + vehicle.pos.y);
      setAlertBool(true);
      setTimeout(() => {
        setAlertBool(false);
      }, 3000);
    } catch (err) {
      console.log(err);
    }
  };

  const parameters = [
    { name: "Гос. номер", value: vehicle.nm },
    {
      name: "Координаты",
      value: (
        <p className="whitespace-nowrap flex">
          {vehicle.pos.x}, {vehicle.pos.y}
          <button onClick={handleCopy} className="ml-2 ">
            <Icon icon="lucide:file-text" width={16} />
          </button>
        </p>
      ),
    },
    { name: "Тип", value: vehicle.hw },
    { name: "Симкарта", value: vehicle.ph },
    {
      name: "Дата/время",
      value: (
        <VehicleStatusBadge
          txt={formatLastUpdated(vehicle.pos.t)}
          status={getTimeStatus(vehicle.pos.t)}
        />
      ),
    },
    {
      name: "Спутники",
      value: vehicle.pos.sc,
    },
  ];

  if (vehicle.pos.p) {
    Object.entries(vehicle.pos.p).forEach(([key, value]) => {
      parameters.push({ name: key, value });
    });
  }

  if (vehicle.sens && vehicle.pos.p) {
    Object.values(vehicle.sens).forEach((sensor) => {
      if (sensor.tp === "fuel level" && sensor.tbl && sensor.pn) {
        const rawValue = vehicle.pos.p?.[sensor.pn];

        if (typeof rawValue !== "number") {
          parameters.push({
            name: `Уровень топлива (${sensor.nm})`,
            value: "Нет данных",
          });
          return;
        }

        let matched = null;
        for (let i = 0; i < sensor.tbl.length; i++) {
          const [threshold, coeff] = sensor.tbl[i];
          if (rawValue < threshold) {
            matched = { threshold, coeff };
            break;
          }
        }

        if (matched) {
          const fuel = Math.round(rawValue * matched.coeff);
          parameters.push({
            name: `Уровень топлива (${sensor.nm})`,
            value: `${fuel} литров`,
          });
        } else {
          parameters.push({
            name: `Уровень топлива (${sensor.nm})`,
            value: "Не удалось рассчитать",
          });
        }
      }
    });
  }

  return (
    <>
      <div className="container w-full mx-auto max-w-md p-4 pb-24">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">{vehicle.nm}</h1>
          </div>
          <Button
            isIconOnly
            variant="light"
            onPress={() => navigate("/list")}
            aria-label="Назад"
          >
            <Icon icon="lucide:arrow-left" width={20} />
          </Button>
        </div>

        {vehicle.pos && <VehicleMap pos={vehicle.pos} />}

        <Card className="mt-2">
          <CardHeader className="pb-0">
            <h2 className="text-lg font-medium">Параметры</h2>
          </CardHeader>
          <CardBody>
            <ParameterTable parameters={parameters} />
          </CardBody>
        </Card>

        <div className="flex gap-2 mt-4">
          <Button
            color="primary"
            className="flex-grow"
            onPress={handleGenerateReport}
            isLoading={isGeneratingReport}
            startContent={
              !isGeneratingReport && <Icon icon="lucide:file-text" />
            }
          >
            Сформировать отчёт
          </Button>
        </div>
      </div>
      {alertBool && (
        <div
          key={"success"}
          className="w-[350px] flex items-center my-3 absolute top-0 right-3"
        >
          <Alert color={"success"} title={`Координаты успешно скопированы`} />
        </div>
      )}
    </>
  );
};
