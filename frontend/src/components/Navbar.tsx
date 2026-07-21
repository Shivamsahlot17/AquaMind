function Navbar() {
  return (
    <nav
      style={{
        background: "#0f4c81",
        color: "white",
        padding: "18px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,.2)",
      }}
    >
      <h2 style={{ margin: 0 }}>
        🌊 AquaMind
      </h2>

      <h3 style={{ margin: 0 }}>
        Groundwater Monitoring Dashboard
      </h3>

      <div>
        <span
          style={{
            background: "#2e7d32",
            padding: "8px 14px",
            borderRadius: "20px",
            fontWeight: "bold",
          }}
        >
          🟢 ONLINE
        </span>
      </div>
    </nav>
  );
}

export default Navbar;