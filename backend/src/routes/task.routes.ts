import { Router } from "express";
import * as taskController from "../controllers/task.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createTaskSchema } from "../schemas/task.schema";

const router = Router();

// Protect all task endpoints with JWT authentication middleware
router.use(authenticate);

// POST /api/tasks - Create task
router.post("/", validate(createTaskSchema), taskController.createTask);

// GET /api/tasks - Get all tasks (supports ?page=1&limit=10&status=PENDING)
router.get("/", taskController.getTasks);

// GET /api/tasks/:id - Get task by ID
router.get("/:id", taskController.getTaskById);

export default router;
