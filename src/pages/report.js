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
} from "@heroui/react";
import { Icon } from "@iconify/react";

import { DetailedReportTable } from "../components/detailed-report-table";
import { useAuth } from "../context/auth-context.js";
import { VehicleMapReport } from "../components/vehicle-map-report.js";

export const ReportsPage = () => {
  const { reportList, dataCar, IdCar } = useAuth();

  const location = useLocation();

  const [listType, setListType] = useState();
  const [carlistType, setCarListType] = useState();
  const [selectedCarId, setSelectedCarId] = useState();
  const [selectedVehicleId, setSelectedVehicleId] = useState();
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState();
  const [aid, setAid] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [mapCord, setMapCord] = useState();
  const [serchAct, setSearchAct] = useState(false)

  console.log(reportList, dataCar, IdCar)

  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState(null);

  const sid = localStorage.getItem("sid");
  const s = localStorage.getItem("server");

  const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    const localDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0
    );
    return Math.floor(localDate.getTime() / 1000);
  });

  const [endDate, setEndDate] = useState(() => {
    const now = new Date();
    const localDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59
    );
    return Math.floor(localDate.getTime() / 1000);
  });

  useEffect(() => {
    if (location.state?.selectedVehicleId) {
      setSelectedVehicleId("1");
      setSelectedVehicleIndex(0)
      setAid(reportList[0]?.a);
      setSelectedCarId(String(IdCar.id));
    }
    // eslint-disable-next-line
  }, [location.state]);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));

        setListType(reportList);
        setCarListType(dataCar.items);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicle();
    // eslint-disable-next-line
  }, []);

  function extractAndParseXML(rawText, tableId = "unit_trips") {
    const xmlStart = rawText.indexOf("<");
    if (xmlStart === -1) {
      throw new Error("В ответе нет XML");
    }

    const xmlText = rawText.slice(xmlStart);

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    const parserError = xmlDoc.querySelector("parsererror");
    if (parserError) {
      throw new Error("Ошибка парсинга XML: " + parserError.textContent);
    }

    const tripsTable = xmlDoc.querySelector(`table[id="${tableId}"]`);
    if (!tripsTable) {
      throw new Error(`Таблица ${tableId} не найдена в отчёте`);
    }

    const rows = Array.from(tripsTable.querySelectorAll("row"));
    const tripsData = rows.map((row) => {
      const cols = Array.from(row.querySelectorAll("col"));
      return cols.map((col) => col.getAttribute("txt") || "");
    });

    const headerElem = tripsTable.querySelector("header");
    const tripsDataHeader = headerElem
      ? Array.from(headerElem.querySelectorAll("col")).map(
        (col) => col.getAttribute("name") || ""
      )
      : [];

    const tripsTabl = xmlDoc.querySelector(`stats`);
    if (!tripsTabl) {
      throw new Error(`Таблица не найдена в отчёте`);
    }

    const statsNode = xmlDoc.querySelector("stats");
    if (!statsNode) {
      throw new Error("Статистика не найдена в отчёте");
    }

    const stats = Array.from(statsNode.querySelectorAll("row")).map((row) => ({
      name: row.getAttribute("name") || "",
      txt: row.getAttribute("txt") || "",
      val: row.getAttribute("val") || "",
      vt: row.getAttribute("vt") || "",
    }));

    return { header: tripsDataHeader, rows: tripsData, stats: stats };
  }

  function extractAndParseJSONPayload(rawText) {
    const jsonStart = rawText.indexOf("[");
    if (jsonStart === -1) {
      throw new Error("В ответе не найден JSON");
    }

    const jsonText = rawText.slice(jsonStart);

    try {
      const data = JSON.parse(jsonText);
      return data;
    } catch (err) {
      throw new Error("Ошибка парсинга JSON: " + err.message);
    }
  }

  const handleGenerateReport = async () => {
    if (!selectedCarId || !startDate || !endDate || !selectedVehicleId) return;

    setSearchAct(true);
    setIsGenerating(true);
    setReport(null);

    try {
      const response = await fetch(
        `https://gps-it.ru/proxy.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            a: "report",
            sid: sid,
            srv: `${s}`,
            uid: selectedCarId,
            aid: aid,
            rid: selectedVehicleId,
            from: startDate,
            to: endDate,
          }),
        }
      );

      const responseMap = await fetch(
        `https://gps-it.ru/proxy.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            a: "messages",
            sid: sid,
            srv: `${s}`,
            uid: selectedCarId,
            from: startDate,
            to: endDate,
            resolve: "0",
          }),
        }
      );

      const rawText = await response.text();
      const mapText = await responseMap.text();

      let tripsData = null;
      let mapData = null;

      try {
        tripsData = extractAndParseXML(rawText, "unit_trips");
      } catch (err) {
        console.warn("Не удалось распарсить XML:", err);
      }

      try {
        mapData = extractAndParseJSONPayload(mapText, "unit_trips");
      } catch (err) {
        console.warn("Не удалось распарсить JSON:", err);
      }

      // сохраняем только то, что получилось
      if (tripsData) setReport(tripsData);
      if (mapData) setMapCord(mapData);

    } catch (error) {
      console.error("Ошибка при генерации отчёта:", error);
    } finally {
      setIsGenerating(false);
    }
  };


  const formatLocalDateTime = (date) => {
    const pad = (num) => String(num).padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-md p-4 flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container w-full mx-auto max-w-md p-4 pb-24">
      <h1 className="text-xl font-semibold mb-4">Отчёты</h1>

      <Card className="mt-2">
        <CardHeader className="pb-0">
          <h2 className="text-lg font-medium">Параметры отчёта</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <Select
            label="Транспортное средство"
            placeholder="Выберите транспортное средство"
            selectedKeys={selectedCarId ? [selectedCarId] : []}
            onChange={(e) => setSelectedCarId(e.target.value)}
          >
            {carlistType
              ?.slice() // копия массива, чтобы не мутировать оригинал
              .sort((a, b) => {
                // сначала сортировка по имени (nm) по алфавиту
                const nameCompare = a.nm.localeCompare(b.nm, "ru"); // "ru" для кириллицы
                if (nameCompare !== 0) return nameCompare;

                // если имена одинаковые → сортировка по id по возрастанию
                return a.id - b.id;
              })
              .map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.nm}
                </SelectItem>
              ))}
          </Select>
          <Select
            label="Вид отчета"
            placeholder="Выберите отчет"
            selectedKeys={selectedVehicleIndex !== null ? [String(selectedVehicleIndex)] : []}
            onChange={(e) => {
              const selectedIndex = Number(e.target.value); // индекс в массиве
              const filtered = listType.filter(item => !/групп[а-я]*/i.test(item.n));
              const selectedObj = filtered[selectedIndex]; // берём по индексу



              if (selectedObj) {
                setSelectedVehicleId(selectedObj.r);
                setSelectedVehicleIndex(selectedIndex);
                setAid(selectedObj.a);
              }
            }}
          >
            {listType
              .filter(item => !/групп[а-я]*/i.test(item.n))
              .map((vehicle, index) => (
                <SelectItem key={index} value={String(index)}>
                  {vehicle.n}
                </SelectItem>
              ))}
          </Select>


          <div className="grid grid-cols-2 gap-4">
            <Input
              type="datetime-local"
              label={
                <>
                  <p className="hidden md:inline">Дата и </p>
                  <span className="text-sm">время начала</span>
                </>
              }
              value={formatLocalDateTime(new Date(startDate * 1000))}
              onChange={(e) => {
                const unix = Math.floor(
                  new Date(e.target.value).getTime() / 1000
                );
                setStartDate(unix);
              }}
            />

            <Input
              type="datetime-local"
              label={
                <>
                  <p className="hidden md:inline">Дата и </p>
                  <span className="text-sm">время окончания</span>
                </>
              }
              value={formatLocalDateTime(new Date(endDate * 1000))}
              onChange={(e) => {
                const unix = Math.floor(
                  new Date(e.target.value).getTime() / 1000
                );
                setEndDate(unix);
              }}
            />
          </div>

          <Button
            color="primary"
            className="w-full"
            onPress={handleGenerateReport}
            isLoading={isGenerating}
            isDisabled={!selectedCarId || !selectedVehicleId || !endDate}
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
      ) : report ? (
        <>
          <div className="mt-3 mb-3 rounded-xl overflow-hidden">
            <VehicleMapReport path={mapCord} />
          </div>

          {report.stats.length > 0 && (
            <Card>
              <CardBody className="p-5">
                <CardHeader className="p-0 pb-5">
                  <h4>Статистика</h4>
                </CardHeader>
                <div className="space-y-2">
                  {report?.stats.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between border-b pb-1 text-sm text-gray-700"
                    >
                      <span className="font-medium">{item.name}</span>
                      <span>{item.txt}</span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
          <DetailedReportTable trips={report} />
        </>
      ) : <>{serchAct && <p className="mt-5 text-default-700">Ничего не найдено</p>}</>}
    </div>
  );
};
