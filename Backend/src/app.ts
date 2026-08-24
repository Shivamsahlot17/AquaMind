import express from "express";
import cors from "cors";

import stationRoutes from "./routes/station.routes";
import readingRoutes from "./routes/reading.routes";
import stationReadingRoutes from "./routes/stationReading.routes";
import authRoutes from "./routes/auth.routes";
import sensorRoutes from "./routes/sensor.routes";
import sensorDataRoutes from "./routes/sensorData.routes";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/stations", stationRoutes);
app.use("/api/readings", readingRoutes);
app.use("/api/station-readings", stationReadingRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/sensor-data", sensorDataRoutes);

export default app;