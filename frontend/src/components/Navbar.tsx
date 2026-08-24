import "../styles/navbar.css";

function Navbar() {
  const currentTime = new Date().toLocaleString();

  return (
    <nav className="navbar">
      <div>
        <h2 className="navbar-logo">🌊 AquaMind</h2>
        <p
          style={{
            margin: 0,
            color: "#dbeafe",
            fontSize: "13px",
          }}
        >
          Smart Groundwater Monitoring System
        </p>
      </div>

      <h3 className="navbar-title">
        Real-Time Groundwater Monitoring Dashboard
      </h3>

      <div
        style={{
          textAlign: "right",
        }}
      >
        <div className="navbar-status">🟢 ONLINE</div>

        <div
          style={{
            fontSize: "13px",
            color: "#dbeafe",
            marginTop: 6,
          }}
        >
          {currentTime}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;