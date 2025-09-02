import { AuthContext } from "@/components/AuthProvider";
import { useContext } from "react";

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
