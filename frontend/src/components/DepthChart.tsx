import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { Reading } from "../types/reading";

type Props = {
  data: Reading[];
};

function DepthChart({ data }: Props) {
  const chartData = data.map((item) => ({
    time: new Date(item.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    depth: item.depth,
    temperature: item.temperature,
    ph: item.ph,
    tds: item.tds,
  }));

  return (
    <div
      style={{
        background: "white",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,.15)",
        marginTop: 30,
      }}
    >
      <h2>Groundwater Trends</h2>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="time" />

          <YAxis />

          <Tooltip />

          <Legend />

          <Line
            type="monotone"
            dataKey="depth"
            stroke="#1976d2"
            strokeWidth={3}
            dot={false}
            name="Depth"
          />

          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
            name="Temperature"
          />

          <Line
            type="monotone"
            dataKey="ph"
            stroke="#16a34a"
            strokeWidth={2}
            dot={false}
            name="pH"
          />

          <Line
            type="monotone"
            dataKey="tds"
            stroke="#9333ea"
            strokeWidth={2}
            dot={false}
            name="TDS"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DepthChart;