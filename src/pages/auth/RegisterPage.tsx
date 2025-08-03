import { RegisterForm } from "@/modules/RegisterForm";
import { PATH } from "@/router/paths";
import { Link } from "@tanstack/react-router";

export function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <RegisterForm />

        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Уже есть аккаунт?{" "}
            <Link
              to={PATH.LOGIN}
              className="font-medium text-primary hover:underline"
            >
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
