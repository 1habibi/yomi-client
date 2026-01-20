import type { ApiError } from "@/common/types";
import { tokenStorage } from "@/common/utils/token-storage";
import type { AuthResponse } from "@/modules/auth/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

let refreshTokenPromise: Promise<boolean> | null = null;

export const customInstance = async <T>({
  url,
  method,
  headers,
  params,
  data,
  ...config
}: {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  data?: unknown;
  [key: string]: unknown;
}): Promise<T> => {
  let finalUrl = `${API_BASE_URL}${url}`;
  if (params && method === "GET") {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    finalUrl += `?${searchParams.toString()}`;
  }

  const requestConfig: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include",
    ...config,
  };

  const token = tokenStorage.getAccessToken();
  if (token) {
    requestConfig.headers = {
      ...requestConfig.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  if (data && method !== "GET") {
    requestConfig.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(finalUrl, requestConfig);

    if (
      response.status === 401 &&
      url !== "/auth/refresh" &&
      url !== "/auth/login"
    ) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        const newToken = tokenStorage.getAccessToken();
        if (newToken) {
          requestConfig.headers = {
            ...requestConfig.headers,
            Authorization: `Bearer ${newToken}`,
          };
          const retryResponse = await fetch(finalUrl, requestConfig);
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
    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      "statusCode" in error
    ) {
      throw error;
    }
    throw {
      message: error instanceof Error ? error.message : "Unknown error",
      statusCode: 0,
    };
  }
};

async function tryRefreshToken(): Promise<boolean> {
  if (refreshTokenPromise) {
    return refreshTokenPromise;
  }

  refreshTokenPromise = (async () => {
    try {
      const response = await customInstance<AuthResponse>({
        url: "/auth/refresh",
        method: "POST",
        data: { userAgent: navigator.userAgent },
      });
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
