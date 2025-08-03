import { Outlet, useLocation } from "@tanstack/react-router";
import { Header } from "../modules/Header/Header";

export function RootLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith("/auth");

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthPage && <Header />}
      <Outlet />
    </div>
  );
}
