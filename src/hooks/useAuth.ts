import type {
  ApiError,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "@/lib/api";
import { apiClient } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys
export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
};

// Хук для регистрации
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ApiError, RegisterRequest>({
    mutationFn: (data) => apiClient.register(data),
    onSuccess: (data) => {
      // Сохраняем токены в localStorage
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      // Обновляем кэш профиля
      queryClient.setQueryData(authKeys.profile(), data.user);
    },
  });
}

// Хук для входа
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ApiError, LoginRequest>({
    mutationFn: (data) => apiClient.login(data),
    onSuccess: (data) => {
      // Сохраняем токены в localStorage
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      // Обновляем кэш профиля
      queryClient.setQueryData(authKeys.profile(), data.user);
    },
  });
}

// Хук для выхода
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError>({
    mutationFn: () => apiClient.logout(),
    onSuccess: () => {
      // Очищаем токены
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Очищаем кэш
      queryClient.clear();
    },
  });
}

// Хук для получения профиля
export function useProfile() {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => apiClient.getProfile(),
    enabled: !!localStorage.getItem("accessToken"),
    retry: false,
  });
}

// Хук для проверки авторизации
export function useIsAuthenticated() {
  const { data: profile, isLoading } = useProfile();
  return {
    isAuthenticated: !!profile,
    isLoading,
    user: profile,
  };
}
