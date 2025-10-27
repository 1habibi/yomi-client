import { Outlet } from "@tanstack/react-router";
import { Header } from "../modules/header/header";

export function RootLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <Outlet />
    </div>
  );
}
