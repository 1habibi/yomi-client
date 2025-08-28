import { request, tokenStorage } from "./base";

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
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
    isEmailConfirmed: boolean;
  };
  accessToken: string;
}

interface SessionInfo {
  sessionId: string;
  userId: string;
  email: string;
  role: string;
  userAgent: string;
  ip?: string;
  loginTime: Date;
  lastActivity: Date;
}

// class ApiClient {
//   private baseURL: string;

//   constructor(baseURL: string) {
//     this.baseURL = baseURL;
//   }

//   private async request<T>(
//     endpoint: string,
//     options: RequestInit = {},
//     includeCredentials: boolean = true,
//   ): Promise<T> {
//     const url = `${this.baseURL}${endpoint}`;

//     const config: RequestInit = {
//       headers: {
//         "Content-Type": "application/json",
//         ...options.headers,
//       },
//       credentials: includeCredentials ? "include" : "omit", // Включаем cookies
//       ...options,
//     };

//     // Добавляем токен авторизации если есть
//     const token = this.getAccessToken();
//     if (token) {
//       config.headers = {
//         ...config.headers,
//         Authorization: `Bearer ${token}`,
//       };
//     }

//     try {
//       const response = await fetch(url, config);

//       // Если токен истек, пытаемся обновить его
//       if (
//         response.status === 401 &&
//         endpoint !== "/auth/refresh" &&
//         endpoint !== "/auth/login"
//       ) {
//         const refreshed = await this.tryRefreshToken();
//         if (refreshed) {
//           // Повторяем запрос с новым токеном
//           const newToken = this.getAccessToken();
//           if (newToken) {
//             config.headers = {
//               ...config.headers,
//               Authorization: `Bearer ${newToken}`,
//             };
//             const retryResponse = await fetch(url, config);
//             if (retryResponse.ok) {
//               return await retryResponse.json();
//             }
//           }
//         }
//       }

//       if (!response.ok) {
//         const errorData: ApiError = await response.json().catch(() => ({
//           message: "Network error",
//           statusCode: response.status,
//         }));
//         throw errorData;
//       }

//       return await response.json();
//     } catch (error) {
//       if (error instanceof Error) {
//         throw {
//           message: error.message,
//           statusCode: 0,
//         } as ApiError;
//       }
//       throw error;
//     }
//   }

//   // Получить access token из localStorage
//   private getAccessToken(): string | null {
//     return localStorage.getItem("accessToken");
//   }

//   // Сохранить access token
//   private setAccessToken(token: string): void {
//     localStorage.setItem("accessToken", token);
//   }

//   // Удалить access token
//   private removeAccessToken(): void {
//     localStorage.removeItem("accessToken");
//   }

//   // Попытка обновить токен
//   private async tryRefreshToken(): Promise<boolean> {
//     try {
//       // Backend теперь работает без sessionId, только с userAgent из refresh token cookie
//       const response = await this.request<AuthResponse>(
//         "/auth/refresh",
//         {
//           method: "POST",
//           body: JSON.stringify({ userAgent: navigator.userAgent }),
//         },
//         true,
//       );

//       this.setAccessToken(response.accessToken);
//       // Refresh token обновляется сервером через httpOnly cookie
//       return true;
//     } catch {
//       // Если не удалось обновить токен, очищаем access token
//       this.removeAccessToken();
//       return false;
//     }
//   }

//   // Очистить данные аутентификации (только access token)
//   // Cookies очищаются сервером при logout
//   private clearAuthData(): void {
//     this.removeAccessToken();
//   }

//   // Auth endpoints
//   async register(data: RegisterRequest): Promise<AuthResponse> {
//     return this.request<AuthResponse>("/auth/register", {
//       method: "POST",
//       body: JSON.stringify(data),
//     });
//   }

//   async login(data: LoginRequest): Promise<AuthResponse> {
//     const response = await this.request<AuthResponse>("/auth/login", {
//       method: "POST",
//       body: JSON.stringify(data),
//     });

//     // Сохраняем только access token
//     // Refresh token и sessionId устанавливаются сервером как cookies
//     this.setAccessToken(response.accessToken);

//     return response;
//   }

//   async logout(): Promise<void> {
//     try {
//       await this.request<void>("/auth/logout", {
//         method: "POST",
//       });
//     } finally {
//       // Очищаем данные независимо от результата запроса
//       this.clearAuthData();
//     }
//   }

