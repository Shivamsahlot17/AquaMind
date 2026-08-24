import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export interface StationMapProps {
  stations: {
    id: string;
    code: string;
    name: string;
    location: string;
    latitude: number;
    longitude: number;
    status: string;
  }[];
}

function StationMap({ stations }: StationMapProps) {
  const navigate = useNavigate();

  const center =
    stations.length > 0
      ? [stations[0].latitude, stations[0].longitude]
      : [28.753, 77.498];

  return (
    <MapContainer
      center={center as [number, number]}
      zoom={10}
      style={{
        height: "450px",
        width: "100%",
        borderRadius: "12px",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {stations.map((station) => (
        <Marker
          key={station.id}
          position={[station.latitude, station.longitude]}
        >
          <Popup>
            <strong>{station.name}</strong>
            <br />
            {station.location}
            <br />
            Status: {station.status}
            <br />
            <br />
            <button
              onClick={() => navigate(`/dashboard/${station.code}`)}
              style={{
                padding: "8px 12px",
                border: "none",
                borderRadius: "6px",
                background: "#0f4c81",
                color: "white",
                cursor: "pointer",
              }}
            >
              Open Dashboard
            </button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default StationMap;