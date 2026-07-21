import { useEffect, useState } from "react";
import MetricCard from "../components/MetricCard";
import DepthChart from "../components/DepthChart";
import api from "../services/api";
import Navbar from "../components/Navbar";
import RecentReadingsTable from "../components/RecentReadingsTable";
import AlertPanel from "../components/AlertPanel";




function Dashboard() {
  const [reading, setReading] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  async function fetchData() {
    try {
      const [latest, history] = await Promise.all([
        api.get("/readings/latest"),
        api.get("/readings/history"),
      ]);

      setReading(latest.data);
      setHistory(history.data);
    } catch (error) {
      console.error(error);
    }
  }

  if (!reading) {
    return <h2>Loading...</h2>;
  }

  return (
    <> 
    <Navbar />
    
    <div
      style={{
        background: "#eef5f9",
        minHeight: "100vh",
        padding: 40,
        fontFamily: "Arial",
      }}
    >
      {/* <h1
        style={{
          textAlign: "center",
          color: "#0f4c81",
        }}
      >
        AquaMind Dashboard
      </h1> */}

      <div
        style={{
          width: 900,
          margin: "40px auto",
        }}
      >
        <h2>{reading.station.name}</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            marginTop: 20,
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
            marginTop: 25,
            background: "white",
            padding: 20,
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,.15)",
          }}
        >
          <h2>
            Water Quality: {reading.waterQuality}
          </h2>
            <AlertPanel
            depth={reading.depth}
            ph={reading.ph}
            tds={reading.tds}
            quality={reading.waterQuality}
            />
        </div>

        <DepthChart data={history} />
        <RecentReadingsTable data={history} />
      </div>
    </div>
    </>
  );
}

export default Dashboard;