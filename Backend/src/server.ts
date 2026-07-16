import app from "./app";
import { startSensorSimulator } from "./jobs/sensorSimulator";

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    startSensorSimulator();
});