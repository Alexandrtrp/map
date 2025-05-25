import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../App.css";
import type { IDevice } from "../types";
import { useState } from "react";

// Генерация простых иконок через div
const getModelIcon = (
  model: IDevice["model"],
  status: IDevice["status"],
  isChild = false
) => {
  const size = isChild ? [20, 20] : [30, 30];
  let color = "";

  switch (model) {
    case "basic":
      color = "blue";
      break;
    case "advanced":
      color = "green";
      break;
    case "special":
      color = "red";
      break;
  }

  // Дополнительное оформление для статуса off
  const opacity = status === "off" ? 0.5 : 1;

  return L.divIcon({
    html: `<div style="
      background-color: ${color};
      opacity: ${opacity};
      width: ${size[0]}px;
      height: ${size[1]}px;
      border-radius: 35%;
      border: 2px solid white;
    "></div>`,
    className: "",
    iconAnchor: [size[0] / 2, size[1] / 2],
    popupAnchor: [0, -size[1] / 2],
  });
};

// Компонент маркера устройства
export const DeviceMarker = ({ device }: { device: IDevice }) => {
  const map = useMap();
  const offset = 0.001;
  const [position, setPosition] = useState<[number, number]>([
    device.lat,
    device.lon,
  ]);

  const isDraggable = device.id === "1"; // только для первого маркера
  // P.S. Перетаскиваемый маркер отрисуется синим с названием: Температурный сенсор

  const handleDragEnd = (e: L.LeafletEvent) => {
    const marker = e.target as L.Marker;
    const newPos = marker.getLatLng();
    setPosition([newPos.lat, newPos.lng]);
    console.log(
      `Маркер ${device.name} перемещён в ${newPos.lat}, ${newPos.lng}`
    );
  };

  return (
    <>
      <Marker
        position={position}
        icon={getModelIcon(device.model, device.status)}
        draggable={isDraggable}
        eventHandlers={{
          dragend: handleDragEnd,
          dblclick: () => map.setView([device.lat, device.lon], 16),
        }}
      >
        <Popup>
          <strong>{device.name}</strong>
          <br />
          <span>Модель: {device.model}</span>
          <br />
          <span>Статус: {device.status}</span>
        </Popup>
      </Marker>

      {device.children?.map((child, index) => (
        <Marker
          key={child.id}
          position={[
            device.lat + offset * (index + 1),
            device.lon + offset * (index + 1),
          ]}
          icon={getModelIcon(child.model, child.status, true)}
        >
          <Popup>
            <strong>{child.name}</strong>
            <br />
            <span> Модель: {child.model}</span>
            <br />
            <span> Статус: {child.status}</span>
          </Popup>
        </Marker>
      ))}
    </>
  );
};
