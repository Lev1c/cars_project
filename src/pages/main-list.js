import React, { useState, useEffect, useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Card, CardBody, Input, Spinner, Badge } from "@heroui/react";
import { Icon } from "@iconify/react";
import { mockVehicles } from "../data/mock-data.ts";
import { VehicleStatusBadge } from "../components/vehicle-status-badge";
import { useAuth } from "../context/auth-context.js";

export const Main = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("name");
  const [filterStatus, setFilterStatus] = useState("all");

  const { dataCar, setCar } = useAuth();

  const navigate = useNavigate();

  const sortAndFilterVehicles = useCallback(() => {
    let result = [...vehicles];

    if (filterStatus !== "all") {
      result = result.filter((vehicle) => vehicle.status === filterStatus);
    }

    if (searchQuery) {
      result = dataCar.items.filter((vehicle) =>
        vehicle.nm.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredVehicles(result);
  }, [vehicles, searchQuery, sortBy, filterStatus]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setVehicles(dataCar.items);
        setFilteredVehicles(dataCar.items);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    sortAndFilterVehicles();
  }, [searchQuery, vehicles, sortBy, filterStatus, sortAndFilterVehicles]);

  const handleVehicleClick = (vehicleId) => {
    setCar(vehicleId);
    navigate(`/vehicle/${vehicleId.id}`);
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

  console.log(dataCar.items);
  console.log(filteredVehicles);

  return (
    <div className="container mx-auto max-w-md p-4 pb-24">
      <h1 className="text-xl font-semibold mb-4">Транспортные средства</h1>

      <div className="flex flex-col gap-2 mb-4">
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
            console.log(vehicle);
            return (
              <Card
                key={vehicle.id}
                isPressable
                onPress={() => handleVehicleClick(vehicle)}
                className="w-full"
              >
                <CardBody className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{vehicle.nm}</h3>

                      <p className="text-default-400 text-xs mt-1">
                        Обновлено: {formatLastUpdated(vehicle.pos.t)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <VehicleStatusBadge status={vehicle.status} />
                      <div className="flex items-center text-default-500 text-xs">
                        <Icon icon="lucide:fuel" className="mr-1" width={14} />
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
