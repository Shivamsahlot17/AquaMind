import { Router } from "express";
import {
  createReading,
  getLatestReading,
} from "../controllers/reading.controller";

const router = Router();

router.get("/latest", getLatestReading);

router.post("/", createReading);

export default router;