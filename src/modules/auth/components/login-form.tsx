import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/common/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/common/components/ui/field";
import { Input } from "@/common/components/ui/input";
import { tokenStorage } from "@/common/utils/token-storage";
import { useAuthControllerLogin } from "@/shared/api/generated/authentication/authentication";
import type { LoginDto } from "@/shared/api/generated/model";

import { useAuthContext } from "../hooks/use-auth-context";
import { loginSchema } from "../types";

export const LoginForm = () => {
  const navigate = useNavigate();
  const loginMutation = useAuthControllerLogin();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthContext();

  const form = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginDto) => {
    try {
      await loginMutation.mutateAsync(
        { data },
        {
          onSuccess: (response) => {
            tokenStorage.setAccessToken(response.accessToken);
            login(response.user);
            navigate({ to: "/" });
          },
        },
      );
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : "Произошла ошибка при входе";
      form.setError("root", { message: errorMessage });
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Вход</h1>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {form.formState.errors.root && (
          <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-md border px-4 py-3 text-sm">
            {form.formState.errors.root.message}
          </div>
        )}

        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field
              className="flex flex-col gap-1.5"
              data-invalid={!!fieldState.error}
            >
              <FieldLabel>Email</FieldLabel>
              <Input
                placeholder="example@email.com"
                aria-invalid={!!fieldState.error}
                {...field}
              />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field
              className="flex flex-col gap-1.5"
              data-invalid={!!fieldState.error}
            >
              <FieldLabel>Пароль</FieldLabel>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Введите пароль"
                  aria-invalid={!!fieldState.error}
                  {...field}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        <div className="text-right">
          <Link
            to="/auth/forgot-password"
            className="text-primary text-sm underline-offset-4 hover:underline"
          >
            Забыли пароль?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting || loginMutation.isPending}
        >
          {form.formState.isSubmitting || loginMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Вход...
            </>
          ) : (
            "Войти"
          )}
        </Button>
      </form>
    </div>
  );
};
