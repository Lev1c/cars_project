import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

export const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-content1 border-t border-divider py-2 px-4 flex justify-around items-center z-10">
      <Button
        variant={isActive("/list") ? "flat" : "light"}
        color={isActive("/list") ? "primary" : "default"}
        onClick={() => navigate("/list")}
        className="flex flex-col items-center gap-1 h-16 w-1/2"
      >
        <Icon icon="lucide:list" width={24} />
        <span className="text-xs">Список</span>
      </Button>

      <Button
        variant={isActive("/reports") ? "flat" : "light"}
        color={isActive("/reports") ? "primary" : "default"}
        onClick={() => navigate("/reports")}
        className="flex flex-col items-center gap-1 h-16 w-1/2"
      >
        <Icon icon="lucide:file-text" width={24} />
        <span className="text-xs">Отчёты</span>
      </Button>
    </div>
  );
};
