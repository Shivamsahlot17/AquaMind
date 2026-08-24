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
        overflowX: "auto",
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
          <tr
            style={{
              background: "#0f4c81",
              color: "white",
            }}
          >
            <th style={{ padding: 10 }}>Time</th>
            <th style={{ padding: 10 }}>Depth (m)</th>
            <th style={{ padding: 10 }}>Temp (°C)</th>
            <th style={{ padding: 10 }}>pH</th>
            <th style={{ padding: 10 }}>TDS (ppm)</th>
            <th style={{ padding: 10 }}>Quality</th>
          </tr>
        </thead>

        <tbody>
          {[...data].reverse().map((reading, index) => (
            <tr
              key={index}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <td style={{ padding: 10 }}>
                {new Date(reading.createdAt).toLocaleString()}
              </td>

              <td>{reading.depth}</td>

              <td>{reading.temperature}</td>

              <td>{reading.ph}</td>

              <td>{reading.tds}</td>

              <td>
                <span
                  style={{
                    color:
                      reading.waterQuality === "GOOD"
                        ? "green"
                        : reading.waterQuality === "MODERATE"
                        ? "#f59e0b"
                        : "red",
                    fontWeight: "bold",
                  }}
                >
                  {reading.waterQuality}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RecentReadingsTable;