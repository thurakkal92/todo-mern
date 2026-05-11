import { z } from "zod";

export const TaskStatusSchema = z.enum(["todo", "in-progress", "done"]);

export const CreateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or fewer"),
  description: z.string().max(500, "Description must be 500 characters or fewer").optional(),
  status: TaskStatusSchema.default("todo"),
  dueDate: z.string().optional(),
  projectId: z.string().optional(),
});

export const UpdateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or fewer")
    .optional(),
  description: z.string().max(500, "Description must be 500 characters or fewer").optional(),
  dueDate: z.string().optional(),
});

export const MoveTaskSchema = z.object({
  status: TaskStatusSchema,
  order: z.number().finite(),
});

export const PatchTaskSchema = z.union([UpdateTaskSchema, MoveTaskSchema]);
