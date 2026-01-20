import { Outlet } from "@tanstack/react-router";

import { Header } from "@/common/components/header";

export function RootLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <Outlet />
    </div>
  );
}
