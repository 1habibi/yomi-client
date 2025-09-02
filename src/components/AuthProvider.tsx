import { useProfile } from "@/hooks/auth";
import { tokenStorage } from "@/lib/tokenStorage";
import { createContext, useEffect, useState, type ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  isEmailConfirmed: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
}

interface AuthContextType {
  auth: AuthState;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
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
