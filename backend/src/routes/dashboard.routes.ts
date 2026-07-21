import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Protect dashboard route with JWT authentication middleware
router.use(authenticate);

// GET /api/dashboard/stats
router.get("/stats", dashboardController.getStats);

export default router;
