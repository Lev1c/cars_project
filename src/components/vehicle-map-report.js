import React from "react";
import { YMaps, Map, Polyline } from "@pbe/react-yandex-maps";

export const VehicleMapReport = ({ path = [] }) => {
  if (!Array.isArray(path) || path.length === 0) return null;

  const firstPoint = path.find(
    (pos) => typeof pos.x === "number" && typeof pos.y === "number"
  );
  const defaultState = {
    center: [firstPoint?.y || 0, firstPoint?.x || 0],
    zoom: 12,
  };

  const coordinates = path
    .filter((pos) => typeof pos.x === "number" && typeof pos.y === "number")
    .map((pos) => [pos.y, pos.x]);
  return (
    <YMaps query={{ apikey: "ec5e8dee-5067-4393-856f-b137854efe26" }}>
      <Map defaultState={defaultState} type="map" width="100%" height="250px">
        <Polyline
          geometry={coordinates}
          options={{
            strokeColor: "#0077ff",
            strokeWidth: 4,
            strokeOpacity: 0.8,
          }}
        />
      </Map>
    </YMaps>
  );
};
