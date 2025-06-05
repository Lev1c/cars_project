import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Spinner,
  Badge,
  Tooltip,
  Tabs,
  Tab,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { getVehicleById } from "../data/mock-data.ts";
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
  const [activeTab, setActiveTab] = useState("info");

  const { IdCar } = useAuth();

  console.log(IdCar);

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
  }, [id]);

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      setIsGeneratingReport(false);
      navigate({
        pathname: "/reports",
        state: { selectedVehicleId: id },
      });
    }, 800);
  };

  const formatLastUpdated = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
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

  const parameters = [
    { name: "Гос. номер", value: vehicle.nm },
    { name: "Модель", value: vehicle.model },
    { name: "Статус", value: <VehicleStatusBadge status={vehicle.status} /> },
    // { name: "Уровень топлива", value: vehicle.parameters.fuelLevel, unit: "%" },
    // { name: "Пробег", value: vehicle.parameters.mileage, unit: "км" },
    // {
    //   name: "Температура двигателя",
    //   value: vehicle.parameters.engineTemp,
    //   unit: "°C",
    // },
    // {
    //   name: "Заряд батареи",
    //   value: vehicle.parameters.batteryLevel,
    //   unit: "%",
    // },
    // { name: "Скорость", value: vehicle.parameters.speed, unit: "км/ч" },
    // {
    //   name: "Последнее обновление",
    //   value: formatLastUpdated(vehicle.lastUpdated),
    // },
  ];

  return (
    <div className="container mx-auto max-w-md p-4 pb-24">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">{vehicle.nm}</h1>
          <Badge
            color={
              vehicle.status === "active"
                ? "success"
                : vehicle.status === "maintenance"
                ? "warning"
                : "default"
            }
            variant="flat"
            size="sm"
          >
            {vehicle.status === "active"
              ? "Активен"
              : vehicle.status === "maintenance"
              ? "Обслуживание"
              : "Неактивен"}
          </Badge>
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
          startContent={!isGeneratingReport && <Icon icon="lucide:file-text" />}
        >
          Сформировать отчёт
        </Button>
      </div>
    </div>
  );
};
