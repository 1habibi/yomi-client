import {
  authApi,
  type AuthResponse,
  type LoginRequest,
  type RegisterRequest,
} from "@/api";
import type { ApiError } from "@/api/base";
import { useAuthContext } from "@/hooks/useAuthContext";
import { tokenStorage } from "@/lib/tokenStorage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
};

export function useRegister() {
  return useMutation<AuthResponse, ApiError, RegisterRequest>({
    mutationFn: (data) => authApi.register(data),
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const { login } = useAuthContext();

  return useMutation<AuthResponse, ApiError, LoginRequest>({
    mutationFn: (data) => authApi.login(data),
    onSuccess: (data) => {
      console.log("data from login", data);
      tokenStorage.setAccessToken(data.accessToken);
      queryClient.setQueryData(authKeys.profile(), data.user);
      login(data.user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { logout } = useAuthContext();

  return useMutation<void, ApiError>({
    mutationFn: async () => {
      await authApi.logout();
      tokenStorage.removeAccessToken();
    },
    onSuccess: () => {
      queryClient.clear();
      logout();
    },
  });
}

export function useProfile() {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => authApi.getProfile(),
    enabled: !!tokenStorage.getAccessToken(),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useIsAuthenticated() {
  const { data: user, isLoading, isError } = useProfile();

  return {
    isAuthenticated: !isError && !!user,
    isLoading,
    user,
  };
}

export function useCurrentUser() {
  const { data: user } = useProfile();
  return user;
}
