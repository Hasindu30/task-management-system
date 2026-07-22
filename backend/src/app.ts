import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { apiResponse } from "./utils/api-response";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

const app = express();

// Security headers
app.use(helmet());

// Configure allowed CORS origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  ...env.CLIENT_URL.split(",").map((url) => url.trim()),
  ...env.CORS_ORIGIN.split(",").map((url) => url.trim()),
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman, health checks)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Request logging (simplified format in production)
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

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
import taskRoutes from "./routes/task.routes";
import dashboardRoutes from "./routes/dashboard.routes";

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Error handler (must be last middleware)
app.use(errorHandler);

export default app;
