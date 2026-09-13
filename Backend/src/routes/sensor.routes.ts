import { Router } from "express";

import {
  registerSensor,
  getSensors,
  getSensorById,
  updateSensor,
  deleteSensor,
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

// ADMIN, ENGINEER and VIEWER can view a specific sensor
router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "ENGINEER", "VIEWER"),
  getSensorById
);

// Only ADMIN can update sensors
router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateSensor
);

// Only ADMIN can delete sensors
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteSensor
);

export default router;