import { authApi } from "@/api";
import { Button } from "@/components/ui/button";
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/email-confirmation")({
  component: RouteComponent,
});

function RouteComponent() {
  const search = useSearch({ from: "/email-confirmation" });
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Подтверждение email...");

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const token = search.token as string;
        if (!token) throw new Error("Токен подтверждения не найден");
        await authApi.confirmEmail(token);
        setStatus("success");
        setMessage("Email успешно подтвержден!");
      } catch (error) {
        setStatus("error");
        setMessage(
          error instanceof Error ? error.message : "Ошибка подтверждения email",
        );
      }
    };
    confirmEmail();
  }, [search]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 rounded-lg border p-6 text-center">
        {status === "loading" && (
          <Loader2 className="mx-auto h-8 w-8 animate-spin" />
        )}
        <p className="text-lg">{message}</p>
        {status === "success" && (
          <Button onClick={() => navigate({ to: "/login" })}>
            Перейти к входу
          </Button>
        )}
      </div>
    </div>
  );
}
