import type { User } from "@/types";
import { apiClient } from "./client";

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface LoginInput {
  identifier: string;
  password: string;
}

export interface RegisterInput {
  display_name: string;
  username: string;
  email: string;
  birth_date: string;
  password: string;
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/sign-in", input);

  return response.data;
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/sign-up", input);

  return response.data;
}
