import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ReactDOM from "react-dom/client";

import { AuthProvider } from "@/app/providers/auth-provider.tsx";
import { Router } from "@/app/providers/router.tsx";
import { ThemeProvider } from "@/app/providers/theme-provider.tsx";

import { queryClient } from "./config/query-client.ts";
import "./styles/index.css";

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
