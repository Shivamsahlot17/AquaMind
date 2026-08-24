import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Layout from "../layout/Layout";
import MetricCard from "../components/MetricCard";
import DepthChart from "../components/DepthChart";
import RecentReadingsTable from "../components/RecentReadingsTable";
import AlertPanel from "../components/AlertPanel";

import type { Reading } from "../types/reading";

import {
  getLatestReading,
  getReadingHistory,
} from "../services/readingService";

function Dashboard() {
  const { stationId } = useParams();

  const [reading, setReading] = useState<Reading | null>(null);
  const [history, setHistory] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!stationId) return;

    fetchData();

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, [stationId]);

  async function fetchData() {
    try {
      setError("");

      const [latest, history] = await Promise.all([
    getLatestReading(),
    getReadingHistory(),
      ]);

      setReading(latest);
      setHistory(history);
    } catch (err) {
      console.error(err);
      setError("Unable to load station data.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Layout>
        <div
          style={{
            height: "70vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 24,
            fontWeight: "bold",
            color: "#0f4c81",
          }}
        >
          Loading Dashboard...
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div
          style={{
            height: "70vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "red",
            fontSize: 22,
            fontWeight: "bold",
          }}
        >
          {error}
        </div>
      </Layout>
    );
  }

  if (!reading) return null;

  return (
    <Layout>
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          <div>
            <h2>{reading.station.name}</h2>

            <p
              style={{
                color: "#666",
                marginTop: 6,
              }}
            >
              Station Code: <strong>{stationId}</strong>
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
            gap: 20,
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
            value={reading.ph.toFixed(2)}
          />

          <MetricCard
            title="💧 TDS"
            value={`${reading.tds} ppm`}
          />

          <MetricCard
            title="💎 Water Quality"
            value={reading.waterQuality}
          />

          <MetricCard
            title="📈 Total Readings"
            value={history.length.toString()}
          />

          <MetricCard
            title="📅 Last Updated"
            value={new Date(reading.createdAt).toLocaleTimeString()}
          />

          <MetricCard
            title="🛰 Station Status"
            value={reading.station.status}
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
    </Layout>
  );
}

export default Dashboard;