import React from "react";
import { Chip } from "@heroui/react";

export const VehicleStatusBadge = ({ status, txt }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "red":
        return { color: "danger", text: "" };
      case "green":
        return { color: "success", text: "" };
      case "yellow":
        return { color: "warning", text: "" };
      case "red-time":
        return { color: "danger", text: txt };
      case "green-time":
        return { color: "success", text: txt };
      case "yellow-time":
        return { color: "warning", text: txt };
      default:
        return { color: "default", text: "Неизвестно" };
    }
  };

  const { color, text } = getStatusConfig();

  return (
    <Chip
      color={color}
      variant="flat"
      size="sm"
      style={{ "min-width": "25px" }}
    >
      {text}
    </Chip>
  );
};
