import type { Request, Response, NextFunction } from "express";
import type { CreateProjectInput, UpdateProjectInput } from "@todo/shared";
import { projectService } from "../services/project.service";

export const projectController = {
  getAll: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const projects = await projectService.getAll();
      res.json(projects);
    } catch (err) {
      next(err);
    }
  },

  create: async (
    req: Request<Record<string, never>, unknown, CreateProjectInput>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const project = await projectService.create(req.body);
      res.status(201).json(project);
    } catch (err) {
      next(err);
    }
  },

  update: async (
    req: Request<{ id: string }, unknown, UpdateProjectInput>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const project = await projectService.rename(req.params.id, req.body);
      if (!project) {
        res.status(404).json({ error: { code: "NOT_FOUND", message: "Project not found" } });
        return;
      }
      res.json(project);
    } catch (err) {
      next(err);
    }
  },

  remove: async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await projectService.remove(req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },
};
