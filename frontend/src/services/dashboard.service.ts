import api from "./api";
import type { DashboardStats, ApiResponse } from "../types";

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get<ApiResponse<DashboardStats>>("/dashboard/stats");
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || "Failed to fetch dashboard statistics");
  }
  return response.data.data;
};
