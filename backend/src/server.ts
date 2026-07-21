import app from "./app";
import { env } from "./config/env";

const startServer = () => {
  app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
    console.log(`Environment: ${env.NODE_ENV}`);
    console.log(`Health check: http://localhost:${env.PORT}/api/health`);
  });
};

startServer();
