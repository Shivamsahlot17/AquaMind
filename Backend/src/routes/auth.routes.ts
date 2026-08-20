import { Router } from "express";
import { register, login, getMe } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get(
  "/me",
  authenticate,
  authorize("ADMIN"),
  getMe
);

export default router;