import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./components/auth-provider.tsx";
import { Router } from "./components/router.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import "./index.css";
import { queryClient } from "./lib/query-client.ts";

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Router />
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>,
  );
}
