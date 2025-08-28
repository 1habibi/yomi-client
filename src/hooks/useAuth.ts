import {
  authApi,
  type ApiError,
  type AuthResponse,
  type LoginRequest,
  type RegisterRequest,
} from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Ключи для кэширования
export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
};

// Хук для регистрации
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ApiError, RegisterRequest>({
    mutationFn: (data) => authApi.register(data),
    onSuccess: (data) => {
      // Сохраняем токен
      localStorage.setItem("accessToken", data.accessToken);
      // Устанавливаем данные пользователя в кэш
      queryClient.setQueryData(authKeys.profile(), data.user);
    },
  });
}

// Хук для входа
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ApiError, LoginRequest>({
    mutationFn: (data) => authApi.login(data),
    onSuccess: (data) => {
      // Сохраняем токен
      localStorage.setItem("accessToken", data.accessToken);
      // Устанавливаем данные пользователя в кэш
      queryClient.setQueryData(authKeys.profile(), data.user);
    },
  });
}

// Хук для выхода
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError>({
    mutationFn: async () => {
      await authApi.logout();
      localStorage.removeItem("accessToken");
    },
    onSuccess: () => {
      // Очищаем кэш
      queryClient.clear();
    },
  });
}

// Хук для получения профиля
export function useProfile() {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => authApi.getProfile(),
    enabled: !!localStorage.getItem("accessToken"),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
}

// Хук для проверки аутентификации
export function useIsAuthenticated() {
  const { data: user, isLoading, isError } = useProfile();

  return {
    isAuthenticated: !isError && !!user,
    isLoading,
    user,
  };
}

// Хук для получения текущего пользователя
export function useCurrentUser() {
  const { data: user } = useProfile();
  return user;
}
