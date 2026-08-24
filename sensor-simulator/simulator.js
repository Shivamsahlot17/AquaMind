const axios = require("axios");

const API_URL = "http://localhost:3000/api/readings";

const stationCode = "GW001";

const deviceId = "AQM-0001";
const deviceKey =
  "4200f8591a79d7d03f7ef6238dc1bb14730b84a90c75f0288a74ae5734810efe";

function generateReading() {
  const depth = Number((45 + Math.random() * 20).toFixed(2));
  const temperature = Number((24 + Math.random() * 8).toFixed(2));
  const ph = Number((6 + Math.random() * 3).toFixed(2));
  const tds = Math.floor(250 + Math.random() * 1000);

  return {
    stationCode,
    depth,
    temperature,
    ph,
    tds
  };
}

async function sendReading() {
  const reading = generateReading();

  try {
    const response = await axios.post(
  API_URL,
  reading,
  {
    headers: {
      "x-device-id": deviceId,
      "x-device-key": deviceKey
    }
  }
);

    console.log("Reading sent successfully:");
    console.log(reading);

    console.log("Backend response:", response.data);
    console.log("--------------------------------");
  } catch (error) {
    console.error(
      "Failed to send reading:",
      error.response?.data || error.message
    );
  }
}

sendReading();

setInterval(sendReading, 5000);