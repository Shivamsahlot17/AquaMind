import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";
import {
  getStations,
  type Station,
} from "../services/stationService";
import StationMap from "../components/StationMap";

function Stations() {
  const [stations, setStations] = useState<Station[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadStations();
  }, []);

  async function loadStations() {
    try {
      const data = await getStations();
      setStations(data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Layout>
      <h1>📍 Groundwater Monitoring Stations</h1>

      <div
        style={{
          marginTop: "20px",
          marginBottom: "30px",
          background: "white",
          padding: "15px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,.15)",
        }}
      >
        <StationMap stations={stations} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {stations.map((station) => (
          <div
            key={station.id}
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,.15)",
            }}
          >
            <h2>{station.name}</h2>

            <p>
              <strong>Code:</strong> {station.code}
            </p>

            <p>
              <strong>Location:</strong> {station.location}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color:
                    station.status === "ONLINE"
                      ? "green"
                      : "red",
                  fontWeight: "bold",
                }}
              >
                {station.status}
              </span>
            </p>

            <button
              onClick={() =>
                navigate(`/dashboard/${station.code}`)
              }
              style={{
                marginTop: "15px",
                width: "100%",
                padding: "10px",
                border: "none",
                borderRadius: "8px",
                background: "#0f4c81",
                color: "white",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "bold",
              }}
            >
              View Dashboard →
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default Stations;