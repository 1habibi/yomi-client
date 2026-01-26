import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/common/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/common/components/ui/field";
import { Input } from "@/common/components/ui/input";
import { changePasswordSchema, type ChangePasswordFormData } from "@/modules/auth/types";
import { useUsersControllerChangePassword } from "@/shared/api/generated/users/users";

export const ChangePasswordForm = () => {
  const changePassword = useUsersControllerChangePassword();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await changePassword.mutateAsync({
        data: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
      });

      form.reset();
      form.setError("root", {
        type: "success",
        message: "Пароль успешно изменен",
      });
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : "Произошла ошибка при смене пароля";
      form.setError("root", { message: errorMessage });
    }
  };

  return (
    <div className="rounded-lg border p-6">
      <h2 className="mb-4 text-xl font-semibold">Смена пароля</h2>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {form.formState.errors.root && (
          <div
            className={`rounded-md border px-4 py-3 text-sm ${
              form.formState.errors.root.type === "success"
                ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200"
                : "bg-destructive/10 border-destructive/20 text-destructive"
            }`}
          >
            {form.formState.errors.root.message}
          </div>
        )}

        <Controller
          control={form.control}
          name="currentPassword"
          render={({ field, fieldState }) => (
            <Field
              className="flex flex-col gap-1.5"
              data-invalid={!!fieldState.error}
            >
              <FieldLabel>Текущий пароль</FieldLabel>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Введите текущий пароль"
                  aria-invalid={!!fieldState.error}
                  {...field}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
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
          name="newPassword"
          render={({ field, fieldState }) => (
            <Field
              className="flex flex-col gap-1.5"
              data-invalid={!!fieldState.error}
            >
              <FieldLabel>Новый пароль</FieldLabel>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Введите новый пароль"
                  aria-invalid={!!fieldState.error}
                  {...field}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
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
            <Field
              className="flex flex-col gap-1.5"
              data-invalid={!!fieldState.error}
            >
              <FieldLabel>Подтверждение пароля</FieldLabel>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Повторите новый пароль"
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
          disabled={form.formState.isSubmitting || changePassword.isPending}
        >
          {form.formState.isSubmitting || changePassword.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Изменение...
            </>
          ) : (
            "Изменить пароль"
          )}
        </Button>
      </form>
    </div>
  );
};
