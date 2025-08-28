import type { AuthState } from "@/components/AuthProvider";
import { RootLayout } from "@/layouts";
import {
  createRootRouteWithContext,
  HeadContent,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

// Тип контекста роутера
interface MyRouterContext {
  auth: AuthState;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <HeadContent />
      <RootLayout />
      <TanStackRouterDevtools />
    </>
  ),
});
