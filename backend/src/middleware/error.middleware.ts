import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";
import { apiResponse } from "../utils/api-response";
import { env } from "../config/env";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Log error in development
  if (env.NODE_ENV === "development") {
    console.error("Error:", err);
  }

  // Handle known API errors
  if (err instanceof ApiError) {
    res.status(err.statusCode).json(
      apiResponse({
        success: false,
        message: err.message,
        errors: err.errors.length > 0 ? err.errors : undefined,
      })
    );
    return;
  }

  // Handle unknown errors
  res.status(500).json(
    apiResponse({
      success: false,
      message:
        env.NODE_ENV === "production"
          ? "Internal server error"
          : err.message || "Internal server error",
    })
  );
};

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json(
    apiResponse({
      success: false,
      message: "Route not found",
    })
  );
};
