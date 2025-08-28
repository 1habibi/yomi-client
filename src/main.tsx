import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import AuthProvider from "./components/AuthProvider.tsx";
import { useIsAuthenticated } from "./hooks/useAuth.ts";
import "./index.css";
import { queryClient } from "./lib/query-client.ts";
import { routeTree } from "./routeTree.gen";

// // Create a new router instance
// const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}

function InnerApp() {
  const auth = useIsAuthenticated(); // Получаем состояние аутентификации
  console.log("aAUTJ", auth);
  const router = createRouter({
    routeTree,
    context: { auth }, // Передаем auth в контекст роутера
    defaultPreload: "intent",
  });

  // Ждем, пока isLoading не станет false, чтобы избежать мигания
  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  return <RouterProvider router={router} />;
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <InnerApp />
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}
