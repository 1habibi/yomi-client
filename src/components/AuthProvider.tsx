import { authApi } from "@/api";
import { authKeys } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";

interface AuthProviderProps {
  children: React.ReactNode;
}

// src/auth.tsx
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user:
    | {
        id: string;
        email: string;
        name: string;
        role: string;
        createdAt: string;
        isEmailConfirmed: boolean;
      }
    | undefined;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    // При монтировании проверяем токен и загружаем профиль
    if (accessToken) {
      authApi
        .getProfile()
        .then((user) => {
          queryClient.setQueryData(authKeys.profile(), user);
        })
        .catch(() => {
          // Если токен невалидный, очищаем
          localStorage.removeItem("accessToken");
          queryClient.clear();
        });
    }
  }, [accessToken, queryClient]);

  return <>{children}</>;
};

export default AuthProvider;
