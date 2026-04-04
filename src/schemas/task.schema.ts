import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  categoryName: z.string().min(1, "category is required"),
  dueDate: z.coerce.date(),
});

export const markCompleteSchema = z.object({
  taskId: z.string().min(1, "taskId is required"),
});

export const deleteTaskSchema = z.object({
  taskId: z.string().min(1, "taskId is required"),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  dueDate: z.coerce.date().optional(),
  categoryId: z.string().optional(),
  isCompleted: z.boolean().optional(),
});
