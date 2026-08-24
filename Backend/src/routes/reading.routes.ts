import { Router } from "express";
import {
  createReading,
  getLatestReading,
  getRecentReadings,
  getAlerts,
} from "../controllers/reading.controller";

import { authenticateSensor } from "../middleware/sensorAuth.middleware";

const router = Router();

router.get("/latest", getLatestReading);
router.get("/history", getRecentReadings);
router.get("/alerts", getAlerts);

router.post(
  "/",
  authenticateSensor,
  createReading
);

export default router;