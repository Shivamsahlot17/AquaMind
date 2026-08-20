import { Router } from "express";
import { receiveSensorData } from "../controllers/sensorData.controller";

const router = Router();

router.post("/", receiveSensorData);

export default router;