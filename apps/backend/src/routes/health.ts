import { Router } from "express";
import mongoose from "mongoose";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    db:
      mongoose.connection.readyState === mongoose.ConnectionStates.connected
        ? "connected"
        : "disconnected",
  });
});
