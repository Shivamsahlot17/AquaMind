import { Router } from "express";

import {
  registerSensor,
  getSensors,
} from "../controllers/sensor.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

// Only ADMIN can register sensors
router.post(
  "/register",
  authenticate,
  authorize("ADMIN"),
  registerSensor
);

// ADMIN, ENGINEER and VIEWER can view sensors
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "ENGINEER", "VIEWER"),
  getSensors
);

export default router;