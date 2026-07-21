

type Reading = {
  createdAt: string;
  depth: number;
  temperature: number;
  ph: number;
  tds: number;
  waterQuality: string;
};
import type { Reading } from "../types/reading";
type Props = {
  data: Reading[];
};

function RecentReadingsTable({ data }: Props) {
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
      <h2>Recent Readings</h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Time</th>
            <th>Depth</th>
            <th>Temperature</th>
            <th>pH</th>
            <th>TDS</th>
            <th>Quality</th>
          </tr>
        </thead>

        <tbody>
          {data
            .slice()
            .reverse()
            .map((reading, index) => (
              <tr key={index}>
                <td>
                  {new Date(reading.createdAt).toLocaleTimeString()}
                </td>

                <td>{reading.depth} m</td>

                <td>{reading.temperature} °C</td>

                <td>{reading.ph}</td>

                <td>{reading.tds} ppm</td>

                <td>{reading.waterQuality}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default RecentReadingsTable;