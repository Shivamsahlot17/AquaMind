import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import { getRecentReadings } from "../services/readingService";

type Reading = {
  id: string;
  depth: number;
  temperature: number;
  ph: number;
  tds: number;
  waterQuality: string;
  createdAt: string;
  station?: {
    code: string;
    name: string;
  };
};

function Reports() {
  const [readings, setReadings] = useState<Reading[]>([]);

  useEffect(() => {
    loadReadings();
  }, []);

  async function loadReadings() {
    try {
      const data = await getRecentReadings();
      setReadings(data);
    } catch (err) {
      console.error(err);
    }
  }

  function exportCSV() {
    if (readings.length === 0) {
      alert("No data available.");
      return;
    }

    const headers = [
      "Station",
      "Depth (m)",
      "Temperature (°C)",
      "pH",
      "TDS",
      "Water Quality",
      "Date",
    ];

    const rows = readings.map((r) => [
      r.station?.code ?? "N/A",
      r.depth,
      r.temperature,
      r.ph,
      r.tds,
      r.waterQuality,
      new Date(r.createdAt).toLocaleString(),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "groundwater_report.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  function exportPDF() {
    window.print();
  }

  return (
    <Layout>
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <h1>📄 Reports</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 20,
            marginTop: 30,
          }}
        >
          <div
            style={{
              background: "white",
              padding: 24,
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,.15)",
            }}
          >
            <h2>CSV Report</h2>

            <p>
              Export all available groundwater readings as a CSV file.
            </p>

            <button
              onClick={exportCSV}
              style={{
                marginTop: 15,
                padding: "10px 20px",
                border: "none",
                borderRadius: 8,
                background: "#0f4c81",
                color: "white",
                cursor: "pointer",
              }}
            >
              Export CSV
            </button>
          </div>

          <div
            style={{
              background: "white",
              padding: 24,
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,.15)",
            }}
          >
            <h2>Printable Report</h2>

            <p>
              Generate a printable report using your browser's print dialog.
            </p>

            <button
              onClick={exportPDF}
              style={{
                marginTop: 15,
                padding: "10px 20px",
                border: "none",
                borderRadius: 8,
                background: "#0f4c81",
                color: "white",
                cursor: "pointer",
              }}
            >
              Print / Save as PDF
            </button>
          </div>

          <div
            style={{
              background: "white",
              padding: 24,
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,.15)",
            }}
          >
            <h2>Summary</h2>

            <p>
              Total Readings
            </p>

            <h1>{readings.length}</h1>
          </div>
        </div>

        <div
          style={{
            marginTop: 40,
            background: "white",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 2px 8px rgba(0,0,0,.15)",
          }}
        >
          <h2>Latest Readings</h2>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: 20,
            }}
          >
            <thead>
              <tr>
                <th>Station</th>
                <th>Depth</th>
                <th>Temp</th>
                <th>pH</th>
                <th>TDS</th>
                <th>Quality</th>
              </tr>
            </thead>

            <tbody>
              {readings.map((r) => (
                <tr key={r.id}>
                  <td>{r.station?.code ?? "-"}</td>
                  <td>{r.depth}</td>
                  <td>{r.temperature}</td>
                  <td>{r.ph}</td>
                  <td>{r.tds}</td>
                  <td>{r.waterQuality}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default Reports;