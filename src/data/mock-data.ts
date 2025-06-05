import { Vehicle, Report } from "../types/vehicle";

export const mockVehicles: Vehicle[] = [
  {
    id: "v1",
    name: "Truck 01",
    licensePlate: "AB123CD",
    model: "Volvo FH16",
    status: "active",
    lastUpdated: "2023-06-15T14:30:00Z",
    location: {
      lat: 55.751244,
      lng: 37.618423,
    },
    parameters: {
      fuelLevel: 75,
      mileage: 125000,
      engineTemp: 90,
      batteryLevel: 95,
      speed: 65,
    },
  },
  {
    id: "v2",
    name: "Delivery Van 02",
    licensePlate: "XY789ZW",
    model: "Mercedes Sprinter",
    status: "active",
    lastUpdated: "2023-06-15T14:25:00Z",
    location: {
      lat: 55.755814,
      lng: 37.617635,
    },
    parameters: {
      fuelLevel: 45,
      mileage: 78000,
      engineTemp: 85,
      batteryLevel: 90,
      speed: 0,
    },
  },
  {
    id: "v3",
    name: "Pickup 03",
    licensePlate: "PL456QR",
    model: "Ford F-150",
    status: "maintenance",
    lastUpdated: "2023-06-15T12:10:00Z",
    location: {
      lat: 55.758463,
      lng: 37.601079,
    },
    parameters: {
      fuelLevel: 30,
      mileage: 45000,
      engineTemp: 0,
      batteryLevel: 85,
      speed: 0,
    },
  },
  {
    id: "v4",
    name: "Sedan 04",
    licensePlate: "MN321OP",
    model: "Toyota Camry",
    status: "inactive",
    lastUpdated: "2023-06-14T18:45:00Z",
    location: {
      lat: 55.761353,
      lng: 37.632735,
    },
    parameters: {
      fuelLevel: 60,
      mileage: 32000,
      engineTemp: 0,
      batteryLevel: 75,
      speed: 0,
    },
  },
  {
    id: "v5",
    name: "SUV 05",
    licensePlate: "GH567JK",
    model: "Nissan X-Trail",
    status: "active",
    lastUpdated: "2023-06-15T14:15:00Z",
    location: {
      lat: 55.744525,
      lng: 37.616034,
    },
    parameters: {
      fuelLevel: 85,
      mileage: 18000,
      engineTemp: 88,
      batteryLevel: 100,
      speed: 45,
    },
  },
];

export const mockReports: Report[] = [
  {
    id: "r1",
    type: "mileage",
    vehicleId: "v1",
    startDate: "2023-06-01T00:00:00Z",
    endDate: "2023-06-15T23:59:59Z",
    data: {
      totalMileage: 1250,
      dailyAverage: 83.3,
      details: [
        { date: "2023-06-01", mileage: 95 },
        { date: "2023-06-02", mileage: 120 },
        { date: "2023-06-03", mileage: 85 },
        { date: "2023-06-04", mileage: 0 },
        { date: "2023-06-05", mileage: 110 },
        { date: "2023-06-06", mileage: 95 },
        { date: "2023-06-07", mileage: 105 },
        { date: "2023-06-08", mileage: 90 },
        { date: "2023-06-09", mileage: 115 },
        { date: "2023-06-10", mileage: 75 },
        { date: "2023-06-11", mileage: 0 },
        { date: "2023-06-12", mileage: 100 },
        { date: "2023-06-13", mileage: 85 },
        { date: "2023-06-14", mileage: 95 },
        { date: "2023-06-15", mileage: 80 },
      ],
    },
  },
];

// Add sample detailed report data
export const mockDetailedReport = {
  id: "dr1",
  type: "detailed",
  vehicleId: "v1",
  startDate: "2025-06-04T00:00:00Z",
  endDate: "2025-06-04T23:59:59Z",
  vehicleInfo: {
    name: "Автомобиль",
    licensePlate: "А197НР 763",
    model: "ГАЗ",
  },
  data: {},
  trips: [
    {
      startTime: "2025-06-04T06:36:48Z",
      startLocation: "",
      endTime: "2025-06-04T13:41:17Z",
      endLocation: "Безенчук",
      duration: "3:24:05",
      distance: "122 км",
      avgSpeed: "36 км/ч",
      maxSpeed: "115 км/ч",
      fuelUsed: "0 л",
    },
    {
      startTime: "2025-06-04T06:36:48Z",
      startLocation: "Победы Проспект, НОВОКУЙБЫШЕВСК",
      endTime: "2025-06-04T06:43:00Z",
      endLocation: "0.14 км от Самарское Шоссе, НОВОКУЙБЫШЕВСК",
      duration: "0:06:12",
      distance: "12.20 км",
      avgSpeed: "118 км/ч",
      maxSpeed: "113 км/ч",
      fuelUsed: "0 л",
    },
    {
      startTime: "2025-06-04T06:54:47Z",
      startLocation: "0.14 км от Самарское Шоссе, НОВОКУЙБЫШЕВСК",
      endTime: "2025-06-04T07:16:46Z",
      endLocation: "Самара",
      duration: "0:22:01",
      distance: "18.5 км",
      avgSpeed: "50 км/ч",
      maxSpeed: "90 км/ч",
      fuelUsed: "0 л",
    },
    {
      startTime: "2025-06-04T08:12:33Z",
      startLocation: "Самара",
      endTime: "2025-06-04T09:45:21Z",
      endLocation: "Чапаевск",
      duration: "1:32:48",
      distance: "43.7 км",
      avgSpeed: "28 км/ч",
      maxSpeed: "95 км/ч",
      fuelUsed: "0 л",
    },
    {
      startTime: "2025-06-04T10:30:15Z",
      startLocation: "Чапаевск",
      endTime: "2025-06-04T11:45:22Z",
      endLocation: "Безенчук",
      duration: "1:15:07",
      distance: "47.6 км",
      avgSpeed: "38 км/ч",
      maxSpeed: "105 км/ч",
      fuelUsed: "0 л",
    },
  ],
};

// Add function to generate a detailed report
export const generateDetailedReport = (
  vehicleId: string,
  startDate: string,
  endDate: string
) => {
  const vehicle = mockVehicles.find((v) => v.id === vehicleId);
  if (!vehicle) return null;

  return {
    ...mockDetailedReport,
    id: `dr-${Date.now()}`,
    vehicleId,
    startDate,
    endDate,
    vehicleInfo: {
      name: vehicle.name,
      licensePlate: vehicle.licensePlate,
      model: vehicle.model,
    },
  };
};

export const getVehicleById = (id: string): Vehicle | undefined => {
  return mockVehicles.find((vehicle) => vehicle.id === id);
};

export const getReportsByVehicleId = (vehicleId: string): Report[] => {
  return mockReports.filter((report) => report.vehicleId === vehicleId);
};

export const generateMileageReport = (
  vehicleId: string,
  startDate: string,
  endDate: string
): Report => {
  // In a real app, this would fetch data from an API
  return {
    id: `r-${Date.now()}`,
    type: "mileage",
    vehicleId,
    startDate,
    endDate,
    data: {
      totalMileage: Math.floor(Math.random() * 2000) + 500,
      dailyAverage: Math.floor(Math.random() * 100) + 50,
      details: Array.from({ length: 15 }, (_, i) => ({
        date: new Date(new Date(startDate).getTime() + i * 86400000)
          .toISOString()
          .split("T")[0],
        mileage: Math.floor(Math.random() * 150),
      })),
    },
  };
};
