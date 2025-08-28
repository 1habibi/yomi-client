import { Outlet } from "@tanstack/react-router";
import { Header } from "../modules/Header/Header";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Outlet />
    </div>
  );
}
