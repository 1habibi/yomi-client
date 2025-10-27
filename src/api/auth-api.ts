import type { User } from "@/components/auth-provider";
import { tokenStorage } from "@/lib/token-storage";
import { request } from "./base";

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export const authApi = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    tokenStorage.setAccessToken(response.accessToken);
    return response;
  },

  async logout(): Promise<void> {
    try {
      await request<void>("/auth/logout", { method: "POST" });
    } finally {
      tokenStorage.removeAccessToken();
    }
  },

  async confirmEmail(token: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/auth/confirm-email?token=${token}`);
  },

  async getProfile(): Promise<AuthResponse["user"]> {
    return request<AuthResponse["user"]>("/auth/profile");
  },
};
