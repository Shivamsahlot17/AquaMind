import app from "./app";
import { startSensorSimulator } from "./jobs/sensorSimulator";
import { startSensorMonitor } from "./services/sensorMonitor";

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  startSensorMonitor();
});