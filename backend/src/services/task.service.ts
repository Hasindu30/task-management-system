import prisma from "../config/prisma";
import { CreateTaskInput, GetTasksQuery } from "../schemas/task.schema";
import { ApiError } from "../utils/api-error";

export const createTask = async (userId: string, input: CreateTaskInput) => {
  const task = await prisma.task.create({
    data: {
      title: input.title,
      description: input.description ?? null,
      priority: input.priority,
      status: input.status,
      dueDate: input.dueDate,
      userId,
    },
  });

  return task;
};

export const getTasks = async (userId: string, query: GetTasksQuery) => {
  const { page, limit, status } = query;
  const skip = (page - 1) * limit;

  const whereClause: { userId: string; status?: GetTasksQuery["status"] } = {
    userId,
  };

  if (status) {
    whereClause.status = status;
  }

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.task.count({
      where: whereClause,
    }),
  ]);

  const pages = Math.ceil(total / limit) || 1;

  return {
    tasks,
    pagination: {
      page,
      limit,
      total,
      pages,
    },
  };
};

export const getTaskById = async (userId: string, taskId: string) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId, // User isolation: ensures user cannot access another user's task
    },
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return task;
};
