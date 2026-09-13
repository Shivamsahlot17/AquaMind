import { Router } from "express";

import {
  getUsers,
  createUser,
  updateUserRole,
  deleteUser,
} from "../controllers/user.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/", getUsers);

router.post("/", createUser);

router.patch("/:id/role", updateUserRole);

router.delete("/:id", deleteUser);

export default router;