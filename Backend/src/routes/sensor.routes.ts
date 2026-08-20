import { Router } from "express";

import {
  getStations,
  getStationByCode,
  createStation,
  updateStation,
} from "../controllers/station.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

// View all stations
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "ENGINEER", "VIEWER"),
  getStations
);

// View one station
router.get(
  "/:code",
  authenticate,
  authorize("ADMIN", "ENGINEER", "VIEWER"),
  getStationByCode
);

// Create station
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createStation
);

// Update station
router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateStation
);

export default router;