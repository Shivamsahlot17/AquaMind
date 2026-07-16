import express from "express";
import cors from "cors";
import readingRoutes from "./routes/reading.routes";

import stationRoutes from "./routes/station.routes";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/stations", stationRoutes);
app.use("/api/readings", readingRoutes);

export default app;