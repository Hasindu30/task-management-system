import { z } from "zod";
import { Priority, Status } from "@prisma/client";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title cannot exceed 100 characters" }),
  description: z
    .string()
    .max(500, { message: "Description cannot exceed 500 characters" })
    .optional()
    .nullable(),
  priority: z
    .nativeEnum(Priority, { message: "Priority must be LOW, MEDIUM, or HIGH" })
    .optional()
    .default(Priority.MEDIUM),
  status: z
    .nativeEnum(Status, { message: "Status must be PENDING, IN_PROGRESS, or COMPLETED" })
    .optional()
    .default(Status.PENDING),
  dueDate: z
    .string()
    .min(1, { message: "Due date is required" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Due date must be a valid date string",
    })
    .transform((val) => new Date(val)),
});

export const getTasksQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(1, parseInt(val, 10) || 1) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(100, Math.max(1, parseInt(val, 10) || 10)) : 10)),
  status: z.nativeEnum(Status).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type GetTasksQuery = z.infer<typeof getTasksQuerySchema>;
