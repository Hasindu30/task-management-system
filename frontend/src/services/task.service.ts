import api from "./api";
import type { TaskListParams, TaskListData, ApiResponse } from "../types";

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

  const response = await api.get<ApiResponse<TaskListData>>("/tasks", {
    params: queryParams,
  });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || "Failed to fetch tasks");
  }

  return response.data.data;
};
