import express from "express";
import cors from "cors";

import stationRoutes from "./routes/station.routes";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/stations", stationRoutes);

export default app;