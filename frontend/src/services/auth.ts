import api from "./api";
import type { User, ApiResponse } from "../types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthData {
  user: User;
  token: string;
}

export const loginApi = async (credentials: LoginCredentials): Promise<AuthData> => {
  const response = await api.post<ApiResponse<AuthData>>("/auth/login", credentials);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || "Login failed");
  }
  return response.data.data;
};

export const getMeApi = async (): Promise<User> => {
  const response = await api.get<ApiResponse<{ user: User }>>("/auth/me");
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || "Failed to fetch user");
  }
  return response.data.data.user;
};
