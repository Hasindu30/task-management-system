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

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title cannot be empty" })
    .max(100, { message: "Title cannot exceed 100 characters" })
    .optional(),
  description: z
    .string()
    .max(500, { message: "Description cannot exceed 500 characters" })
    .optional()
    .nullable(),
  priority: z
    .nativeEnum(Priority, { message: "Priority must be LOW, MEDIUM, or HIGH" })
    .optional(),
  status: z
    .nativeEnum(Status, { message: "Status must be PENDING, IN_PROGRESS, or COMPLETED" })
    .optional(),
  dueDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Due date must be a valid date string",
    })
    .transform((val) => new Date(val))
    .optional(),
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
  priority: z.nativeEnum(Priority).optional(),
  search: z.string().optional(),
  startDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "startDate must be a valid date string",
    })
    .transform((val) => (val ? new Date(val) : undefined)),
  endDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "endDate must be a valid date string",
    })
    .transform((val) => (val ? new Date(val) : undefined)),
  sortBy: z.enum(["createdAt", "updatedAt", "dueDate"]).optional().default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type GetTasksQuery = z.infer<typeof getTasksQuerySchema>;
