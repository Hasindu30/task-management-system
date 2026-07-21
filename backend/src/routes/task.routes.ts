import { Router } from "express";
import * as taskController from "../controllers/task.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema";

const router = Router();

// Protect all task endpoints with JWT authentication middleware
router.use(authenticate);

// POST /api/tasks - Create task
router.post("/", validate(createTaskSchema), taskController.createTask);

// GET /api/tasks - Get all tasks (supports search, status, priority, date filtering, pagination, sorting)
router.get("/", taskController.getTasks);

// GET /api/tasks/:id - Get task by ID
router.get("/:id", taskController.getTaskById);

// PUT /api/tasks/:id - Update task (supports partial updates)
router.put("/:id", validate(updateTaskSchema), taskController.updateTask);

// DELETE /api/tasks/:id - Delete task
router.delete("/:id", taskController.deleteTask);

export default router;
