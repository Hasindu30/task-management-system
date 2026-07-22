import api from "./api";
import type { TaskListParams, TaskListData, Task, ApiResponse } from "../types";

// ─── Fetch ───────────────────────────────────────────────────────────────────

export const getTasks = async (params?: TaskListParams): Promise<TaskListData> => {
  const queryParams: Record<string, string | number> = {};

  if (params) {
    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;
    if (params.status && params.status !== "ALL") queryParams.status = params.status;
    if (params.priority && params.priority !== "ALL") queryParams.priority = params.priority;
    if (params.search && params.search.trim() !== "") queryParams.search = params.search.trim();
    if (params.sortBy) queryParams.sortBy = params.sortBy;
    if (params.order) queryParams.order = params.order;
  }

  const response = await api.get<ApiResponse<TaskListData>>("/tasks", { params: queryParams });
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || "Failed to fetch tasks");
  }
  return response.data.data;
};



export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  dueDate?: string;
}

export const createTask = async (payload: CreateTaskPayload): Promise<Task> => {
  const response = await api.post<ApiResponse<{ task: Task }>>("/tasks", payload);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || "Failed to create task");
  }
  return response.data.data.task;
};



export type UpdateTaskPayload = Partial<CreateTaskPayload>;

export const updateTask = async (id: string, payload: UpdateTaskPayload): Promise<Task> => {
  const response = await api.put<ApiResponse<{ task: Task }>>(`/tasks/${id}`, payload);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || "Failed to update task");
  }
  return response.data.data.task;
};


export const deleteTask = async (id: string): Promise<void> => {
  const response = await api.delete<ApiResponse<null>>(`/tasks/${id}`);
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to delete task");
  }
};
