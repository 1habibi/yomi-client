import { RouterProvider } from "@tanstack/react-router";
import { routeTree } from "../routeTree.gen";

import { useAuthContext } from "@/hooks/useAuthContext";
import { createRouter } from "@tanstack/react-router";

export function Router() {
  const { auth } = useAuthContext();

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  return <RouterProvider router={router} context={{ auth }} />;
}

const router = createRouter({
  routeTree,
  context: { auth: { isAuthenticated: false, isLoading: true, user: null } },
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
