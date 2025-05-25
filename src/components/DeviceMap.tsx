import { useEffect, useState } from "react";
import type { IDevice } from "../types";
import { MapContainer, TileLayer } from "react-leaflet";
import { DeviceMarker } from "./DeviceMarker";

export const DeviceMap = () => {
  const [devices, setDevices] = useState<IDevice[]>([]);

  useEffect(() => {
    fetch("/devices.json")
      .then((res) => res.json())
      .then((data) => setDevices(data))
      .catch((err) => console.error("Ошибка загрузки устройств:", err));
  }, []);

  return (
    <div className="App">
      <h1>Карта устройств</h1>
      <MapContainer
        center={[55.751244, 37.618423]}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {devices.map((device) => (
          <DeviceMarker key={device.id} device={device} />
        ))}
      </MapContainer>
    </div>
  );
};
