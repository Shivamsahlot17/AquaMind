import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

type Props = {
  children: ReactNode;
};

function Layout({ children }: Props) {
  const location = useLocation();

  return (
    <>
      <Navbar />

      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          background: "#eef5f9",
        }}
      >
        <aside
          style={{
            width: "240px",
            background: "#0f4c81",
            color: "white",
            padding: "20px",
          }}
        >
          <h2>AquaMind</h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              marginTop: "30px",
            }}
          >
            <Link
              to="/dashboard/GW001"
              style={getLinkStyle(location.pathname.startsWith("/dashboard"))}
            >
              🏠 Dashboard
            </Link>

            <Link
              to="/stations"
              style={getLinkStyle(location.pathname === "/stations")}
            >
              📍 Stations
            </Link>

            <Link
              to="/alerts"
              style={getLinkStyle(location.pathname === "/alerts")}
            >
              🚨 Alerts
            </Link>

            <Link
              to="/reports"
              style={getLinkStyle(location.pathname === "/reports")}
            >
              📄 Reports
            </Link>

            <Link
              to="/settings"
              style={getLinkStyle(location.pathname === "/settings")}
            >
              ⚙️ Settings
            </Link>

            <Link
              to="/users"
              style={getLinkStyle(location.pathname === "/users")}
            >
              👥 Users
            </Link>
          </div>
        </aside>

        <main
          style={{
            flex: 1,
            padding: "30px",
          }}
        >
          {children}
        </main>
      </div>
    </>
  );
}

function getLinkStyle(active: boolean) {
  return {
    color: "white",
    textDecoration: "none",
    fontSize: "17px",
    padding: "12px 16px",
    borderRadius: "8px",
    background: active ? "#1b6ca8" : "transparent",
    transition: "0.2s",
    fontWeight: active ? "bold" : "normal",
  };
}

export default Layout;
