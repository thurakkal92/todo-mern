import type { Request, Response, NextFunction } from "express";
import type { CreateTeamInput, UpdateTeamInput } from "@todo/shared";
import { teamService } from "../services/team.service";

export const teamController = {
  getAll: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const teams = await teamService.getAll();
      res.json(teams);
    } catch (err) {
      next(err);
    }
  },

  create: async (
    req: Request<Record<string, never>, unknown, CreateTeamInput>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const team = await teamService.create(req.body);
      res.status(201).json(team);
    } catch (err) {
      next(err);
    }
  },

  update: async (
    req: Request<{ id: string }, unknown, UpdateTeamInput>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const team = await teamService.rename(req.params.id, req.body);
      if (!team) {
        res.status(404).json({ error: { code: "NOT_FOUND", message: "Team not found" } });
        return;
      }
      res.json(team);
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
      await teamService.remove(req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },
};
