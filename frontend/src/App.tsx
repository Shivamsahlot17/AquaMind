import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [reading, setReading] = useState<any>(null);

  useEffect(() => {

    fetchLatestReading();

    const interval = setInterval(() => {

        fetchLatestReading();

    }, 5000);

    return () => clearInterval(interval);

}, []);

  async function fetchLatestReading() {

    try {

      const response = await axios.get(
        "http://localhost:3000/api/readings/latest"
      );

      setReading(response.data);

    } catch (error) {

      console.log(error);

    }

  }

  if (!reading)
    return <h2>Loading...</h2>;

  return (

    <div
      style={{
        background: "#eef5f9",
        minHeight: "100vh",
        padding: 40,
        fontFamily: "Arial"
      }}
    >

      <h1
        style={{
          textAlign: "center",
          color: "#0f4c81"
        }}
      >
        AquaMind Dashboard
      </h1>

      <div
        style={{
          width: 500,
          margin: "40px auto",
          background: "white",
          padding: 30,
          borderRadius: 12,
          boxShadow: "0 0 10px rgba(0,0,0,.2)"
        }}
      >

        <h2>{reading.station.name}</h2>

        <hr />

        <p><b>Groundwater Depth :</b> {reading.depth} m</p>

        <p><b>Temperature :</b> {reading.temperature} °C</p>

        <p><b>pH :</b> {reading.ph}</p>

        <p><b>TDS :</b> {reading.tds} ppm</p>

        <p><b>Water Quality :</b> {reading.waterQuality}</p>

      </div>

    </div>

  );

}

export default App;