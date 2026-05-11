import { Router } from "express";
import { CreateProjectSchema, UpdateProjectSchema } from "@todo/shared";
import { validate } from "../middleware/validate";
import { projectController } from "../controllers/project.controller";

export const projectsRouter = Router();

projectsRouter.get("/", projectController.getAll);
projectsRouter.post("/", validate(CreateProjectSchema), projectController.create);
projectsRouter.patch("/:id", validate(UpdateProjectSchema), projectController.update);
projectsRouter.delete("/:id", projectController.remove);
