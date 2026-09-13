import { Router } from "express";

import {
  createReading,
  getLatestReading,
  getRecentReadings,
  getAlerts,
  getLatestReadingByStation,
  getRecentReadingsByStation,
} from "../controllers/reading.controller";

import { authenticateSensor } from "../middleware/sensorAuth.middleware";

const router = Router();

router.get("/latest", getLatestReading);

router.get("/history", getRecentReadings);

router.get("/alerts", getAlerts);

router.get(
  "/latest/:stationCode",
  getLatestReadingByStation
);

router.get(
  "/history/:stationCode",
  getRecentReadingsByStation
);

router.post(
  "/",
  authenticateSensor,
  createReading
);

export default router;