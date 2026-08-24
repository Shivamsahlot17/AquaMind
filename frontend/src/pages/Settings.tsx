import Layout from "../layout/Layout";

function Settings() {
  return (
    <Layout>
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <h1>⚙️ Settings</h1>

        <div
          style={{
            marginTop: 30,
            background: "white",
            padding: 25,
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,.15)",
          }}
        >
          <h2>Application Settings</h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              marginTop: 20,
            }}
          >
            <label>
              <input type="checkbox" defaultChecked /> Enable Email Alerts
            </label>

            <label>
              <input type="checkbox" defaultChecked /> Enable SMS Alerts
            </label>

            <label>
              <input type="checkbox" defaultChecked /> Auto Refresh Dashboard
            </label>

            <label>
              <input type="checkbox" /> Dark Mode
            </label>

            <button
              style={{
                width: "200px",
                padding: "10px",
                border: "none",
                borderRadius: 8,
                background: "#0f4c81",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Settings;