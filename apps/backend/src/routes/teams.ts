import { Router } from "express";
import { CreateTeamSchema, UpdateTeamSchema } from "@todo/shared";
import { validate } from "../middleware/validate";
import { teamController } from "../controllers/team.controller";

export const teamsRouter = Router();

teamsRouter.get("/", teamController.getAll);
teamsRouter.post("/", validate(CreateTeamSchema), teamController.create);
teamsRouter.patch("/:id", validate(UpdateTeamSchema), teamController.update);
teamsRouter.delete("/:id", teamController.remove);
