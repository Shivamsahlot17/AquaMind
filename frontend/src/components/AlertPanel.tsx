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
  const alerts: string[] = [];

  if (ph < 6.5 || ph > 8.5) {
    alerts.push("🔴 pH is outside the safe range.");
  }

  if (tds > 500) {
    alerts.push("🟡 TDS is above the recommended limit.");
  }

  if (depth > 20) {
    alerts.push("🔵 Groundwater level is getting low.");
  }

  if (alerts.length === 0) {
    alerts.push(`🟢 Water Quality is ${quality}.`);
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
        <p key={index}>{alert}</p>
      ))}
    </div>
  );
}

export default AlertPanel;