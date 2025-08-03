import { LoginForm } from "@/modules/LoginForm";
import { PATH } from "@/router/paths";
import { Link } from "@tanstack/react-router";

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <LoginForm />

        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Нет аккаунта?{" "}
            <Link
              to={PATH.REGISTER}
              className="font-medium text-primary hover:underline"
            >
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
