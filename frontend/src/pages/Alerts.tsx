import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import { getAlerts } from "../services/alertService";

type Alert = {
  id: string;
  title: string;
  message: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  createdAt: string;
  station: {
    code: string;
    name: string;
  };
};

function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAlerts();
  }, []);

  async function loadAlerts() {
    try {
      setLoading(true);

      const data = await getAlerts();

      console.log("Alerts API Response:", data);

      setAlerts(data);
    } catch (err: any) {
      console.error("Alerts API Error:", err);

      if (err.response) {
        console.log("Status:", err.response.status);
        console.log("Data:", err.response.data);
      }

      setError("Failed to load alerts.");
    } finally {
      setLoading(false);
    }
  }

  const getColor = (severity: string) => {
    switch (severity) {
      case "HIGH":
        return "#ef4444";
      case "MEDIUM":
        return "#f59e0b";
      default:
        return "#22c55e";
    }
  };

  return (
    <Layout>
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <h1>🚨 Alerts</h1>

        <button
          onClick={loadAlerts}
          style={{
            padding: "8px 16px",
            marginBottom: 20,
            cursor: "pointer",
          }}
        >
          Refresh Alerts
        </button>

        {loading && <p>Loading alerts...</p>}

        {!loading && error && (
          <p style={{ color: "red" }}>{error}</p>
        )}

        {!loading && !error && alerts.length === 0 && (
          <p>No alerts available.</p>
        )}

        {!loading && alerts.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {alerts.map((alert) => (
              <div
                key={alert.id}
                style={{
                  background: "#fff",
                  borderLeft: `8px solid ${getColor(alert.severity)}`,
                  borderRadius: 12,
                  padding: 20,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                <h2>{alert.station.code}</h2>

                <p>
                  <strong>Station:</strong> {alert.station.name}
                </p>

                <p>
                  <strong>Severity:</strong>{" "}
                  <span
                    style={{
                      color: getColor(alert.severity),
                      fontWeight: "bold",
                    }}
                  >
                    {alert.severity}
                  </span>
                </p>

                <p>
                  <strong>{alert.title}</strong>
                </p>

                <p>{alert.message}</p>

                <small>
                  {new Date(alert.createdAt).toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Alerts;