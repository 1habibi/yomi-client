import { useQueryClient } from "@tanstack/react-query";

import { tokenStorage } from "@/common/utils/token-storage";
import {
  getAuthControllerGetProfileQueryKey,
  useAuthControllerGetProfile,
  useAuthControllerLogout,
} from "@/shared/api/generated/authentication/authentication";
import { QUERY_CACHE_STRATEGIES } from "@/shared/constants/query-config";

import { useAuthContext } from "./use-auth-context";

export const authKeys = {
  all: ["auth"] as const,
  profile: () => getAuthControllerGetProfileQueryKey(),
};

export function useLogout() {
  const queryClient = useQueryClient();
  const { logout } = useAuthContext();

  return useAuthControllerLogout({
    mutation: {
      onSuccess: () => {
        tokenStorage.removeAccessToken();
        queryClient.clear();
        logout();
      },
      onError: () => {
        tokenStorage.removeAccessToken();
        queryClient.clear();
        logout();
      },
    },
  });
}

export function useProfile() {
  return useAuthControllerGetProfile({
    query: {
      ...QUERY_CACHE_STRATEGIES.NORMAL,
      enabled: !!tokenStorage.getAccessToken(),
      retry: 1,
      refetchOnWindowFocus: false,
    },
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
