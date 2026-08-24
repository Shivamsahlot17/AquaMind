type Props = {
  depth: number;
  ph: number;
  tds: number;
  quality: string;
};

function AlertPanel({
  depth,
  ph,
  tds,
  quality,
}: Props) {
  const alerts: { message: string; color: string }[] = [];

  if (depth > 20) {
    alerts.push({
      message: "Groundwater level is critically low.",
      color: "#ef4444",
    });
  }

  if (ph < 6.5 || ph > 8.5) {
    alerts.push({
      message: "pH is outside the safe range.",
      color: "#f59e0b",
    });
  }

  if (tds > 500) {
    alerts.push({
      message: "TDS exceeds the recommended limit.",
      color: "#f97316",
    });
  }

  if (quality !== "GOOD") {
    alerts.push({
      message: `Water quality is ${quality}.`,
      color: "#dc2626",
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      message: "All groundwater parameters are within the safe range.",
      color: "#16a34a",
    });
  }

  return (
    <div
      style={{
        background: "white",
        marginTop: 30,
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,.15)",
      }}
    >
      <h2>🚨 Alerts</h2>

      {alerts.map((alert, index) => (
        <div
          key={index}
          style={{
            marginTop: 10,
            padding: 12,
            borderLeft: `6px solid ${alert.color}`,
            background: "#f8fafc",
            borderRadius: 8,
            fontWeight: 600,
          }}
        >
          {alert.message}
        </div>
      ))}
    </div>
  );
}

export default AlertPanel;