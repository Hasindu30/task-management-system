import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import * as taskService from "../services/task.service";
import { apiResponse } from "../utils/api-response";
import { ApiError } from "../utils/api-error";
import { getTasksQuerySchema } from "../schemas/task.schema";

export const createTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, "Authentication required");
    }

    const task = await taskService.createTask(userId, req.body);
    res.status(201).json(
      apiResponse({
        success: true,
        message: "Task created successfully",
        data: { task },
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, "Authentication required");
    }

    const query = getTasksQuerySchema.parse(req.query);
    const result = await taskService.getTasks(userId, query);

    res.status(200).json(
      apiResponse({
        success: true,
        message: "Tasks retrieved successfully",
        data: result,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, "Authentication required");
    }

    const taskId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const task = await taskService.getTaskById(userId, taskId);

    res.status(200).json(
      apiResponse({
        success: true,
        message: "Task retrieved successfully",
        data: { task },
      })
    );
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, "Authentication required");
    }

    const taskId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updatedTask = await taskService.updateTask(userId, taskId, req.body);

    res.status(200).json(
      apiResponse({
        success: true,
        message: "Task updated successfully",
        data: { task: updatedTask },
      })
    );
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, "Authentication required");
    }

    const taskId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await taskService.deleteTask(userId, taskId);

    res.status(200).json(
      apiResponse({
        success: true,
        message: "Task deleted successfully",
      })
    );
  } catch (error) {
    next(error);
  }
};
