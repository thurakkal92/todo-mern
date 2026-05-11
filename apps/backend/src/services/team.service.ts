import type { CreateTeamInput, UpdateTeamInput } from "@todo/shared";
import { TeamModel } from "../models/team.model";
import { ProjectModel } from "../models/project.model";
import type { ITeam } from "../models/team.model";

export const teamService = {
  async getAll(): Promise<ITeam[]> {
    return TeamModel.find().sort({ createdAt: 1 });
  },

  async create(input: CreateTeamInput): Promise<ITeam> {
    return TeamModel.create(input);
  },

  async rename(id: string, input: UpdateTeamInput): Promise<ITeam | null> {
    return TeamModel.findByIdAndUpdate(
      id,
      { name: input.name },
      { new: true, runValidators: true },
    );
  },

  async remove(id: string): Promise<void> {
    await TeamModel.findByIdAndDelete(id);
    await ProjectModel.deleteMany({ teamId: id });
  },
};
