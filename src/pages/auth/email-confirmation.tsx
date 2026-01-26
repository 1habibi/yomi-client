import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/common/components/ui/button";
import { authControllerConfirmEmail } from "@/shared/api/generated/authentication/authentication";

export const Route = createFileRoute("/auth/email-confirmation")({
  component: RouteComponent,
});

function RouteComponent() {
  const search = useSearch({ from: "/auth/email-confirmation" });
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
        await authControllerConfirmEmail({ token });
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
          <Button onClick={() => navigate({ to: "/auth/login" })}>
            Перейти к входу
          </Button>
        )}
      </div>
    </div>
  );
}
