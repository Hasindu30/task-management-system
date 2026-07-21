import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { authenticate } from "../middleware/auth.middleware";
import { loginSchema } from "../schemas/auth.schema";

const router = Router();

// POST /api/auth/login
router.post("/login", validate(loginSchema), authController.login);

// GET /api/auth/me 
router.get("/me", authenticate, authController.getMe);

export default router;
