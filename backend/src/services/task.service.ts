import { Prisma } from "@prisma/client";
import prisma from "../config/prisma";
import { CreateTaskInput, UpdateTaskInput, GetTasksQuery } from "../schemas/task.schema";
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
  const { page, limit, status, priority, search, startDate, endDate, sortBy, order } = query;
  const skip = (page - 1) * limit;

  // Build Prisma where clause with user isolation
  const whereClause: Prisma.TaskWhereInput = {
    userId,
  };

  if (status) {
    whereClause.status = status;
  }

  if (priority) {
    whereClause.priority = priority;
  }

  // Case-insensitive search on title OR description
  if (search && search.trim() !== "") {
    const searchTerm = search.trim();
    whereClause.OR = [
      { title: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  // Due date range filtering
  if (startDate || endDate) {
    whereClause.dueDate = {};
    if (startDate) {
      whereClause.dueDate.gte = startDate;
    }
    if (endDate) {
      whereClause.dueDate.lte = endDate;
    }
  }

  // Execute database queries in parallel
  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: order,
      },
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
      userId, // User isolation
    },
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return task;
};

export const updateTask = async (userId: string, taskId: string, input: UpdateTaskInput) => {
  // First verify task exists and belongs to user
  await getTaskById(userId, taskId);

  const updatedTask = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: input,
  });

  return updatedTask;
};

export const deleteTask = async (userId: string, taskId: string) => {
  // First verify task exists and belongs to user
  await getTaskById(userId, taskId);

  await prisma.task.delete({
    where: {
      id: taskId,
    },
  });
};
