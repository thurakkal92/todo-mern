import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/health";
import { tasksRouter } from "./routes/tasks";
import { teamsRouter } from "./routes/teams";
import { projectsRouter } from "./routes/projects";
import { errorMiddleware } from "./middleware/error";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/health", healthRouter);
  app.use("/api/tasks", tasksRouter);
  app.use("/api/teams", teamsRouter);
  app.use("/api/projects", projectsRouter);

  app.use(errorMiddleware);

  return app;
}
