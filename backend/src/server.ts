import app from "./app";
import { env } from "./config/env";

const PORT = process.env.PORT || env.PORT || 5000;

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${env.NODE_ENV}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
};

startServer();
