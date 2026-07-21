import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { apiResponse } from "./utils/api-response";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

// Request logging
app.use(morgan("dev"));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.status(200).json(
    apiResponse({
      success: true,
      message: "API is running",
    })
  );
});

// API Routes
import authRoutes from "./routes/auth.routes";
app.use("/api/auth", authRoutes);

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Error handler (must be last middleware)
app.use(errorHandler);

export default app;
