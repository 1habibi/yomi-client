import {
  createFileRoute,
  Outlet,
  redirect,
  useRouteContext,
} from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context, location }) => {
    if (context.auth.isLoading) {
      return;
    }

    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
  },
  component: function AuthenticatedRoute() {
    const { auth } = useRouteContext({ from: "/_authenticated" });

    if (auth.isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      );
    }

    return <Outlet />;
  },
});
