import type { Request, Response, NextFunction } from "express";
import type { CreateTaskInput, UpdateTaskInput, MoveTaskInput } from "@todo/shared";
import { taskService } from "../services/task.service";

export const taskController = {
  getAll: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const projectId =
        typeof req.query["projectId"] === "string" ? req.query["projectId"] : undefined;
      const tasks = await taskService.getAll(projectId);
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  },

  create: async (
    req: Request<Record<string, never>, unknown, CreateTaskInput>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const task = await taskService.create(req.body);
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  },

  update: async (
    req: Request<{ id: string }, unknown, UpdateTaskInput>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const task = await taskService.update(req.params.id, req.body);
      res.json(task);
    } catch (err) {
      next(err);
    }
  },

  move: async (
    req: Request<{ id: string }, unknown, MoveTaskInput>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const task = await taskService.move(req.params.id, req.body);
      res.json(task);
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
      await taskService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
