import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Layout from "../layout/Layout";
import {
  getSensors,
  registerSensor,
  updateSensor,
  deleteSensor,
  type Sensor,
} from "../services/sensorService";
import {
  getStations,
  type Station,
} from "../services/stationService";

function Sensors() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const [deviceId, setDeviceId] = useState("");
  const [macAddress, setMacAddress] = useState("");
  const [firmwareVersion, setFirmwareVersion] = useState("");
  const [stationId, setStationId] = useState("");

  const [generatedKey, setGeneratedKey] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [sensorData, stationData] = await Promise.all([
        getSensors(),
        getStations(),
      ]);

      setSensors(sensorData);
      setStations(stationData);
    } catch (err) {
      console.error(err);
      setError("Failed to load sensor data.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    if (!deviceId || !stationId) {
      alert("Device ID and Station are required.");
      return;
    }

    try {
      const sensor = await registerSensor({
        deviceId,
        macAddress: macAddress || undefined,
        firmwareVersion: firmwareVersion || undefined,
        stationId,
      });

      setSensors((currentSensors) => [sensor, ...currentSensors]);

      setGeneratedKey(sensor.deviceKey);

      setDeviceId("");
      setMacAddress("");
      setFirmwareVersion("");
      setStationId("");
    } catch (err) {
      console.error(err);
      alert("Failed to register sensor.");
    }
  }

  async function handleStatusChange(
    sensorId: string,
    status: Sensor["status"]
  ) {
    try {
      const updatedSensor = await updateSensor(sensorId, {
        status,
      });

      setSensors((currentSensors) =>
        currentSensors.map((sensor) =>
          sensor.id === sensorId ? updatedSensor : sensor
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update sensor status.");
    }
  }

  async function handleDelete(sensorId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this sensor?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteSensor(sensorId);

      setSensors((currentSensors) =>
        currentSensors.filter((sensor) => sensor.id !== sensorId)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to delete sensor.");
    }
  }

  function getStationName(sensor: Sensor) {
    if (sensor.station) {
      return `${sensor.station.code} - ${sensor.station.name}`;
    }

    return "Unassigned";
  }

  function formatLastSeen(lastSeen: string | null | undefined) {
    if (!lastSeen) {
      return "Never";
    }

    return new Date(lastSeen).toLocaleString();
  }

  return (
    <Layout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <div>
          <h1 style={{ marginBottom: "5px" }}>
            📡 Sensor Management
          </h1>

          <p
            style={{
              marginTop: "0",
              color: "#666",
            }}
          >
            Register and monitor groundwater sensors.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            onClick={loadData}
            style={secondaryButtonStyle}
          >
            🔄 Refresh
          </button>

          <button
            onClick={() => {
              setShowRegisterForm(!showRegisterForm);
              setGeneratedKey("");
            }}
            style={primaryButtonStyle}
          >
            {showRegisterForm
              ? "✕ Close"
              : "➕ Register Sensor"}
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            background: "#ffe5e5",
            color: "#b00020",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {showRegisterForm && (
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            marginBottom: "25px",
            boxShadow: "0 2px 8px rgba(0,0,0,.15)",
          }}
        >
          <h2>Register New Sensor</h2>

          <form onSubmit={handleRegister}>
            <div style={formGridStyle}>
              <div>
                <label style={labelStyle}>Device ID *</label>

                <input
                  value={deviceId}
                  onChange={(event) =>
                    setDeviceId(event.target.value)
                  }
                  placeholder="Example: AQM-0002"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>MAC Address</label>

                <input
                  value={macAddress}
                  onChange={(event) =>
                    setMacAddress(event.target.value)
                  }
                  placeholder="AA:BB:CC:DD:EE:FF"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Firmware Version
                </label>

                <input
                  value={firmwareVersion}
                  onChange={(event) =>
                    setFirmwareVersion(event.target.value)
                  }
                  placeholder="v1.0.0"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Station *</label>

                <select
                  value={stationId}
                  onChange={(event) =>
                    setStationId(event.target.value)
                  }
                  style={inputStyle}
                >
                  <option value="">
                    Select Station
                  </option>

                  {stations.map((station) => (
                    <option
                      key={station.id}
                      value={station.id}
                    >
                      {station.code} - {station.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              style={{
                ...primaryButtonStyle,
                marginTop: "20px",
              }}
            >
              Register Sensor
            </button>
          </form>

          {generatedKey && (
            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                background: "#fff8dc",
                border: "1px solid #e0c85a",
                borderRadius: "8px",
              }}
            >
              <strong>⚠️ Device Key</strong>

              <p>
                Save this key securely. It is required by the
                physical sensor to send readings.
              </p>

              <code
                style={{
                  display: "block",
                  wordBreak: "break-all",
                  background: "#f5f5f5",
                  padding: "10px",
                  borderRadius: "6px",
                }}
              >
                {generatedKey}
              </code>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <p>Loading sensors...</p>
      ) : sensors.length === 0 ? (
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,.15)",
          }}
        >
          No sensors registered.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          {sensors.map((sensor) => (
            <div
              key={sensor.id}
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,.15)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2 style={{ marginTop: "0" }}>
                  📡 {sensor.deviceId}
                </h2>

                <span
                  style={{
                    fontWeight: "bold",
                    color:
                      sensor.status === "ONLINE"
                        ? "green"
                        : sensor.status === "OFFLINE"
                        ? "red"
                        : "#d68910",
                  }}
                >
                  {sensor.status}
                </span>
              </div>

              <p>
                <strong>Station:</strong>{" "}
                {getStationName(sensor)}
              </p>

              <p>
                <strong>MAC:</strong>{" "}
                {sensor.macAddress || "Not provided"}
              </p>

              <p>
                <strong>Firmware:</strong>{" "}
                {sensor.firmwareVersion || "Not provided"}
              </p>

              <p>
                <strong>Last Seen:</strong>{" "}
                {formatLastSeen(sensor.lastSeen)}
              </p>

              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  gap: "10px",
                }}
              >
                <select
                  value={sensor.status}
                  onChange={(event) =>
                    handleStatusChange(
                      sensor.id,
                      event.target.value as Sensor["status"]
                    )
                  }
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="ONLINE">ONLINE</option>
                  <option value="OFFLINE">OFFLINE</option>
                  <option value="MAINTENANCE">
                    MAINTENANCE
                  </option>
                </select>

                <button
                  onClick={() => handleDelete(sensor.id)}
                  style={{
                    padding: "8px 12px",
                    border: "none",
                    borderRadius: "6px",
                    background: "#c62828",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

const primaryButtonStyle = {
  padding: "10px 18px",
  border: "none",
  borderRadius: "8px",
  background: "#0f4c81",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold" as const,
};

const secondaryButtonStyle = {
  padding: "10px 18px",
  border: "1px solid #0f4c81",
  borderRadius: "8px",
  background: "white",
  color: "#0f4c81",
  cursor: "pointer",
  fontWeight: "bold" as const,
};

const formGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontWeight: "bold" as const,
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: "14px",
};

export default Sensors;