import { Status, Priority } from "@prisma/client";
import prisma from "../config/prisma";

export const getDashboardStats = async (userId: string) => {
  const now = new Date();

  // Run all count queries concurrently for optimal performance
  const [
    totalTasks,
    pendingTasks,
    inProgressTasks,
    completedTasks,
    highPriorityTasks,
    mediumPriorityTasks,
    lowPriorityTasks,
    overdueTasks,
  ] = await Promise.all([
    // Total tasks count
    prisma.task.count({ where: { userId } }),

    // Status counts
    prisma.task.count({ where: { userId, status: Status.PENDING } }),
    prisma.task.count({ where: { userId, status: Status.IN_PROGRESS } }),
    prisma.task.count({ where: { userId, status: Status.COMPLETED } }),

    // Priority counts
    prisma.task.count({ where: { userId, priority: Priority.HIGH } }),
    prisma.task.count({ where: { userId, priority: Priority.MEDIUM } }),
    prisma.task.count({ where: { userId, priority: Priority.LOW } }),

    // Overdue tasks count: dueDate < now AND status != COMPLETED
    prisma.task.count({
      where: {
        userId,
        dueDate: { lt: now },
        status: { not: Status.COMPLETED },
      },
    }),
  ]);

  return {
    totalTasks,
    pendingTasks,
    inProgressTasks,
    completedTasks,
    highPriorityTasks,
    mediumPriorityTasks,
    lowPriorityTasks,
    overdueTasks,
  };
};
