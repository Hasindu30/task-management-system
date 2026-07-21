import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import * as dashboardService from "../services/dashboard.service";
import { apiResponse } from "../utils/api-response";
import { ApiError } from "../utils/api-error";

export const getStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, "Authentication required");
    }

    const stats = await dashboardService.getDashboardStats(userId);

    res.status(200).json(
      apiResponse({
        success: true,
        message: "Dashboard statistics retrieved successfully",
        data: stats,
      })
    );
  } catch (error) {
    next(error);
  }
};
