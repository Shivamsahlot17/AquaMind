import { Router } from "express";

import {
  getStations,
  createStation,
} from "../controllers/station.controller";

const router = Router();

router.get("/", getStations);

router.post("/", createStation);

export default router;