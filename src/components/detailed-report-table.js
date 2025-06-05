import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Tabs,
  Tab,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@heroui/react";
import { Icon } from "@iconify/react";

export const DetailedReportTable = ({
  vehicleName,
  licensePlate,
  model,
  startDate,
  endDate,
  trips,
}) => {
  const [activeView, setActiveView] = useState("table");

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatShortDate = (dateString) => {
    return new Date(dateString).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const totalDistance = trips.reduce((sum, trip) => {
    const distance = parseFloat(trip.distance.replace(/[^\d.]/g, "")) || 0;
    return sum + distance;
  }, 0);

  const totalDuration = trips.reduce((sum, trip) => {
    const durationParts = trip.duration.split(":");
    if (durationParts.length === 3) {
      const hours = parseInt(durationParts[0]) || 0;
      const minutes = parseInt(durationParts[1]) || 0;
      const seconds = parseInt(durationParts[2]) || 0;
      return sum + (hours * 3600 + minutes * 60 + seconds);
    }
    return sum;
  }, 0);

  const formatTotalDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-col gap-1">
        <h2 className="text-lg font-medium">Детальный отчет</h2>
        <p className="text-default-500 text-sm">
          {vehicleName} {licensePlate} ({model})
        </p>
        <p className="text-default-500 text-sm">
          с {formatShortDate(startDate)} по {formatShortDate(endDate)}
        </p>
      </CardHeader>

      <CardBody>
        <Tabs
          aria-label="Вид отчета"
          selectedKey={activeView}
          onSelectionChange={(key) => setActiveView(key)}
          className="mb-2 center justify-center"
        >
          <Tab
            key="table"
            title={
              <div className="flex items-center gap-2 w-100">
                <Icon icon="lucide:table" />
                <span>Таблица</span>
              </div>
            }
          >
            <div className="overflow-auto">
              <Table
                removeWrapper
                aria-label="Детальный отчет по поездкам"
                className="min-w-full"
                isCompact
              >
                <TableHeader>
                  <TableColumn>Начало</TableColumn>
                  <TableColumn>Нач. положение</TableColumn>
                  <TableColumn>Конец</TableColumn>
                  <TableColumn>Конеч. положение</TableColumn>
                  <TableColumn>Длит.</TableColumn>
                  <TableColumn>Пробег</TableColumn>
                  <TableColumn>Ср. скор.</TableColumn>
                  <TableColumn>Макс. скор.</TableColumn>
                  <TableColumn>Расход</TableColumn>
                </TableHeader>
                <TableBody>
                  {trips.map((trip, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatTime(trip.startTime)}</TableCell>
                      <TableCell className="max-w-[100px] truncate">
                        {trip.startLocation || "-"}
                      </TableCell>
                      <TableCell>{formatTime(trip.endTime)}</TableCell>
                      <TableCell className="max-w-[100px] truncate">
                        {trip.endLocation || "-"}
                      </TableCell>
                      <TableCell>{trip.duration}</TableCell>
                      <TableCell>{trip.distance}</TableCell>
                      <TableCell>{trip.avgSpeed}</TableCell>
                      <TableCell>{trip.maxSpeed}</TableCell>
                      <TableCell>{trip.fuelUsed}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-content2">
                    <TableCell colSpan={4} className="text-right font-medium">
                      Итого:
                    </TableCell>
                    <TableCell>{formatTotalDuration(totalDuration)}</TableCell>
                    <TableCell>{totalDistance.toFixed(2)} км</TableCell>
                    <TableCell colSpan={3}></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Tab>
          <Tab
            key="cards"
            title={
              <div className="flex items-center gap-2">
                <Icon icon="lucide:layout-grid" />
                <span>Карточки</span>
              </div>
            }
          >
            <div className="space-y-3">
              {trips.map((trip, index) => (
                <Card key={index} className="w-full">
                  <CardBody className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Icon
                          icon="lucide:clock"
                          className="text-default-500"
                          width={16}
                        />
                        <span className="font-medium">
                          {formatTime(trip.startTime)} -{" "}
                          {formatTime(trip.endTime)}
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        {trip.duration}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <p className="text-xs text-default-500">
                          Начальное положение
                        </p>
                        <p className="text-sm">
                          {trip.startLocation || "Не указано"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-default-500">
                          Конечное положение
                        </p>
                        <p className="text-sm">
                          {trip.endLocation || "Не указано"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <p className="text-xs text-default-500">Пробег</p>
                        <p className="text-sm font-medium">{trip.distance}</p>
                      </div>
                      <div>
                        <p className="text-xs text-default-500">Ср. скорость</p>
                        <p className="text-sm">{trip.avgSpeed}</p>
                      </div>
                      <div>
                        <p className="text-xs text-default-500">
                          Макс. скорость
                        </p>
                        <p className="text-sm">{trip.maxSpeed}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}

              <Card className="w-full bg-content2">
                <CardBody className="p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Итого за день:</span>
                    <span className="font-medium">
                      {formatTotalDuration(totalDuration)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-default-500">Общий пробег:</span>
                    <span className="font-medium">
                      {totalDistance.toFixed(2)} км
                    </span>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Tab>
        </Tabs>

        <div className="flex justify-end mt-4">
          <Button
            size="sm"
            color="primary"
            variant="flat"
            startContent={<Icon icon="lucide:download" width={16} />}
          >
            Экспорт
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
