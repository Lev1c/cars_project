import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { VehicleStatusBadge } from "../components/vehicle-status-badge";
import { useAuth } from "../context/auth-context.js";

import { Card, CardBody, Input, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";

export const Main = () => {
  const { dataCar, setCar } = useAuth();

  const navigate = useNavigate();

  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const sortAndFilterVehicles = useCallback(() => {
    let result = [...dataCar.items];

    if (searchQuery) {
      result = dataCar.items.filter((vehicle) =>
        vehicle.nm.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredVehicles(result);
    // eslint-disable-next-line
  }, [searchQuery]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setFilteredVehicles(dataCar.items);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    sortAndFilterVehicles();
  }, [searchQuery, sortAndFilterVehicles]);

  const handleVehicleClick = (vehicleId) => {
    setCar(vehicleId);
    navigate(`/vehicle/${vehicleId.id}`);
  };

  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return "Неизвестно";

    const date = new Date(timestamp * 1000);

    if (isNaN(date.getTime())) return "Неверная дата";

    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleLogout = () => {
    // Здесь можно добавить логику выхода, если нужно
    window.location.reload()
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
  };

  return (
    <div className="container w-full mx-auto max-w-md p-4 pb-24">
      <h1 className="text-xl font-semibold mb-4 flex justify-between">Транспортные средства<button onClick={handleLogout}><Icon icon="line-md:log-out" width="24" height="24" /></button></h1>

      <div className="flex flex-col gap-3 mb-4">
        <Input
          placeholder="Поиск по названию или номеру"
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={
            <Icon icon="lucide:search" className="text-default-400" />
          }
        />

        <div className="flex justify-between items-center">
          <p className="text-default-500 text-sm">
            Найдено: {dataCar.items.length}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : filteredVehicles.length === 0 ? (
        <Card>
          <CardBody className="flex flex-col items-center justify-center py-8">
            <Icon
              icon="lucide:car-off"
              width={48}
              className="text-default-400 mb-2"
            />
            <p className="text-default-500">Транспортные средства не найдены</p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredVehicles.map((vehicle) => {
            const getTimeStatus = (timestamp) => {
              const now = Date.now() / 1000;
              const diffHours = (now - timestamp) / 3600;

              if (diffHours <= 6) return "green";
              if (diffHours <= 12) return "yellow";
              return "red";
            };

            const timeStatus = getTimeStatus(vehicle.pos.t);

            return (
              <Card
                key={vehicle.id}
                isPressable
                onPress={() => handleVehicleClick(vehicle)}
                className="w-full"
              >
                <CardBody className="p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex justify-between flex-col gap-1">
                      <h3 className="font-medium">{vehicle.nm}</h3>

                      <p className="text-default-400 text-sm mt-1">
                        Обновлено: {formatLastUpdated(vehicle.pos.t)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <VehicleStatusBadge status={timeStatus} />
                      <div className="flex items-center text-default-500 text-sm  gap-1">
                        {vehicle.pos.sc}
                        <Icon
                          icon="hugeicons:satellite"
                          className="mr-1"
                          width={14}
                        />
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
