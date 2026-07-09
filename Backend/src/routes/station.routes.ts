import { Router } from "express";

import { getStations } from "../controllers/station.controller";

const router = Router();

router.get("/", getStations);

export default router;