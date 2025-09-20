import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./components/AuthProvider.tsx";
import { Router } from "./components/Router.tsx";
import { ThemeProvider } from "./components/theme-prodiver.tsx";
import "./index.css";
import { queryClient } from "./lib/query-client.ts";

// Render the app
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
