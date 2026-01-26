import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/common/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/common/components/ui/field";
import { Input } from "@/common/components/ui/input";
import { useAuthControllerForgotPassword } from "@/shared/api/generated/authentication/authentication";

import { forgotPasswordSchema, type ForgotPasswordFormData } from "../types";

export const ForgotPasswordForm = () => {
  const forgotPasswordMutation = useAuthControllerForgotPassword();
  const [success, setSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPasswordMutation.mutateAsync({ data });
      setSuccess(true);
      form.reset();
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : "Произошла ошибка при отправке письма";
      form.setError("root", { message: errorMessage });
    }
  };

  if (success) {
    return (
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Письмо отправлено
          </h1>
          <p className="text-muted-foreground">
            Если пользователь с таким email существует, на него будет отправлено
            письмо для сброса пароля. Проверьте вашу почту.
          </p>
        </div>

        <div className="bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200 rounded-md border px-4 py-3 text-sm">
          Письмо может прийти в течение нескольких минут. Не забудьте проверить
          папку "Спам".
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Забыли пароль?</h1>
        <p className="text-muted-foreground">
          Введите ваш email и мы отправим вам ссылку для восстановления пароля
        </p>
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
                type="email"
                placeholder="example@email.com"
                aria-invalid={!!fieldState.error}
                {...field}
              />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={
            form.formState.isSubmitting || forgotPasswordMutation.isPending
          }
        >
          {form.formState.isSubmitting || forgotPasswordMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Отправка...
            </>
          ) : (
            "Отправить ссылку"
          )}
        </Button>
      </form>
    </div>
  );
};
