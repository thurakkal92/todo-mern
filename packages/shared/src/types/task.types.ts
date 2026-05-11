import type { z } from "zod";
import type {
  TaskStatusSchema,
  CreateTaskSchema,
  UpdateTaskSchema,
  MoveTaskSchema,
} from "../schemas/task.schema";

export type TaskStatus = z.infer<typeof TaskStatusSchema>;
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type MoveTaskInput = z.infer<typeof MoveTaskSchema>;

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  order: number;
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
