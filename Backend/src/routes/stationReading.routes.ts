import { Router } from "express";
import {
  getLatestReadingByStation,
  getHistoryByStation,
} from "../controllers/stationReading.controller";

const router = Router();

router.get("/:code/latest", getLatestReadingByStation);

router.get("/:code/history", getHistoryByStation);

export default router;