import {
  createRootRouteWithContext,
  HeadContent,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { RootLayout } from "@/common/layouts/root-layout";
import type { useAuthContext } from "@/modules/auth";

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
