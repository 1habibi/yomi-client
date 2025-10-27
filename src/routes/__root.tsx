import { useAuthContext } from "@/hooks/use-auth-context";
import { RootLayout } from "@/layouts";
import {
  createRootRouteWithContext,
  HeadContent,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export interface MyRouterContext {
  auth: ReturnType<typeof useAuthContext>["auth"];
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
