import React from "react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";

export const VehicleMap = ({ pos }) => {
  const defaultState = {
    center: [pos.y, pos.x],
    zoom: 15,
  };

  return (
    <YMaps
      query={{
        apikey: "ec5e8dee-5067-4393-856f-b137854efe26",
      }}
    >
      <Map
        defaultState={defaultState}
        type="satellite"
        width="100%"
        height="200px"
      >
        <Placemark geometry={[pos.y, pos.x]} />
      </Map>
    </YMaps>
  );
};
