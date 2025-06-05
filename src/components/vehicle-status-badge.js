import React from "react";
import { Chip } from "@heroui/react";

export const VehicleStatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "active":
        return { color: "success", text: "Активен" };
      case "inactive":
        return { color: "default", text: "Неактивен" };
      case "maintenance":
        return { color: "warning", text: "Обслуживание" };
      default:
        return { color: "default", text: "Неизвестно" };
    }
  };

  const { color, text } = getStatusConfig();

  return (
    <Chip color={color} variant="flat" size="sm">
      {text}
    </Chip>
  );
};
