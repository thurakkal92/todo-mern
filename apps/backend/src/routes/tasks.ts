import { Router } from "express";
import { CreateTaskSchema, UpdateTaskSchema, MoveTaskSchema } from "@todo/shared";
import { validate } from "../middleware/validate";
import { taskController } from "../controllers/task.controller";

export const tasksRouter = Router();

tasksRouter.get("/", taskController.getAll);
tasksRouter.post("/", validate(CreateTaskSchema), taskController.create);
tasksRouter.patch("/:id/move", validate(MoveTaskSchema), taskController.move);
tasksRouter.patch("/:id", validate(UpdateTaskSchema), taskController.update);
tasksRouter.delete("/:id", taskController.remove);
