import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
  Button,
  Spinner,
  Input,
  Tabs,
  Tab,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import {
  mockVehicles,
  generateMileageReport,
  generateDetailedReport,
} from "../data/mock-data.ts";
import { DetailedReportTable } from "../components/detailed-report-table";

export const ReportsPage = () => {
  const location = useLocation();
  const [selectedVehicleId, setSelectedVehicleId] = useState(
    location.state?.selectedVehicleId || ""
  );
  const [selectedReportType, setSelectedReportType] = useState("detailed");
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState(null);
  const [activeTab, setActiveTab] = useState("generator");
  const [savedReports, setSavedReports] = useState([]);
  const [detailedReport, setDetailedReport] = useState(null);

  const reportTypes = [
    { key: "detailed", label: "Детальный отчет" },
    { key: "mileage", label: "Пробег" },
    { key: "fuel", label: "Расход топлива" },
    { key: "activity", label: "Активность" },
    { key: "maintenance", label: "Техобслуживание" },
  ];

  const handleGenerateReport = () => {
    if (!selectedVehicleId || !startDate || !endDate) return;

    setIsGenerating(true);
    setReport(null);
    setDetailedReport(null);

    setTimeout(() => {
      if (selectedReportType === "detailed") {
        const generated = generateDetailedReport(
          selectedVehicleId,
          startDate,
          endDate
        );
        setDetailedReport(generated);
      } else {
        const generatedReport = generateMileageReport(
          selectedVehicleId,
          startDate,
          endDate
        );
        setReport(generatedReport);
      }
      setIsGenerating(false);
    }, 1500);
  };

  const handleSaveReport = () => {
    if (report) {
      setSavedReports((prev) => [report, ...prev]);
    } else if (detailedReport) {
      setSavedReports((prev) => [detailedReport, ...prev]);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ru-RU");
  };

  return (
    <div className="container mx-auto max-w-md p-4 pb-24">
      <h1 className="text-xl font-semibold mb-4">Отчёты</h1>

      <Card className="mt-2">
        <CardHeader className="pb-0">
          <h2 className="text-lg font-medium">Параметры отчёта</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <Select
            label="Транспортное средство"
            placeholder="Выберите транспортное средство"
            selectedKeys={selectedVehicleId ? [selectedVehicleId] : []}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
          >
            {mockVehicles.map((vehicle) => (
              <SelectItem key={vehicle.id} value={vehicle.id}>
                {vehicle.name}
              </SelectItem>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label="Дата начала"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              type="date"
              label="Дата окончания"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <Button
            color="primary"
            className="w-full"
            onPress={handleGenerateReport}
            isLoading={isGenerating}
            isDisabled={!selectedVehicleId || !startDate || !endDate}
            startContent={
              !isGenerating && <Icon icon="lucide:file-bar-chart" />
            }
          >
            Сформировать отчёт
          </Button>
        </CardBody>
      </Card>

      {isGenerating ? (
        <Card className="mt-4">
          <CardBody className="flex flex-col items-center justify-center py-8">
            <Spinner size="lg" className="mb-4" />
            <p className="text-default-500">Формирование отчёта...</p>
          </CardBody>
        </Card>
      ) : detailedReport ? (
        <DetailedReportTable
          vehicleName={detailedReport.vehicleInfo.name}
          licensePlate={detailedReport.vehicleInfo.licensePlate}
          model={detailedReport.vehicleInfo.model}
          startDate={detailedReport.startDate}
          endDate={detailedReport.endDate}
          trips={detailedReport.trips}
        />
      ) : report ? (
        <Card className="mt-4">
          <CardHeader className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Результаты отчёта</h2>
              <Button
                size="sm"
                color="primary"
                variant="flat"
                onPress={handleSaveReport}
                startContent={<Icon icon="lucide:save" width={16} />}
              >
                Сохранить
              </Button>
            </div>
            <p className="text-default-500 text-sm">
              {formatDate(report.startDate)} - {formatDate(report.endDate)}
            </p>
          </CardHeader>
          <CardBody>
            {report.type === "mileage" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardBody className="text-center p-4">
                      <p className="text-default-500 text-sm">Общий пробег</p>
                      <p className="text-2xl font-semibold">
                        {report.data.totalMileage} км
                      </p>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody className="text-center p-4">
                      <p className="text-default-500 text-sm">Средний в день</p>
                      <p className="text-2xl font-semibold">
                        {report.data.dailyAverage} км
                      </p>
                    </CardBody>
                  </Card>
                </div>

                <div>
                  <h3 className="text-md font-medium mb-2">
                    Детализация по дням
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {report.data.details.map((detail, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-content2 rounded-medium"
                      >
                        <span>{formatDate(detail.date)}</span>
                        <span className="font-medium">{detail.mileage} км</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      ) : null}
    </div>
  );
};