//   async logoutAll(): Promise<void> {
//     try {
//       await this.request<void>("/auth/logout-all", {
//         method: "POST",
//       });
//     } finally {
//       // Очищаем данные независимо от результата запроса
//       this.clearAuthData();
//     }
//   }

//   async getProfile(): Promise<AuthResponse["user"]> {
//     return this.request<AuthResponse["user"]>("/auth/profile");
//   }

//   // Методы для работы с сессиями (если понадобятся в будущем)
//   async getSessions(): Promise<SessionInfo[]> {
//     return this.request<SessionInfo[]>("/auth/sessions");
//   }

//   async terminateSession(sessionId: string): Promise<void> {
//     return this.request<void>("/auth/sessions/terminate", {
//       method: "POST",
//       body: JSON.stringify({ sessionId }),
//     });
//   }

//   // Проверить аутентификацию
//   isAuthenticated(): boolean {
//     const token = this.getAccessToken();
//     // Поскольку мы убрали Redis сессии, проверяем только access token
//     return !!token;
//   }

//   // // Проверить аутентификацию
//   // async isAuthenticated(): Promise<boolean> {
//   //   try {
//   //     await this.getProfile();
//   //     return true;
//   //   } catch {
//   //     return false;
//   //   }
//   // }
// }

// export const apiClient = new ApiClient(API_BASE_URL);

// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// const getAccessToken = () => localStorage.getItem("accessToken");
// const setAccessToken = (token: string) =>
//   localStorage.setItem("accessToken", token);
// const removeAccessToken = () => localStorage.removeItem("accessToken");

// async function request<T>(
//   endpoint: string,
//   options: RequestInit = {},
//   includeCredentials: boolean = true,
// ): Promise<T> {
//   const url = `${API_BASE_URL}${endpoint}`;
//   const config: RequestInit = {
//     headers: {
//       "Content-Type": "application/json",
//       ...options.headers,
//     },
//     credentials: includeCredentials ? "include" : "omit",
//     ...options,
//   };

//   const token = getAccessToken();
//   if (token) {
//     config.headers = {
//       ...config.headers,
//       Authorization: `Bearer ${token}`,
//     };
//   }

//   // Логика рефреша токенов (аналогично вашему классу)
//   try {
//     const response = await fetch(url, config);
//     if (
//       response.status === 401 &&
//       endpoint !== "/auth/refresh" &&
//       endpoint !== "/auth/login"
//     ) {
//       const refreshed = await tryRefreshToken();
//       console.log("REFRESHD:", refreshed);
//       if (refreshed) {
//         const newToken = getAccessToken();
//         if (newToken) {
//           config.headers = {
//             ...config.headers,
//             Authorization: `Bearer ${newToken}`,
//           };
//           const retryResponse = await fetch(url, config);
//           if (retryResponse.ok) {
//             return await retryResponse.json();
//           }
//         }
//       }
//     }
//     if (!response.ok) {
//       const errorData: ApiError = await response.json().catch(() => ({
//         message: "Network error",
//         statusCode: response.status,
//       }));
//       throw errorData;
//     }
//     return await response.json();
//   } catch (error) {
//     throw error instanceof Error
//       ? { message: error.message, statusCode: 0 }
//       : error;
//   }
// }

// async function tryRefreshToken(): Promise<boolean> {
//   try {
//     const response = await request<AuthResponse>(
//       "/auth/refresh",
//       {
//         method: "POST",
//         body: JSON.stringify({ userAgent: navigator.userAgent }),
//       },
//       true,
//     );
//     setAccessToken(response.accessToken);
//     return true;
//   } catch {
//     removeAccessToken();
//     return false;
//   }
// }

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

  async getProfile(): Promise<AuthResponse["user"]> {
    return request<AuthResponse["user"]>("/auth/profile");
  },

  async logoutAll(): Promise<void> {
    try {
      await request<void>("/auth/logout-all", {
        method: "POST",
      });
    } finally {
      // Очищаем данные независимо от результата запроса
      tokenStorage.removeAccessToken();
    }
  },

  // Методы для работы с сессиями (если понадобятся в будущем)
  async getSessions(): Promise<SessionInfo[]> {
    return await request<SessionInfo[]>("/auth/sessions");
  },

  async terminateSession(sessionId: string): Promise<void> {
    return await request<void>("/auth/sessions/terminate", {
      method: "POST",
      body: JSON.stringify({ sessionId }),
    });
  },

  // Другие методы (logoutAll, getSessions, terminateSession)
};
