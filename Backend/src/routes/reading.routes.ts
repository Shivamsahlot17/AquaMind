import { Router } from "express";
import { getRecentReadings } from "../controllers/reading.controller";
import {
  createReading,
  getLatestReading,
} from "../controllers/reading.controller";

const router = Router();

router.get("/latest", getLatestReading);

router.post("/", createReading);
router.get("/history", getRecentReadings);

export default router;