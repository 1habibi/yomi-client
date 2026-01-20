import { createContext, useEffect, useState, type ReactNode } from "react";

import { tokenStorage } from "@/common/utils/token-storage";

import { useProfile } from "../../modules/auth/hooks/auth";
import type {
  AuthContextType,
  AuthState,
  User,
} from "../../modules/auth/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const { data: user, isLoading, isError } = useProfile();

  useEffect(() => {
    if (isLoading) {
      setAuth((prev) => ({ ...prev, isLoading: true }));
    } else if (isError) {
      setAuth({ user: null, isAuthenticated: false, isLoading: false });
      tokenStorage.removeAccessToken();
    } else if (user) {
      setAuth({ user, isAuthenticated: true, isLoading: false });
    } else {
      setAuth({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, [user, isLoading, isError]);

  const login = (user: User) => {
    setAuth({ user, isAuthenticated: true, isLoading: false });
  };

  const logout = () => {
    setAuth({ user: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
