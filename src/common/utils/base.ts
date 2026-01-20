import { tokenStorage } from "@/common/utils/token-storage";
import type { AuthResponse } from "@/modules/auth/types";

import type { ApiError } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

let refreshTokenPromise: Promise<boolean> | null = null;

// Универсальная функция для выполнения HTTP запросов
export async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  includeCredentials: boolean = true,
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: includeCredentials ? "include" : "omit",
    ...options,
  };

  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, config);
    if (
      response.status === 401 &&
      endpoint !== "/auth/refresh" &&
      endpoint !== "/auth/login"
    ) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        const newToken = tokenStorage.getAccessToken();
        if (newToken) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${newToken}`,
          };
          const retryResponse = await fetch(url, config);
          if (retryResponse.ok) {
            return await retryResponse.json();
          }
        }
      }
    }
    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        message: "Network error",
        statusCode: response.status,
      }));
      throw errorData;
    }
    return await response.json();
  } catch (error) {
    throw error instanceof Error
      ? { message: error.message, statusCode: 0 }
      : error;
  }
}

async function tryRefreshToken(): Promise<boolean> {
  if (refreshTokenPromise) {
    return refreshTokenPromise;
  }

  refreshTokenPromise = (async () => {
    try {
      const response = await request<AuthResponse>(
        "/auth/refresh",
        {
          method: "POST",
          body: JSON.stringify({ userAgent: navigator.userAgent }),
        },
        true,
      );
      tokenStorage.setAccessToken(response.accessToken);
      return true;
    } catch {
      tokenStorage.removeAccessToken();
      return false;
    } finally {
      refreshTokenPromise = null;
    }
  })();

  return refreshTokenPromise;
}
