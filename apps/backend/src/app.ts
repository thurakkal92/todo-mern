import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/health";
import { tasksRouter } from "./routes/tasks";
import { errorMiddleware } from "./middleware/error";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/health", healthRouter);
  app.use("/api/tasks", tasksRouter);

  app.use(errorMiddleware);

  return app;
}
