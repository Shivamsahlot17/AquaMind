import { useEffect, useState } from "react";
import axios from "axios";
import MetricCard from "./components/MetricCard";
import DepthChart from "./components/DepthChart";

function App() {
  const [reading, setReading] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchLatestReading();

    const interval = setInterval(() => {
      fetchLatestReading();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  async function fetchLatestReading() {
    try {
      const [latestResponse, historyResponse] = await Promise.all([
        axios.get("http://localhost:3000/api/readings/latest"),
        axios.get("http://localhost:3000/api/readings/history"),
      ]);

      setReading(latestResponse.data);
      setHistory(historyResponse.data);
    } catch (error) {
      console.error(error);
    }
  }

  if (!reading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div
      style={{
        background: "#eef5f9",
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#0f4c81",
          marginBottom: "40px",
        }}
      >
        AquaMind Dashboard
      </h1>

      <div
        style={{
          width: "900px",
          margin: "0 auto",
        }}
      >
        <h2>{reading.station.name}</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <MetricCard
            title="🌊 Groundwater Depth"
            value={`${reading.depth} m`}
          />

          <MetricCard
            title="🌡 Temperature"
            value={`${reading.temperature} °C`}
          />

          <MetricCard
            title="🧪 pH"
            value={`${reading.ph}`}
          />

          <MetricCard
            title="💧 TDS"
            value={`${reading.tds} ppm`}
          />
        </div>

        <div
          style={{
            marginTop: "25px",
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,.15)",
          }}
        >
          <h2>
            Water Quality:{" "}
            <span
              style={{
                color:
                  reading.waterQuality === "EXCELLENT"
                    ? "green"
                    : reading.waterQuality === "GOOD"
                    ? "#2e7d32"
                    : reading.waterQuality === "FAIR"
                    ? "#f9a825"
                    : reading.waterQuality === "POOR"
                    ? "orange"
                    : "red",
              }}
            >
              {reading.waterQuality}
            </span>
          </h2>
        </div>

        <DepthChart data={history} />
      </div>
    </div>
  );
}

export default App;