import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/common/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/common/components/ui/field";
import { Input } from "@/common/components/ui/input";
import { useAuthControllerRegister } from "@/shared/api/generated/authentication/authentication";
import type { RegisterDto } from "@/shared/api/generated/model";

import { registerSchema } from "../types";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const registerMutation = useAuthControllerRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterDto & { confirmPassword: string }>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterDto & { confirmPassword: string }) => {
    try {
      const { confirmPassword: _confirmPassword, ...registerData } = data;
      await registerMutation.mutateAsync(
        {
          data: registerData,
        },
        {
          onSuccess: () => {
            navigate({ to: "/" });
          },
        },
      );
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : "Произошла ошибка при регистрации";

      if (errorMessage.includes("email")) {
        form.setError("email", {
          message: "Пользователь с таким email уже существует",
        });
      } else {
        form.setError("root", { message: errorMessage });
      }
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Регистрация</h1>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {form.formState.errors.root && (
          <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-md border px-4 py-3 text-sm">
            {form.formState.errors.root.message}
          </div>
        )}

        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel>Имя</FieldLabel>
              <Input
                placeholder="Введите ваше имя"
                aria-invalid={!!fieldState.error}
                {...field}
              />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel>Email</FieldLabel>
              <Input
                type="email"
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
            <Field data-invalid={!!fieldState.error}>
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

        <Controller
          control={form.control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel>Подтвердите пароль</FieldLabel>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Повторите пароль"
                  aria-invalid={!!fieldState.error}
                  {...field}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
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

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting || registerMutation.isPending}
        >
          {form.formState.isSubmitting || registerMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Создание аккаунта...
            </>
          ) : (
            "Создать аккаунт"
          )}
        </Button>
      </form>
    </div>
  );
};
