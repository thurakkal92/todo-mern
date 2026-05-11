import type { CreateProjectInput, UpdateProjectInput } from "@todo/shared";
import { ProjectModel } from "../models/project.model";
import type { IProject } from "../models/project.model";

export const projectService = {
  async getAll(): Promise<IProject[]> {
    return ProjectModel.find().sort({ teamId: 1, createdAt: 1 });
  },

  async create(input: CreateProjectInput): Promise<IProject> {
    return ProjectModel.create(input);
  },

  async rename(id: string, input: UpdateProjectInput): Promise<IProject | null> {
    return ProjectModel.findByIdAndUpdate(
      id,
      { name: input.name },
      { new: true, runValidators: true },
    );
  },

  async remove(id: string): Promise<void> {
    await ProjectModel.findByIdAndDelete(id);
  },
};
