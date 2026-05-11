import type { z } from "zod";
import type {
  TaskStatusSchema,
  CreateTaskSchema,
  UpdateTaskSchema,
  MoveTaskSchema,
} from "../schemas/task.schema";
import type { CreateTeamSchema, UpdateTeamSchema } from "../schemas/team.schema";
import type { CreateProjectSchema, UpdateProjectSchema } from "../schemas/project.schema";

export type TaskStatus = z.infer<typeof TaskStatusSchema>;
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type MoveTaskInput = z.infer<typeof MoveTaskSchema>;
export type CreateTeamInput = z.infer<typeof CreateTeamSchema>;
export type UpdateTeamInput = z.infer<typeof UpdateTeamSchema>;
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  order: number;
  projectId?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  name: string;
  teamId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}
