import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import * as authService from "../services/auth.service";
import { apiResponse } from "../utils/api-response";
import { ApiError } from "../utils/api-error";

export const login = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.loginUser(req.body);
    res.status(200).json(
      apiResponse({
        success: true,
        message: "Login successful",
        data: result,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      throw new ApiError(401, "Authentication required");
    }

    const user = await authService.getCurrentUser(req.user.userId);
    res.status(200).json(
      apiResponse({
        success: true,
        message: "Current user profile retrieved successfully",
        data: { user },
      })
    );
  } catch (error) {
    next(error);
  }
};
